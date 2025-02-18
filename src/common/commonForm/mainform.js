import { Outlet, useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Header from "./Header";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useState } from "react";

const Screen = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 91.9vh;
  transition: background-color 0.5s ease, color 0.5s ease;
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
  const [isUserToggleVisible, setIsUserToggleVisible] = useState(false);

  const toggleUserToggle = () => {
    setIsUserToggleVisible(!isUserToggleVisible);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Header
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        toggleUserToggle={toggleUserToggle}
        isUserToggleVisible={isUserToggleVisible}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Screen>
        <Contents>
          <Outlet
            context={{
              isDarkMode,
            }}
          />
        </Contents>
      </Screen>
    </ThemeProvider>
  );
};

export default MainForm;
