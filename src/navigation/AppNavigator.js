import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MessageCircle, User } from 'lucide-react-native';

import ConversationListScreen from '../screens/ConversationListScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConversationList" component={ConversationListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme, isDarkMode } = useTheme();

  const icons = {
    Chats: MessageCircle,
    Profile: User,
  };

  return (
    <View style={styles.tabBarWrapper}>
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.tabBarGlass,
            styles.tabBarGlassWeb,
            {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              shadowColor: theme.glowColor || '#A78BFA',
            },
          ]}
        >
          <View style={styles.tabBarContent}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const Icon = icons[route.name];

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  {isFocused ? (
                    <LinearGradient
                      colors={[theme.gradient1, theme.gradient2]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.activeIconBg}
                    >
                      <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
                    </LinearGradient>
                  ) : (
                    <Icon size={20} color={theme.tabInactive} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <BlurView
          intensity={80}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.tabBarGlass, { overflow: 'hidden' }]}
        >
          <View style={[styles.tabBarBlurInner, { borderColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <View style={styles.tabBarContent}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const Icon = icons[route.name];

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    style={styles.tabItem}
                    activeOpacity={0.7}
                  >
                    {isFocused ? (
                      <LinearGradient
                        colors={[theme.gradient1, theme.gradient2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.activeIconBg}
                      >
                        <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
                      </LinearGradient>
                    ) : (
                      <Icon size={20} color={theme.tabInactive} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </BlurView>
      )}
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Chats" component={ChatStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 60,
    right: 60,
    height: 60,
  },
  tabBarGlass: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  tabBarGlassWeb: {
    backgroundColor: 'rgba(30, 30, 40, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  tabBarBlurInner: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default AppNavigator;
