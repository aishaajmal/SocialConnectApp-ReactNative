import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { wp, hp } from "../utils/responsive"; 

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SocialConnectApp</Text>
      <Text style={styles.subtitle}>
        Connect with your friends here
      </Text>

      {/* Navigate to login */}
      <Link href="/login" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Go to Login</Text>
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
    padding: wp(5), // 5% of screen width
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: wp(7), // responsive title
    fontWeight: "bold",
    marginBottom: hp(2),
    textAlign: "center",
  },
  subtitle: {
    fontSize: wp(4.5), // responsive subtitle
    color: "#666",
    marginBottom: hp(3),
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: 10,
  },
  buttonText: {
    fontSize: wp(4.5),
    color: "white",
    fontWeight: "bold",
  },
});
