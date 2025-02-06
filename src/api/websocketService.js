import { WS_BASE_URL, WS_ENDPOINTS, Common } from "./config";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.messageHandlers = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  connect() {
    if (this.isConnected()) {
      console.log("WebSocket is already connected");
      return;
    }

    const token = Common.getAccessToken();
    const wsUrl = `${WS_BASE_URL.replace(/\/$/, "")}${WS_ENDPOINTS.CHAT}${
      token ? `?token=${token}` : ""
    }`;

    console.log("Connecting to WebSocket URL:", wsUrl);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.handleReconnect();
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.log("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  sendMessage(message) {
    if (this.isConnected()) {
      const messageData = {
        type: "chat.message",
        message: message.message,
        user_id: message.user_id,
      };
      this.ws.send(JSON.stringify(messageData));
    } else {
      console.error("WebSocket is not connected.");
      this.connect();
    }
  }
}

export const websocketService = new WebSocketService();
