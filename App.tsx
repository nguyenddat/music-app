import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from './src/services/UserService';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/sreens/home/HomeScreen';
import AuthScreen from './src/sreens/auth/AuthScreen';
import WelcomeScreen from './src/sreens/onboard/WelcomeScreen';
import GenreScreen from './src/sreens/onboard/GenreScreen';
import ArtistScreen from './src/sreens/onboard/ArtistScreen';
import FindScreen from './src/sreens/find/FindScreen';
import MainFindScreen from './src/sreens/find/MainFindScreen';
import AIFindScreen from './src/sreens/find/AIFindScreen';

import LoginScreen from './src/sreens/auth/LoginScreen';
import RegisterScreen from './src/sreens/auth/RegisterScreen';
import PlaylistScreen from './src/sreens/playlist/PlaylistScreen';
import ArtistDetailScreen from './src/sreens/playlist/ArtistScreen';
import PersonalScreen from './src/sreens/auth/PersonalScreen';
import SettingsScreen from './src/sreens/auth/SettingsScreen';
import { COLORS } from './src/constants/colors';

import { MusicPlayerProvider } from './src/contexts/MusicPlayerContext';
import UnifiedPlayer from './src/components/UnifiedPlayer';

import { LanguageProvider } from './src/contexts/LanguageContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for tabs that aren't implemented yet
const PlaylistsScreen = () => <View style={{ flex: 1, backgroundColor: '#000' }} />;

// Main Tab Navigator with bottom bar
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Find" component={FindScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Gilroy-Light': require('./assets/fonts/SVN-Gilroy-Light.otf'),
    'Gilroy-Regular': require('./assets/fonts/SVN-Gilroy-Regular.otf'),
    'Gilroy-Medium': require('./assets/fonts/SVN-Gilroy-Medium.otf'),
    'Gilroy-SemiBold': require('./assets/fonts/SVN-Gilroy-SemiBold.otf'),
    'Gilroy-Bold': require('./assets/fonts/SVN-Gilroy-Bold.otf'),
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState("Auth");

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          // Validate token by fetching user profile
          const result = await UserService.me();
          if (result.success) {
            setInitialRoute("MainTabs");
          } else {
            // Token invalid or expired
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading screen while fonts are loading or auth is being checked
  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <MusicPlayerProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Genre" component={GenreScreen} />
            <Stack.Screen name="Artist" component={ArtistScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="MainFind" component={MainFindScreen} />
            <Stack.Screen name="AIFind" component={AIFindScreen} />
            <Stack.Screen name="Playlist" component={PlaylistScreen} />
            <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
            <Stack.Screen name="Personal" component={PersonalScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>

          {/* Unified Player - renders above all screens */}
          <UnifiedPlayer />

          <StatusBar style="auto" />
        </NavigationContainer>
      </MusicPlayerProvider>
    </LanguageProvider>
  );
}

