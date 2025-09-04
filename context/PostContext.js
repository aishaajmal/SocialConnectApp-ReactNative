import React, { createContext, useState, useEffect, useContext } from "react";
import { collection, addDoc, onSnapshot, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseconfig";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Realtime listener for posts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(allPosts.sort((a, b) => b.createdAt - a.createdAt));
    });
    return () => unsub();
  }, []);

  // Add new post
  const addPost = async (text) => {
    await addDoc(collection(db, "posts"), {
      text,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now(),
      user: { id: "1", name: "Demo User" }, // replace with real user later
    });
  };

  // Toggle like
  const toggleLike = async (postId, userId = "1") => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

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
    }
  };

  // Add comment
  const addComment = async (postId, text) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        id: Date.now(),
        text,
        timestamp: new Date().toLocaleString(),
      }),
    });
  };

  return (
    <PostContext.Provider value={{ posts, addPost, toggleLike, addComment }}>
      {children}
    </PostContext.Provider>
  );
};
