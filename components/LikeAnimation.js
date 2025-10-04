import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function LikeAnimation({ visible }) {
  const scale = new Animated.Value(0);

  if (visible) {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(() => {
      Animated.timing(scale, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    });
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Text style={styles.heart}>❤️</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10,
    left: 10,
  },
  heart: {
    fontSize: 30,
  },
});
