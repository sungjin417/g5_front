import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  Contain,
  Screen,
  MessageBox,
  MessagePlace,
  MessageSendBox,
  MessageSendWrap,
  MessageSend,
  SendWrap,
  MessageBubble,
  LoadingIcon,
  DisclaimerMessage,
} from "./ChatBotStyles";
import { CardWrapper, CardContainer, CardText } from "./ChatCardStyles";
import { VscSend, VscAdd } from "react-icons/vsc";
import { FaArrowLeft } from "react-icons/fa";
import UserInfoForm from "./UserInfoForm";
import styled from "styled-components";

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
  background: white;
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
  color: white;
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
  color: #007bff;

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
  const userId = "test_user"; // 임시 사용자 ID (실제 구현 시 인증 시스템과 연동 필요)

  const textarea = useRef();

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
      // const wsUrl = process.env.REACT_APP_WEBSOCKET_URL;
      const wsUrl = "ws://54.180.252.205:8009/ws/chat";
      // const wsUrl = "ws://0.0.0.0:8009/ws/chat";
      // const wsUrl = "ws://127.0.0.1:8009/ws/chat";
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
            ?.map(
              (ref, index) =>
                `[${index + 1}] ${ref.authors} (${ref.year}). ${ref.title}. ${
                  ref.journal
                }`
            )
            .join("\n");

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
    if (inputMessage.trim() === "") return;

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

    // WebSocket으로 메시지 전송
    ws.current.send(
      JSON.stringify({
        message: inputMessage,
        user_id: userId,
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
    const formData = new FormData();
    formData.append("image", file);
    formData.append("test_date", testDate);

    try {
      const response = await fetch(
        "http://127.0.0.1:8010//api/ocr/upload-blood-test/",
        {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRFToken": getCookie("csrftoken"), // CSRF 토큰 전송
          },
          credentials: "same-origin",
        }
      );

      // 응답이 JSON인지 확인
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorData = await response.text(); // 오류 메시지를 텍스트로 읽기
        throw new Error(errorData || "업로드 실패");
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("업로드 성공:", data);
        setUploadResult(data); // 업로드 결과 상태 업데이트
      } else {
        throw new Error("서버에서 JSON 형식의 응답을 반환하지 않았습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      // 오류 처리 (예: 오류 메시지 표시)
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

  return (
    <Contain>
      <Screen>
        <MessageBox hasMessages={hasMessages}>
          <ContentWrapper>
            <MessagePlace hasMessages={hasMessages}>
              {messages.map((message, index) => (
                <MessageBubble key={index} sender={message.sender}>
                  {message.text}
                </MessageBubble>
              ))}
              <div ref={messageEndRef} />
            </MessagePlace>

            {isLoading && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <LoadingIcon /> {/* 회전하는 로딩 아이콘 */}
                <p style={{ marginTop: "10px" }}>로딩 중...</p>{" "}
                {/* 로딩 메시지 */}
              </div>
            )}

            {showUserInfoModal && (
              <UserInfoForm
                onSubmit={handleUserInfoSubmit}
                onClose={() => setShowUserInfoModal(false)}
              />
            )}
            {showFileUploadModal && (
              <Modal>
                <ModalContent>
                  <BackButton onClick={() => setShowFileUploadModal(false)}>
                    <FaArrowLeft /> 뒤로가기
                  </BackButton>
                  <h2>혈액 검사 결과 업로드</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fileInput = e.target.elements.imageFile.files[0];
                      const testDate = e.target.elements.testDate.value;
                      handleFileUpload(fileInput, testDate);
                      setShowFileUploadModal(false); // 업로드 후 모달 닫기
                    }}
                  >
                    <FormGroup>
                      <label htmlFor="testDate" style={{ marginRight: "10px" }}>
                        검사일자
                      </label>
                      <Input type="date" name="testDate" required />
                    </FormGroup>
                    <FormGroup>
                      <label
                        htmlFor="imageFile"
                        style={{ marginRight: "10px" }}
                      >
                        이미지 파일
                      </label>
                      <Input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        required
                      />
                    </FormGroup>
                  </form>
                  <UploadButton type="submit">업로드</UploadButton>
                </ModalContent>
              </Modal>
            )}
            {/* 업로드 결과 표시 */}
            {uploadResult && (
              <div>
                <h5>업로드 결과</h5>
                <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
              </div>
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
                    <CardContainer onClick={() => setShowFileUploadModal(true)}>
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
                    handleResizeHeight(); // 텍스트 영역 높이 조정
                  }}
                  onFocus={() => setPlaceholderVisible(false)} // 포커스 시 플레이스홀더 숨기기
                  onBlur={() => {
                    if (inputMessage.trim() === "") {
                      setPlaceholderVisible(true); // 입력값이 없으면 플레이스홀더 다시 표시
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Enter 키의 기본 동작 방지
                      handleSendMessage(e); // 메시지 전송 함수 호출
                    }
                  }}
                  placeholder={
                    placeholderVisible ? "메시지를 입력하세요..." : ""
                  }
                  style={{ resize: "none" }} // 사용자가 수동으로 크기를 조정하지 못하도록 설정
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
                <SendWrap onClick={handleSendMessage}>
                  <VscSend />
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
