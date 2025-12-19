import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from 'expo-av';
import MusicService from '../services/MusicService';

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
    dominantColor: string;
    isPlayerExpanded: boolean;

    // Playback controls
    playSong: (song: Song, playlist?: Song[], index?: number, color?: string) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    skipNext: () => Promise<void>;
    skipPrevious: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    toggleShuffle: () => void;
    toggleRepeat: () => void;

    // Player state controls
    expandPlayer: () => void;
    minimizePlayer: () => void;
    togglePlayerState: () => void;

    setCurrentSong: (song: Song | null) => void;
    setIsPlaying: (playing: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
    const [dominantColor, setDominantColor] = useState('#6C5CE7');
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

    const sound = useRef<Audio.Sound | null>(null);
    const musicService = useRef(new MusicService()).current;
    const seekOffset = useRef(0); // Track the offset from the original file start (in seconds)

    // Setup audio on mount
    useEffect(() => {
        setupAudio();
        return () => {
            unloadSound();
        };
    }, []);

    const setupAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: false,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            });
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    };

    const unloadSound = async () => {
        try {
            if (sound.current) {
                await sound.current.unloadAsync();
                sound.current = null;
            }
        } catch (error) {
            console.error('Error unloading sound:', error);
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Playback error: ${status.error}`);
            }
        } else {
            setIsPlaying(status.isPlaying);
            const positionInSeconds = status.positionMillis / 1000;
            setCurrentTime(positionInSeconds + seekOffset.current);

            if (status.durationMillis) {
                if (!currentSong?.duration) {
                    setDuration((status.durationMillis / 1000) + seekOffset.current);
                } else {
                    setDuration(currentSong.duration);
                }
            }

            if (status.didJustFinish && !status.isLooping) {
                handleSongEnd();
            }
        }
    };

    const handleSongEnd = () => {
        if (repeatMode === 'one') {
            replaySong();
        } else if (repeatMode === 'all' || playlist.length > 0) {
            skipNext();
        } else {
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const replaySong = async () => {
        try {
            if (sound.current) {
                await sound.current.setPositionAsync(0);
                await sound.current.playAsync();
            }
        } catch (error) {
            console.error('Error replaying song:', error);
        }
    };

    const loadSong = async (song: Song, startTime: number = 0) => {
        setIsLoading(true);
        try {
            await unloadSound();

            const streamUrl = `${musicService.getStreamingUrl(song.id)}?start=${startTime}`;
            console.log('Stream URL:', streamUrl);

            seekOffset.current = startTime; // Update offset

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: streamUrl },
                {
                    shouldPlay: true,
                    progressUpdateIntervalMillis: 100,
                    androidImplementation: 'MediaPlayer',
                },
                onPlaybackStatusUpdate
            );

            sound.current = newSound;
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading song:', error);
            setIsLoading(false);
        }
    };

    const playSong = async (song: Song, newPlaylist: Song[] = [], index: number = 0, color: string = '#6C5CE7') => {
        setCurrentSong(song);
        setPlaylist(newPlaylist);
        setCurrentSongIndex(index);
        setDominantColor(color);
        setCurrentTime(0);
        await loadSong(song, 0);
    };

    const togglePlayPause = async () => {
        try {
            if (!sound.current) return;

            if (isPlaying) {
                await sound.current.pauseAsync();
            } else {
                await sound.current.playAsync();
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    const skipNext = async () => {
        if (playlist.length === 0) return;

        const nextIndex = (currentSongIndex + 1) % playlist.length;
        const nextSong = playlist[nextIndex];
        setCurrentSongIndex(nextIndex);
        setCurrentSong(nextSong);
        setCurrentTime(0);
        await loadSong(nextSong, 0);
    };

    const skipPrevious = async () => {
        if (playlist.length === 0) return;

        const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
        const prevSong = playlist[prevIndex];
        setCurrentSongIndex(prevIndex);
        setCurrentSong(prevSong);
        setCurrentTime(0);
        await loadSong(prevSong, 0);
    };

    const seekTo = async (position: number) => {
        try {
            if (sound.current) {
                await sound.current.setPositionAsync(position * 1000);
                setCurrentTime(position);
            }
        } catch (error) {
            console.error('Error seeking:', error);
        }
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const toggleRepeat = () => {
        const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    const expandPlayer = () => {
        setIsPlayerExpanded(true);
    };

    const minimizePlayer = () => {
        setIsPlayerExpanded(false);
    };

    const togglePlayerState = () => {
        setIsPlayerExpanded(!isPlayerExpanded);
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                isLoading,
                currentTime,
                duration,
                playlist,
                currentSongIndex,
                isShuffle,
                repeatMode,
                dominantColor,
                isPlayerExpanded,
                playSong,
                togglePlayPause,
                skipNext,
                skipPrevious,
                seekTo,
                toggleShuffle,
                toggleRepeat,
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

