import React, { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import MusicService from '../services/MusicService';
import PlaylistService from '../services/PlaylistService';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ALBUM_ART_SIZE = width * 0.8;
const MINI_PLAYER_HEIGHT = 86;


const UnifiedPlayer = () => {
    const {
        currentSong,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        isShuffle,
        repeatMode,
        dominantColor,
        isPlayerExpanded,
        volume,
        isMuted,
        togglePlayPause,
        skipNext,
        skipPrevious,
        toggleShuffle,
        toggleRepeat,
        changeVolume,
        toggleMute,
        minimizePlayer,
        expandPlayer,
        seekTo,
    } = useMusicPlayer();

    const [isLiked, setIsLiked] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);

    let currentRouteName = '';
    try {
        currentRouteName = useNavigationState(state => {
            if (!state) return '';
            let route = state.routes[state.index] as any;
            while (route.state && route.state.index !== undefined) {
                route = route.state.routes[route.state.index];
            }
            return route.name;
        }) || '';
    } catch (error) {
        currentRouteName = '';
    }

    const authScreens = ['Auth', 'Login', 'Register', 'Welcome', 'Genre', 'Artist'];
    const shouldHidePlayer = authScreens.includes(currentRouteName);

    // Animation values
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacityMiniAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isPlayerExpanded) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 20,
                    friction: 7
                }),
                Animated.timing(opacityMiniAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityMiniAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isPlayerExpanded]);

    // Log history only once when song changes
    useEffect(() => {
        if (currentSong?.id) {
            MusicService.createHistory({ song_id: currentSong.id })
                .then((res) => {
                    if (res.success) {
                        console.log('Logged history for song:', currentSong.id);
                    }
                })
                .catch((error) => {
                    console.error('Failed to log history:', error);
                });
        }
    }, [currentSong?.id]);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isPlaying ? 1 : 0.98,
            useNativeDriver: true,
        }).start();
    }, [isPlaying]);

    // Load liked status when song changes
    useEffect(() => {
        const loadLikedStatus = async () => {
            if (!currentSong) {
                setIsLiked(false);
                return;
            }

            try {
                const likedSongsJson = await AsyncStorage.getItem('liked_songs');
                if (likedSongsJson) {
                    const likedSongs: number[] = JSON.parse(likedSongsJson);
                    setIsLiked(likedSongs.includes(currentSong.id));
                } else {
                    setIsLiked(false);
                }
            } catch (error) {
                console.error('[UnifiedPlayer] Failed to load liked status:', error);
                setIsLiked(false);
            }
        };

        loadLikedStatus();
    }, [currentSong?.id]);

    const toggleLike = async () => {
        if (!currentSong) return;

        try {
            // Load current liked songs
            const likedSongsJson = await AsyncStorage.getItem('liked_songs');
            const likedSongs: number[] = likedSongsJson ? JSON.parse(likedSongsJson) : [];

            if (isLiked) {
                // Unlike - Show confirmation
                Alert.alert(
                    'Bỏ yêu thích',
                    'Bạn có chắc muốn bỏ bài hát này khỏi danh sách yêu thích?',
                    [
                        {
                            text: 'Hủy',
                            style: 'cancel'
                        },
                        {
                            text: 'Bỏ yêu thích',
                            style: 'destructive',
                            onPress: async () => {
                                // Remove from local storage
                                const updatedLiked = likedSongs.filter(id => id !== currentSong.id);
                                await AsyncStorage.setItem('liked_songs', JSON.stringify(updatedLiked));
                                setIsLiked(false);
                                console.log('[UnifiedPlayer] Song unliked (local only):', currentSong.id);
                            }
                        }
                    ]
                );
            } else {
                // Like - Add to favorites playlist
                setIsLiked(true); // Optimistic update

                // Get or create favorites playlist
                const userPlaylists = await PlaylistService.getUserPlaylists();

                console.log('[UnifiedPlayer] User playlists:', userPlaylists.data?.map(p => ({ id: p.id, name: p.name, type: p.playlist_type })));

                // Try to find existing "Yêu thích" playlist by name
                let favoritesPlaylist = userPlaylists.data?.find(p => p.name === 'Yêu thích');

                console.log('[UnifiedPlayer] Found favorites playlist:', favoritesPlaylist ? favoritesPlaylist.id : 'NOT FOUND');

                if (!favoritesPlaylist) {
                    // Create favorites playlist
                    console.log('[UnifiedPlayer] Creating favorites playlist...');

                    const createResult = await PlaylistService.createUserPlaylist({
                        name: 'Yêu thích',
                        playlist_type: 'personal', // Use 'personal' - 'favorite' is not valid
                        is_public: false,
                    });

                    console.log('[UnifiedPlayer] Create result:', createResult);

                    if (createResult.success && createResult.data) {
                        favoritesPlaylist = createResult.data;
                        console.log('[UnifiedPlayer] Favorites playlist created:', favoritesPlaylist.id);
                    } else {
                        console.error('[UnifiedPlayer] Failed to create playlist:', createResult.error);
                        throw new Error(`Failed to create favorites playlist: ${JSON.stringify(createResult.error)}`);
                    }
                }

                // Add song to playlist
                const addResult = await MusicService.addToPlaylist(favoritesPlaylist.id, {
                    song_id: currentSong.id
                });

                if (addResult.success) {
                    // Update local storage
                    const updatedLiked = [...likedSongs, currentSong.id];
                    await AsyncStorage.setItem('liked_songs', JSON.stringify(updatedLiked));
                    console.log('[UnifiedPlayer] Song liked:', currentSong.id);
                } else {
                    // Rollback on failure
                    setIsLiked(false);
                    Alert.alert('Lỗi', 'Không thể thêm bài hát vào danh sách yêu thích');
                }
            }
        } catch (error) {
            console.error('[UnifiedPlayer] Failed to toggle like:', error);
            setIsLiked(!isLiked); // Rollback
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý yêu thích');
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentSong || shouldHidePlayer) {
        return null;
    }

    // Debug logging
    console.log('[UnifiedPlayer] Rendering with song:', currentSong.name, 'color:', dominantColor);

    return (
        <View
            style={styles.container}
            pointerEvents="box-none"
        >
            <StatusBar barStyle={isPlayerExpanded ? "light-content" : "dark-content"} />

            {/* FLIP ORDER: Mini Player must be below Full Player in Z-order conceptually, 
                but Full Player covers it. 
                Full Player needs to be rendered AFTER or use zIndex. 
                Since Full Player slides over, let's put it last.
            */}

            {/* Mini Player View */}
            <Animated.View
                style={[
                    styles.miniPlayerContainer,
                    { opacity: opacityMiniAnim },
                ]}
                pointerEvents={isPlayerExpanded ? 'none' : 'auto'}
            >
                <TouchableOpacity
                    style={[
                        styles.miniPlayerWrapper,
                        {
                            backgroundColor: dominantColor || COLORS.surface,
                        }
                    ]}
                    onPress={expandPlayer}
                    activeOpacity={0.9}
                >
                    <View style={styles.miniPlayerContent}>
                        <Image
                            key={`mini-${currentSong.id}`}
                            source={{ uri: currentSong.avatar_url }}
                            style={styles.miniAlbumArt}
                            resizeMode="cover"
                        />

                        <View style={styles.miniSongInfo}>
                            <Text style={styles.miniSongTitle} numberOfLines={1}>
                                {currentSong.name}
                            </Text>
                            <Text style={styles.miniArtistName} numberOfLines={1}>
                                {currentSong.artists.join(', ')}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                togglePlayPause();
                            }}
                            style={styles.miniControlButton}
                        >
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={28}
                                color={COLORS.text}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Progress bar */}
                    <View style={[
                        styles.miniProgressBar,
                        { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
                    ]} />
                </TouchableOpacity>
            </Animated.View>

            {/* Full Player View */}
            <Animated.View
                style={[
                    styles.fullPlayerContainer,
                    {
                        transform: [{ translateY: slideAnim }]
                    },
                ]}
                pointerEvents={isPlayerExpanded ? 'auto' : 'none'}
            >
                {/* Background Image with Blur */}
                <Image
                    key={`bg-${currentSong?.id}`}
                    source={{ uri: currentSong?.avatar_url }}
                    style={StyleSheet.absoluteFillObject}
                    blurRadius={50}
                />
                <BlurView
                    intensity={50}
                    tint="dark"
                    style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                    key={`gradient-${currentSong.id}-${dominantColor}`}
                    colors={[
                        (dominantColor || COLORS.background) + '40',
                        (dominantColor || COLORS.background) + '80',
                        '#121212'
                    ]}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />

                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={minimizePlayer}
                            style={styles.headerButton}
                        >
                            <Ionicons name="chevron-down" size={28} color={COLORS.text} />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>Now Playing</Text>
                            <Text style={styles.headerSubtitle}>From Playlist</Text>
                        </View>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Album Art */}
                    <View style={styles.albumArtContainer}>
                        <Animated.View
                            style={[
                                styles.albumArtWrapper,
                                {
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <Image
                                key={`art-${currentSong.id}`}
                                source={{ uri: currentSong.avatar_url }}
                                style={styles.albumArt}
                                resizeMode="cover"
                            />
                        </Animated.View>
                    </View>

                    {/* Song Info */}
                    <View style={styles.songInfo}>
                        <View style={styles.songTitleContainer}>
                            <Text style={styles.songTitle} numberOfLines={1}>
                                {currentSong.name}
                            </Text>
                            <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={28}
                                    color={isLiked ? COLORS.primary : COLORS.text}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.artistName} numberOfLines={1}>
                            {currentSong.artists.join(', ')}
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <Slider
                            style={styles.progressBar}
                            minimumValue={0}
                            maximumValue={Math.max(duration, 1)} // Avoid division by zero
                            value={isSeeking ? seekValue : currentTime}
                            minimumTrackTintColor={COLORS.primary}
                            maximumTrackTintColor={COLORS.surface}
                            thumbTintColor={COLORS.primary}
                            onSlidingStart={() => {
                                setIsSeeking(true);
                                setSeekValue(currentTime);
                            }}
                            onValueChange={(value) => {
                                setSeekValue(value);
                            }}
                            onSlidingComplete={async (value) => {
                                try {
                                    await seekTo(value);
                                } catch (error) {
                                    console.error('Seek failed:', error);
                                } finally {
                                    setIsSeeking(false);
                                }
                            }}
                        />
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>{formatTime(isSeeking ? seekValue : currentTime)}</Text>
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>
                    </View>

                    {/* Volume Control */}
                    <View style={styles.volumeContainer}>
                        <TouchableOpacity onPress={toggleMute} style={styles.volumeButton}>
                            <Ionicons
                                name={isMuted ? 'volume-mute' : volume > 0.5 ? 'volume-high' : volume > 0 ? 'volume-medium' : 'volume-mute'}
                                size={24}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>

                        <Slider
                            style={styles.volumeSlider}
                            minimumValue={0}
                            maximumValue={1}
                            value={isMuted ? 0 : volume}
                            minimumTrackTintColor={COLORS.primary}
                            maximumTrackTintColor={COLORS.surface}
                            thumbTintColor={COLORS.primary}
                            onValueChange={(value) => {
                                if (isMuted && value > 0) {
                                    toggleMute(); // Unmute if user moves slider
                                }
                                changeVolume(value);
                            }}
                        />

                        <Text style={styles.volumeText}>{Math.round((isMuted ? 0 : volume) * 100)}%</Text>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        <View style={styles.allControls}>
                            <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
                                <Ionicons
                                    name="shuffle"
                                    size={40}
                                    color={isShuffle ? COLORS.primary : COLORS.textSecondary}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={skipPrevious}
                                style={styles.controlButton}
                                disabled={isLoading}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="play-skip-back" size={46} color={COLORS.text} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={togglePlayPause}
                                style={styles.playButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="large" color={COLORS.text} />
                                ) : (
                                    <Ionicons
                                        name={isPlaying ? 'pause' : 'play'}
                                        size={50}
                                        color={COLORS.text}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={skipNext}
                                style={styles.controlButton}
                                disabled={isLoading}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="play-skip-forward" size={46} color={COLORS.text} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleRepeat} style={styles.controlButton}>
                                <Ionicons
                                    name="repeat"
                                    size={40}
                                    color={
                                        repeatMode !== 'off' ? COLORS.primary : COLORS.textSecondary
                                    }
                                />
                                {repeatMode === 'one' && (
                                    <View style={styles.repeatOneBadge}>
                                        <Text style={styles.repeatOneText}>1</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Cover entire screen
        zIndex: 150,
        elevation: 10,
    },

    // Full Player Styles
    fullPlayerContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.background, // Ensure logic background
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 14,
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    albumArtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    albumArtWrapper: {
        width: ALBUM_ART_SIZE,
        height: ALBUM_ART_SIZE,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    albumArt: {
        width: '100%',
        height: '100%',
    },
    songInfo: {
        marginBottom: 32,
    },
    songTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    songTitle: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 24,
        color: COLORS.text,
        flex: 1,
        marginRight: 12,
    },
    likeButton: {
        padding: 4,
    },
    artistName: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    progressContainer: {
        marginBottom: 32,
    },
    progressBar: {
        width: '100%',
        height: 40,
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    controlsContainer: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    allControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    controlButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },

    miniPlayerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    miniPlayerWrapper: {
        flex: 1, // Fill the container
        marginHorizontal: 12,
        marginBottom: 16, // Spacing above bottom bar/screen edge
        borderRadius: 12,
        padding: 8,
        paddingBottom: 0,
        overflow: 'hidden',
    },
    miniPlayerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    miniAlbumArt: {
        width: 38,
        height: 38,
        borderRadius: 4,
        backgroundColor: '#555',
    },
    miniSongInfo: {
        flex: 1,
        marginLeft: 10,
    },
    miniSongTitle: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 13,
        color: '#FFF',
    },
    miniArtistName: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
        color: '#BBB',
    },
    miniControlButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniProgressBar: {
        height: 2,
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        marginBottom: 0,
    },
    repeatOneBadge: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.background,
        // Adjusted position to not cover the icon
        top: 18,
        right: 16,
    },
    repeatOneText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    volumeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    volumeSlider: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    },
    volumeText: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
        color: COLORS.textSecondary,
        width: 40,
        textAlign: 'right',
    },
});

export default UnifiedPlayer;
