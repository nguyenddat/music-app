import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/sreens/home/HomeScreen';
import AuthScreen from './src/sreens/auth/AuthScreen';
import WelcomeScreen from './src/sreens/onboard/WelcomeScreen';
import GenreScreen from './src/sreens/onboard/GenreScreen';
import ArtistScreen from './src/sreens/onboard/ArtistScreen';

import LoginScreen from './src/sreens/auth/LoginScreen';
import RegisterScreen from './src/sreens/auth/RegisterScreen';
import PlaylistScreen from './src/sreens/playlist/PlaylistScreen';
import { COLORS } from './src/constants/colors';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

