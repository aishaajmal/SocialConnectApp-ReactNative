import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { wp, hp } from "../utils/responsive";
import { usePosts } from "../context/PostContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "react-native-image-picker";

export default function Posts() {
  const { posts, addPost, toggleLike, loading } = usePosts();
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  //  Pick image
  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      (result) => {
        if (!result.didCancel && result.assets?.[0]?.uri) {
          setImageUri(result.assets[0].uri);
        }
      }
    );
  };

  //  Handle Add Post
  const handleAddPost = async () => {
    await addPost(text, imageUri);
    setText("");
    setImageUri(null);
  };

  //  Filter posts by search
  const filteredPosts = posts.filter(
    (item) =>
      item.text?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts Feed</Text>

      {/*  Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search posts or users..."
        value={search}
        onChangeText={setSearch}
      />

      {/*  New Post Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>📷</Text>
        </Pressable>
        <Pressable style={styles.postButton} onPress={handleAddPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>

      {/*  Show selected image preview */}
      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <Pressable onPress={() => setImageUri(null)}>
            <Text style={{ color: "red", marginTop: 5 }}>Remove</Text>
          </Pressable>
        </View>
      )}

      {/*  Posts List */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Text style={styles.postUser}>{item.user?.name || "Anonymous"}</Text>
              <Text style={styles.postText}>{item.text}</Text>

              {/* Post Image if available */}
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.postImage} />
              )}

              <Text style={styles.timestamp}>
                {item.createdAt?.seconds
                  ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </Text>

              {/* Buttons */}
              <View style={styles.actions}>
                <Pressable
                  style={styles.likeButton}
                  onPress={() => toggleLike(item.id)}
                >
                  <Text style={styles.actionText}>👍 {item.likes}</Text>
                </Pressable>

                <Pressable
                  style={styles.commentButton}
                  onPress={() => router.push(`/comments/${item.id}`)}
                >
                  <Text style={styles.actionText}>💬 Comments</Text>
                </Pressable>

                <Pressable
                  style={styles.chatButton}
                  onPress={() => router.push("/chat")}
                >
                  <Text style={styles.actionText}>💬 Chat</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
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
  searchInput: {
    margin: wp(3),
    padding: wp(3),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    padding: wp(3),
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: wp(3),
    backgroundColor: "#fff",
  },
  imageButton: {
    marginLeft: wp(2),
    paddingHorizontal: wp(3),
    backgroundColor: "#ffc107",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageButtonText: {
    fontSize: wp(5),
  },
  postButton: {
    backgroundColor: "#28a745",
    marginLeft: wp(2),
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: wp(5),
  },
  postButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: hp(1),
  },
  previewImage: {
    width: wp(80),
    height: hp(25),
    borderRadius: 10,
    resizeMode: "cover",
  },
  postItem: {
    backgroundColor: "white",
    margin: wp(3),
    padding: wp(3),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  postText: {
    fontSize: wp(4.5),
    marginBottom: hp(1),
  },
  postImage: {
    width: "100%",
    height: hp(25),
    borderRadius: 10,
    marginTop: 5,
  },
  timestamp: {
    fontSize: wp(3.5),
    color: "gray",
    marginBottom: hp(1),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeButton: { padding: wp(2) },
  commentButton: { padding: wp(2) },
  chatButton: { padding: wp(2) },
  actionText: {
    fontSize: wp(4),
    color: "#007bff",
  },
});
