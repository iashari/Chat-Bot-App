import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Dimensions,
  ScrollView,
  Animated,
  Modal,
  Image,
  Alert,
  Vibration,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Plus,
  MessageSquare,
  Bot,
  Code2,
  Palette,
  Calculator,
  BarChart3,
  GraduationCap,
  Mic,
  FileText,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Zap,
  Pin,
  Trash2,
  VolumeX,
  MoreHorizontal,
  Filter,
  Bell,
  BellOff,
} from 'lucide-react-native';

const iconMap = {
  Bot: Bot,
  Code2: Code2,
  Palette: Palette,
  Calculator: Calculator,
  BarChart3: BarChart3,
  GraduationCap: GraduationCap,
  Mic: Mic,
  FileText: FileText,
  Sparkles: Sparkles,
};

import { conversations as initialConversations, userProfile } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ConversationListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState(initialConversations);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [mutedChats, setMutedChats] = useState([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter conversations based on active filter
  const getFilteredConversations = () => {
    let filtered = conversations;

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeFilter) {
      case 'pinned':
        return filtered.filter(c => c.isPinned);
      case 'unread':
        return filtered.filter(c => c.unread > 0);
      default:
        return filtered;
    }
  };

  const filteredConversations = getFilteredConversations();
  const pinnedConversations = conversations.filter(c => c.isPinned);
  const recentConversations = conversations.filter(c => !c.isPinned);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setConversations(initialConversations);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatDetail', { conversation });
  };

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      name: 'New Chat',
      icon: 'Sparkles',
      iconColor: theme.primary,
      lastMessage: 'Start a new conversation...',
      timestamp: 'Now',
      messages: [],
      isOnline: true,
    };
    navigation.navigate('ChatDetail', { conversation: newConversation });
  };

  const handleLongPress = (chat) => {
    Vibration.vibrate(50);
    setSelectedChat(chat);
    setShowChatMenu(true);
  };

  const handlePinChat = () => {
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedChat.id ? { ...c, isPinned: !c.isPinned } : c
      )
    );
    setShowChatMenu(false);
  };

  const handleMuteChat = () => {
    if (mutedChats.includes(selectedChat.id)) {
      setMutedChats(prev => prev.filter(id => id !== selectedChat.id));
    } else {
      setMutedChats(prev => [...prev, selectedChat.id]);
    }
    setShowChatMenu(false);
  };

  const handleDeleteChat = () => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${selectedChat.name}"?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowChatMenu(false) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConversations(prev => prev.filter(c => c.id !== selectedChat.id));
            setShowChatMenu(false);
          },
        },
      ]
    );
  };

  const filters = [
    { key: 'all', label: 'All', count: conversations.length },
    { key: 'pinned', label: 'Pinned', count: pinnedConversations.length },
    { key: 'unread', label: 'Unread', count: conversations.filter(c => c.unread > 0).length },
  ];

  const quickActions = [
    { icon: Code2, label: 'Code' },
    { icon: FileText, label: 'Write' },
    { icon: Palette, label: 'Create' },
    { icon: Calculator, label: 'Math' },
  ];

  const GlassContainer = ({ children, style, noPadding }) => {
    if (Platform.OS === 'web') {
      return (
        <View
          style={[
            styles.glassCard,
            styles.glassCardWeb,
            {
              borderColor: theme.glassBorder,
            },
            !noPadding && { padding: 14 },
            style,
          ]}
        >
          {children}
        </View>
      );
    }
    return (
      <BlurView
        intensity={60}
        tint={theme.background === '#0A0A0F' ? 'dark' : 'light'}
        style={[styles.glassCard, style]}
      >
        <View
          style={[
            styles.glassInner,
            {
              backgroundColor: 'rgba(30, 30, 45, 0.3)',
              borderColor: theme.glassBorder,
            },
            !noPadding && { padding: 14 },
          ]}
        >
          {children}
        </View>
      </BlurView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Ambient background gradients for glass effect */}
      <View style={styles.ambientBackground}>
        <LinearGradient
          colors={[theme.gradientGlass1 || theme.gradient1, 'transparent']}
          style={styles.ambientGradient1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={[theme.gradientGlass2 || theme.gradient2, 'transparent']}
          style={styles.ambientGradient2}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: theme.textMuted }]}>Welcome back,</Text>
              <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowSearchModal(true)}
              activeOpacity={0.8}
            >
              <GlassContainer style={styles.searchBtn}>
                <Search size={20} color={theme.textSecondary} />
              </GlassContainer>
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Card with Glass Effect */}
          <Animated.View
            style={[
              styles.heroSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity onPress={handleNewChat} activeOpacity={0.9}>
              <LinearGradient
                colors={[theme.gradient1, theme.gradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.heroCard, styles.heroGlow]}
              >
                {/* Glass overlay on gradient */}
                <View style={styles.heroGlassOverlay} />
                <View style={styles.heroContent}>
                  <View style={styles.heroIconWrap}>
                    <Sparkles size={28} color="#FFFFFF" />
                  </View>
                  <View style={styles.heroText}>
                    <Text style={styles.heroTitle}>Start New Chat</Text>
                    <Text style={styles.heroSubtitle}>Ask me anything, I'm here to help</Text>
                  </View>
                </View>
                <View style={styles.heroButton}>
                  <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        {/* Filter Tabs - Glass Style */}
        <Animated.View
          style={[
            styles.filterSection,
            { opacity: filterAnim }
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setActiveFilter(filter.key)}
                activeOpacity={0.8}
              >
                {activeFilter === filter.key ? (
                  <LinearGradient
                    colors={[theme.gradient1, theme.gradient2]}
                    style={[styles.filterTab, styles.filterTabActive, styles.filterGlow]}
                  >
                    <Text style={styles.filterTextActive}>{filter.label}</Text>
                    {filter.count > 0 && (
                      <View style={styles.filterCountActive}>
                        <Text style={styles.filterCountTextActive}>{filter.count}</Text>
                      </View>
                    )}
                  </LinearGradient>
                ) : (
                  <View style={[styles.filterTab, styles.filterTabGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                    <Text style={[styles.filterText, { color: theme.textSecondary }]}>{filter.label}</Text>
                    {filter.count > 0 && (
                      <View style={[styles.filterCount, { backgroundColor: theme.glassHighlight }]}>
                        <Text style={[styles.filterCountText, { color: theme.textSecondary }]}>{filter.count}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions - Glass Style */}
        <View style={styles.quickSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={handleNewChat}
                activeOpacity={0.7}
              >
                <GlassContainer style={styles.quickCard}>
                  <LinearGradient
                    colors={[theme.gradient1, theme.gradient2]}
                    style={[styles.quickIconWrap, styles.iconGlow]}
                  >
                    <action.icon size={22} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.quickLabel, { color: theme.text }]}>{action.label}</Text>
                </GlassContainer>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pinned Chats - Glass Style */}
        {activeFilter === 'all' && pinnedConversations.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Pin size={18} color={theme.primary} />
                <Text style={[styles.sectionTitleNoBtm, { color: theme.text }]}>Pinned</Text>
              </View>
            </View>

            {pinnedConversations.map((chat) => {
              const IconComp = iconMap[chat.icon] || Bot;
              const isMuted = mutedChats.includes(chat.id);
              return (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => handleConversationPress(chat)}
                  onLongPress={() => handleLongPress(chat)}
                  activeOpacity={0.7}
                  delayLongPress={300}
                >
                  <GlassContainer style={styles.chatCard} noPadding>
                    <View style={styles.chatCardInner}>
                      <View style={styles.chatIconWrapper}>
                        <LinearGradient
                          colors={[theme.gradient1, theme.gradient2]}
                          style={[styles.chatIcon, styles.iconGlow]}
                        >
                          <IconComp size={20} color="#FFFFFF" />
                        </LinearGradient>
                        {chat.isOnline && (
                          <View style={[styles.onlineIndicator, { borderColor: theme.glass }]} />
                        )}
                      </View>
                      <View style={styles.chatInfo}>
                        <View style={styles.chatNameRow}>
                          <Text style={[styles.chatName, { color: theme.text }]} numberOfLines={1}>
                            {chat.name}
                          </Text>
                          {isMuted && <BellOff size={12} color={theme.textMuted} />}
                        </View>
                        <Text style={[styles.chatMessage, { color: theme.textMuted }]} numberOfLines={1}>
                          {chat.lastMessage}
                        </Text>
                      </View>
                      <View style={styles.chatMeta}>
                        <Text style={[styles.chatTime, { color: theme.textMuted }]}>{chat.timestamp}</Text>
                        {chat.unread > 0 && (
                          <LinearGradient
                            colors={[theme.gradient1, theme.gradient2]}
                            style={[styles.unreadBadge, styles.badgeGlow]}
                          >
                            <Text style={styles.unreadText}>{chat.unread}</Text>
                          </LinearGradient>
                        )}
                      </View>
                    </View>
                  </GlassContainer>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Recent Chats - Glass Style */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {activeFilter === 'all' ? 'Recent Chats' :
               activeFilter === 'pinned' ? 'Pinned Chats' : 'Unread Chats'}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {(activeFilter === 'all' ? recentConversations : filteredConversations).slice(0, 5).map((chat) => {
            const IconComp = iconMap[chat.icon] || Bot;
            const isMuted = mutedChats.includes(chat.id);
            return (
              <TouchableOpacity
                key={chat.id}
                onPress={() => handleConversationPress(chat)}
                onLongPress={() => handleLongPress(chat)}
                activeOpacity={0.7}
                delayLongPress={300}
              >
                <GlassContainer style={styles.chatCard} noPadding>
                  <View style={styles.chatCardInner}>
                    <View style={styles.chatIconWrapper}>
                      <LinearGradient
                        colors={[theme.gradient1, theme.gradient2]}
                        style={[styles.chatIcon, styles.iconGlow]}
                      >
                        <IconComp size={20} color="#FFFFFF" />
                      </LinearGradient>
                      {chat.isOnline && (
                        <View style={[styles.onlineIndicator, { borderColor: theme.glass }]} />
                      )}
                    </View>
                    <View style={styles.chatInfo}>
                      <View style={styles.chatNameRow}>
                        <Text style={[styles.chatName, { color: theme.text }]} numberOfLines={1}>
                          {chat.name}
                        </Text>
                        {chat.isPinned && activeFilter !== 'pinned' && (
                          <Pin size={12} color={theme.primary} />
                        )}
                        {isMuted && <BellOff size={12} color={theme.textMuted} />}
                      </View>
                      <Text style={[styles.chatMessage, { color: theme.textMuted }]} numberOfLines={1}>
                        {chat.lastMessage}
                      </Text>
                    </View>
                    <View style={styles.chatMeta}>
                      <Text style={[styles.chatTime, { color: theme.textMuted }]}>{chat.timestamp}</Text>
                      {chat.unread > 0 && (
                        <LinearGradient
                          colors={[theme.gradient1, theme.gradient2]}
                          style={[styles.unreadBadge, styles.badgeGlow]}
                        >
                          <Text style={styles.unreadText}>{chat.unread}</Text>
                        </LinearGradient>
                      )}
                    </View>
                  </View>
                </GlassContainer>
              </TouchableOpacity>
            );
          })}

          {filteredConversations.length === 0 && activeFilter !== 'all' && (
            <GlassContainer style={styles.emptyFilter}>
              <Filter size={48} color={theme.textMuted} />
              <Text style={[styles.emptyFilterText, { color: theme.textMuted }]}>
                No {activeFilter} chats
              </Text>
            </GlassContainer>
          )}
        </View>

        {/* Capabilities - Glass Style */}
        <View style={styles.capabilitiesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>What I can do</Text>
          <View style={styles.capabilitiesGrid}>
            {[
              { icon: Zap, title: 'Fast Responses', desc: 'Get instant answers' },
              { icon: Code2, title: 'Code Helper', desc: 'Debug & write code' },
              { icon: FileText, title: 'Content Writer', desc: 'Create any content' },
              { icon: Sparkles, title: 'Creative Ideas', desc: 'Brainstorm together' },
            ].map((item, index) => (
              <GlassContainer key={index} style={styles.capabilityCard}>
                <LinearGradient
                  colors={[theme.gradient1, theme.gradient2]}
                  style={[styles.capabilityIcon, styles.iconGlow]}
                >
                  <item.icon size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.capabilityTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.capabilityDesc, { color: theme.textMuted }]}>{item.desc}</Text>
              </GlassContainer>
            ))}
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>

      {/* Search Modal - Glass Style */}
      <Modal
        visible={showSearchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.searchHeader}>
              <View style={[styles.searchInputWrap, styles.glassInput, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
                <Search size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search chats..."
                  placeholderTextColor={theme.placeholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                style={styles.cancelBtn}
              >
                <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.searchResults}>
              {filteredConversations.map((chat) => {
                const IconComp = iconMap[chat.icon] || Bot;
                return (
                  <TouchableOpacity
                    key={chat.id}
                    onPress={() => {
                      setShowSearchModal(false);
                      setSearchQuery('');
                      handleConversationPress(chat);
                    }}
                  >
                    <GlassContainer style={styles.searchResultItem} noPadding>
                      <View style={styles.searchResultInner}>
                        <LinearGradient
                          colors={[theme.gradient1, theme.gradient2]}
                          style={[styles.searchResultIcon, styles.iconGlow]}
                        >
                          <IconComp size={18} color="#FFFFFF" />
                        </LinearGradient>
                        <View style={styles.searchResultInfo}>
                          <Text style={[styles.searchResultName, { color: theme.text }]}>{chat.name}</Text>
                          <Text style={[styles.searchResultMsg, { color: theme.textMuted }]} numberOfLines={1}>
                            {chat.lastMessage}
                          </Text>
                        </View>
                        <ArrowRight size={18} color={theme.textSecondary} />
                      </View>
                    </GlassContainer>
                  </TouchableOpacity>
                );
              })}
              {filteredConversations.length === 0 && (
                <GlassContainer style={styles.noResults}>
                  <Search size={48} color={theme.textMuted} />
                  <Text style={[styles.noResultsText, { color: theme.textMuted }]}>No results found</Text>
                </GlassContainer>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Chat Action Menu Modal - Glass Style */}
      <Modal
        visible={showChatMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChatMenu(false)}
      >
        <TouchableOpacity
          style={styles.chatMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowChatMenu(false)}
        >
          {Platform.OS === 'web' ? (
            <View style={[styles.chatMenuModal, styles.chatMenuGlass, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
              <View style={[styles.chatMenuHandle, { backgroundColor: theme.glassHighlight }]} />

              {selectedChat && (
                <>
                  <View style={styles.chatMenuHeader}>
                    <LinearGradient
                      colors={[theme.gradient1, theme.gradient2]}
                      style={[styles.chatMenuIcon, styles.iconGlow]}
                    >
                      {(() => {
                        const IconComp = iconMap[selectedChat.icon] || Bot;
                        return <IconComp size={20} color="#FFFFFF" />;
                      })()}
                    </LinearGradient>
                    <Text style={[styles.chatMenuTitle, { color: theme.text }]} numberOfLines={1}>
                      {selectedChat.name}
                    </Text>
                  </View>

                  <View style={styles.chatMenuActions}>
                    <TouchableOpacity
                      style={[styles.chatMenuAction, { backgroundColor: theme.glass, borderColor: theme.glassBorder, borderWidth: 1 }]}
                      onPress={handlePinChat}
                    >
                      <LinearGradient
                        colors={[theme.gradient1, theme.gradient2]}
                        style={[styles.chatMenuActionIcon, styles.iconGlow]}
                      >
                        <Pin size={18} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={[styles.chatMenuActionText, { color: theme.text }]}>
                        {selectedChat.isPinned ? 'Unpin' : 'Pin'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.chatMenuAction, { backgroundColor: theme.glass, borderColor: theme.glassBorder, borderWidth: 1 }]}
                      onPress={handleMuteChat}
                    >
                      <LinearGradient
                        colors={[theme.gradient1, theme.gradient2]}
                        style={[styles.chatMenuActionIcon, styles.iconGlow]}
                      >
                        {mutedChats.includes(selectedChat.id) ? (
                          <Bell size={18} color="#FFFFFF" />
                        ) : (
                          <BellOff size={18} color="#FFFFFF" />
                        )}
                      </LinearGradient>
                      <Text style={[styles.chatMenuActionText, { color: theme.text }]}>
                        {mutedChats.includes(selectedChat.id) ? 'Unmute' : 'Mute'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.chatMenuAction, { backgroundColor: 'rgba(248, 113, 113, 0.15)', borderColor: 'rgba(248, 113, 113, 0.3)', borderWidth: 1 }]}
                      onPress={handleDeleteChat}
                    >
                      <View style={[styles.chatMenuActionIcon, { backgroundColor: theme.error }]}>
                        <Trash2 size={18} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.chatMenuActionText, { color: theme.error }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ) : (
            <BlurView
              intensity={40}
              tint={theme.background === '#0A0A0F' ? 'dark' : 'light'}
              style={[styles.chatMenuModal, styles.chatMenuGlass]}
            >
              <View style={[styles.chatMenuInner, { borderColor: theme.glassBorder }]}>
                <View style={[styles.chatMenuHandle, { backgroundColor: theme.glassHighlight }]} />

                {selectedChat && (
                  <>
                    <View style={styles.chatMenuHeader}>
                      <LinearGradient
                        colors={[theme.gradient1, theme.gradient2]}
                        style={[styles.chatMenuIcon, styles.iconGlow]}
                      >
                        {(() => {
                          const IconComp = iconMap[selectedChat.icon] || Bot;
                          return <IconComp size={20} color="#FFFFFF" />;
                        })()}
                      </LinearGradient>
                      <Text style={[styles.chatMenuTitle, { color: theme.text }]} numberOfLines={1}>
                        {selectedChat.name}
                      </Text>
                    </View>

                    <View style={styles.chatMenuActions}>
                      <TouchableOpacity
                        style={[styles.chatMenuAction, { backgroundColor: theme.glass, borderColor: theme.glassBorder, borderWidth: 1 }]}
                        onPress={handlePinChat}
                      >
                        <LinearGradient
                          colors={[theme.gradient1, theme.gradient2]}
                          style={[styles.chatMenuActionIcon, styles.iconGlow]}
                        >
                          <Pin size={18} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={[styles.chatMenuActionText, { color: theme.text }]}>
                          {selectedChat.isPinned ? 'Unpin' : 'Pin'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chatMenuAction, { backgroundColor: theme.glass, borderColor: theme.glassBorder, borderWidth: 1 }]}
                        onPress={handleMuteChat}
                      >
                        <LinearGradient
                          colors={[theme.gradient1, theme.gradient2]}
                          style={[styles.chatMenuActionIcon, styles.iconGlow]}
                        >
                          {mutedChats.includes(selectedChat.id) ? (
                            <Bell size={18} color="#FFFFFF" />
                          ) : (
                            <BellOff size={18} color="#FFFFFF" />
                          )}
                        </LinearGradient>
                        <Text style={[styles.chatMenuActionText, { color: theme.text }]}>
                          {mutedChats.includes(selectedChat.id) ? 'Unmute' : 'Mute'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chatMenuAction, { backgroundColor: 'rgba(248, 113, 113, 0.15)', borderColor: 'rgba(248, 113, 113, 0.3)', borderWidth: 1 }]}
                        onPress={handleDeleteChat}
                      >
                        <View style={[styles.chatMenuActionIcon, { backgroundColor: theme.error }]}>
                          <Trash2 size={18} color="#FFFFFF" />
                        </View>
                        <Text style={[styles.chatMenuActionText, { color: theme.error }]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </BlurView>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
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
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.6,
  },
  ambientGradient2: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Glass card styles
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassCardWeb: {
    backgroundColor: 'rgba(30, 30, 45, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
  },
  glassInner: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  heroButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterScroll: {
    gap: 10,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  filterTabGlass: {
    borderWidth: 1,
  },
  filterTabActive: {
    borderWidth: 0,
  },
  filterGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterCountTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitleNoBtm: {
    fontSize: 18,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
  },
  iconGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  quickIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chatCard: {
    borderRadius: 18,
    marginBottom: 12,
  },
  chatCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  chatIconWrapper: {
    position: 'relative',
  },
  chatIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  chatInfo: {
    flex: 1,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  chatMessage: {
    fontSize: 13,
  },
  chatMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  chatTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  capabilitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  capabilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capabilityCard: {
    width: '47%',
    borderRadius: 18,
    gap: 10,
  },
  capabilityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capabilityTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  capabilityDesc: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    gap: 12,
    borderWidth: 1,
  },
  glassInput: {
    backdropFilter: 'blur(20px)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    borderRadius: 16,
    marginBottom: 10,
  },
  searchResultInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  searchResultIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultMsg: {
    fontSize: 13,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  emptyFilter: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyFilterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chatMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatMenuModal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  chatMenuGlass: {
    borderTopWidth: 1,
  },
  chatMenuInner: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  chatMenuHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  chatMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  chatMenuIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMenuTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  chatMenuActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chatMenuAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  chatMenuActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMenuActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ConversationListScreen;
