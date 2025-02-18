import React, { createContext, useContext, useState } from "react";

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

  const login = async (id, password) => {
    try {
      // 로그인 API 호출
      const response = await fetch(
        "http://54.180.252.205:8009/api/account/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const newAuth = {
        tokens: {
          access: data.access,
          refresh: data.refresh,
        },
        user: {
          id: id,
          username: id,
        },
        isAuthenticated: true,
      };

      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (auth.tokens?.refresh) {
        // 로그아웃 API 호출
        await fetch("http://54.180.252.205:8009/api/account/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.tokens.access}`,
          },
          body: JSON.stringify({
            refresh: auth.tokens.refresh,
          }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // 로컬 상태 초기화
    const newAuth = {
      tokens: null,
      user: null,
      isAuthenticated: false,
    };

    setAuth(newAuth);
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser"); // 기존 호환성 유지
  };

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      if (!auth.tokens?.refresh) return false;

      const response = await fetch(
        "http://54.180.252.205:8009/api/account/token/refresh/",
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

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        refreshToken,
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
