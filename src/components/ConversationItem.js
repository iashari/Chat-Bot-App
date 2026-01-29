import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import {
  Pin,
  CheckCheck,
  Bot,
  Code2,
  Palette,
  Calculator,
  Languages,
  BarChart3,
  GraduationCap,
  Heart,
  Brain,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Mic,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  Bot: Bot,
  Code2: Code2,
  Palette: Palette,
  Calculator: Calculator,
  Languages: Languages,
  BarChart3: BarChart3,
  GraduationCap: GraduationCap,
  Heart: Heart,
  Brain: Brain,
  Sparkles: Sparkles,
  Mic: Mic,
  FileText: FileText,
};

const ConversationItem = ({ conversation, onPress, index }) => {
  const { theme } = useTheme();
  const IconComponent = iconMap[conversation.icon] || Bot;
  const iconColor = conversation.iconColor || theme.primary;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: slideAnim }
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.surface }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Left Side - Icon Card with Solid Color */}
        <View style={styles.iconCard}>
          <View style={[styles.iconBox, { backgroundColor: iconColor }]}>
            <IconComponent size={26} color="#FFF1F1" strokeWidth={1.8} />
            {/* Decorative elements */}
            <View style={[styles.iconDeco1, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={[styles.iconDeco2, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
          </View>
          {conversation.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: theme.online, borderColor: theme.surface }]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {conversation.name}
              </Text>
              {conversation.isPinned && (
                <View style={[styles.pinnedBadge, { backgroundColor: theme.primary }]}>
                  <Pin size={8} color="#FFF1F1" />
                </View>
              )}
            </View>
            <View style={styles.timestampContainer}>
              <Text style={[styles.timestamp, { color: conversation.unread ? theme.primary : theme.textMuted }]}>
                {conversation.timestamp}
              </Text>
              {conversation.unread ? (
                <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.unreadText}>{conversation.unread}</Text>
                </View>
              ) : (
                <ArrowUpRight size={16} color={theme.textMuted} style={styles.arrowIcon} />
              )}
            </View>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.messageRow}>
              {!conversation.unread && (
                <CheckCheck size={14} color={theme.online} style={styles.readIcon} />
              )}
              <Text
                style={[
                  styles.lastMessage,
                  { color: conversation.unread ? theme.text : theme.textSecondary },
                  conversation.unread && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {conversation.lastMessage}
              </Text>
            </View>
          </View>

          {/* Subtle accent line with solid color */}
          <View style={[styles.accentLine, { backgroundColor: iconColor }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconCard: {
    position: 'relative',
    marginRight: 14,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconDeco1: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  iconDeco2: {
    position: 'absolute',
    bottom: -5,
    left: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    zIndex: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
    letterSpacing: -0.3,
  },
  pinnedBadge: {
    width: 16,
    height: 16,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestampContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowIcon: {
    opacity: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  readIcon: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '600',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF1F1',
    fontSize: 11,
    fontWeight: '700',
  },
  accentLine: {
    position: 'absolute',
    bottom: -14,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    opacity: 0.3,
  },
});

export default ConversationItem;
