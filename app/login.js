import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { wp, hp } from "../utils/responsive"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    
    if (username && password) {
      alert(`Welcome ${username}!`);
    } else {
      alert("Please enter username and password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
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
