import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

// Premium Purple Color Palette
// Elegant gradients with depth

export const darkTheme = {
  // Base colors - Liquid Glass dark
  background: '#0A0A0F',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceSecondary: 'rgba(255, 255, 255, 0.08)',
  surfaceLight: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(255, 255, 255, 0.06)',

  // Glass specific - strong blur effect
  glass: 'rgba(30, 30, 45, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',
  glassShadow: 'rgba(0, 0, 0, 0.3)',
  glassBlur: 80,

  // Primary purple palette
  primary: '#A78BFA',
  primaryDark: '#8B5CF6',
  primaryLight: '#C4B5FD',
  primarySoft: 'rgba(167, 139, 250, 0.2)',
  primaryGlass: 'rgba(167, 139, 250, 0.15)',

  // Gradient (softer purple for glass look)
  gradient1: '#C4B5FD',
  gradient2: '#8B5CF6',
  gradientGlass1: 'rgba(196, 181, 253, 0.3)',
  gradientGlass2: 'rgba(139, 92, 246, 0.3)',

  // Text colors
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',

  // UI elements
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  divider: 'rgba(255, 255, 255, 0.08)',
  overlay: 'rgba(10, 10, 15, 0.85)',

  // Chat bubbles - Glass style
  userBubble: 'rgba(167, 139, 250, 0.9)',
  userBubbleText: '#FFFFFF',
  aiBubble: 'rgba(255, 255, 255, 0.1)',
  aiBubbleText: '#FFFFFF',
  aiBubbleBorder: 'rgba(255, 255, 255, 0.15)',

  // Input - Glass style
  inputBackground: 'rgba(255, 255, 255, 0.08)',
  inputBorder: 'rgba(255, 255, 255, 0.15)',
  inputText: '#FFFFFF',
  placeholder: 'rgba(255, 255, 255, 0.4)',

  // Status
  online: '#4ADE80',
  offline: 'rgba(255, 255, 255, 0.4)',

  // Tab bar - Glass style
  tabBar: 'rgba(10, 10, 15, 0.8)',
  tabBarBorder: 'rgba(255, 255, 255, 0.1)',
  tabActive: '#A78BFA',
  tabInactive: 'rgba(255, 255, 255, 0.5)',

  // Status colors
  success: '#4ADE80',
  error: '#F87171',

  // Shadows - Glow effect
  shadowColor: '#A78BFA',
  glowColor: 'rgba(167, 139, 250, 0.4)',
};

export const lightTheme = {
  // Base colors - Liquid Glass light
  background: '#F8F9FC',
  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceSecondary: 'rgba(255, 255, 255, 0.5)',
  surfaceLight: 'rgba(255, 255, 255, 0.8)',
  cardBg: 'rgba(255, 255, 255, 0.6)',

  // Glass specific
  glass: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.8)',
  glassHighlight: 'rgba(255, 255, 255, 0.9)',
  glassShadow: 'rgba(100, 100, 150, 0.15)',
  glassBlur: 25,

  // Primary purple
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  primarySoft: 'rgba(139, 92, 246, 0.15)',
  primaryGlass: 'rgba(139, 92, 246, 0.2)',

  // Gradient
  gradient1: '#A78BFA',
  gradient2: '#7C3AED',
  gradientGlass1: 'rgba(167, 139, 250, 0.4)',
  gradientGlass2: 'rgba(124, 58, 237, 0.4)',

  // Text colors
  text: '#1A1A2E',
  textSecondary: 'rgba(26, 26, 46, 0.7)',
  textMuted: 'rgba(26, 26, 46, 0.5)',

  // UI elements
  border: 'rgba(255, 255, 255, 0.6)',
  borderLight: 'rgba(255, 255, 255, 0.8)',
  divider: 'rgba(26, 26, 46, 0.1)',
  overlay: 'rgba(248, 249, 252, 0.9)',

  // Chat bubbles - Glass style
  userBubble: 'rgba(139, 92, 246, 0.9)',
  userBubbleText: '#FFFFFF',
  aiBubble: 'rgba(255, 255, 255, 0.7)',
  aiBubbleText: '#1A1A2E',
  aiBubbleBorder: 'rgba(255, 255, 255, 0.8)',

  // Input - Glass style
  inputBackground: 'rgba(255, 255, 255, 0.6)',
  inputBorder: 'rgba(255, 255, 255, 0.8)',
  inputText: '#1A1A2E',
  placeholder: 'rgba(26, 26, 46, 0.4)',

  // Status
  online: '#22C55E',
  offline: 'rgba(26, 26, 46, 0.4)',

  // Tab bar - Glass style
  tabBar: 'rgba(255, 255, 255, 0.7)',
  tabBarBorder: 'rgba(255, 255, 255, 0.8)',
  tabActive: '#8B5CF6',
  tabInactive: 'rgba(26, 26, 46, 0.5)',

  // Status colors
  success: '#22C55E',
  error: '#EF4444',

  // Shadows - Soft glow
  shadowColor: '#8B5CF6',
  glowColor: 'rgba(139, 92, 246, 0.3)',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
