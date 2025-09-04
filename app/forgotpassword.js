import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebaseconfig"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const auth = getAuth(app);

  const handleReset = () => {
    if (!email) {
      Alert.alert("Please enter your email");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Password reset email sent!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Forgot Password</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={handleReset} />
    </View>
  );
}
