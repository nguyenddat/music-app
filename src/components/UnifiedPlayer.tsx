import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import MusicService from '../services/MusicService';

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
        togglePlayPause,
        skipNext,
        skipPrevious,
        toggleShuffle,
        toggleRepeat,
        minimizePlayer,
        expandPlayer,
        seekTo,
    } = useMusicPlayer();

    const [isLiked, setIsLiked] = React.useState(false);
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

    useEffect(() => {
        if (currentSong?.id) {
            MusicService.createHistory({ song_id: currentSong.id })
                .then((res) => {
                    if (res.success) {
                        console.log('Logged history for song:', currentSong.id);
                    }
                })
                .catch(console.error);
        }
    }, [currentSong?.id]);

    useEffect(() => {
        if (currentSong?.id) {
            MusicService.createHistory({ song_id: currentSong.id })
                .then((res) => {
                    if (res.success) {
                        console.log('Logged history for song:', currentSong.id);
                    }
                })
                .catch(console.error);
        }
    }, [currentSong?.id]);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isPlaying ? 1 : 0.98,
            useNativeDriver: true,
        }).start();
    }, [isPlaying]);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentSong || shouldHidePlayer) {
        return null;
    }

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
                            backgroundColor: dominantColor,
                        }
                    ]}
                    onPress={expandPlayer}
                    activeOpacity={0.9}
                >
                    <View style={styles.miniPlayerContent}>
                        <Image
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
                        { width: `${(currentTime / duration) * 100}%` }
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
                <LinearGradient
                    colors={[dominantColor, COLORS.background, COLORS.black]}
                    locations={[0, 0.5, 1]}
                    style={StyleSheet.absoluteFillObject}
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
                            maximumValue={duration}
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
                                await seekTo(value);
                                setIsSeeking(false);
                            }}
                        />
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        <View style={styles.allControls}>
                            <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
                                <Ionicons
                                    name="shuffle"
                                    size={26}
                                    color={isShuffle ? COLORS.primary : COLORS.textSecondary}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={skipPrevious}
                                style={styles.controlButton}
                            >
                                <Ionicons name="play-skip-back" size={32} color={COLORS.text} />
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
                                        size={36}
                                        color={COLORS.text}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={skipNext}
                                style={styles.controlButton}
                            >
                                <Ionicons name="play-skip-forward" size={32} color={COLORS.text} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleRepeat} style={styles.controlButton}>
                                <Ionicons
                                    name={
                                        repeatMode === 'one'
                                            ? 'repeat-outline'
                                            : 'repeat'
                                    }
                                    size={26}
                                    color={
                                        repeatMode !== 'off' ? COLORS.primary : COLORS.textSecondary
                                    }
                                />
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
});

export default UnifiedPlayer;
