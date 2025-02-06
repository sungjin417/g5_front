export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

export const WS_BASE_URL =
  process.env.REACT_APP_WS_URL || "ws://localhost:8000";

export const API_ENDPOINTS = {
  CHAT: "/ws/chat/",
  USER_INFO: "/api/user-info/",
  FILE_UPLOAD: "/api/file-upload/",
  MEMBER_INFO: "/api/member/info/",
  CHAT_DETAIL: "/api/chat/detail/",
};

export const WS_ENDPOINTS = {
  CHAT: "/ws/chat/",
};

// 공통 유틸리티 함수
export const Common = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  removeTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
  handleUnauthorized: async () => {
    const refreshToken = Common.getRefreshToken();
    if (refreshToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (response.ok) {
          const data = await response.json();
          Common.setTokens(data.access, refreshToken);
          return true;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
    Common.removeTokens();
    return false;
  },
};
