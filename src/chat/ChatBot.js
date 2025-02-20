import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from '../context/AuthContext'; // AuthContext import

import {
  Contain,
  Screen,
  MessageBox,
  MessagePlace,
  MessageSendBox,
  MessageSendWrap,
  MessageSend,
  MessageBubble,
  LoadingIcon,
  DisclaimerMessage,
  bounce,
  LoadingModalOverlay,
  LoadingModalContent,
  LoadingEmoji,
  LoadingMessage,
  LoadingProgress,
} from "./ChatBotStyles";
import { CardWrapper, CardContainer, CardText } from "./ChatCardStyles";
import { VscSend, VscAdd } from "react-icons/vsc";
import { FaArrowLeft } from "react-icons/fa";
import UserInfoForm from "./UserInfoForm";
import styled from "styled-components";
import common from "../common/Common";

const TitleText = styled.h1`
  display: ${(props) => (props.hasMessages ? "none" : "block")};
`;
/**
 * 설정 아이콘 스타일 컴포넌트
 * - 우측 상단에 위치
 * - 호버 시 색상 변경 효과
 */
const SettingsIcon = styled.div`
  display: flex;
  cursor: pointer;
  font-size: 24px;
  color: ${({ theme }) => theme.color};
  z-index: 100;
  align-items: center;
  justify-content: ${(props) => (props.show ? "flex-end" : "center")};

  &:hover {
    color: #4a59b0;
  }
`;

/**
 * 채팅 컨텐츠 래퍼 스타일 컴포넌트
 * - 채팅 메시지와 입력창을 감싸는 컨테이너
 * - 스크롤 가능한 영역 설정
 */
const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 20px;
  overflow-y: auto;
`;

/**
 * 설정 카드 섹션 스타일 컴포넌트
 * - 설정 아이콘 클릭 시 표시되는 팝업 메뉴
 * - 애니메이션 효과 포함
 */

const PlusBtn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  padding: 10px;
  position: ${(props) => (props.hasMessages ? "relative" : "absolute")};
  @media screen and (max-width: 768px) {
    width: 95%;
  }
`;
const CardSection = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 14vw;
  bottom: 56px;
  position: absolute;
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform-origin: top right;
  transform: ${(props) => (props.show ? "scale(1)" : "scale(0)")};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${CardWrapper} {
    flex-direction: column;
    padding: 0;
    gap: 10px;
  }

  ${CardContainer} {
    width: 90%;
    height: auto;
    min-height: 60px;
    padding: 15px;
    margin: 0;

    &:hover {
      transform: scale(1.02);
    }
  }
`;

// 모달 스타일 컴포넌트
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); // 반투명 배경
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // 다른 요소 위에 표시
`;

// 모달 내용 스타일 컴포넌트
const ModalContent = styled.div`
  display: flex;
  background: ${({ theme }) => theme.commponent};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
  flex-direction: column;
`;

// 스타일 컴포넌트 정의
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Input = styled.input`
  flex: 1;
  margin-right: 10px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const UploadButton = styled.button`
  padding: 10px 15px;
  margin-left: auto;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: ${({ theme }) => theme.color};
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  background-color: #ccc;
  cursor: pointer;
`;
const BackButton = styled.button`
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.color};

  &:hover {
    color: #0056b3;
  }
`;
const MessageTop = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CardBox = styled.div`
  width: 100%;
`;

const MessageBottom = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

// 회전 스타일 정의
const RotatingIcon = styled(VscAdd)`
  transition: transform 0.3s ease; // 회전 애니메이션
  transform: ${({ rotated }) =>
    rotated ? "rotate(45deg)" : "rotate(0deg)"}; // 회전 상태에 따라 변환
`;

// 성공 모달 스타일 추가
const SuccessModal = styled.div`
  background:  ${({ theme }) => theme.commponent};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const SuccessButton = styled.button`
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4a59b0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3a4890;
  }
`;

// 로딩 모달 스타일 추가
const LoadingModal = styled(Modal)`
  background:  ${({ theme }) => theme.commponent};
 
`;

const LoadingContent = styled(SuccessModal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid ${({ theme }) => theme.border};
  gap: 15px;
`;

// SendWrap 스타일 컴포넌트 수정
const SendWrap = styled.div`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    cursor: pointer;
  font-size: 20px;
  padding: 0 15px;
  color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.lightText : theme.darkText};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const InputLoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 15px;
  color: #4a59b0;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #4a59b0;
    border-radius: 50%;
    animation: ${bounce} 0.6s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

/**
 * 채팅 봇 메인 컴포넌트
 * WebSocket을 통한 실시간 채팅 기능 구현
 */
const ChatBot = () => {
  // === State 관리 ===
  // 모달 상태 관리
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [isRotated, setIsRotated] = useState(false); // 회전 상태 추가
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 채팅 관련 상태 관리
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태

  // 스트리밍 상태 추가
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimeoutRef = useRef(null);

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  const [ocrResult, setOcrResult] = useState(""); // OCR 결과 상태

  // 상태 추가: 업로드 결과를 저장할 상태
  const [uploadResult, setUploadResult] = useState(null);

  // 플레이스홀더 상태 추가
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  // === Refs ===
  const messageEndRef = useRef(null); // 스크롤 위치 관리용
  const ws = useRef(null); // WebSocket 인스턴스 관리
  

  const textarea = useRef();

  // 로딩 메시지 배열
  const loadingMessages = [
    "AI가 열심히 생각하고 있어요",
    "최선의 답변을 준비 중이에요",
    "잠시만 기다려주세요",
    "거의 다 왔어요",
    "답변을 정리하고 있어요"
  ];

  // 로딩 이모지 배열
  const loadingEmojis = ["🤔", "🧐", "💭", "✨", "🔍"];

  // 현재 메시지와 이모지 인덱스 상태
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  // AuthContext에서 사용자 정보와 인증 상태 가져오기
  const { user, isAuthenticated, getUserInfo } = useAuth();
  
  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    if (isAuthenticated && !user) {
      getUserInfo();
    }
  }, [isAuthenticated, user, getUserInfo]);

  /**
   * WebSocket 연결 설정 및 정리
   * 컴포넌트 마운트 시 연결, 언마운트 시 정리
   */
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  /**
   * WebSocket 연결 설정 함수
   * - 연결 설정
   * - 이벤트 핸들러 등록
   * - 에러 처리
   */
  
  const connectWebSocket = () => {
    try {
      console.log("Attempting to connect to WebSocket...");
      
      const wsUrl = `ws://${common.Websocket_Domain}/ws/chat`;
      
      if (!wsUrl) {
        throw new Error("WebSocket URL is not configured");
      }
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Successfully connected to WebSocket");
        setIsConnected(true);
      };

      // 메시지 수신 처리
      ws.current.onmessage = (event) => {
        try {
          // 먼저 일반 텍스트 메시지인지 확인
          if (typeof event.data === 'string' && event.data.startsWith('서버')) {
            // 서버 에러 메시지를 직접 처리
            setMessages((prev) => [
              ...prev,
              {
                id: `error_${Date.now()}`,
                text: event.data,
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            ]);
            setIsLoading(false);
            return;
          }

          // 기존 JSON 처리 로직
          const data = JSON.parse(event.data);
          
          if (data.type === "chat.message") {
            setIsLoading(false); // 메시지를 수신하면 로딩 상태 해제
            const response = data.message;
            
            // 응답 데이터 포맷팅
            const mainContent = [
              response.mechanism,
              response.evidence1,
              response.evidence2,
              response.lab_analysis,
              response.final_advice,
            ]
              .filter(Boolean)
              .join("\n\n");

            // 참고문헌 정보 포맷팅
            const references = response.references
              ?.map((ref) => {
                // URL이 있는 경우 클릭 가능한 링크로 만듦
                const linkText = ref.url 
                  ? `[${ref.id}] <a href="${ref.url}" target="_blank">${ref.url}</a>`
                  : `[${ref.id}] ${ref.title}`;
                
                return linkText;
              })
              .join("\n");

            // 디버깅용 로그
            console.log('포맷팅된 참고문헌:', references);

            // 최종 응답 텍스트 조합
            const formattedText = references
              ? `${mainContent}\n\n참고문헌:\n${references}`
              : mainContent;

            // 스트리밍 시작
            setIsStreaming(true);
            let currentText = "";
            const textArray = formattedText.split("");
            let currentIndex = 0;

            // 봇 응답 메시지 초기 상태 추가
            const botMessageId = `bot_${Date.now()}`; // 고유 ID 생성
            setMessages((prev) => [
              ...prev,
              {
                id: botMessageId,
                text: "",
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            ]);

            // 스트리밍 함수
            const streamText = () => {
              if (currentIndex < textArray.length) {
                currentText += textArray[currentIndex];
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId ? { ...msg, text: currentText } : msg
                  )
                );
                currentIndex++;
                streamTimeoutRef.current = setTimeout(streamText, 20);
              } else {
                setIsStreaming(false);
              }
            };

            streamText();
          } else if (data.type === "chat.error") {
            // 오류 처리
            setIsLoading(false); // 로딩 상태 해제
            const errorMessage = data.message; // 백엔드에서 전달된 오류 메시지

            // 챗봇 대화 형식으로 오류 메시지 추가
            const errorMessageId = `error_${Date.now()}`; // 고유 ID 생성
            setMessages((prev) => [
              ...prev,
              {
                id: errorMessageId,
                text: "", // 초기 상태는 빈 문자열
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            ]);

            // 스트리밍 시작
            let currentErrorText = "";
            const errorTextArray = errorMessage.split("");
            let errorCurrentIndex = 0;

            // 스트리밍 함수
            const streamErrorText = () => {
              if (errorCurrentIndex < errorTextArray.length) {
                currentErrorText += errorTextArray[errorCurrentIndex];
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === errorMessageId
                      ? { ...msg, text: currentErrorText }
                      : msg
                  )
                );
                errorCurrentIndex++;
                streamTimeoutRef.current = setTimeout(streamErrorText, 20);
              }
            };

            streamErrorText(); // 오류 메시지 스트리밍 시작
          } else if (data.type === "send.error") {
            // send_error 처리
            const errorMessage = data.message;
            setIsLoading(false); // send_error에서 전달된 오류 메시지
            alert(`오류 발생: ${errorMessage}`); // 사용자에게 알림으로 표시
          }
        } catch (error) {
          // JSON 파싱 실패 시 원본 메시지를 그대로 표시
          setMessages((prev) => [
            ...prev,
            {
              id: `error_${Date.now()}`,
              text: event.data || "서버 처리 중 오류가 발생했습니다",
              sender: "bot",
              timestamp: new Date().toISOString(),
            },
          ]);
          setIsLoading(false);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  };

  /**
   * 새 메시지 추가 시 스크롤 자동 이동
   */
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /**
   * 메시지 전송 처리 함수
   * - 입력값 검증
   * - 메시지 전송
   * - UI 업데이트
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    // 로딩 중이거나 스트리밍 중일 때는 메시지 전송 방지
    if (isLoading || isStreaming || inputMessage.trim() === "") return;

    // WebSocket 연결 상태 체크
    if (!ws.current || !isConnected) {
      alert("서버와 연결 중입니다. 잠시만 기다려주세요.");
      return;
    }

    // 사용자 메시지 UI 추가
    const userMessage = {
      id: `user_${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 로딩 상태 설정
    setIsLoading(true); // 메시지를 전송하면 로딩 상태 설정

    // WebSocket으로 메시지 전송 (실제 사용자 정보 사용)
    ws.current.send(
      JSON.stringify({
        message: inputMessage,
        user_id: user.username, // 실제 사용자 username 사용
        type: "chat.message",
      })
    );

    // 입력창 초기화
    setInputMessage(""); // 입력창 초기화
    setPlaceholderVisible(true); // 플레이스홀더 다시 표시

    // textarea 높이 초기화 및 줄어들게 하기
    setTimeout(() => {
      handleResizeHeight(); // 높이 조정
    }, 0); // 다음 이벤트 루프에서 높이 조정
  };

  // 사용자 정보 제출 처리
  const handleUserInfoSubmit = async (userInfo) => {
    try {
      console.log("User info submitted:", userInfo);
      setShowUserInfoModal(false);
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (file, testDate) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("test_date", testDate);

    try {
      const response = await fetch(
        `http://${common.Llm_Domain}/api/ocr/upload-blood-test/`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "업로드 실패");
      }

      setShowFileUploadModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert(`파일 업로드에 실패했습니다: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Add this function to get CSRF token
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // 컴포넌트 cleanup 시 타이머 정리
  useEffect(() => {
    return () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, []);

  // messages 배열의 길이에 따라 UI 상태 결정
  const hasMessages = messages.length > 0;

  const handleResizeHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "44px"; // 높이 초기화
      textarea.current.style.height = textarea.current.scrollHeight + "px"; // 현재 내용에 맞게 높이 조정
    }
  };

  // CardContainer 클릭 핸들러 수정
  const handleCardClick = () => {
    setShowCards(false);
    setIsRotated(false);
    setShowFileUploadModal(true);
  };

  // 로딩 중일 때 메시지와 이모지 변경
  useEffect(() => {
    if (isLoading) {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);

      const emojiInterval = setInterval(() => {
        setCurrentEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
      }, 2000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(emojiInterval);
      };
    }
  }, [isLoading]);

  return (
    <Contain>
      <Screen>
        <MessageBox hasMessages={hasMessages}>
          <ContentWrapper>
            <MessagePlace hasMessages={hasMessages}>
              {messages.map((message, index) => (
                <MessageBubble 
                  key={index} 
                  sender={message.sender}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              ))}
              <div ref={messageEndRef} />
            </MessagePlace>

            {/* 기존 로딩 표시 대체 */}
            {isLoading && (
              <LoadingModalOverlay>
                <LoadingModalContent>
                  <LoadingEmoji>
                    {loadingEmojis[currentEmojiIndex]}
                  </LoadingEmoji>
                  <LoadingMessage>
                    {loadingMessages[currentMessageIndex]}
                  </LoadingMessage>
                  <LoadingProgress />
                </LoadingModalContent>
              </LoadingModalOverlay>
            )}

            {showUserInfoModal && (
              <UserInfoForm
                onSubmit={handleUserInfoSubmit}
                onClose={() => setShowUserInfoModal(false)}
              />
            )}
            {showFileUploadModal && (
              <Modal >
                <ModalContent>
                  <BackButton onClick={() => setShowFileUploadModal(false)}>
                    <FaArrowLeft /> 뒤로가기
                  </BackButton>
                  <h2>혈액 검사 결과 업로드</h2>
                  <form
                    id="uploadForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fileInput = e.target.elements.imageFile;
                      const testDate = e.target.elements.testDate;
                      
                      if (!fileInput.files[0]) {
                        alert("파일을 선택해주세요.");
                        return;
                      }
                      
                      console.log("파일:", fileInput.files[0]);
                      console.log("날짜:", testDate.value);
                      
                      handleFileUpload(fileInput.files[0], testDate.value);
                    }}
                  >
                    <FormGroup>
                      <label htmlFor="testDate" style={{ marginRight: "10px" }}>
                        검사일자
                      </label>
                      <Input type="date" name="testDate" required />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="imageFile" style={{ marginRight: "10px" }}>
                        이미지 파일
                      </label>
                      <Input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        required
                      />
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <CancelButton type="button" onClick={() => setShowFileUploadModal(false)}>
                        취소
                      </CancelButton>
                      <UploadButton type="submit">
                        업로드
                      </UploadButton>
                    </div>
                  </form>
                </ModalContent>
              </Modal>
            )}
            {showSuccessModal && (
              <Modal onClick={() => setShowSuccessModal(false)}>
                <SuccessModal onClick={(e) => e.stopPropagation()}>
                  <h3>업로드 완료</h3>
                  <p>혈액 검사 결과가 성공적으로 업로드되었습니다.</p>
                  <SuccessButton onClick={() => setShowSuccessModal(false)}>
                    확인
                  </SuccessButton>
                </SuccessModal>
              </Modal>
            )}

            {/* 로딩 모달 추가 */}
            {isUploading && (
              <LoadingModal>
                <LoadingContent>
                  <LoadingIcon />
                  <h3>파일 업로드 중...</h3>
                  <p>잠시만 기다려주세요.</p>
                </LoadingContent>
              </LoadingModal>
            )}
          </ContentWrapper>
          <PlusBtn hasMessages={hasMessages}>
            <TitleText hasMessages={hasMessages}>
              무엇을 도와드릴까요?
            </TitleText>
            <MessageSendBox>
              <CardBox>
                <CardSection show={showCards}>
                  <CardWrapper>
                    <CardContainer onClick={handleCardClick}>
                      <CardText>
                        혈액 검사 파일
                        <br />
                        업로드
                      </CardText>
                    </CardContainer>
                  </CardWrapper>
                </CardSection>
              </CardBox>
              <MessageTop>
                <MessageSend
                  ref={textarea}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleResizeHeight();
                  }}
                  onFocus={() => setPlaceholderVisible(false)}
                  onBlur={() => {
                    if (inputMessage.trim() === "") {
                      setPlaceholderVisible(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading && !isStreaming) { // 로딩/스트리밍 중이 아닐 때만 전송
                        handleSendMessage(e);
                      }
                    }
                  }}
                  placeholder={placeholderVisible ? "메시지를 입력하세요..." : ""}
                  style={{ resize: "none" }}
                />
              </MessageTop>

              <MessageBottom>
                <SettingsIcon
                  onClick={() => {
                    setShowCards(!showCards);
                    setIsRotated(!isRotated); // 클릭 시 회전 상태 변경
                  }}
                  show={showCards}
                >
                  <RotatingIcon rotated={isRotated} />{" "}
                  {/* 회전 상태에 따라 아이콘 회전 */}
                </SettingsIcon>

                <SendWrap 
                  onClick={handleSendMessage} 
                  
                >
                   {(isLoading || isStreaming) ? (
                    <InputLoadingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </InputLoadingIndicator>
                  ) : (
                    <VscSend />
                  )}
                 
                </SendWrap>
              </MessageBottom>
            </MessageSendBox>
          </PlusBtn>
          <DisclaimerMessage>
            본 챗봇은 일반적인 영양 정보를 제공하며, 의료 전문가의 조언을 대체할
            수 없습니다. 개인의 건강 상태에 따라 다를 수 있으므로, 정확한 상담은
            담당 의사와 상의하시길 바랍니다.
          </DisclaimerMessage>
        </MessageBox>
      </Screen>
    </Contain>
  );
};

export default ChatBot;
