import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Profile() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>User Profile</Text>
      <Text>User ID: {id}</Text>
      <Text>Name: Demo User</Text>
      <Text>Bio: Just a sample profile</Text>
    </View>
  );
}
