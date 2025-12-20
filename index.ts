import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';

import App from './App';

// CRITICAL: Import the PlaybackService as a CommonJS module
// This is required for Android HeadlessJS task to work properly
const PlaybackService = require('./src/services/PlaybackService');

// CRITICAL: Register PlaybackService BEFORE registering the app component
// This ensures remote events from notifications are properly handled on Android
TrackPlayer.registerPlaybackService(() => PlaybackService);

console.log('[Index] TrackPlayer PlaybackService registered');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
