import styled from "styled-components";
import Logo from "../../img/logo/logo.png";
import { Link } from "react-router-dom";
import { BsMoonStars, BsSunFill } from "react-icons/bs";
import { IoMenuOutline } from "react-icons/io5";
import UserToggle from "./UserToggle";
import { useState } from "react";
import defaultProfile from "../../img/mainImg/pro.png";
import { VscMenu, VscColorMode } from "react-icons/vsc";
import { IoChevronDown } from "react-icons/io5";

const HeaderContainer = styled.div`
  width: 100%;
  height: 6vh;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  transition: background-color 0.5s ease, color 0.5s ease,
    border-bottom 0.5s ease;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const LeftBox = styled.div`
  width: 70%;
  min-width: 117px;
  height: 100%;
  background-color: ${({ theme }) => theme.sideBar};
  color: ${({ theme }) => theme.color};
  transition: background-color 0.5s ease, color 0.5s ease,
    border-right 0.5s ease;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SideBarToggle = styled.div`
  width: 10%;
  min-width: 50px;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    transform: scale(1.1);
  }
  @media screen and (min-width: 1201px) {
    display: none;
  }
`;

const RightBox = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const LogoBox = styled(Link)`
  width: 10%;
  height: 90%;
  display: flex;
  justify-content: end;
  align-items: center;
  &:hover {
    transform: scale(1.04);
  }
  @media screen and (max-width: 1200px) {
    display: ${({ isHeader }) => (isHeader ? "flex" : "none")};
  }
`;

const SymLogo = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const LogoTitle = styled(Link)`
  width: 20%;
  height: 90%;
  display: flex;
  justify-content: start;
  align-items: center;
  color: #5a67ba;
  font-family: "Poppins-Bold", Helvetica;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  &:hover {
    font-size: 16px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 40px;
  height: 40px;
  @media screen and (max-width: 330px) {
    width: 35px;
    height: 35px;
  }
`;

const ToggleIcon = styled.div`
  position: absolute;
  align-items: center;
  justify-content: center;
  display: flex;
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? "scale(1)" : "scale(0.8)")};
`;

const Toggle = styled.div`
  width: 60px;
  height: 32px;
  background-color: ${({ theme }) => theme.toggle};
  border-radius: 104px;
  box-shadow: 2px 2px 6px #90909040;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s ease;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  @media screen and (max-width: 430px) {
    width: 40px;
    height: 25px;
  }
  @media screen and (max-width: 330px) {
    width: 30px;
  }
`;

const ToggleBox = styled.div`
  min-width: 40px;
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
  @media screen and (max-width: 1200px) {
    width: 8%;
  }
  @media screen and (max-width: 430px) {
    min-width: 45px;
    justify-content: flex-start;
  }
  @media screen and (max-width: 330px) {
    min-width: 35px;
    justify-content: flex-start;
  }
`;

const UserBox = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UserDiv = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 60%;
  height: 100%;
`;

const UserProfile = styled.div`
  width: 10%;
  min-width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 430px) {
    min-width: 30px;
  }
`;

const UserImg = styled.div`
  width: 35px;
  height: 35px;
  cursor: pointer;
  border-radius: 50%;
  background-image: ${({ imageurl }) => `url(${imageurl})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  @media screen and (max-width: 430px) {
    width: 30px;
    height: 30px;
  }
`;

const UserName = styled.div`
  width: 30%;
  height: 100%;
  margin-left: 5%;
  padding-left: 1%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  font-family: "Roboto-Regular", Helvetica;
  white-space: nowrap;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Dont = styled.div`
  width: 25%;
  height: 100%;
  @media screen and (max-width: 1200px) {
    width: 40%;
  }
`;

const AuthButton = styled.button`
  background-color: ${({ $isFirstAuth }) =>
    $isFirstAuth ? "#5a67ba" : "#c0c0c0"};
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${({ $isFirstAuth }) =>
      $isFirstAuth ? "#4a55a2" : "#a0a0a0"};
  }
`;

const TextWrapper = styled.span`
  margin-left: 10px;
`;

const Header = ({
  toggleDarkMode,
  isDarkMode,
  toggleUserToggle,
  isUserToggleVisible,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  return (
    <HeaderContainer>
      <LeftBox>
        <LogoBox to="/mainpage">
          <SymLogo />
        </LogoBox>
        <LogoTitle to="/mainpage">테스트입니다.</LogoTitle>
      </LeftBox>
      <RightBox>
        <ToggleBox>
          <Toggle onClick={toggleDarkMode}>
            <IconWrapper>
              <ToggleIcon isVisible={isDarkMode}>
                <BsMoonStars size={19} color="#c0c0c0" />
              </ToggleIcon>
              <ToggleIcon isVisible={!isDarkMode}>
                <BsSunFill size={23} color="#ffd400" />
              </ToggleIcon>
            </IconWrapper>
          </Toggle>
        </ToggleBox>
        <UserBox>
          {isAuthenticated && (
            <>
              <UserDiv>
                <UserProfile>
                  <UserImg
                    imageurl={currentUser?.imageUrl || defaultProfile}
                    onClick={toggleUserToggle}
                  />
                </UserProfile>
                <UserName>{currentUser?.username || "사용자"}</UserName>
                <UserToggle
                  isOpen={isUserToggleVisible}
                  setIsOpen={toggleUserToggle}
                  email={currentUser?.username || "사용자"}
                />
              </UserDiv>
              <AuthButton $isFirstAuth={true} onClick={handleLogout}>
                <TextWrapper>로그아웃</TextWrapper>
              </AuthButton>
            </>
          )}
          <Dont />
        </UserBox>
      </RightBox>
    </HeaderContainer>
  );
};

export default Header;
