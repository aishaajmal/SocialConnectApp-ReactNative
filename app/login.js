import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { wp, hp } from "../utils/responsive"; 
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../config/firebase"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = getAuth(app);

  //   Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.push("/feed"); 
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  //  Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      {/* Forgot Password */}
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </Pressable>

      {/* Back to Welcome */}
      <Link href="/" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>⬅ Back to Welcome</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(5),
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: wp(7),
    fontWeight: "bold",
    marginBottom: hp(3),
  },
  input: {
    width: "90%",
    height: hp(6),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    width: "90%",
    paddingVertical: hp(2),
    borderRadius: 10,
    marginBottom: hp(2),
    alignItems: "center",
  },
  buttonText: {
    fontSize: wp(4.5),
    color: "white",
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: hp(1),
  },
  linkText: {
    color: "#007bff",
    fontSize: wp(4),
    textDecorationLine: "underline",
  },
});
