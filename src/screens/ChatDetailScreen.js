import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  ArrowLeft,
  Send,
  Mic,
  Paperclip,
  Bot,
  Wand2,
  Code2,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Palette,
  Calculator,
  Languages,
  BarChart3,
  GraduationCap,
  Camera,
  X,
  Trash2,
  Share2,
  Info,
  Volume2,
  VolumeX,
  Flag,
  Download,
  MicOff,
  Sparkles,
  Zap,
} from 'lucide-react-native';

const iconMap = {
  Bot: Bot,
  Code2: Code2,
  Palette: Palette,
  Calculator: Calculator,
  Languages: Languages,
  BarChart3: BarChart3,
  GraduationCap: GraduationCap,
  Sparkles: Sparkles,
  Wand2: Wand2,
  Mic: Mic,
  FileText: FileText,
};

import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import { useTheme } from '../context/ThemeContext';

const ChatDetailScreen = ({ route, navigation }) => {
  const { conversation } = route.params;
  const { theme } = useTheme();
  const [messages, setMessages] = useState(conversation.messages || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const flatListRef = useRef(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const emptyAnim = useRef(new Animated.Value(0)).current;
  const emptyScaleAnim = useRef(new Animated.Value(0.9)).current;
  const recordingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    if (messages.length === 0) {
      Animated.parallel([
        Animated.timing(emptyAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(emptyScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(recordingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      recordingAnim.setValue(1);
    }
  }, [isRecording]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const simulateResponse = () => {
    setIsTyping(true);
    setShowSuggestions(false);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's a great question! Let me help you with that...",
        "I understand what you're looking for. Here's my suggestion...",
        "Great question! I'd recommend exploring these options...",
        "I'm happy to help with that. Here's what I think...",
      ];
      const newMessage = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMessage]);
    }, 1500);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    simulateResponse();
  };

  const handlePromptSelect = (text) => {
    setInputText(text);
    setShowSuggestions(false);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => setInputText('Voice transcription...'), 500);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Voice transcription...');
      }, 3000);
    }
  };

  const handleAttachment = (type) => {
    setShowAttachModal(false);
    const msgs = { camera: '[Photo]', gallery: '[Image]', document: '[Document]' };
    const newMessage = {
      id: Date.now().toString(),
      text: msgs[type] || '[Attachment]',
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    simulateResponse();
  };

  const handleTool = (tool) => {
    setShowToolsModal(false);
    const prompts = {
      summarize: 'Summarize our conversation.',
      translate: 'Translate to Spanish.',
      simplify: 'Explain simpler.',
      expand: 'Elaborate more.',
    };
    if (prompts[tool]) setInputText(prompts[tool]);
  };

  const handleMenuOption = (option) => {
    setShowOptionsModal(false);
    switch (option) {
      case 'clear':
        Alert.alert('Clear Chat', 'Clear all messages?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) },
        ]);
        break;
      case 'mute':
        setIsMuted(!isMuted);
        break;
      default:
        Alert.alert(option, `Action: ${option}`);
    }
  };

  const renderMessage = ({ item, index }) => (
    <ChatBubble message={item.text} isUser={item.isUser} time={item.time} isLast={index === messages.length - 1} />
  );

  const quickPrompts = [
    { icon: Wand2, text: 'Write a story', color: theme.primary },
    { icon: Code2, text: 'Help me code', color: theme.secondary },
    { icon: FileText, text: 'Summarize', color: theme.accent },
    { icon: Sparkles, text: 'Creative ideas', color: theme.primary },
  ];

  const suggestions = ["What can you do?", "Explain AI", "Write a poem", "Debug code"];
  const IconComponent = iconMap[conversation.icon] || Sparkles;
  const iconColor = conversation.iconColor || theme.primary;

  const renderEmptyChat = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: emptyAnim, transform: [{ scale: emptyScaleAnim }] }]}>
      <View style={styles.emptyIconWrap}>
        <LinearGradient colors={[theme.gradient1, theme.gradient2]} style={styles.emptyIconGradient}>
          <Sparkles size={44} color="#FFFFFF" />
        </LinearGradient>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>How can I help you?</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Start a conversation or choose a suggestion
      </Text>

      <View style={styles.quickPrompts}>
        {quickPrompts.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.promptChip, styles.floatingCard, { backgroundColor: theme.surface }]}
            onPress={() => handlePromptSelect(p.text)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={[`${p.color}30`, `${p.color}10`]} style={styles.promptIconBg}>
              <p.icon size={18} color={p.color} />
            </LinearGradient>
            <Text style={[styles.promptText, { color: theme.text }]}>{p.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.suggestionsWrap}>
        <Text style={[styles.suggestLabel, { color: theme.textMuted }]}>Try asking:</Text>
        <View style={styles.suggestPills}>
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.suggestPill, styles.floatingSmall, { backgroundColor: theme.surfaceSecondary }]}
              onPress={() => handlePromptSelect(s)}
            >
              <Text style={[styles.suggestText, { color: theme.textSecondary }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const GlassButton = ({ children, style, onPress }) => {
    if (Platform.OS === 'web') {
      return (
        <TouchableOpacity
          style={[styles.glassBtn, { backgroundColor: theme.glass, borderColor: theme.glassBorder }, style]}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <BlurView intensity={theme.glassBlur || 20} tint={theme.background === '#0A0A0F' ? 'dark' : 'light'} style={styles.glassBtn}>
          <View style={[styles.glassBtnInner, { borderColor: theme.glassBorder }]}>
            {children}
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Ambient background for glass effect */}
      <View style={styles.ambientBackground}>
        <LinearGradient
          colors={[theme.gradientGlass1 || 'rgba(167, 139, 250, 0.2)', 'transparent']}
          style={styles.ambientGradient1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={[theme.gradientGlass2 || 'rgba(139, 92, 246, 0.15)', 'transparent']}
          style={styles.ambientGradient2}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header - Glass Style */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <GlassButton onPress={() => navigation.goBack()} style={styles.headerBtnWrap}>
            <ArrowLeft size={20} color={theme.text} />
          </GlassButton>

          <View style={styles.headerCenter}>
            <LinearGradient colors={[iconColor, `${iconColor}99`]} style={[styles.avatarBox, styles.glowIcon]}>
              <IconComponent size={20} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{conversation.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: theme.online }]} />
                <Text style={[styles.statusText, { color: theme.textMuted }]}>Online</Text>
                <View style={[styles.modelBadge, { backgroundColor: theme.primaryGlass || theme.primarySoft, borderColor: theme.glassBorder, borderWidth: 1 }]}>
                  <Sparkles size={10} color={theme.primary} />
                  <Text style={[styles.modelBadgeText, { color: theme.primary }]}>GPT-4</Text>
                </View>
              </View>
            </View>
          </View>

          <GlassButton onPress={() => setShowOptionsModal(true)} style={styles.headerBtnWrap}>
            <MoreVertical size={20} color={theme.text} />
          </GlassButton>
        </Animated.View>

      {/* Chat */}
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messageList, messages.length === 0 && styles.emptyList]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          ListEmptyComponent={renderEmptyChat}
        />

        {showSuggestions && messages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestBar} contentContainerStyle={styles.suggestBarContent}>
            {suggestions.slice(0, 3).map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.suggestBarItem, styles.floatingSmall, { backgroundColor: theme.surface }]}
                onPress={() => handlePromptSelect(s)}
              >
                <Text style={[styles.suggestBarText, { color: theme.text }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isRecording && (
          <Animated.View style={[styles.recordingWrap, { transform: [{ scale: recordingAnim }] }]}>
            <LinearGradient colors={[theme.error, '#FF6B6B']} style={styles.recordingBadge}>
              <Mic size={16} color="#FFF" />
              <Text style={styles.recordingText}>Recording...</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Input - Glass Style */}
        <View style={styles.inputSection}>
          {Platform.OS === 'web' ? (
            <View style={[styles.inputGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity style={[styles.inputIconBtn, styles.inputIconGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} onPress={() => setShowToolsModal(true)}>
                  <Zap size={20} color={theme.primary} />
                </TouchableOpacity>

                <View style={[styles.inputContainer, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={isRecording ? "Listening..." : "Ask me anything..."}
                    placeholderTextColor={theme.placeholder}
                    value={inputText}
                    onChangeText={setInputText}
                    maxLength={2000}
                    editable={!isRecording}
                  />
                  <TouchableOpacity style={styles.inputAttachBtn} onPress={() => setShowAttachModal(true)}>
                    <Paperclip size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={inputText.trim() ? handleSend : handleVoiceInput} activeOpacity={0.8}>
                  {inputText.trim() ? (
                    <LinearGradient colors={[theme.gradient1, theme.gradient2]} style={[styles.sendBtn, styles.glowSend]}>
                      <Send size={20} color="#FFFFFF" />
                    </LinearGradient>
                  ) : (
                    <View style={[styles.sendBtn, styles.inputIconGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                      {isRecording ? <MicOff size={20} color={theme.error} /> : <Mic size={20} color={theme.textSecondary} />}
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputFooter}>
                {inputText.length > 0 ? (
                  <Text style={[styles.charCount, { color: inputText.length > 1800 ? theme.error : theme.textMuted }]}>
                    {inputText.length}/2000
                  </Text>
                ) : (
                  <View style={styles.poweredByRow}>
                    <Sparkles size={12} color={theme.textMuted} />
                    <Text style={[styles.poweredByText, { color: theme.textMuted }]}>Powered by AI</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <BlurView intensity={30} tint={theme.background === '#0A0A0F' ? 'dark' : 'light'} style={styles.inputBlur}>
              <View style={[styles.inputGlassInner, { borderColor: theme.glassBorder }]}>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity style={[styles.inputIconBtn, styles.inputIconGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} onPress={() => setShowToolsModal(true)}>
                    <Zap size={20} color={theme.primary} />
                  </TouchableOpacity>

                  <View style={[styles.inputContainer, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder={isRecording ? "Listening..." : "Ask me anything..."}
                      placeholderTextColor={theme.placeholder}
                      value={inputText}
                      onChangeText={setInputText}
                      maxLength={2000}
                      editable={!isRecording}
                    />
                    <TouchableOpacity style={styles.inputAttachBtn} onPress={() => setShowAttachModal(true)}>
                      <Paperclip size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={inputText.trim() ? handleSend : handleVoiceInput} activeOpacity={0.8}>
                    {inputText.trim() ? (
                      <LinearGradient colors={[theme.gradient1, theme.gradient2]} style={[styles.sendBtn, styles.glowSend]}>
                        <Send size={20} color="#FFFFFF" />
                      </LinearGradient>
                    ) : (
                      <View style={[styles.sendBtn, styles.inputIconGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                        {isRecording ? <MicOff size={20} color={theme.error} /> : <Mic size={20} color={theme.textSecondary} />}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputFooter}>
                  {inputText.length > 0 ? (
                    <Text style={[styles.charCount, { color: inputText.length > 1800 ? theme.error : theme.textMuted }]}>
                      {inputText.length}/2000
                    </Text>
                  ) : (
                    <View style={styles.poweredByRow}>
                      <Sparkles size={12} color={theme.textMuted} />
                      <Text style={[styles.poweredByText, { color: theme.textMuted }]}>Powered by AI</Text>
                    </View>
                  )}
                </View>
              </View>
            </BlurView>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Options Modal */}
      <Modal visible={showOptionsModal} transparent animationType="fade" onRequestClose={() => setShowOptionsModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptionsModal(false)}>
          <View style={[styles.optionsModal, styles.floatingCard, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Options</Text>
              <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
                <X size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            {[
              { icon: isMuted ? Volume2 : VolumeX, label: isMuted ? 'Unmute' : 'Mute', key: 'mute' },
              { icon: Share2, label: 'Share', key: 'share' },
              { icon: Download, label: 'Export', key: 'export' },
              { icon: Info, label: 'Info', key: 'info' },
              { icon: Flag, label: 'Report', key: 'report' },
              { icon: Trash2, label: 'Clear', key: 'clear', danger: true },
            ].map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.optionItem} onPress={() => handleMenuOption(item.key)}>
                <item.icon size={20} color={item.danger ? theme.error : theme.text} />
                <Text style={[styles.optionText, { color: item.danger ? theme.error : theme.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Attachment Modal */}
      <Modal visible={showAttachModal} transparent animationType="slide" onRequestClose={() => setShowAttachModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAttachModal(false)}>
          <View style={[styles.attachModal, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 24 }]}>Attach</Text>
            <View style={styles.attachGrid}>
              {[
                { icon: Camera, label: 'Camera', color: theme.primary, key: 'camera' },
                { icon: ImageIcon, label: 'Gallery', color: theme.secondary, key: 'gallery' },
                { icon: FileText, label: 'Document', color: theme.accent, key: 'document' },
              ].map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.attachItem} onPress={() => handleAttachment(item.key)}>
                  <LinearGradient colors={[item.color, `${item.color}99`]} style={[styles.attachIcon, styles.floatingCard]}>
                    <item.icon size={26} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.attachLabel, { color: theme.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tools Modal - Glass Style */}
      <Modal visible={showToolsModal} transparent animationType="slide" onRequestClose={() => setShowToolsModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowToolsModal(false)}>
          {Platform.OS === 'web' ? (
            <View style={[styles.attachModal, styles.modalGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.glassHighlight }]} />
              <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 24 }]}>Quick Tools</Text>
              <View style={styles.attachGrid}>
                {[
                  { icon: FileText, label: 'Summarize', color: theme.primary, key: 'summarize' },
                  { icon: Languages, label: 'Translate', color: theme.secondary || theme.primary, key: 'translate' },
                  { icon: Sparkles, label: 'Simplify', color: theme.accent || theme.primary, key: 'simplify' },
                  { icon: Wand2, label: 'Expand', color: theme.primary, key: 'expand' },
                ].map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.attachItem} onPress={() => handleTool(item.key)}>
                    <LinearGradient colors={[item.color, `${item.color}99`]} style={[styles.attachIcon, styles.glowIcon]}>
                      <item.icon size={26} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.attachLabel, { color: theme.text }]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <BlurView intensity={40} tint={theme.background === '#0A0A0F' ? 'dark' : 'light'} style={[styles.attachModal, styles.modalGlass]}>
              <View style={[styles.modalGlassInner, { borderColor: theme.glassBorder }]}>
                <View style={[styles.modalHandle, { backgroundColor: theme.glassHighlight }]} />
                <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 24 }]}>Quick Tools</Text>
                <View style={styles.attachGrid}>
                  {[
                    { icon: FileText, label: 'Summarize', color: theme.primary, key: 'summarize' },
                    { icon: Languages, label: 'Translate', color: theme.secondary || theme.primary, key: 'translate' },
                    { icon: Sparkles, label: 'Simplify', color: theme.accent || theme.primary, key: 'simplify' },
                    { icon: Wand2, label: 'Expand', color: theme.primary, key: 'expand' },
                  ].map((item, idx) => (
                    <TouchableOpacity key={idx} style={styles.attachItem} onPress={() => handleTool(item.key)}>
                      <LinearGradient colors={[item.color, `${item.color}99`]} style={[styles.attachIcon, styles.glowIcon]}>
                        <item.icon size={26} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={[styles.attachLabel, { color: theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </BlurView>
          )}
        </TouchableOpacity>
      </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  // Ambient background for glass effect
  ambientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  ambientGradient1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.6,
  },
  ambientGradient2: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.4,
  },
  // Glass button styles
  glassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glassBtnInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
  },
  // Glow effects
  glowIcon: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  glowSend: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtnWrap: {
    // wrapper for glass button
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
    gap: 4,
  },
  modelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  keyboardView: { flex: 1 },
  messageList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyList: { justifyContent: 'center' },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 18,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 10,
  },
  promptIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsWrap: { width: '100%' },
  suggestLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  suggestPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestText: {
    fontSize: 13,
    fontWeight: '500',
  },
  suggestBar: {
    paddingVertical: 8,
  },
  suggestBarContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  suggestBarItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestBarText: {
    fontSize: 13,
    fontWeight: '500',
  },
  recordingWrap: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  inputSection: {
    paddingBottom: 8,
  },
  inputBlur: {
    overflow: 'hidden',
    borderTopWidth: 1,
  },
  inputGlass: {
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  inputGlassInner: {
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  inputIconGlass: {
    borderWidth: 1,
  },
  inputFooter: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  poweredByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  poweredByText: {
    fontSize: 11,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    height: 48,
  },
  inputAttachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    height: 48,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  optionsModal: {
    margin: 16,
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  attachModal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  attachGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  attachItem: {
    alignItems: 'center',
    width: 80,
  },
  attachIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  attachLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Glass modal styles
  modalGlass: {
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  modalGlassInner: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
});

export default ChatDetailScreen;
