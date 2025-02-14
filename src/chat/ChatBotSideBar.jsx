import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft, FaPlus } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { MdLogout } from "react-icons/md";
// import { useChatContext } from "../../contexts/ChatContext";
import {
  Sidebar,
  Menu,
  NewChatBox,
  Back,
  NewChatBtn,
  SettingBox,
  SetDetail,
  ConversationList,
  ConversationItem,
  DeleteButton,
  Overlay,
} from "./ChatBotSideBarStyles";

const ChatBotSideBar = ({
  isOpen,
  toggleSideBar,
  onNewChat,
  isCardSelected,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const { conversations, deleteConversation, setCurrentConversation } =
    useState();

  const handleConversationClick = (conv) => {
    setCurrentConversation(conv);
    if (window.innerWidth <= 768) {
      toggleSideBar();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `대화 ${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}. 오후 ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSideBar} />
      <Sidebar isOpen={isOpen} isDarkMode={isDarkMode}>
        <Back onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </Back>
        <Menu>
          <NewChatBox>
            <NewChatBtn onClick={onNewChat}>
              새 채팅
              <FaPlus size={14} />
            </NewChatBtn>
          </NewChatBox>
          <ConversationList isCardSelected={isCardSelected}>
            {conversations.map((conv) => (
              <ConversationItem
                isDarkMode={isDarkMode}
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
              >
                {formatDate(conv.id)}
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                >
                  <FaTrashAlt />
                </DeleteButton>
              </ConversationItem>
            ))}
          </ConversationList>
          <SettingBox>
            <SetDetail
              isDarkMode={isDarkMode}
              onClick={() => navigate("/setting")}
            >
              <GoPerson />
              계정관리
            </SetDetail>
            <SetDetail
              isDarkMode={isDarkMode}
              onClick={() => navigate("/help")}
            >
              FAQ
            </SetDetail>
            <SetDetail
              isDarkMode={isDarkMode}
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/");
              }}
            >
              <MdLogout />
              로그아웃
            </SetDetail>
          </SettingBox>
        </Menu>
      </Sidebar>
    </>
  );
};

export default ChatBotSideBar;
