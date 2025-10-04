import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePosts } from "../../context/PostContext";
import PostItem from "../../components/PostItem";
import { wp, hp } from "../../utils/responsive";
import * as ImagePicker from "react-native-image-picker";
import { db, storage, auth } from "../../utils/firebaseConfig";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const { id } = useLocalSearchParams();
  const { posts } = usePosts();

  const [user, setUser] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user profile from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser({ id, ...snap.data() });
        } else {
          // fallback demo user
          const demoUser = {
            id,
            name: `User ${id}`,
            bio: "Loves coding & coffee ☕",
            avatar: "https://i.pravatar.cc/150?u=" + id,
          };
          await setDoc(ref, demoUser);
          setUser(demoUser);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Pick new avatar
  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setNewAvatar(response.assets[0].uri);
        }
      }
    );
  };

  // Save profile updates
  const saveProfile = async () => {
    setLoading(true);
    try {
      let photoURL = newAvatar || user.avatar;

      // Upload avatar to Firebase Storage if new one selected
      if (newAvatar && newAvatar.startsWith("file://")) {
        const response = await fetch(newAvatar);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${id}.jpg`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      const refDoc = doc(db, "users", id);
      await updateDoc(refDoc, {
        name: newName || user.name,
        bio: newBio || user.bio,
        avatar: photoURL,
      });

      setUser({
        ...user,
        name: newName || user.name,
        bio: newBio || user.bio,
        avatar: photoURL,
      });

      alert(" Profile updated!");
      setEditModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(" Error updating profile.");
    }
    setLoading(false);
  };

  // Filter user’s posts
  const userPosts = posts.filter((p) => p.user.id === id);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        {/* Edit Profile only if this is logged-in user */}
        {id === (auth.currentUser?.uid || "1") && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              setNewName(user.name);
              setNewBio(user.bio);
              setNewAvatar(user.avatar);
              setEditModal(true);
            }}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User Posts */}
      <Text style={styles.sectionTitle}>Posts by {user.name}</Text>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem post={item} currentUserId={auth.currentUser?.uid || "1"} />
        )}
        ListEmptyComponent={<Text style={styles.noPosts}>No posts yet</Text>}
      />

      {/* Edit Profile Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: newAvatar }}
                style={[styles.avatar, { alignSelf: "center" }]}
              />
              <Text style={{ textAlign: "center", color: "#007bff" }}>
                Change Avatar
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new bio"
              value={newBio}
              onChangeText={setNewBio}
            />

            {loading ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <>
                <Button title="Save" onPress={saveProfile} />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setEditModal(false)}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    alignItems: "center",
    paddingVertical: hp(4),
    backgroundColor: "#fff",
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    marginBottom: hp(1.5),
  },
  name: { fontSize: wp(5.5), fontWeight: "bold" },
  bio: {
    fontSize: wp(4),
    color: "#555",
    textAlign: "center",
    marginVertical: hp(1),
    paddingHorizontal: wp(5),
  },
  editBtn: {
    backgroundColor: "#007bff",
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 8,
    marginTop: hp(1),
  },
  editText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
  },
  noPosts: { textAlign: "center", color: "#888", marginTop: hp(2) },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: wp(5), fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
});
