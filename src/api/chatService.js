import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS, Common } from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Common.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const isRefreshed = await Common.handleUnauthorized();
      if (isRefreshed) {
        const token = Common.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  // 채팅 메시지 전송
  sendMessage: async (message) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // 사용자 정보 저장
  saveUserInfo: async (userInfo) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_INFO,
        userInfo
      );
      return response.data;
    } catch (error) {
      console.error("Error saving user info:", error);
      throw error;
    }
  },

  // 파일 업로드
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        API_ENDPOINTS.FILE_UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // 회원 정보 조회
  getMemberInfo: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEMBER_INFO);
      return response.data;
    } catch (error) {
      console.error("Error getting member info:", error);
      throw error;
    }
  },

  // 채팅방 상세 정보 조회
  getChatDetail: async (roomId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CHAT_DETAIL}${roomId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting chat detail:", error);
      throw error;
    }
  },
};
