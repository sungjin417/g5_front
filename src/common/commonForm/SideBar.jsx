import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  IoSettingsOutline,
  IoReaderOutline,
  IoBarChartOutline,
  IoChatbubbleEllipsesOutline,
  IoNewspaperOutline,
  IoTodayOutline,
  IoChatboxEllipsesOutline,
} from "react-icons/io5";
import { useState } from "react";
import SignUp from "../../auth/SignUp";
import Login from "../../auth/Login";

const Sidebar = styled.div`
  width: 15%;
  min-width: 161.69px;
  height: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.sideBar};
  transition: background-color 0.5s ease, border-right 0.5s ease;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 1%;
  @media screen and (max-width: 1200px) {
    position: fixed;
    width: 200px;
    top: 6%;
    left: 0;
    background-color: ${({ theme }) => theme.sideBar};
    border-right: 1px solid ${({ theme }) => theme.border};
    z-index: 100;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
`;

const Menu = styled.div`
  width: 60%;
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  @media screen and (max-width: 1200px) {
    width: 70%;
  }
`;

const activeTitleStyle = css`
  background-color: ${({ theme }) => theme.sideCheck};
  transition: background-color 0.5s ease;
  opacity: 0.8;
  border-radius: 5px;
`;

const Title = styled.div`
  width: 100%;
  height: 45px;
  color: ${({ theme }) => theme.color};
  transition: color 0.5s ease;
  font-family: "Poppins-Regular", Helvetica;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 11px;
  opacity: 0.5;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const ContentsBox = styled(Link)`
  width: 100%;
  min-width: 124px;
  height: 42px;
  padding-left: 7%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
  ${(props) => props.isActive && activeTitleStyle}
  &:hover {
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const IconBox = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  width: 80%;
  color: ${({ theme }) => theme.color};
  transition: color 0.5s ease;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding-left: 5px;
`;

const AuthButton = styled(ContentsBox)`
  background-color: ${({ theme }) => theme.background};
  margin-top: 10px;
`;

const SideBar = ({
  toggleSideBar,
  isDarkMode,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleMenuClick = (e, path) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다. 로그인 해주세요.");
      return;
    }

    if (window.innerWidth <= 1200) {
      toggleSideBar();
    }
    navigate(path);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Sidebar>
      <Menu>
        {isAuthenticated ? (
          <Title>Welcome, {currentUser?.id}</Title>
        ) : (
          <>
            <AuthButton onClick={() => setShowSignUp(true)}>
              <TextWrapper>회원가입하기</TextWrapper>
            </AuthButton>
            <AuthButton onClick={() => setShowLogin(true)}>
              <TextWrapper>로그인하기</TextWrapper>
            </AuthButton>
          </>
        )}
        <ContentsBox
          to="/mainpage"
          isActive={currentPath === "/mainpage"}
          onClick={(e) => handleMenuClick(e, "/mainpage")}
        >
          <IconBox>
            <IoBarChartOutline
              size={20}
              color={currentPath === "/mainpage" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>Dashboard</TextWrapper>
        </ContentsBox>
        <ContentsBox
          to="/announcement"
          isActive={currentPath === "/announcement"}
          onClick={(e) => handleMenuClick(e, "/announcement")}
        >
          <IconBox>
            <IoTodayOutline
              size={20}
              color={currentPath === "/announcement" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>공지사항</TextWrapper>
        </ContentsBox>
        <ContentsBox
          to="/information"
          isActive={currentPath === "/information"}
          onClick={(e) => handleMenuClick(e, "/information")}
        >
          <IconBox>
            <IoReaderOutline
              size={20}
              color={currentPath === "/information" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>건강정보</TextWrapper>
        </ContentsBox>
        <ContentsBox
          to="/evaluation"
          isActive={currentPath === "/evaluation"}
          onClick={(e) => handleMenuClick(e, "/evaluation")}
        >
          <IconBox>
            <IoNewspaperOutline
              size={20}
              color={currentPath === "/evaluation" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>건강평가</TextWrapper>
        </ContentsBox>
        <ContentsBox
          to="/chat"
          isActive={currentPath === "/chat"}
          onClick={(e) => handleMenuClick(e, "/chat")}
        >
          <IconBox>
            <IoChatbubbleEllipsesOutline
              size={20}
              color={currentPath === "/chat" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>챗봇</TextWrapper>
        </ContentsBox>
        <Title>OTHERS</Title>
        <ContentsBox
          to="/setting"
          isActive={currentPath === "/setting"}
          onClick={(e) => handleMenuClick(e, "/setting")}
        >
          <IconBox>
            <IoSettingsOutline
              size={20}
              color={currentPath === "/setting" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>설정</TextWrapper>
        </ContentsBox>
        <ContentsBox
          to="/help"
          isActive={currentPath === "/help"}
          onClick={(e) => handleMenuClick(e, "/help")}
        >
          <IconBox>
            <IoChatboxEllipsesOutline
              size={20}
              color={currentPath === "/help" ? "#263ed8" : "#8290ee"}
            />
          </IconBox>
          <TextWrapper>고객지원</TextWrapper>
        </ContentsBox>
        {isAuthenticated && (
          <AuthButton onClick={handleLogout}>
            <TextWrapper>로그아웃</TextWrapper>
          </AuthButton>
        )}
      </Menu>

      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </Sidebar>
  );
};
export default SideBar;
