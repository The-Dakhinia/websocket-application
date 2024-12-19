import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  SafeAreaView,
} from 'react-native';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://192.168.1.30:3000"; // Replace with your server's address if deployed

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Type the socket state as Socket or null
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io client
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("connect", ()=>{
      console.log("connected");
    });
    newSocket.on("disconnect", ()=>{
      console.log("disconnected");
    });

    // Clean up the socket connection on unmount
    return () => {
      newSocket.disconnect(); // Correct way to disconnect
    };
  }, []); // Empty dependency array means this effect runs only once

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("message", message); // Send message to server
      setMessage(""); // Clear input
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#dfe7fd",
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
