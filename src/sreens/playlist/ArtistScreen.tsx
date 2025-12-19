import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import MusicService, { MusicResponse } from '../../services/MusicService';
import PlaylistService, { PlayListResponse } from '../../services/PlaylistService';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const ArtistScreen = () => {
    const { t } = useLanguage();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { artist, dominantColor = '#5e35b1' } = route.params || {};

    // State
    const [popularSongs, setPopularSongs] = useState<MusicResponse[]>([]);
    const [albums, setAlbums] = useState<PlayListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const { playSong, expandPlayer } = useMusicPlayer();

    // Animation Shared Value
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const heroStyle = useAnimatedStyle(() => {
        const height = interpolate(scrollY.value, [-100, 0], [width * 1.1 + 100, width * 1.1], Extrapolate.CLAMP);
        const top = interpolate(scrollY.value, [0, 100], [0, -50], Extrapolate.CLAMP);

        return {
            height: height,
            top: top,
        };
    });

    const heroImageStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, width * 0.8], [1, 0], Extrapolate.CLAMP);
        const scale = interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolate.CLAMP);

        return {
            opacity: opacity,
            transform: [{ scale: scale }]
        };
    });

    useEffect(() => {
        if (artist?.id) {
            fetchArtistData();
        }
    }, [artist]);

    const fetchArtistData = async () => {
        setIsLoading(true);
        try {
            const [songsResponse, albumsResponse] = await Promise.all([
                MusicService.getMusicByArtistId(artist.id),
                PlaylistService.getPlaylistsByArtistId(artist.id)
            ]);

            if (songsResponse.success && songsResponse.data) {
                setPopularSongs(songsResponse.data);
            }

            if (albumsResponse.success && albumsResponse.data) {
                setAlbums(albumsResponse.data);
            }
        } catch (error) {
            console.error("Error fetching artist data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSongPress = (song: MusicResponse, index: number) => {
        const contextSong = {
            id: song.id,
            name: song.name,
            artists: song.artists || [artist?.name || t('unknownArtist')],
            avatar_url: song.avatar_url,
            duration: song.duration
        };

        const playlist = popularSongs.map(s => ({
            id: s.id,
            name: s.name,
            artists: s.artists || [artist?.name || t('unknownArtist')],
            avatar_url: s.avatar_url,
            duration: s.duration
        }));

        playSong(contextSong, playlist, index, dominantColor);
        expandPlayer();
    };

    const renderSongItem = ({ item, index }: { item: MusicResponse, index: number }) => (
        <TouchableOpacity
            style={styles.songRow}
            onPress={() => handleSongPress(item, index)}
            activeOpacity={0.7}
        >
            <Text style={styles.indexText}>{index + 1}</Text>
            <Image source={{ uri: item.avatar_url }} style={styles.songCover} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.songListeners}>{t('millionPlays').replace('{{count}}', (Math.random() * 5 + 1).toFixed(1))}</Text>
            </View>
            <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const navigateToAlbum = async (album: PlayListResponse) => {
        setIsLoading(true);
        const musicResponse = await MusicService.getMusicByPlaylistId(album.id);
        setIsLoading(false);

        if (musicResponse.success) {
            const mappedSongs = musicResponse.data.map((m: MusicResponse) => ({
                id: m.id.toString(),
                title: m.name,
                artist: m.artists && m.artists.length > 0 ? m.artists.join(', ') : t('unknownArtist'),
                cover: m.avatar_url || 'https://via.placeholder.com/150',
                duration: m.duration,
                isLiked: false
            }));

            navigation.navigate('Playlist', {
                playlistId: album.id,
                playlistTitle: album.name,
                playlistCover: album.avatar_url,
                songs: mappedSongs,
                description: t('albumBy').replace('{{artist}}', artist.name),
                dominantColor: dominantColor
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Hero Image Background */}
            <Animated.View style={[styles.heroContainer, heroStyle]}>
                <Animated.Image
                    source={{ uri: artist?.avatar_url || 'https://via.placeholder.com/500' }}
                    style={[styles.heroImage, heroImageStyle]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#000000']}
                    style={styles.heroGradient}
                    start={{ x: 0.5, y: 0.3 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            <SafeAreaView edges={['top']} style={styles.backButtonContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                {/* Spacer for Hero Image */}
                <View style={{ height: width * 0.8 }} />

                {/* Artist Info */}
                <View style={styles.artistInfoContainer}>
                    <Text style={styles.artistName}>{artist?.name || t('unknownArtist')}</Text>
                    <Text style={styles.monthlyListeners}>
                        {t('monthlyListeners').replace('{{count}}', (Math.random() * 10 + 2).toFixed(1))}
                    </Text>
                </View>

                {/* Sticky Actions */}
                <View style={styles.actionsContainer}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity
                            style={styles.followButton}
                            onPress={() => setIsThinking(!isThinking)}
                        >
                            <Text style={styles.followText}>{isThinking ? t('following') : t('follow')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                        <Ionicons name="play" size={28} color="#000" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>

                {/* Popular Songs Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('popular')}</Text>
                    <FlatList
                        data={popularSongs}
                        renderItem={renderSongItem}
                        keyExtractor={item => item.id.toString()}
                        scrollEnabled={false}
                    />
                </View>

                {/* Albums Section (Mock) */}
                {albums.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('albums')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                            {albums.map((album, i) => (
                                <TouchableOpacity
                                    key={album.id}
                                    style={styles.albumCard}
                                    onPress={() => navigateToAlbum(album)}
                                >
                                    <Image
                                        source={{ uri: album.avatar_url || `https://source.unsplash.com/random/300x300?music,album,${i}` }}
                                        style={styles.albumCover}
                                    />
                                    <Text style={styles.albumTitle} numberOfLines={1}>{album.name}</Text>
                                    <Text style={styles.albumYear}>{new Date(album.created_at).getFullYear()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about')}</Text>
                    <View style={styles.aboutCard}>
                        <Image
                            source={{ uri: artist?.avatar_url || 'https://via.placeholder.com/500' }}
                            style={styles.aboutImage}
                        />
                        <View style={styles.aboutOverlay}>
                            <Text style={styles.aboutText} numberOfLines={3}>
                                {artist?.name} is a global superstar known for their unique sound and chart-topping hits.
                                Exploring genres and breaking boundaries.
                            </Text>
                        </View>
                    </View>
                </View>

            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
        padding: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: width * 1.1,
        zIndex: 0,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    artistInfoContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
    artistName: {
        fontSize: 48,
        fontFamily: FONTS.GilroyBold,
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -1,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    monthlyListeners: {
        fontSize: 14,
        fontFamily: FONTS.GilroyMedium,
        color: '#E0E0E0',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    followButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFF',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    followText: {
        color: '#FFF',
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 14,
    },
    iconBtn: {
        padding: 8,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: FONTS.GilroyBold,
        color: '#FFF',
        marginBottom: 16,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    indexText: {
        color: COLORS.textSecondary,
        width: 24,
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
    },
    songCover: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 14,
    },
    songInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    songTitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
        color: '#FFF',
        marginBottom: 4,
    },
    songListeners: {
        fontSize: 13,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    albumCard: {
        marginRight: 16,
        width: 150,
    },
    albumCover: {
        width: 150,
        height: 150,
        borderRadius: 12,
        marginBottom: 10,
    },
    albumTitle: {
        fontSize: 15,
        fontFamily: FONTS.GilroySemiBold,
        color: '#FFF',
        marginBottom: 4,
    },
    albumYear: {
        fontSize: 13,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    aboutCard: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 40,
    },
    aboutImage: {
        width: '100%',
        height: '100%',
    },
    aboutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
        justifyContent: 'flex-end',
    },
    aboutText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
        lineHeight: 24,
    },
});

export default ArtistScreen;
