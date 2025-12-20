import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event,
    State,
    useTrackPlayerEvents,
    useProgress
} from 'react-native-track-player';
import MusicService from '../services/MusicService';
import { getColors } from 'react-native-image-colors';

// Extract dominant color from image using react-native-image-colors
const extractDominantColor = async (imageUrl: string): Promise<string | null> => {
    try {
        console.log('[ColorExtractor] Extracting color from:', imageUrl);

        const result = await getColors(imageUrl, {
            cache: true,
            key: imageUrl,
        });

        console.log('[ColorExtractor] Full result:', JSON.stringify(result, null, 2));

        let extractedColor: string | null = null;

        switch (result.platform) {
            case 'android':
                extractedColor = result.dominant || result.vibrant || result.average || null;
                break;
            case 'ios':
                extractedColor = result.primary || result.secondary || result.background || null;
                break;
            case 'web':
                extractedColor = result.dominant || result.vibrant || null;
                break;
        }

        console.log('[ColorExtractor] Extracted color:', extractedColor);

        if (!extractedColor) {
            console.warn('[ColorExtractor] No color could be extracted from image!');
        }

        return extractedColor;
    } catch (error) {
        console.error('[ColorExtractor] Failed to extract color:', error);
        return null;
    }
};

interface Song {
    id: number;
    name: string;
    artists: string[];
    avatar_url: string;
    duration: number | null;
}

interface MusicPlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    isLoading: boolean;
    currentTime: number;
    duration: number;
    playlist: Song[];
    currentSongIndex: number;
    isShuffle: boolean;
    repeatMode: 'off' | 'all' | 'one';
    dominantColor: string | null; // Cho phép null
    isPlayerExpanded: boolean;

    playSong: (song: Song, playlist?: Song[], index?: number, color?: string) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    skipNext: () => Promise<void>;
    skipPrevious: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    changeVolume: (volume: number) => Promise<void>;
    toggleMute: () => Promise<void>;

    expandPlayer: () => void;
    minimizePlayer: () => void;
    togglePlayerState: () => void;
    setCurrentSong: (song: Song | null) => void;
    setIsPlaying: (playing: boolean) => void;

    volume: number;
    isMuted: boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const events = [
    Event.PlaybackState,
    Event.PlaybackError,
    Event.PlaybackQueueEnded,
    Event.PlaybackTrackChanged,
];

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
    const [isSetup, setIsSetup] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0); // Only used for UI reference
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all'); // Default to 'all' to enable auto-advance
    const [dominantColor, setDominantColor] = useState<string | null>(null); // Không dùng fallback, chỉ màu thật từ album
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
    const [volume, setVolume] = useState<number>(1.0);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const [originalPlaylist, setOriginalPlaylist] = useState<Song[]>([]);

    // TrackPlayer hook for progress
    const { position, duration } = useProgress();

    // Ref to keep track of playlist for events without dependency cycles
    const playlistRef = React.useRef<Song[]>([]);
    const shuffleRef = React.useRef<boolean>(false);
    const isRebuildingQueueRef = React.useRef<boolean>(false);

    useEffect(() => {
        setupPlayer();

        // Cleanup on unmount
        return () => {
            TrackPlayer.reset().catch(console.error);
        };
    }, []);

    useEffect(() => {
        playlistRef.current = playlist;
    }, [playlist]);

    useEffect(() => {
        shuffleRef.current = isShuffle;

        // Save shuffle state to AsyncStorage for PlaybackService
        AsyncStorage.setItem('shuffle_enabled', JSON.stringify(isShuffle))
            .catch(error => console.error('[MusicPlayer] Failed to save shuffle state:', error));
    }, [isShuffle]);

    // Load saved volume on init
    useEffect(() => {
        AsyncStorage.getItem('volume')
            .then(savedVolume => {
                if (savedVolume) {
                    const vol = parseFloat(savedVolume);
                    setVolume(vol);
                    TrackPlayer.setVolume(vol).catch(console.error);
                    console.log('[MusicPlayer] Loaded saved volume:', vol);
                }
            })
            .catch(error => console.error('[MusicPlayer] Failed to load volume:', error));
    }, []);



    useTrackPlayerEvents(events, async (event) => {
        if (event.type === Event.PlaybackError) {
            console.warn('An error occurred while playing the current track:', event);
        }
        if (event.type === Event.PlaybackState) {
            // Check strictly for Playing state to update UI
            const newIsPlaying = event.state === State.Playing;
            const newIsLoading = event.state === State.Buffering || event.state === State.Loading;

            console.log('[MusicPlayer] State changed:', {
                state: event.state,
                isPlaying: newIsPlaying,
                isLoading: newIsLoading
            });

            setIsPlaying(newIsPlaying);
            setIsLoading(newIsLoading);
        }
        if (event.type === Event.PlaybackQueueEnded) {
            console.log('[MusicPlayer] ⚠️ PlaybackQueueEnded - Queue has ended');
            const currentRepeatMode = await TrackPlayer.getRepeatMode();
            console.log('[MusicPlayer] Current repeat mode:', currentRepeatMode);
        }
        if (event.type === Event.PlaybackTrackChanged) {
            console.log('[MusicPlayer] 🎵 PlaybackTrackChanged event triggered!');
            console.log('[MusicPlayer] Previous track:', event.track);
            console.log('[MusicPlayer] Next track index:', event.nextTrack);
            const index = event.nextTrack;
            console.log('[MusicPlayer] PlaybackTrackChanged event - nextTrack:', index);

            if (index != null && index !== undefined) {
                // Validate playlist exists and index is within bounds
                const currentPlaylist = playlistRef.current;
                console.log('[MusicPlayer] Current playlist length:', currentPlaylist?.length);

                if (!currentPlaylist || currentPlaylist.length === 0) {
                    console.warn('[MusicPlayer] Playlist is empty or undefined');
                    return;
                }

                if (index < 0 || index >= currentPlaylist.length) {
                    console.warn(`[MusicPlayer] Track index ${index} out of bounds (playlist length: ${currentPlaylist.length})`);
                    return;
                }

                // Get song from playlist
                const song = currentPlaylist[index];
                console.log('[MusicPlayer] New song:', song?.name, 'by', song?.artists?.join(', '));

                if (song) {
                    // Update the index FIRST
                    setCurrentSongIndex(index);

                    // Update song - THIS IS CRITICAL
                    setCurrentSong(song);
                    console.log('[MusicPlayer] ✅ Updated currentSong state');

                    // Update notification metadata
                    try {
                        await TrackPlayer.updateNowPlayingMetadata({
                            title: song.name,
                            artist: song.artists.join(', '),
                            artwork: song.avatar_url,
                            duration: song.duration || undefined,
                        });
                    } catch (error) {
                        console.error('[MusicPlayer] Failed to update metadata:', error);
                    }

                    // Extract and update dominant color for the new song
                    console.log('[MusicPlayer] Starting color extraction for:', song.avatar_url);
                    extractDominantColor(song.avatar_url)
                        .then(color => {
                            console.log('[MusicPlayer] ✅ Setting new dominantColor:', color);
                            setDominantColor(color);
                        })
                        .catch(error => {
                            console.error('[MusicPlayer] Failed to extract color:', error);
                            setDominantColor(null);
                        });

                    // If shuffle is enabled, rebuild queue with shuffled remaining tracks
                    // Use setTimeout to ensure UI updates complete first
                    if (shuffleRef.current && currentPlaylist.length > 1 && !isRebuildingQueueRef.current) {
                        setTimeout(async () => {
                            console.log('[MusicPlayer] Shuffle enabled - rebuilding queue with random order');

                            // Set flag to prevent infinite loop
                            isRebuildingQueueRef.current = true;

                            try {
                                // Get remaining songs (exclude current)
                                const remainingSongs = currentPlaylist.filter((_, idx) => idx !== index);

                                // Fisher-Yates shuffle
                                for (let i = remainingSongs.length - 1; i > 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
                                }

                                // Build new queue: current song + shuffled remaining
                                const newQueue = [song, ...remainingSongs];

                                // Get current position and playing state
                                const currentPosition = await TrackPlayer.getPosition();
                                const wasPlaying = await TrackPlayer.getState() === State.Playing;

                                // Rebuild queue
                                await TrackPlayer.reset();
                                const tracks = newQueue.map(convertSongToTrack);
                                await TrackPlayer.add(tracks);

                                // Restore playback state
                                await TrackPlayer.seekTo(currentPosition);
                                if (wasPlaying) {
                                    await TrackPlayer.play();
                                }

                                console.log('[MusicPlayer] Queue rebuilt with shuffled order');
                            } catch (error) {
                                console.error('[MusicPlayer] Failed to rebuild queue:', error);
                            } finally {
                                // Reset flag after a delay to allow next rebuild
                                setTimeout(() => {
                                    isRebuildingQueueRef.current = false;
                                }, 1000);
                            }
                        }, 100); // Wait 100ms for UI to update first
                    }
                } else {
                    console.warn('[MusicPlayer] Song not found at index', index);
                    // Fallback: reconstruct from TrackPlayer
                    try {
                        const track = await TrackPlayer.getTrack(index);
                        if (track) {
                            const reconstructedSong = {
                                id: Number(track.id),
                                name: track.title || 'Unknown',
                                artists: [track.artist || 'Unknown'],
                                avatar_url: track.artwork || '',
                                duration: track.duration || null
                            } as Song;
                            console.log('[MusicPlayer] Reconstructed song from TrackPlayer:', reconstructedSong.name);
                            setCurrentSong(reconstructedSong);
                            setCurrentSongIndex(index);
                        }
                    } catch (error) {
                        console.error('[MusicPlayer] Failed to get track info:', error);
                    }
                }
            }
        }
    });

    const setupPlayer = async () => {
        if (isSetup) {
            console.log('[MusicPlayer] Already setup, skipping');
            return;
        }

        try {
            await TrackPlayer.setupPlayer({
                waitForBuffer: true,
                autoUpdateMetadata: true,
                autoHandleInterruptions: true,
            });

            // Set default repeat mode to enable auto-advance
            await TrackPlayer.setRepeatMode(RepeatMode.Queue);
            console.log('[MusicPlayer] Set default repeat mode to Queue');

            await TrackPlayer.updateOptions({
                android: {
                    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
                    // CRITICAL: Enable foreground service for notification controls
                    alwaysPauseOnInterruption: true,
                },
                // Notification display capabilities
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                    Capability.Stop,
                ],
                // CRITICAL: notificationCapabilities tells Android which buttons to show and respond to
                notificationCapabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                ],
                // Compact view buttons (Android notification collapsed state)
                compactCapabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                ],
                progressUpdateEventInterval: 1,
            });

            setIsSetup(true);
            console.log('[MusicPlayer] TrackPlayer setup completed');
        } catch (error) {
            console.error('[MusicPlayer] Setup error:', error);
            // Setup might fail if already setup, which is fine
            setIsSetup(true);
        }
    };

    const convertSongToTrack = (song: Song) => ({
        id: song.id.toString(),
        url: MusicService.getStreamingUrl(song.id),
        title: song.name,
        artist: song.artists.join(', '),
        artwork: song.avatar_url,
        duration: song.duration || undefined,
        // Additional metadata for better notification display
        album: 'Music App', // Could be extracted from song data if available
        genre: undefined,
        date: undefined,
        rating: undefined,
        // Control which features are available for this track
        isLiveStream: false,
    });

    const playSong = async (song: Song, newPlaylist: Song[] = [], index: number = 0, color?: string | null) => {
        if (!isSetup) {
            console.warn('TrackPlayer not setup yet');
            return;
        }

        try {
            setIsLoading(true);

            // ALWAYS extract color from album art, ignore passed color
            console.log('[MusicPlayer] Extracting color for song:', song.name);
            const effectiveColor = await extractDominantColor(song.avatar_url);
            console.log('[MusicPlayer] Extracted color:', effectiveColor);
            setDominantColor(effectiveColor);

            // Update playlists
            const effectivePlaylist = newPlaylist.length > 0 ? newPlaylist : [song];
            setPlaylist(effectivePlaylist);
            setOriginalPlaylist(effectivePlaylist);

            // Optimistic UI updates
            setCurrentSong(song);
            setCurrentSongIndex(index);
            setIsPlaying(true);

            // Reset queue and add new playlist
            await TrackPlayer.reset();

            const tracks = effectivePlaylist.map(convertSongToTrack);
            await TrackPlayer.add(tracks);

            // Validate index before skipping
            const validIndex = Math.max(0, Math.min(index, tracks.length - 1));
            if (validIndex !== 0) {
                await TrackPlayer.skip(validIndex);
            }

            // Restore repeat mode after reset
            switch (repeatMode) {
                case 'all': await TrackPlayer.setRepeatMode(RepeatMode.Queue); break;
                case 'one': await TrackPlayer.setRepeatMode(RepeatMode.Track); break;
                default: await TrackPlayer.setRepeatMode(RepeatMode.Off);
            }

            await TrackPlayer.play();
        } catch (error) {
            console.error('Failed to play song:', error);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayPause = async () => {
        try {
            const state = await TrackPlayer.getState();

            if (state === State.Playing) {
                setIsPlaying(false);
                await TrackPlayer.pause();
            } else {
                setIsPlaying(true);
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error('Failed to toggle play/pause:', error);
        }
    };

    const skipNext = async () => {
        // Debounce: prevent multiple calls
        if (isLoading) return;

        try {
            const queue = await TrackPlayer.getQueue();
            const currentIndex = await TrackPlayer.getCurrentTrack();

            console.log(`[MusicPlayer] skipNext - currentIndex: ${currentIndex}, queueLength: ${queue.length}, repeatMode: ${repeatMode}, isShuffle: ${isShuffle}`);

            if (currentIndex === null || currentIndex === undefined) {
                console.warn('[MusicPlayer] No current track to skip from');
                return;
            }

            // If shuffle is enabled, pick a random song (excluding current)
            if (isShuffle && playlist.length > 1) {
                console.log('[MusicPlayer] Shuffle mode: picking random next song');

                // Get all indices except current
                const availableIndices = playlist
                    .map((_, idx) => idx)
                    .filter(idx => idx !== currentIndex);

                // Pick random index
                const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                const randomSong = playlist[randomIdx];

                console.log(`[MusicPlayer] Random pick: index ${randomIdx}, song: ${randomSong?.name}`);

                if (randomSong) {
                    // Update state
                    setCurrentSongIndex(randomIdx);
                    setCurrentSong(randomSong);

                    // Skip to the random track in queue
                    await TrackPlayer.skip(randomIdx);

                    // Extract color for new song
                    extractDominantColor(randomSong.avatar_url)
                        .then(color => {
                            console.log('[MusicPlayer] ✅ New color:', color);
                            setDominantColor(color);
                        })
                        .catch(error => {
                            console.error('[MusicPlayer] Color extraction failed:', error);
                            setDominantColor(null);
                        });
                }
                return;
            }

            // Normal sequential mode
            const nextIndex = currentIndex + 1;
            if (nextIndex >= queue.length) {
                console.log('[MusicPlayer] Reached end of playlist');
                if (repeatMode !== 'all') {
                    return;
                }
            }

            // Skip to next track
            await TrackPlayer.skipToNext();
            console.log('[MusicPlayer] Skip next completed');

            // CRITICAL: Manually update UI because PlaybackTrackChanged may not fire
            const newIndex = await TrackPlayer.getCurrentTrack();
            if (newIndex !== null && newIndex !== undefined && newIndex < playlist.length) {
                const newSong = playlist[newIndex];
                if (newSong) {
                    console.log('[MusicPlayer] 🔄 Manually updating to:', newSong.name);
                    setCurrentSongIndex(newIndex);
                    setCurrentSong(newSong);

                    // Extract color for new song
                    extractDominantColor(newSong.avatar_url)
                        .then(color => {
                            console.log('[MusicPlayer] ✅ New color:', color);
                            setDominantColor(color);
                        })
                        .catch(error => {
                            console.error('[MusicPlayer] Color extraction failed:', error);
                            setDominantColor(null);
                        });
                }
            }
        } catch (error) {
            console.error('[MusicPlayer] Failed to skip next:', error);
        }
    };

    const skipPrevious = async () => {
        // Debounce: prevent multiple calls
        if (isLoading) return;

        try {
            const currentIndex = await TrackPlayer.getCurrentTrack();
            const position = await TrackPlayer.getPosition();

            console.log(`[MusicPlayer] skipPrevious - currentIndex: ${currentIndex}, position: ${position}`);

            if (currentIndex === null || currentIndex === undefined) {
                console.warn('[MusicPlayer] No current track to skip from');
                return;
            }

            // If more than 3 seconds into the song, restart it. Otherwise, go to previous
            if (position > 3) {
                await TrackPlayer.seekTo(0);
                console.log('[MusicPlayer] Restarted current track');
            } else {
                // Check if we're at the first track
                if (currentIndex === 0) {
                    console.log('[MusicPlayer] Already at first track, restarting');
                    await TrackPlayer.seekTo(0);
                } else {
                    await TrackPlayer.skipToPrevious();
                    console.log('[MusicPlayer] Skip previous completed');

                    // CRITICAL: Manually update UI
                    const newIndex = await TrackPlayer.getCurrentTrack();
                    if (newIndex !== null && newIndex !== undefined && newIndex < playlist.length) {
                        const newSong = playlist[newIndex];
                        if (newSong) {
                            console.log('[MusicPlayer] 🔄 Manually updating to:', newSong.name);
                            setCurrentSongIndex(newIndex);
                            setCurrentSong(newSong);

                            // Extract color
                            extractDominantColor(newSong.avatar_url)
                                .then(color => {
                                    console.log('[MusicPlayer] ✅ New color:', color);
                                    setDominantColor(color);
                                })
                                .catch(error => {
                                    console.error('[MusicPlayer] Color extraction failed:', error);
                                    setDominantColor(null);
                                });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[MusicPlayer] Failed to skip previous:', error);
        }
    };

    const seekTo = async (position: number) => {
        try {
            await TrackPlayer.seekTo(position);
        } catch (error) {
            console.error('Failed to seek:', error);
        }
    };

    const toggleShuffle = () => {
        const newShuffleState = !isShuffle;
        setIsShuffle(newShuffleState);
        console.log(`[MusicPlayer] Shuffle ${newShuffleState ? 'enabled' : 'disabled'}`);
    };

    const toggleRepeat = async () => {
        try {
            const modes = ['off', 'all', 'one'] as const;
            const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
            const nextMode = modes[nextIndex];

            setRepeatMode(nextMode);

            switch (nextMode) {
                case 'off':
                    await TrackPlayer.setRepeatMode(RepeatMode.Off);
                    break;
                case 'all':
                    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
                    break;
                case 'one':
                    await TrackPlayer.setRepeatMode(RepeatMode.Track);
                    break;
            }
        } catch (error) {
            console.error('Failed to toggle repeat mode:', error);
        }
    };

    const changeVolume = async (newVolume: number) => {
        try {
            setVolume(newVolume);
            await TrackPlayer.setVolume(newVolume);
            await AsyncStorage.setItem('volume', newVolume.toString());
            console.log('[MusicPlayer] Volume changed to:', newVolume);
        } catch (error) {
            console.error('[MusicPlayer] Failed to change volume:', error);
        }
    };

    const toggleMute = async () => {
        try {
            const newMutedState = !isMuted;
            setIsMuted(newMutedState);
            await TrackPlayer.setVolume(newMutedState ? 0 : volume);
            console.log('[MusicPlayer] Mute toggled:', newMutedState);
        } catch (error) {
            console.error('[MusicPlayer] Failed to toggle mute:', error);
        }
    };

    const expandPlayer = () => setIsPlayerExpanded(true);
    const minimizePlayer = () => setIsPlayerExpanded(false);
    const togglePlayerState = () => setIsPlayerExpanded(!isPlayerExpanded);

    return (
        <MusicPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                isLoading,
                currentTime: position,
                duration,
                playlist,
                currentSongIndex,
                isShuffle,
                repeatMode,
                dominantColor,
                isPlayerExpanded,
                volume,
                isMuted,
                playSong,
                togglePlayPause,
                skipNext,
                skipPrevious,
                seekTo,
                toggleShuffle,
                toggleRepeat,
                changeVolume,
                toggleMute,
                expandPlayer,
                minimizePlayer,
                togglePlayerState,
                setCurrentSong,
                setIsPlaying,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};
