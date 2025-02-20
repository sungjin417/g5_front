import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import ChatBot from "./chat/ChatBot";
import MainForm from "./common/commonForm/mainform";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme/theme";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import AuthLayout from "./auth/AuthLayout";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme === null) {
      localStorage.setItem("isDarkMode", "true");
      return true;
    }
    return savedTheme === "true";
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
            />
          </Route>

          <Route
            element={
              <MainForm
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          >
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

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
