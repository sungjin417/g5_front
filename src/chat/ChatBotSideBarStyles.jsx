import styled from "styled-components";

export const Back = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1001;

  @media screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const Sidebar = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ isDarkMode }) => (isDarkMode ? "#121212" : "#f1f2f7")};
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  transition: transform 0.3s ease, background-color 0.5s ease;

  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    z-index: 1000;
    padding-top: 60px; // 상단 패딩 추가하여 콘텐츠가 잘리지 않도록 설정
  }
`;

export const Menu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

// 나머지 styled-components 정의는 이전과 동일하게 유지됩니다...

export const NewChatBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const NewChatBtn = styled.div`
  width: 100%;
  height: 40px;
  cursor: pointer;
  background-color: #5a6acf;
  color: #ffffff;
  transition: background-color 0.3s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;

  &:hover {
    background-color: #4a59b0;
  }

  svg {
    margin-right: 10px;
  }
`;

export const ConversationList = styled.div`
  width: 100%;
  height: 50%;
  overflow-y: auto;
  margin-bottom: 20px;
  visibility: ${(props) => (props.isCardSelected ? "visible" : "hidden")};
`;

export const ConversationItem = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 5px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? "#3b3a4f" : "#d8dcf3")};
  &:hover {
    background-color: rgba(90, 106, 207, 0.1);
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 16px;

  &:hover {
    color: #ff7875;
  }
`;

export const SettingBox = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

export const SetDetail = styled.div`
  width: 100%;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000000")};
  border: 1px solid
    ${({ isDarkMode }) => (isDarkMode ? "#333b6c" : "transparent")};
  &:hover {
    background-color: rgba(90, 106, 207, 0.1);
  }

  svg {
    margin-right: 10px;
  }
`;

export const ToggleButton = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 50%;
  color: white;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const Overlay = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;
