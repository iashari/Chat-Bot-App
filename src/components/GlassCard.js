import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

const GlassCard = ({
  children,
  style,
  intensity = 20,
  tint = 'dark',
  borderRadius = 20,
  noPadding = false,
  glowColor = null,
}) => {
  const { theme, isDarkMode } = useTheme();
  const blurTint = isDarkMode ? 'dark' : 'light';

  // For web, use fallback styling since BlurView doesn't work well
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.glassContainer,
          {
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.7)',
            borderRadius,
            borderColor: theme.glassBorder,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
          !noPadding && styles.padding,
          glowColor && {
            shadowColor: glowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        { borderRadius },
        glowColor && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={blurTint}
        style={[
          styles.blurView,
          { borderRadius },
        ]}
      >
        <View
          style={[
            styles.innerContainer,
            {
              borderRadius,
              borderColor: theme.glassBorder,
              backgroundColor: theme.glass,
            },
            !noPadding && styles.padding,
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  blurView: {
    overflow: 'hidden',
  },
  innerContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  glassContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
});

export default GlassCard;
