import React, { createContext, useState, useEffect, useContext } from "react";
import {collection,addDoc,onSnapshot,updateDoc,doc,arrayUnion, serverTimestamp,query,where,getDocs,setDoc,} from "firebase/firestore";
import { db, auth, storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Notifications from "expo-notifications";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Listen to posts in realtime
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(
        allPosts.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        )
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  //  Upload Image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `posts/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  //  Add new post 
  const addPost = async (text, imageUri = null) => {
    if (!text.trim() && !imageUri) return;

    const user = auth.currentUser || { uid: "1", displayName: "Demo User" };
    let imageUrl = null;

    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    try {
      await addDoc(collection(db, "posts"), {
        text,
        image: imageUrl,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: serverTimestamp(),
        user: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || "",
        },
      });
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  //  Like / Unlike post
  const toggleLike = async (postId, userId = "1") => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.likedBy.includes(userId)) {
        await updateDoc(postRef, {
          likedBy: post.likedBy.filter((id) => id !== userId),
          likes: post.likes - 1,
        });
      } else {
        await updateDoc(postRef, {
          likedBy: [...post.likedBy, userId],
          likes: post.likes + 1,
        });

        //  Send notification 
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "New Like ",
            body: `${userId} liked your post.`,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error("Error toggling like: ", error);
    }
  };

  // 🔹 Add comment
  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    const user = auth.currentUser || { uid: "1", displayName: "Demo User" };
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now(),
          text,
          user: {
            id: user.uid,
            name: user.displayName || "Anonymous",
          },
          timestamp: new Date().toLocaleString(),
        }),
      });

      //  Send notification 
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Comment 💬",
          body: `${user.displayName || "Someone"} commented on your post.`,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  //  Search posts 
  const searchPosts = async (keyword) => {
    if (!keyword.trim()) return [];
    const q = query(collection(db, "posts"), where("text", ">=", keyword));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  //  Update Profile Info
  const updateProfile = async (name, bio, imageUri = null) => {
    const user = auth.currentUser;
    if (!user) return;

    let photoURL = null;
    if (imageUri) {
      photoURL = await uploadImage(imageUri);
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        bio,
        photoURL,
        email: user.email,
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        toggleLike,
        addComment,
        searchPosts,
        updateProfile,
        loading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
