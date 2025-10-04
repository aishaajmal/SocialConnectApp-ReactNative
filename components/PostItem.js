import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { usePosts } from "../context/PostContext";
import { wp, hp } from "../utils/responsive";
import { sendLikeNotification } from "../utils/notifications";

export default function PostItem({ post, currentUserId }) {
  const { toggleLike } = usePosts();
  const router = useRouter();

  const isLiked = post.likedBy?.includes(currentUserId);

  const handleLike = () => {
    toggleLike(post.id, currentUserId);

    
    if (post.user.id !== currentUserId) {
      sendLikeNotification(post.user.id, currentUserId);
    }
  };

  return (
    <View style={styles.card}>
      {/* User info */}
      <TouchableOpacity
        onPress={() => router.push(`/profile/${post.user.id}`)}
      >
        <Text style={styles.username}>{post.user.name}</Text>
      </TouchableOpacity>

      {/* Post text */}
      {post.text ? <Text style={styles.text}>{post.text}</Text> : null}

      {/* Optional Post Image */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Timestamp */}
      <Text style={styles.time}>
        {post.createdAt?.seconds
          ? new Date(post.createdAt.seconds * 1000).toLocaleString()
          : ""}
      </Text>

      {/* Like + Comment Row */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Text style={[styles.likeText, isLiked && styles.liked]}>
            {isLiked ? "❤️" : "🤍"} {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/comments/${post.id}`)}
        >
          <Text style={styles.commentText}>💬 {post.comments?.length || 0} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: wp(4),
    marginVertical: hp(1),
    marginHorizontal: wp(2),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  username: {
    fontWeight: "bold",
    fontSize: wp(4.5),
    marginBottom: hp(0.5),
  },
  text: {
    fontSize: wp(4),
    marginBottom: hp(1),
  },
  postImage: {
    width: "100%",
    height: hp(25),
    borderRadius: 10,
    marginBottom: hp(1),
  },
  time: {
    color: "gray",
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
  actionBtn: {
    padding: 5,
  },
  likeText: {
    fontSize: wp(4.5),
    color: "#333",
  },
  liked: {
    color: "red",
    fontWeight: "bold",
  },
  commentText: {
    fontSize: wp(4.5),
    color: "#007bff",
  },
});
