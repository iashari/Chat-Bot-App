import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Switch, Alert, ScrollView, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Bell,
  Globe,
  Crown,
  ChevronRight,
  MessageCircle,
  Clock,
  CreditCard,
  Lock,
  Edit3,
  Star,
  Zap,
  Brain,
  Sparkles,
  Bot,
  HardDrive,
  Trash2,
  X,
  Check,
} from 'lucide-react-native';
import { userProfile } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [showAIModeModal, setShowAIModeModal] = useState(false);
  const [selectedAIMode, setSelectedAIMode] = useState('balanced');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-20)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const profileScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.spring(profileScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMenuPress = (item) => {
    Alert.alert(item, `You tapped on ${item}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const stats = [
    { icon: MessageCircle, value: '156', label: 'Chats' },
    { icon: Star, value: '2.8k', label: 'Messages' },
    { icon: Clock, value: '48h', label: 'Saved' },
  ];

  const aiModes = [
    {
      id: 'creative',
      name: 'Creative',
      desc: 'More imaginative and expressive responses',
      icon: Sparkles,
      color: '#EC4899',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      desc: 'Best mix of creativity and accuracy',
      icon: Brain,
      color: theme.primary,
    },
    {
      id: 'precise',
      name: 'Precise',
      desc: 'More factual and concise responses',
      icon: Zap,
      color: '#22C55E',
    },
  ];

  const storageUsed = 2.4; // GB
  const storageTotal = 5; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Cache Cleared', 'Your cache has been cleared.') },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerAnim, transform: [{ translateY: headerSlideAnim }] }
          ]}
        >
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>Your Account</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          </View>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileSection,
            {
              opacity: profileAnim,
              transform: [{ scale: profileScaleAnim }]
            }
          ]}
        >
          <View style={[styles.profileCard, { backgroundColor: theme.surface }, styles.cardShadow]}>
            <View style={styles.profileContent}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <LinearGradient
                    colors={[theme.gradient1, theme.gradient2]}
                    style={styles.avatarBorder}
                  >
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                  </LinearGradient>
                </View>
                <TouchableOpacity
                  style={styles.editBadgeWrapper}
                  onPress={() => handleMenuPress('Edit Profile')}
                >
                  <LinearGradient
                    colors={[theme.gradient1, theme.gradient2]}
                    style={styles.editBadge}
                  >
                    <Edit3 size={12} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
                <Text style={[styles.userEmail, { color: theme.textMuted }]}>{userProfile.email}</Text>

                <LinearGradient
                  colors={[theme.gradient1 + '30', theme.gradient2 + '30']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.proBadge}
                >
                  <Crown size={12} color={theme.primary} />
                  <Text style={[styles.proBadgeText, { color: theme.primary }]}>PRO</Text>
                </LinearGradient>
              </View>

              <ChevronRight size={20} color={theme.textMuted} />
            </View>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <View style={styles.statsSection}>
          <View style={[styles.statsRow, { backgroundColor: theme.surface }, styles.cardShadow]}>
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => handleMenuPress(stat.label)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[theme.gradient1, theme.gradient2]}
                    style={styles.statIconBg}
                  >
                    <stat.icon size={18} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
                </TouchableOpacity>
                {index < stats.length - 1 && (
                  <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* AI Mode Selector */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>AI ASSISTANT</Text>
          <TouchableOpacity
            style={[styles.aiModeCard, { backgroundColor: theme.surface }, styles.cardShadow]}
            onPress={() => setShowAIModeModal(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[theme.gradient1, theme.gradient2]}
              style={styles.settingIcon}
            >
              <Bot size={18} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.aiModeInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>AI Mode</Text>
              <Text style={[styles.aiModeValue, { color: theme.textMuted }]}>
                {aiModes.find(m => m.id === selectedAIMode)?.name}
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Storage Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>STORAGE</Text>
          <View style={[styles.storageCard, { backgroundColor: theme.surface }, styles.cardShadow]}>
            <View style={styles.storageHeader}>
              <LinearGradient
                colors={[theme.gradient1, theme.gradient2]}
                style={styles.settingIcon}
              >
                <HardDrive size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.storageInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Storage Used</Text>
                <Text style={[styles.storageValue, { color: theme.textMuted }]}>
                  {storageUsed} GB of {storageTotal} GB
                </Text>
              </View>
            </View>
            <View style={[styles.storageBarBg, { backgroundColor: theme.surfaceSecondary }]}>
              <LinearGradient
                colors={[theme.gradient1, theme.gradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.storageBar, { width: `${storagePercentage}%` }]}
              />
            </View>
            <TouchableOpacity
              style={[styles.clearCacheBtn, { borderColor: theme.border }]}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={theme.error} />
              <Text style={[styles.clearCacheText, { color: theme.error }]}>Clear Cache</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PREFERENCES</Text>

          {/* Dark Mode Toggle */}
          <View style={[styles.settingItem, { backgroundColor: theme.surface }, styles.cardShadow]}>
            <LinearGradient
              colors={[theme.gradient1, theme.gradient2]}
              style={styles.settingIcon}
            >
              <Moon size={18} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {/* Notifications Toggle */}
          <View style={[styles.settingItem, { backgroundColor: theme.surface }, styles.cardShadow]}>
            <LinearGradient
              colors={[theme.gradient1, theme.gradient2]}
              style={styles.settingIcon}
            >
              <Bell size={18} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {/* Other Settings */}
          {[
            { icon: Globe, label: 'Language' },
            { icon: Lock, label: 'Privacy' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.settingItem, { backgroundColor: theme.surface }, styles.cardShadow]}
              onPress={() => handleMenuPress(item.label)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[theme.gradient1, theme.gradient2]}
                style={styles.settingIcon}
              >
                <item.icon size={18} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
              <ChevronRight size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ACCOUNT</Text>

          {[
            { icon: User, label: 'Edit Profile' },
            { icon: CreditCard, label: 'Subscription' },
            { icon: Shield, label: 'Security' },
            { icon: HelpCircle, label: 'Help Center' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.settingItem, { backgroundColor: theme.surface }, styles.cardShadow]}
              onPress={() => handleMenuPress(item.label)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[theme.gradient1, theme.gradient2]}
                style={styles.settingIcon}
              >
                <item.icon size={18} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
              <ChevronRight size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.surface, borderColor: 'rgba(239, 68, 68, 0.3)' }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#EF4444" />
            <Text style={[styles.logoutText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          Version 1.0.0
        </Text>
      </ScrollView>

      {/* AI Mode Modal */}
      <Modal
        visible={showAIModeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIModeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAIModeModal(false)}
        >
          <View style={[styles.aiModeModal, { backgroundColor: theme.surface }, styles.cardShadow]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>AI Mode</Text>
              <TouchableOpacity onPress={() => setShowAIModeModal(false)}>
                <X size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
              Choose how your AI assistant responds
            </Text>

            {aiModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.aiModeOption,
                  { backgroundColor: theme.surfaceSecondary },
                  selectedAIMode === mode.id && { borderColor: mode.color, borderWidth: 2 },
                ]}
                onPress={() => {
                  setSelectedAIMode(mode.id);
                  setShowAIModeModal(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.aiModeOptionIcon, { backgroundColor: `${mode.color}20` }]}>
                  <mode.icon size={22} color={mode.color} />
                </View>
                <View style={styles.aiModeOptionInfo}>
                  <Text style={[styles.aiModeOptionName, { color: theme.text }]}>{mode.name}</Text>
                  <Text style={[styles.aiModeOptionDesc, { color: theme.textMuted }]}>{mode.desc}</Text>
                </View>
                {selectedAIMode === mode.id && (
                  <View style={[styles.aiModeCheck, { backgroundColor: mode.color }]}>
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 18,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
  },
  avatarWrapper: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 20,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 17,
  },
  editBadgeWrapper: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 10,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    alignSelf: 'flex-start',
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 18,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 100,
    fontWeight: '500',
  },
  aiModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  aiModeInfo: {
    flex: 1,
  },
  aiModeValue: {
    fontSize: 13,
    marginTop: 2,
  },
  storageCard: {
    padding: 16,
    borderRadius: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageInfo: {
    flex: 1,
    marginLeft: 14,
  },
  storageValue: {
    fontSize: 13,
    marginTop: 2,
  },
  storageBarBg: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  storageBar: {
    height: '100%',
    borderRadius: 4,
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  clearCacheText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  aiModeModal: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  aiModeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  aiModeOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aiModeOptionInfo: {
    flex: 1,
  },
  aiModeOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aiModeOptionDesc: {
    fontSize: 13,
  },
  aiModeCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
