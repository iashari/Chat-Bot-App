import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const MenuItem = ({ icon: Icon, label, onPress, showBorder = true, rightText, rightTextHighlight }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          showBorder && { borderBottomColor: theme.divider, borderBottomWidth: 1 },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
            <Icon size={18} color={theme.primary} />
          </View>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        </View>
        <View style={styles.rightContent}>
          {rightText && (
            rightTextHighlight ? (
              <View style={[styles.rightBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.rightBadgeText}>{rightText}</Text>
              </View>
            ) : (
              <Text style={[styles.rightText, { color: theme.textMuted }]}>{rightText}</Text>
            )
          )}
          <ChevronRight size={20} color={theme.textMuted} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rightBadgeText: {
    color: '#FFF1F1',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default MenuItem;
