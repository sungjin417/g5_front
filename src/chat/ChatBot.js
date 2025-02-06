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
import { chatService } from "../api/chatService";
import { websocketService } from "../api/websocketService";

// 설정 아이콘 스타일
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

// 채팅 컨텐츠 래퍼 스타일
const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 20px;
  overflow-y: auto;
`;

// 카드 섹션 스타일
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

const ChatBot = () => {
  // 상태 관리
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" },
  ]);

  // refs
  const messageEndRef = useRef(null);
  const userId = "test_user"; // TODO: 실제 사용자 ID 관리 구현 필요

  // 새 메시지가 추가될 때마다 스크롤 자동 이동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // WebSocket 메시지 처리
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (data.type === "chat.message") {
        const response = data.message;

        // 메시지 컨텐츠 포맷팅
        const mainContent = formatMainContent(response);
        const references = formatReferences(response.references);
        const formattedText = formatFullText(mainContent, references);

        // 봇 메시지 추가
        addBotMessage(formattedText);
      }
    };

    // WebSocket 연결 설정
    websocketService.addMessageHandler(handleWebSocketMessage);
    websocketService.connect();

    // 컴포넌트 언마운트 시 정리
    return () => {
      websocketService.removeMessageHandler(handleWebSocketMessage);
      websocketService.disconnect();
    };
  }, [messages.length]);

  // 메시지 포맷팅 유틸리티 함수들
  const formatMainContent = (response) => {
    return [
      response.mechanism,
      response.evidence1,
      response.evidence2,
      response.lab_analysis,
      response.final_advice,
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const formatReferences = (references) => {
    return references
      ?.map(
        (ref, index) =>
          `[${index + 1}] ${ref.authors} (${ref.year}). ${ref.title}. ${
            ref.journal
          }`
      )
      .join("\n");
  };

  const formatFullText = (mainContent, references) => {
    return references
      ? `${mainContent}\n\n참고문헌:\n${references}`
      : mainContent;
  };

  // 봇 메시지 추가
  const addBotMessage = (text) => {
    const botMessage = {
      id: messages.length + 1,
      text: text,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // 메시지 전송 처리
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // 사용자 메시지 추가
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // WebSocket으로 메시지 전송
    try {
      websocketService.sendMessage({
        type: "chat.message",
        message: inputMessage,
        user_id: userId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      handleError("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  // 에러 처리
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
      await chatService.saveUserInfo(userInfo);
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
      await chatService.uploadFile(file);
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

  // 채팅 컨텐츠 렌더링
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

  // 메인 렌더링
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
