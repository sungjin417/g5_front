import React, { useState, useEffect, useRef } from "react";
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
} from "./ChatBotStyles";
import { CardWrapper, CardContainer, CardText } from "./ChatCardStyles";
import { VscSend } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";
import UserInfoForm from "./UserInfoForm";
import FileUpload from "./FileUpload";
import styled from "styled-components";

/**
 * 설정 아이콘 스타일 컴포넌트
 * - 우측 상단에 위치
 * - 호버 시 색상 변경 효과
 */
const SettingsIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 24px;
  color: #5a6acf;
  z-index: 100;

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
const CardSection = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
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
    width: 200px;
    height: auto;
    min-height: 60px;
    padding: 15px;
    margin: 0;

    &:hover {
      transform: scale(1.02);
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

  // 채팅 관련 상태 관리
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" },
  ]);
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태

  // === Refs ===
  const messageEndRef = useRef(null); // 스크롤 위치 관리용
  const ws = useRef(null); // WebSocket 인스턴스 관리
  const userId = "test_user"; // 임시 사용자 ID (실제 구현 시 인증 시스템과 연동 필요)

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
      const wsUrl = process.env.REACT_APP_WEBSOCKET_URL;
      if (!wsUrl) {
        throw new Error("WebSocket URL is not configured");
      }
      ws.current = new WebSocket(wsUrl);

      // WebSocket 연결 성공 시
      ws.current.onopen = () => {
        console.log("Successfully connected to WebSocket");
        setIsConnected(true);
      };

      // 메시지 수신 처리
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat.message") {
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

          // 봇 응답 메시지 추가
          const botMessage = {
            id: messages.length + 2,
            text: formattedText,
            sender: "bot",
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      };

      // 에러 처리
      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
        handleError("WebSocket 연결 중 오류가 발생했습니다.");
      };

      // 연결 종료 처리
      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      handleError("WebSocket 연결을 설정할 수 없습니다.");
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
    if (inputMessage.trim() === "" || !ws.current || !isConnected) return;

    // 사용자 메시지 UI 추가
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    // WebSocket으로 메시지 전송
    ws.current.send(
      JSON.stringify({
        message: inputMessage,
        user_id: userId,
        type: "chat.message",
      })
    );

    setInputMessage(""); // 입력창 초기화
  };

  /**
   * 에러 메시지 처리 함수
   */
  const handleError = (errorMessage) => {
    const errorMsg = {
      id: messages.length + 2,
      text: errorMessage,
      sender: "system",
    };
    setMessages((prev) => [...prev, errorMsg]);
  };

  // 사용자 정보 제출 처리
  const handleUserInfoSubmit = async (userInfo) => {
    try {
      console.log("User info submitted:", userInfo); // 임시 로깅
      setShowUserInfoModal(false);
      handleSuccess("사용자 정보가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Error saving user info:", error);
      handleError("사용자 정보 저장 중 오류가 발생했습니다.");
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (file) => {
    try {
      console.log("File uploaded:", file); // 임시 로깅
      setShowFileUploadModal(false);
      handleSuccess("파일이 성공적으로 업로드되었습니다.");
    } catch (error) {
      console.error("Error uploading file:", error);
      handleError("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  // 성공 메시지 처리
  const handleSuccess = (successMessage) => {
    const successMsg = {
      id: messages.length + 1,
      text: successMessage,
      sender: "system",
    };
    setMessages((prev) => [...prev, successMsg]);
  };

  /**
   * 채팅 UI 렌더링 함수
   * - 설정 메뉴
   * - 메시지 목록
   * - 모달 컴포넌트
   */
  const renderContent = () => {
    return (
      <ContentWrapper>
        <SettingsIcon onClick={() => setShowCards(!showCards)}>
          <FiSettings />
        </SettingsIcon>

        <CardSection show={showCards}>
          <CardWrapper>
            <CardContainer onClick={() => setShowUserInfoModal(true)}>
              <CardText>사용자 정보 입력</CardText>
            </CardContainer>
            <CardContainer onClick={() => setShowFileUploadModal(true)}>
              <CardText>혈액 검사 파일 업로드</CardText>
            </CardContainer>
          </CardWrapper>
        </CardSection>

        <MessagePlace>
          {messages.map((message, index) => (
            <MessageBubble key={index} sender={message.sender}>
              {message.text}
            </MessageBubble>
          ))}
          <div ref={messageEndRef} />
        </MessagePlace>

        {showUserInfoModal && (
          <UserInfoForm
            onSubmit={handleUserInfoSubmit}
            onClose={() => setShowUserInfoModal(false)}
          />
        )}
        {showFileUploadModal && (
          <FileUpload
            onUpload={handleFileUpload}
            onClose={() => setShowFileUploadModal(false)}
          />
        )}
      </ContentWrapper>
    );
  };

  return (
    <Contain>
      <Screen>
        <MessageBox>
          {renderContent()}
          <MessageSendBox>
            <MessageSendWrap>
              <MessageSend
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="메시지를 입력하세요..."
              />
              <SendWrap onClick={handleSendMessage}>
                <VscSend />
              </SendWrap>
            </MessageSendWrap>
          </MessageSendBox>
        </MessageBox>
      </Screen>
    </Contain>
  );
};

export default ChatBot;
