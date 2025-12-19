import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS, TYPOGRAPHY } from '../../constants/typography';
import AlbumSection, { AlbumItem } from '../../components/AlbumSection';
import PlaylistSection, { PlaylistItem } from '../../components/PlaylistSection';
import ArtistSection, { ArtistItem } from '../../components/ArtistSection';
import PlaylistService, { PlayListResponse, PlaylistHistoryItem } from '../../services/PlaylistService';
import ArtistService, { ArtistResponse } from '../../services/ArtistService';
import MusicService, { MusicResponse } from '../../services/MusicService';

import { useLanguage } from '../../contexts/LanguageContext';

interface FindScreenProps {
    navigation: any;
}

const FindScreen: React.FC<FindScreenProps> = ({ navigation }) => {
    const { t } = useLanguage();
    const [searchText, setSearchText] = useState('');
    const [recommendedAlbums, setRecommendedAlbums] = useState<PlayListResponse[]>([]);
    const [recommendedPlaylists, setRecommendedPlaylists] = useState<PlayListResponse[]>([]);
    const [historyPlaylists, setHistoryPlaylists] = useState<PlaylistHistoryItem[]>([]);
    const [recommendedArtists, setRecommendedArtists] = useState<ArtistResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchPlaylists = async () => {
                setLoading(true);
                try {
                    const [albumsResult, playlistsResult, historyResult, artistsResult] = await Promise.all([
                        PlaylistService.getRecommendedPlaylists('album'),
                        PlaylistService.getRecommendedPlaylists('playlist'),
                        PlaylistService.getHistoryPlaylists(),
                        ArtistService.getRecommendedArtists()
                    ]);

                    if (albumsResult.success) {
                        setRecommendedAlbums(albumsResult.data);
                    }

                    if (playlistsResult.success) {
                        setRecommendedPlaylists(playlistsResult.data);
                    }

                    if (historyResult.success) {
                        setHistoryPlaylists(historyResult.data);
                    }

                    if (artistsResult.success && artistsResult.data) {
                        setRecommendedArtists(artistsResult.data);
                    }
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPlaylists();
        }, [])
    );

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleClear = () => {
        setSearchText('');
    };

    // Convert PlayListResponse to AlbumItem
    const convertToAlbumItems = (playlists: PlayListResponse[]): AlbumItem[] => {
        return playlists.map(playlist => ({
            id: playlist.id.toString(),
            title: playlist.name,
            image: playlist.avatar_url || 'https://via.placeholder.com/150'
        }));
    };

    // Convert PlayListResponse to PlaylistItem
    const convertToPlaylistItems = (playlists: PlayListResponse[]): PlaylistItem[] => {
        return playlists.map(playlist => ({
            id: playlist.id.toString(),
            title: playlist.name,
            image: playlist.avatar_url || 'https://via.placeholder.com/150'
        }));
    };

    const convertHistoryToPlaylistItems = (historyItems: PlaylistHistoryItem[]): PlaylistItem[] => {
        return historyItems.map(item => ({
            id: item.playlist.id.toString(),
            title: item.playlist.name,
            image: item.playlist.avatar_url || 'https://via.placeholder.com/150'
        }));
    };

    // Convert ArtistResponse to ArtistItem
    const convertToArtistItems = (artists: ArtistResponse[]): ArtistItem[] => {
        return artists.map(artist => ({
            id: artist.id.toString(),
            name: artist.name,
            avatar_url: artist.avatar_url
        }));
    };

    const handlePlaylistPress = async (item: AlbumItem | PlaylistItem) => {
        try {
            const playlistId = parseInt(item.id);
            const result = await MusicService.getMusicByPlaylistId(playlistId);

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Unknown Artist',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistId: playlistId,
                    playlistTitle: item.title,
                    playlistCover: item.image,
                    description: `${songs.length} songs`,
                    songs: songs,
                    dominantColor: '#2a4f38', // Default color
                });
            } else {
                console.error('Failed to fetch playlist songs:', result.error);
            }
        } catch (error) {
            console.error('Error navigating to playlist:', error);
        }
    };

    const handleArtistPress = (artist: ArtistItem) => {
        // TODO: Navigate to artist detail screen
        console.log('Artist pressed:', artist);
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Search Bar Section */}
            <View style={styles.searchHeader}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('whatToListen')}
                        placeholderTextColor={COLORS.textSecondary}
                        selectionColor={COLORS.primary}
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={() => navigation.navigate('MainFind')}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>{t('cancel')}</Text>
                </TouchableOpacity>
            </View>



            {/* Results Section */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {searchText ? (
                    <Text style={styles.placeholderText}>
                        {`${t('resultsFor')} "${searchText}"`}
                    </Text>
                ) : (
                    <>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        ) : (
                            <>
                                {/* Có thể hợp với bạn Section - Albums */}
                                {recommendedAlbums.length > 0 && (
                                    <AlbumSection
                                        title={t('mightSuitYou')}
                                        albums={convertToAlbumItems(recommendedAlbums.slice(0, 8))}
                                        onPressAlbum={handlePlaylistPress}
                                    />
                                )}

                                {/* Bạn nên thử các playlists sau Section */}
                                {recommendedPlaylists.length > 0 && (
                                    <PlaylistSection
                                        title={t('tryThesePlaylists')}
                                        playlists={convertToPlaylistItems(recommendedPlaylists.slice(0, 4))}
                                        onPressPlaylist={handlePlaylistPress}
                                    />
                                )}

                                {/* Tiếp tục nghe Section */}
                                {historyPlaylists.length > 0 && (
                                    <PlaylistSection
                                        title={t('continueListening')}
                                        playlists={convertHistoryToPlaylistItems(historyPlaylists)}
                                        onPressPlaylist={handlePlaylistPress}
                                    />
                                )}

                                {/* Các nghệ sĩ bạn có thể thích Section */}
                                {recommendedArtists.length > 0 && (
                                    <ArtistSection
                                        title={t('artistsYouMightLike')}
                                        artists={convertToArtistItems(recommendedArtists.slice(0, 4))}
                                        onPressArtist={handleArtistPress}
                                    />
                                )}

                                {/* Empty state when no data */}
                                {recommendedAlbums.length === 0 && recommendedPlaylists.length === 0 && historyPlaylists.length === 0 && recommendedArtists.length === 0 && (
                                    <Text style={styles.placeholderText}>
                                        {t('typeToSearch')}
                                    </Text>
                                )}
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
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
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.glassBg,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        marginRight: 12,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        gap: 8,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 15,
        letterSpacing: 0.2,
    },
    cancelText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 15,
    },

    content: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    placeholderText: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 40,
        paddingTop: 100,
    }
});

export default FindScreen;