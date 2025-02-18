import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import ChatBot from "./chat/ChatBot";
import MainForm from "./common/commonForm/mainform";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme/theme";
import { useState, useEffect } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("currentUser")
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "true");
    }

    // 로그인 상태 변경 감지
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("currentUser"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
  };

  // 보호된 라우트 컴포넌트
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <MainForm
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          >
            {/* 보호된 라우트들 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatBot isDarkMode={isDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mainpage"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcement"
              element={
                <ProtectedRoute>
                  <div>Announcement Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/information"
              element={
                <ProtectedRoute>
                  <div>Information Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluation"
              element={
                <ProtectedRoute>
                  <div>Evaluation Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <ProtectedRoute>
                  <div>Settings Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <div>Help Page</div>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
