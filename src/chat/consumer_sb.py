import json
import pandas as pd
from channels.generic.websocket import AsyncWebsocketConsumer

import logging
import aiohttp  
import re
import pickle

from konlpy.tag import Okt
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

from caching_jh import get_similar_cached_answer
from call_mistralai import call_sLLM


logger = logging.getLogger(__name__)

# 금지어 목록
pass_path = '/home/ubuntu/umg/llm_api/websocket/chat/wordtollgate/word_pass.xlsx'
pass_word = pd.read_excel(pass_path)
pass_word_list = pass_word['pass_word_list'].tolist()

#통과어 목록
ng_path = '/home/ubuntu/umg/llm_api/websocket/chat/wordtollgate/word_ng.xlsx'
ng_word = pd.read_excel(ng_path)
ng_word_list = ng_word['ng_word_list'].tolist()

okt = Okt()
stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']

def tokenizer():
    with open('data/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    return tokenizer

def model_load():
    best_model_path = 'data/lstm_model.h5'
    loaded_model = load_model(best_model_path)
    return loaded_model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connected!")  # 연결 확인용 로그

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")  # 연결 해제 로그
        pass

    async def tollgate(self, message): # -> (bool, category)
        # 메시지 최대 길이 제한 : 200자
        if len(message) > 200:  
            return False, '최대 200자까지 입력하실 수 있습니다.'        
        # 금지어 필터링
        if any(keyword in message for keyword in ng_word_list):
            return False, f'부적절한 단어는 사용하실 수 없습니다.'
        # 통과어 필터링
        elif any(keyword in message for keyword in pass_word_list):
            return True, 'PASS_word'
        # 일반 문장
        else:
            return True, ''
        
    async def isMedical(self,message):
        new_sentence = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣a-z]','',message) # 정규화
        new_sentence = okt.morphs(new_sentence, stem=True) # 토큰화
        new_sentence = [word for word in new_sentence if not word in stopwords] # 불용어 제거
        encoded = tokenizer().texts_to_sequences([new_sentence]) # 정수 인코딩
        pad_new = pad_sequences(encoded, maxlen = 200) # 패딩
        score = model_load().predict(pad_new)

        # message가 medical일 확률
        medical_score = score[0][0]

        if medical_score == 0.11805469542741776: # 의미없는 단어를 넣었을 때 나오는 수치, 더 굴려봐야 한다.
            isMedical_output = 'None-Medical'  
        elif medical_score > 0.1:
            isMedical_output == 'Medical'
        else:
            isMedical_output == 'None-Medical'

        return isMedical_output

    
    async def receive(self, text_data):
        try:
            # 클라이언트로부터 메시지 수신
            print(f"Received message: {text_data}")  # 수신 메시지 로그
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', '')
            user_id = text_data_json.get('user_id', 'test_user') # 기본값은 'test_user'
            prescription = text_data_json.get('prescription', 'No')  # prescription 버튼 상태 받기 # 기본값은 'No'


            # 캐싱데이터 유사도 확인
            cached_answer, _ = get_similar_cached_answer(message)
            if cached_answer:                
                formatted_response = {
                        'type': 'chat.error',
                        'status': 'success',
                        'message': {
                            'message_body':cached_answer
                        },
                        'user_id': user_id
                    }
                await self.send(text_data=json.dumps(formatted_response))
                return

            # 메시지 적합성 통과/반려 : pass_or_ng
            # 메시지 적합성 분류 : category
            [pass_or_ng, category] = await self.tollgate(message)

            # 메시지 적합성에 반려됐다면, 반려된 분류를 출력
            if not pass_or_ng :
                formatted_response = {
                        'type': 'chat.error',
                        'status': 'success',
                        'message': {
                            'message_body': category
                        },
                        'user_id': user_id
                    }
                await self.send(text_data=json.dumps(formatted_response))
                return

            # 메시지 적합성이 통과라면, is_medical에 분류를 넣어 전달.
            # is_medical은 PASS_word, Medical, None-Medical 중 하나
            elif pass_or_ng :
                if category == 'PASS_word':
                    is_medical = 'Medical'
                else:
                    is_medical = await self.isMedical(message)
                    
                    if is_medical == 'None-Medical':
                        message_sLLM = call_sLLM(message)
                        formatted_response = {
                                'type': 'chat.error',
                                'status': 'success',
                                'message': {
                                    'message_body': message_sLLM
                                },
                                'user_id': user_id
                            }
                        await self.send(text_data=json.dumps(formatted_response))
                        return
            
            
            # LLM API 서버로 HTTP 요청 (비동기로 수정)
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        'http://localhost:8001/api/langchain/',
                        json={
                            'message': message,
                            'user_id': user_id,
                            'response_type': 'text',
                            'prescription': prescription,
                            'Medical':is_medical,
                        }
                    ) as response:
                        if response.status == 200:
                            result = await response.json()
                            # AgentResponse 구조에 맞게 데이터 구성
                            response_data = result.get('message', {})

                            # 응답 구성
                            formatted_response = {
                                'type': 'chat.message',
                                'status': 'success',
                                'message': {
                                    'mechanism': response_data.get('mechanism', ''),
                                    'evidence1': response_data.get('evidence1', ''),
                                    'evidence2': response_data.get('evidence2', ''),
                                    'lab_analysis': response_data.get('lab_analysis', ''),
                                    'final_advice': response_data.get('final_advice', ''),
                                    'references': response_data.get('references', [])
                                },
                                'user_id': user_id
                            }
                           
                            # 프론트로 결과 전송
                            await self.send(text_data=json.dumps(formatted_response))
                            logger.info(f"Sent formatted response: {formatted_response}")  # 디버깅용 로그
                        else:
                            await self.send_error("LLM 서버 처리 실패")

            except aiohttp.ClientError as e:
                logger.error(f"LLM API request failed: {str(e)}")
                await self.send_error("LLM 서버 연결 실패")

        except json.JSONDecodeError:
            await self.send_error("잘못된 메시지 형식")
        except Exception as e:
            logger.error(f"Error in receive: {str(e)}")
            await self.send_error("서버 처리 중 오류 발생")

    async def send_error(self, message: str):
        await self.send(text_data=json.dumps({
            'type': 'chat.error',
            'status': 'error',
            'message': message
        }))

    
        