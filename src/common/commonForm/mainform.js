import { Outlet, useLocation } from "react-router-dom";
import styled, { css, ThemeProvider } from "styled-components";
import SideBar from "./SideBar";
import Header from "./Header";
import { useEffect, useState } from "react";
import AlarmBar from "./AlarmBar";
import { lightTheme, darkTheme } from "../../theme/theme";

const Screen = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 91.9vh;
  transition: background-color 0.5s ease, color 0.5s ease;
  @media screen and (max-width: 768px) {
  }
  ${({ isAnnouncement }) =>
    isAnnouncement &&
    css`
      @media screen and (max-width: 1200px) {
        height: 100%;
      }
    `}
`;

const Contents = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 430px) {
    width: 95%;
  }
`;

const MainForm = ({
  isDarkMode,
  toggleDarkMode,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);
  const [isAlarmVisible, setIsAlarmVisible] = useState(false);
  const [isHeader, setIsHeader] = useState(false);
  const location = useLocation();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const isAnnouncement = location.pathname === "/announcement";
  const [isUserToggleVisible, setIsUserToggleVisible] = useState(false);

  // 사이드바의 가시성을 토글하는 함수
  const toggleSideBar = () => {
    setIsSideBarVisible(!isSideBarVisible);
    setIsHeader(!isHeader);
  };

  // 알림바의 가시성을 토글하는 함수
  const toggleAlarmBar = () => {
    setIsAlarmVisible(!isAlarmVisible);
    if (isUserToggleVisible) {
      setIsUserToggleVisible(false);
    }
  };

  const toggleUserToggle = () => {
    setIsUserToggleVisible(!isUserToggleVisible);
    if (isAlarmVisible) {
      setIsAlarmVisible(false);
    }
  };
  // 화면 크기 변화에 따라 사이드바를 숨기거나 보이게 설정하는 함수
  const handleResize = () => {
    if (window.innerWidth < 1201) {
      setIsSideBarVisible(false);
      setIsHeader(false);
    } else {
      setIsSideBarVisible(true);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 마운트될 때 한 번 체크
    handleResize();

    // 컴포넌트가 언마운트될 때 리사이즈 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // location이 변경될 때 알림바를 닫음
  // useEffect(() => {
  //   setIsAlarmVisible(false);
  // }, [location]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Header
        toggleSideBar={toggleSideBar}
        toggleAlarmBar={toggleAlarmBar}
        isHeader={isHeader}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        hasUnreadNotifications={hasUnreadNotifications}
        toggleUserToggle={toggleUserToggle}
        isUserToggleVisible={isUserToggleVisible}
      />
      <Screen isAnnouncement={isAnnouncement}>
        {isSideBarVisible && (
          <SideBar
            toggleSideBar={toggleSideBar}
            isDarkMode={isDarkMode}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
        <Contents>
          <Outlet
            context={{
              setHasUnreadNotifications,
              isDarkMode,
            }}
          />
        </Contents>
        {isAlarmVisible && (
          <AlarmBar
            toggleAlarmBar={toggleAlarmBar}
            setHasUnreadNotifications={setHasUnreadNotifications}
            hasUnreadNotifications={hasUnreadNotifications}
            isVisible={isAlarmVisible}
            isDarkMode={isDarkMode}
          />
        )}
      </Screen>
    </ThemeProvider>
  );
};

export default MainForm;
