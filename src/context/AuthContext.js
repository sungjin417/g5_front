import React, { createContext, useContext, useState, useCallback } from "react";
import common from "../common/Common";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // JWT 토큰과 사용자 정보를 함께 관리
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth
      ? JSON.parse(savedAuth)
      : {
          tokens: null,
          user: null,
          isAuthenticated: false,
        };
  });

  const login = async (username, password) => {
    try {
      console.log("로그인 시도:", username);
      
      // API 요청 전에 서버 상태 확인
      const serverUrl = `http://${common.Llm_Domain}/account/login/`;
      console.log("Attempting to connect to:", serverUrl);

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
        credentials: 'include',
        mode: 'cors',  // CORS 모드 명시적 설정
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error details:", errorData);
        throw new Error(errorData.detail || "로그인에 실패했습니다.");
      }

      const data = await response.json();
      
      if (!data.access || !data.refresh) {
        throw new Error("토큰 데이터가 올바르지 않습니다.");
      }

      const newAuth = {
        tokens: {
          access: data.access,
          refresh: data.refresh,
        },
        user: data.user,
        isAuthenticated: true,
      };

      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));
      return true;

    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error("서버 연결 실패. 네트워크 상태를 확인해주세요.");
        throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      }
      console.error("로그인 오류:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth.tokens?.access || !auth.tokens?.refresh) {
        throw new Error('No tokens available');
      }

      const response = await fetch(`http://${common.Llm_Domain}/account/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.tokens.access}`
        },
        body: JSON.stringify({
          refresh: auth.tokens.refresh
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Logout error response:', errorData);
        throw new Error(errorData.error || 'Logout failed');
      }

      // 로그아웃 성공
      setAuth({
        tokens: null,
        user: null,
        isAuthenticated: false
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("currentUser");

    } catch (error) {
      console.error("Logout error:", error);
      // 에러가 발생하더라도 로컬 상태 초기화
      setAuth({
        tokens: null,
        user: null,
        isAuthenticated: false
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("currentUser");
      throw error;
    }
  };

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      if (!auth.tokens?.refresh) return false;

      const response = await fetch(
        `http://${common.Llm_Domain}/account/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: auth.tokens.refresh,
          }),
        }
      );

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      const newAuth = {
        ...auth,
        tokens: {
          ...auth.tokens,
          access: data.access,
        },
      };

      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  // 사용자 정보 조회 함수 (useCallback으로 메모이제이션)
  const getUserInfo = useCallback(async () => {
    try {
      if (!auth.tokens?.access) {
        console.error('No access token available');
        return null;
      }

      const response = await fetch(
        `http://${common.Llm_Domain}/account/me/`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.tokens.access}`
          }
        }
      );

      if (!response.ok) {
        // 토큰이 만료된 경우 토큰 갱신 시도
        if (response.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            // 토큰 갱신 성공 시 다시 요청
            const newResponse = await fetch(
              `http://${common.Llm_Domain}/account/me/`,
              {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${auth.tokens.access}`
                }
              }
            );
            if (newResponse.ok) {
              const userData = await newResponse.json();
              // 사용자 정보 업데이트
              const newAuth = {
                ...auth,
                user: userData,
                isAuthenticated: true
              };
              setAuth(newAuth);
              localStorage.setItem("auth", JSON.stringify(newAuth));
              return userData;
            }
          }
        }
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      // 사용자 정보 업데이트
      const newAuth = {
        ...auth,
        user: userData,
        isAuthenticated: true
      };
      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));
      return userData;

    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }, [auth, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        refreshToken,
        getUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
