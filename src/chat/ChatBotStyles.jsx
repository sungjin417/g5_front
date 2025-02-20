import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

// bounce 애니메이션 정의
export const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

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

// 새로운 애니메이션 정의
export const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

export const gradientBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

export const Contain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
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
  align-items: ${(props) => (props.hasMessages ? "center" : "center")};
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
  border: 1px solid;
  background-color: ${({ theme }) => theme.sideBar};
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 10px;
  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.darkBackground : theme.lightBackground};
  /* border-top: ${(props) => (props.hasMessages ? "1px solid" : "none")}; */
  border-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.color : theme.color};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    /* position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px; */
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

export const MessageSend = styled.textarea`
  background-color: transparent;
  color: ${({ theme }) => theme.color};
  font-size: 15px;
  font-weight: bold;
  line-height: 1.3;
  width: 95%;
  height: 44px;
  max-height: 20vh;
  border: none;
  border-radius: 20px;
  padding: 0 15px;
  outline: none;
  /* placeholder 스타일 */
  &::placeholder {
    color: ${({ theme }) => theme.color};
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  margin: 10px 0;
  border-radius: 20px;
  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.mb1 : theme.mb1};

  color: ${({ theme, isDarkMode }) => (isDarkMode ? theme.color : theme.color)};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  align-self: ${(props) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-line;
  animation: ${fadeIn} 0.5s ease forwards;
  text-align: left;
   a {
    color: ${({ theme }) => theme.color};
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      color: #E4643D;
    }
  }

  @media screen and (max-width: 768px) {
    max-width: 85%;
    font-size: 14px;
  }
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  font-style: italic;
  color: ${({ theme }) => theme.color};
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
  text-align: center;
  color: #666;
  margin-bottom: 10px;
`;

export const LoadingModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const LoadingModalContent = styled.div`
  background: linear-gradient(45deg, #f3f4f6, #ffffff);
  background-size: 200% 200%;
  animation: ${gradientBg} 5s ease infinite;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const LoadingEmoji = styled.div`
  font-size: 50px;
  animation: ${float} 2s ease-in-out infinite;
`;

export const LoadingMessage = styled.div`
  font-size: 16px;
  color: #4a59b0;
  text-align: center;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  width: fit-content;

`;

// 로딩 바 애니메이션 추가
const progressAnimation = keyframes`
  0% {
    left: -30%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: -30%;
  }
`;

export const LoadingProgress = styled.div`
  width: 200px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -30%;
    height: 100%;
    width: 30%;
    background: linear-gradient(90deg, #4a59b0, #6d7adb);
    border-radius: 10px;
    animation: ${progressAnimation} 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(74, 89, 176, 0.5);
  }
`;
