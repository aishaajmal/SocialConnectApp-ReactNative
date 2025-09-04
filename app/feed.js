import React from "react";
import { View, FlatList, Button } from "react-native";
import { useRouter } from "expo-router";
import { usePosts } from "../context/PostContext";
import PostItem from "../components/PostItem";

export default function Feed() {
  const { posts } = usePosts();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Create Post" onPress={() => router.push("/createpost")} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem post={item} />}
      />
    </View>
  );
}
