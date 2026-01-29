import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MessageSquare, Copy, ThumbsUp, ThumbsDown, RefreshCw, Heart, Flame, Laugh, Bookmark, Share2, Check, CheckCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const ChatBubble = ({ message, isUser, time, isLast, status = 'read' }) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(null);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const reactionAnim = useRef(new Animated.Value(0)).current;

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCopy = async () => {
    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Copied!', 'Message copied to clipboard');
    }
  };

  const handleLike = (value) => {
    setLiked(liked === value ? null : value);
  };

  const toggleReactions = () => {
    Vibration.vibrate(30);
    setShowReactions(!showReactions);
    Animated.spring(reactionAnim, {
      toValue: showReactions ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const addReaction = (emoji) => {
    if (reactions.includes(emoji)) {
      setReactions(reactions.filter(r => r !== emoji));
    } else {
      setReactions([...reactions, emoji]);
    }
    setShowReactions(false);
    Animated.spring(reactionAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Vibration.vibrate(30);
  };

  const reactionEmojis = [
    { icon: Heart, color: '#EF4444', name: 'heart' },
    { icon: Flame, color: '#F97316', name: 'fire' },
    { icon: Laugh, color: '#FBBF24', name: 'laugh' },
    { icon: ThumbsUp, color: theme.primary, name: 'thumbsup' },
  ];

  // Animated button press
  const ActionButton = ({ children, onPress, isActive, activeColor }) => {
    const btnScaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(btnScaleAnim, {
        toValue: 0.9,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(btnScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: btnScaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.actionButtonGlass,
            { backgroundColor: theme.glass || theme.surface, borderColor: theme.glassBorder },
            isActive && { backgroundColor: activeColor || theme.primaryGlass || theme.primarySoft }
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isUser) {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.userContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={[theme.gradient1, theme.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble, styles.userBubbleShadow]}
        >
          <Text style={[styles.messageText, { color: '#FFFFFF' }]}>
            {message}
          </Text>
          <View style={styles.userTimestampRow}>
            <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.7)' }]}>
              {time}
            </Text>
            {status === 'sent' && <Check size={14} color="rgba(255,255,255,0.7)" />}
            {status === 'delivered' && <CheckCheck size={14} color="rgba(255,255,255,0.7)" />}
            {status === 'read' && <CheckCheck size={14} color="#4ADE80" />}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.aiMessageWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={[styles.container, styles.aiContainer]}>
        <LinearGradient
          colors={[theme.gradient1, theme.gradient2]}
          style={[styles.avatarContainer, styles.avatarGlow]}
        >
          <MessageSquare size={16} color="#FFFFFF" />
        </LinearGradient>
        <TouchableOpacity
          onLongPress={toggleReactions}
          activeOpacity={0.9}
          delayLongPress={300}
        >
          {Platform.OS === 'web' ? (
            <View
              style={[
                styles.bubble,
                styles.aiBubble,
                styles.aiBubbleGlass,
                {
                  backgroundColor: theme.glass || theme.aiBubble,
                  borderColor: theme.glassBorder || theme.aiBubbleBorder,
                },
              ]}
            >
              <Text style={[styles.messageText, { color: theme.aiBubbleText }]}>
                {message}
              </Text>
              <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                {time}
              </Text>
            </View>
          ) : (
            <BlurView
              intensity={15}
              tint={theme.background === '#0A0A0F' ? 'dark' : 'light'}
              style={[styles.bubble, styles.aiBubble, styles.aiBubbleBlur]}
            >
              <View style={[styles.aiBubbleInner, { borderColor: theme.glassBorder || theme.aiBubbleBorder }]}>
                <Text style={[styles.messageText, { color: theme.aiBubbleText }]}>
                  {message}
                </Text>
                <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                  {time}
                </Text>
              </View>
            </BlurView>
          )}

          {/* Reactions Display */}
          {reactions.length > 0 && (
            <View style={[styles.reactionsDisplay, { backgroundColor: theme.glass || theme.surface, borderColor: theme.glassBorder }]}>
              {reactionEmojis
                .filter(r => reactions.includes(r.name))
                .map((r, i) => (
                  <r.icon key={i} size={14} color={r.color} />
                ))}
            </View>
          )}

          {/* Reaction Picker */}
          {showReactions && (
            <Animated.View
              style={[
                styles.reactionPicker,
                {
                  backgroundColor: theme.glass || theme.surface,
                  borderColor: theme.glassBorder,
                  opacity: reactionAnim,
                  transform: [{
                    scale: reactionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }],
                },
              ]}
            >
              {reactionEmojis.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reactionBtn,
                    reactions.includes(emoji.name) && { backgroundColor: `${emoji.color}20` },
                  ]}
                  onPress={() => addReaction(emoji.name)}
                >
                  <emoji.icon size={20} color={emoji.color} />
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <ActionButton
          onPress={handleCopy}
          isActive={copied}
        >
          <Copy size={14} color={copied ? theme.primary : theme.textMuted} />
          {copied && <Text style={[styles.actionText, { color: theme.primary }]}>Copied!</Text>}
        </ActionButton>

        <ActionButton
          onPress={() => handleLike('up')}
          isActive={liked === 'up'}
        >
          <ThumbsUp size={14} color={liked === 'up' ? theme.primary : theme.textMuted} />
        </ActionButton>

        <ActionButton
          onPress={() => handleLike('down')}
          isActive={liked === 'down'}
          activeColor="rgba(239, 68, 68, 0.1)"
        >
          <ThumbsDown size={14} color={liked === 'down' ? '#EF4444' : theme.textMuted} />
        </ActionButton>

        <ActionButton
          onPress={handleSave}
          isActive={isSaved}
        >
          <Bookmark size={14} color={isSaved ? theme.primary : theme.textMuted} fill={isSaved ? theme.primary : 'transparent'} />
        </ActionButton>

        <ActionButton
          onPress={() => Alert.alert('Regenerate', 'This would regenerate the response')}
        >
          <RefreshCw size={14} color={theme.textMuted} />
        </ActionButton>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  aiMessageWrapper: {
    marginBottom: 8,
  },
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  userBubbleShadow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
  },
  aiBubbleGlass: {
    borderWidth: 1,
    backdropFilter: 'blur(15px)',
  },
  aiBubbleBlur: {
    borderRadius: 22,
    borderBottomLeftRadius: 6,
  },
  aiBubbleInner: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 22,
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 8,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  userTimestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 62,
    marginTop: 6,
    gap: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  actionButtonGlass: {
    borderWidth: 1,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reactionsDisplay: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -8,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  reactionPicker: {
    position: 'absolute',
    top: -50,
    left: 0,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 24,
    gap: 4,
    borderWidth: 1,
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  reactionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatBubble;
