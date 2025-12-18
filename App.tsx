import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

import LoginScreen from './src/sreens/auth/LoginScreen';
import RegisterScreen from './src/sreens/auth/RegisterScreen';
import PlaylistScreen from './src/sreens/playlist/PlaylistScreen';
import { COLORS } from './src/constants/colors';
import CustomBottomBar from './src/components/CustomBottomBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for tabs that aren't implemented yet
const PlaylistsScreen = () => <View style={{ flex: 1, backgroundColor: '#000' }} />;
const SettingsScreen = () => <View style={{ flex: 1, backgroundColor: '#000' }} />;

// Main Tab Navigator with bottom bar
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomBar {...props} />}
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

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Genre" component={GenreScreen} />
        <Stack.Screen name="Artist" component={ArtistScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="MainFind" component={MainFindScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

