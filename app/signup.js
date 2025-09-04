import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { wp, hp } from "../utils/responsive"; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (username && email && password) {
      alert(`Account created for ${username} 🎉`);
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      {/* Link to Login */}
      <Link href="/login" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    backgroundColor: "#28a745",
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
