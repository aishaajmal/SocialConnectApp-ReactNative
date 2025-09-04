import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { usePosts } from "../context/PostContext";

export default function PostItem({ post }) {
  const { toggleLike } = usePosts();
  const router = useRouter();

  return (
    <View style={{ padding: 15, borderBottomWidth: 1 }}>
      <TouchableOpacity onPress={() => router.push(`/profile/${post.user.id}`)}>
        <Text style={{ fontWeight: "bold" }}>{post.user.name}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16 }}>{post.text}</Text>
      <Text style={{ color: "gray" }}>{new Date(post.createdAt).toLocaleString()}</Text>
      <Text>{post.likes} Likes</Text>

      <Button
        title={post.likedBy?.includes("1") ? "Unlike" : "Like"}
        onPress={() => toggleLike(post.id, "1")}
      />
      <Button
        title="Comments"
        onPress={() => router.push(`/comments/${post.id}`)}
      />
    </View>
  );
}
