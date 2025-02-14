import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ChatBot from "./chat/ChatBot";
import MainForm from "./common/commonForm/mainform";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme/theme";
import { useState, useEffect } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true"
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
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
              />
            }
          >
            <Route path="/" element={<ChatBot isDarkMode={isDarkMode} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
