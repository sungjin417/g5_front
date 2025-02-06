import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
const userId = "test_user"; // 실제 구현시 사용자 ID 관리 필요


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      console.log("Attempting to connect to WebSocket...");
      ws.current = new WebSocket("ws://16.184.8.183:8000/ws/chat");

      ws.current.onopen = () => {
        console.log("Successfully connected to WebSocket");
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat.message') {
          const response = data.message;
          
          // 메인 컨텐츠 포맷팅
          const mainContent = [
            response.mechanism,
            response.evidence1,
            response.evidence2,
            response.lab_analysis,
            response.final_advice
          ].filter(Boolean).join('\n\n');

          // 참고문헌 포맷팅
          const references = response.references?.map((ref, index) => 
            `[${index + 1}] ${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}`
          ).join('\n');

          // 전체 텍스트 조합 (참고문헌이 있는 경우에만 추가)
          const formattedText = references 
            ? `${mainContent}\n\n참고문헌:\n${references}`
            : mainContent;

          // 챗봇 메시지로 표시
          const botMessage = {
            id: `bot_${Date.now()}`,
            text: formattedText,
            isUser: false,
            timestamp: new Date().toISOString(),
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);
        } else if (data.type === 'chat.error') {
          Alert.alert('Error', data.message || '오류가 발생했습니다.');
        }
      };
    

      ws.current.onerror = (error) => {
        console.log("WebSocket Error Details:", {
          error,
          readyState: ws.current?.readyState,
          url: ws.current?.url,
        });
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
      };

      return () => {
        if (ws.current) {
          console.log("Closing WebSocket connection...");
          ws.current.close();
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "" || !ws.current || !isConnected) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: inputText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    ws.current.send(JSON.stringify({
      message: inputText,
      user_id: userId,
      type: 'chat.message'
    }));

    setInputText("");
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
    lineHeight: 24,
    whiteSpace: 'pre-wrap',
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChatBot;
