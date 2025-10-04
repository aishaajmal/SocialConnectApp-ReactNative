import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePosts } from "../../context/PostContext";

export default function Comments() {
  const { id } = useLocalSearchParams();
  const { posts, addComment } = usePosts();
  const [text, setText] = useState("");

  const post = posts.find((p) => p.id === id);

  const handleComment = async () => {
    if (text.trim().length === 0) return;
    await addComment(id, text);
    setText("");
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={post?.comments || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 5 }}>
            <Text>{item.text}</Text>
            <Text style={{ color: "gray", fontSize: 12 }}>{item.timestamp}</Text>
          </View>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a comment..."
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Post Comment" onPress={handleComment} />
    </View>
  );
}
