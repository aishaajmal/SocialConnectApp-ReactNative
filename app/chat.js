import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../utils/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { wp, hp } from "../utils/responsive";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const userId = auth.currentUser?.uid || "1"; 

  
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "chats"), {
        text,
        userId,
        createdAt: serverTimestamp(),
      });
      setText(""); 
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💬 Chat Room</Text>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.userId === userId ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleTimeString()
                : ""}
            </Text>
          </View>
        )}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: wp(6),
    fontWeight: "bold",
    padding: wp(4),
    textAlign: "center",
    backgroundColor: "#007bff",
    color: "white",
  },
  message: {
    padding: wp(3),
    margin: wp(2),
    borderRadius: 10,
    maxWidth: "75%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    fontSize: wp(4),
    color: "black",
  },
  timestamp: {
    fontSize: wp(3),
    color: "gray",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: wp(2),
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: wp(5),
    marginLeft: wp(2),
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
