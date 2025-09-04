import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { wp, hp } from "../utils/responsive"; // import here

export default function Posts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Posts Screen</Text>
      <View style={styles.button}>
        <Text style={{ color: "white" }}>Responsive Button</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: wp(8), // 8% of screen width
  },
  button: {
    width: wp(50),   // 50% of screen width
    height: hp(7),   // 7% of screen height
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
