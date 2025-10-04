import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { auth, db, storage } from "../utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { wp, hp } from "../utils/responsive";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser || { uid: "1" }; 

  const [name, setName] = useState(user.displayName || "");
  const [bio, setBio] = useState("Just a short bio...");
  const [avatar, setAvatar] = useState(user.photoURL || "");
  const [loading, setLoading] = useState(false);

  //  Pick Image
  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
          return;
        }

        const asset = response.assets[0];
        if (asset?.uri) {
          setAvatar(asset.uri);
        }
      }
    );
  };

  //  Save Profile
  const saveProfile = async () => {
    if (!name.trim()) {
      alert("Name is required!");
      return;
    }

    setLoading(true);
    try {
      let photoURL = avatar;

     
      if (avatar && avatar.startsWith("file://")) {
        const response = await fetch(avatar);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firestore user doc
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name,
        bio,
        avatar: photoURL,
      });

      alert("Profile updated successfully 🎉");
      router.back();
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Error updating profile. Please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: avatar || "https://i.pravatar.cc/150?u=" + user.uid }}
          style={styles.avatar}
        />
        <Text style={styles.changeText}>Change Profile Picture</Text>
      </TouchableOpacity>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      {/* Bio */}
      <TextInput
        style={[styles.input, { height: hp(10) }]}
        placeholder="Your Bio"
        value={bio}
        multiline
        onChangeText={setBio}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: wp(6),
    fontWeight: "bold",
    marginBottom: hp(2),
    textAlign: "center",
  },
  avatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    alignSelf: "center",
    marginBottom: hp(1),
  },
  changeText: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: hp(3),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: "#fff",
    marginBottom: hp(2),
  },
  saveBtn: {
    backgroundColor: "#28a745",
    paddingVertical: hp(2),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp(1),
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp(4.5),
  },
});
