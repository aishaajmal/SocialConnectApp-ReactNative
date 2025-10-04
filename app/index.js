import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import * as Notifications from "expo-notifications";
import { wp, hp } from "../utils/responsive";

export default function Index() {

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: " SocialConnectApp ",
        body: "This is a  notification .",
      },
      trigger: { seconds: 2 },
    });
    Alert.alert("Notification", "A  notification will appear in 2s");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SocialConnectApp</Text>
      <Text style={styles.subtitle}>
        Connect with your friends and share your moments
      </Text>

      {/* Navigate to Login */}
      <Link href="/login" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </Pressable>
      </Link>

      {/* Navigate to Sign Up */}
      <Link href="/signup" asChild>
        <Pressable style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </Link>

      {/* Navigate to Feed (main app posts screen) */}
      <Link href="/feed" asChild>
        <Pressable style={[styles.button, styles.tertiaryButton]}>
          <Text style={styles.buttonText}>Go to Feed</Text>
        </Pressable>
      </Link>

      {/* Week 4: Test Notifications */}
      <Pressable style={[styles.button, styles.notificationButton]} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>Test Notification 🔔</Text>
      </Pressable>
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
    marginBottom: hp(2),
    textAlign: "center",
  },
  subtitle: {
    fontSize: wp(4.5),
    color: "#666",
    marginBottom: hp(3),
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: 10,
    marginVertical: hp(1),
  },
  secondaryButton: {
    backgroundColor: "#28a745",
  },
  tertiaryButton: {
    backgroundColor: "#6f42c1",
  },
  notificationButton: {
    backgroundColor: "#ff9800",
  },
  buttonText: {
    fontSize: wp(4.5),
    color: "white",
    fontWeight: "bold",
  },
});
