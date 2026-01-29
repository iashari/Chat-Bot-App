import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const SkeletonLoader = ({ count = 3 }) => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonItem = () => (
    <Animated.View style={[styles.card, { backgroundColor: theme.surface, opacity }]}>
      <View style={[styles.avatar, { backgroundColor: theme.surfaceSecondary }]} />
      <View style={styles.content}>
        <View style={[styles.titleBar, { backgroundColor: theme.surfaceSecondary }]} />
        <View style={[styles.subtitleBar, { backgroundColor: theme.surfaceSecondary }]} />
      </View>
      <View style={[styles.timeBadge, { backgroundColor: theme.surfaceSecondary }]} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {Array(count).fill(0).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleBar: {
    height: 16,
    borderRadius: 8,
    width: '60%',
  },
  subtitleBar: {
    height: 12,
    borderRadius: 6,
    width: '80%',
  },
  timeBadge: {
    width: 50,
    height: 12,
    borderRadius: 6,
  },
});

export default SkeletonLoader;
