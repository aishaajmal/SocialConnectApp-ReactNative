import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { usePosts } from "../context/PostContext";

export default function CreatePost() {
  const [text, setText] = useState("");
  const { addPost } = usePosts();
  const router = useRouter();

  const handlePost = async () => {
    if (text.trim().length === 0) return;
    await addPost(text);
    setText("");
    router.push("/feed");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create a Post</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What's on your mind?"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Post" onPress={handlePost} />
    </View>
  );
}
