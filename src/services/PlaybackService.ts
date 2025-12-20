import TrackPlayer, { Event } from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Playback Service for react-native-track-player
 * 
 * CRITICAL NOTES:
 * 1. This service handles ALL remote control events (notification, lock screen, Bluetooth)
 * 2. It MUST be registered BEFORE the app component in index.ts
 * 3. For Android, this function is called as a HeadlessJS task
 * 4. The function MUST return a Promise<void> and NOT throw errors
 */

module.exports = async function PlaybackService() {
    console.log('[PlaybackService] 🎵 ============================================');
    console.log('[PlaybackService] 🎵 PLAYBACK SERVICE STARTING');
    console.log('[PlaybackService] 🎵 ============================================');

    // ============== REMOTE PLAY ==============
    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
        console.log('[PlaybackService] ▶️ ===== REMOTE PLAY RECEIVED =====');
        try {
            await TrackPlayer.play();
            console.log('[PlaybackService] ✅ Play executed');
        } catch (error) {
            console.error('[PlaybackService] ❌ Play failed:', error);
        }
    });

    // ============== REMOTE PAUSE ==============
    TrackPlayer.addEventListener(Event.RemotePause, async () => {
        console.log('[PlaybackService] ⏸️ ===== REMOTE PAUSE RECEIVED =====');
        try {
            await TrackPlayer.pause();
            console.log('[PlaybackService] ✅ Pause executed');
        } catch (error) {
            console.error('[PlaybackService] ❌ Pause failed:', error);
        }
    });

    // ============== REMOTE STOP ==============
    TrackPlayer.addEventListener(Event.RemoteStop, async () => {
        console.log('[PlaybackService] ⏹️ ===== REMOTE STOP RECEIVED =====');
        try {
            await TrackPlayer.stop();
            console.log('[PlaybackService] ✅ Stop executed');
        } catch (error) {
            console.error('[PlaybackService] ❌ Stop failed:', error);
        }
    });

    // ============== REMOTE NEXT ==============
    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        console.log('[PlaybackService] ⏭️ ===== REMOTE NEXT RECEIVED =====');
        try {
            const queue = await TrackPlayer.getQueue();
            const currentIndex = await TrackPlayer.getActiveTrackIndex();

            console.log(`[PlaybackService] Queue length: ${queue.length}, Current: ${currentIndex}`);

            if (currentIndex === null || currentIndex === undefined) {
                console.warn('[PlaybackService] No current track');
                return;
            }

            // Check shuffle
            const shuffleStr = await AsyncStorage.getItem('shuffle_enabled');
            const shuffleEnabled = shuffleStr ? JSON.parse(shuffleStr) : false;

            if (shuffleEnabled && queue.length > 1) {
                const availableIndices = queue
                    .map((_, i) => i)
                    .filter(i => i !== currentIndex);
                const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                console.log('[PlaybackService] 🔀 Shuffle skip to:', randomIdx);
                await TrackPlayer.skip(randomIdx);
            } else {
                await TrackPlayer.skipToNext();
            }

            console.log('[PlaybackService] ✅ Next executed');
        } catch (error) {
            console.error('[PlaybackService] ❌ Next failed:', error);
        }
    });

    // ============== REMOTE PREVIOUS ==============
    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        console.log('[PlaybackService] ⏮️ ===== REMOTE PREVIOUS RECEIVED =====');
        try {
            const position = await TrackPlayer.getProgress().then(p => p.position);

            if (position > 3) {
                await TrackPlayer.seekTo(0);
                console.log('[PlaybackService] ✅ Restarted track');
            } else {
                await TrackPlayer.skipToPrevious();
                console.log('[PlaybackService] ✅ Previous executed');
            }
        } catch (error) {
            console.error('[PlaybackService] ❌ Previous failed:', error);
        }
    });

    // ============== REMOTE SEEK ==============
    TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
        console.log('[PlaybackService] ⏩ ===== REMOTE SEEK RECEIVED =====', event.position);
        try {
            await TrackPlayer.seekTo(event.position);
            console.log('[PlaybackService] ✅ Seek executed');
        } catch (error) {
            console.error('[PlaybackService] ❌ Seek failed:', error);
        }
    });

    // ============== REMOTE DUCK (Audio Focus) ==============
    TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
        console.log('[PlaybackService] 🔉 ===== REMOTE DUCK RECEIVED =====', event);
        try {
            if (event.paused) {
                await TrackPlayer.pause();
            } else if (event.permanent) {
                await TrackPlayer.stop();
            } else {
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error('[PlaybackService] ❌ Duck failed:', error);
        }
    });

    // ============== PLAYBACK QUEUE ENDED ==============
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (event) => {
        console.log('[PlaybackService] 🔚 Queue ended:', event);
    });

    // ============== PLAYBACK ERROR ==============
    TrackPlayer.addEventListener(Event.PlaybackError, async (event) => {
        console.error('[PlaybackService] ❌ Playback error:', event);
    });

    console.log('[PlaybackService] 🎵 ============================================');
    console.log('[PlaybackService] ✅ ALL EVENT LISTENERS REGISTERED');
    console.log('[PlaybackService] 🎵 ============================================');
};
