import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const dots = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: black;
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 black;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Contain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Screen = styled.div`
  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.darkBackground : theme.lightBackground};
  color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.lightText : theme.darkText};
  transition: background-color 0.5s ease, color 0.5s ease;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 11;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MessageBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.hasMessages ? "space-between" : "center"};
  align-items: ${(props) => (props.hasMessages ? "" : "center")};
  padding: 20px;
  height: 100%;
  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.commponent : theme.commponent};
  overflow: hidden;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

export const MessagePlace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  overflow-y: auto;
  flex: 1;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 auto;
    padding-bottom: 60px;
  }
`;

export const MessageSendBox = styled.div`
  width: 100%;
  padding: 10px;
  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.darkBackground : theme.lightBackground};
  border-top: ${(props) => (props.hasMessages ? "1px solid" : "none")};
  border-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.color : theme.color};
  display: flex;
  justify-content: center;
  align-items: center;
  position: ${(props) => (props.hasMessages ? "relative" : "absolute")};

  @media screen and (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px;
  }
`;

export const MessageSendWrap = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #ffffffd0;
  border: 1px solid
    ${({ theme, isDarkMode }) => (isDarkMode ? theme.goodBlue : "#000")};
  transition: background-color 0.5s ease, border 0.5s ease;
  border-radius: 20px;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    width: 95%;
  }
`;

export const MessageSend = styled.input`
  background-color: transparent;
  font-size: 15px;
  font-weight: lighter;
  width: 95%;
  height: 40px;
  border: none;
  border-radius: 20px;
  padding: 0 15px;
  color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.lightText : theme.darkText};
  outline: none;
  &::placeholder {
    color: #4545b8;
  }
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const SendWrap = styled.div`
  cursor: pointer;
  font-size: 20px;
  padding: 0 15px;
  color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.lightText : theme.darkText};

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  margin: 10px 0;
  border-radius: 20px;
  background-color: ${({ theme, isDarkMode, sender }) =>
    sender === "user"
      ? isDarkMode
        ? "#007AFF"
        : "#0056B3"
      : isDarkMode
      ? "#FF0000"
      : "#B30000"};
  color: #ffffff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  align-self: ${(props) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-line;
  animation: ${fadeIn} 0.5s ease forwards;
  text-align: left;
  @media screen and (max-width: 768px) {
    max-width: 85%;
    font-size: 14px;
  }
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  font-style: italic;
  color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.lightText : theme.darkText};
  &:after {
    content: "...";
    animation: ${dots} 1.5s steps(5, end) infinite;
  }
`;

export const LoadingIcon = styled(VscLoading)`
  font-size: 24px;
  animation: ${spin} 1s linear infinite;
`;
export const DisclaimerMessage = styled.p`
  font-size: 10px;
  color: #666;
  margin-bottom: 10px;
`;
