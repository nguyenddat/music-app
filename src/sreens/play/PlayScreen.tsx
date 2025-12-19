import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

const { width } = Dimensions.get('window');
const ALBUM_ART_SIZE = width * 0.8;

const PlayScreen = ({ navigation, route }: any) => {
    const { song, playlist = [], dominantColor = COLORS.accent } = route.params || {};
    const {
        currentSong,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        isShuffle,
        repeatMode,
        playSong,
        togglePlayPause,
        skipNext,
        skipPrevious,
        toggleShuffle,
        toggleRepeat,
        seekTo,
    } = useMusicPlayer();

    const [isLiked, setIsLiked] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Initialize playback when screen opens
    useEffect(() => {
        if (song && (!currentSong || currentSong.id !== song.id)) {
            const songIndex = playlist.findIndex((s: any) => s.id === song.id);
            playSong(song, playlist, songIndex >= 0 ? songIndex : 0, dominantColor);
        }
    }, [song?.id]);


    // Animate album art based on playback state
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

    const handleMinimize = () => {
        // Go back to previous screen and show mini player
        navigation.goBack();
    };

    if (!currentSong) {
        return null;
    }


    return (
        <LinearGradient
            colors={[dominantColor, COLORS.background, COLORS.black]}
            locations={[0, 0.5, 1]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleMinimize}
                        style={styles.headerButton}
                    >
                        <Ionicons name="chevron-down" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Now Playing</Text>
                        <Text style={styles.headerSubtitle}>
                            {playlist.length > 0 ? `From Playlist` : 'Single Track'}
                        </Text>
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
                            await useMusicPlayer().seekTo(value);
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
                    {/* All Controls in One Row */}
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default PlayScreen;