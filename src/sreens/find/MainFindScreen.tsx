import React, { useState, useEffect } from 'react';
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
import { FONTS } from '../../constants/typography';
import SearchResultItem from '../../components/SearchResultItem';
import ArtistService, { ArtistResponse } from '../../services/ArtistService';
import PlaylistService, { PlayListResponse } from '../../services/PlaylistService';
import MusicService, { MusicResponse } from '../../services/MusicService';
import UserService, { SearchHistoryResponse } from '../../services/UserService';

import { useLanguage, TranslationKey } from '../../contexts/LanguageContext';

interface MainFindScreenProps {
    navigation: any;
}

interface UnifiedSearchResult {
    id: string;
    title: string;
    type: 'Artist' | 'Album' | 'Playlist';
    subtitle?: string;
    avatar: string;
    originalData: ArtistResponse | PlayListResponse;
}

const MainFindScreen: React.FC<MainFindScreenProps> = ({ navigation }) => {
    const { t } = useLanguage();
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    // We'll translate filters in display, or keep ID internal
    const filterKeys: TranslationKey[] = ['all', 'artists', 'songs', 'albums', 'playlists'];
    const [allResults, setAllResults] = useState<UnifiedSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState<SearchHistoryResponse[]>([]);

    useEffect(() => {
        fetchSearchHistory();
    }, []);

    const fetchSearchHistory = async () => {
        const response = await UserService.getSearchHistory();
        if (response.success && response.data) {
            setSearchHistory(response.data);
        }
    };

    const addToHistory = async (query: string) => {
        const response = await UserService.addSearchHistory({ query });
        if (response.success) {
            fetchSearchHistory();
        }
    };



    // Debounced search
    useEffect(() => {
        if (!searchText.trim()) {
            setAllResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const [artistsResult, albumsResult, playlistsResult] = await Promise.all([
                    ArtistService.getArtistsByName(searchText),
                    PlaylistService.getPlaylistsByName(searchText, 'album'),
                    PlaylistService.getPlaylistsByName(searchText, 'playlist')
                ]);

                const artists: UnifiedSearchResult[] = artistsResult.success && artistsResult.data
                    ? artistsResult.data.slice(0, 2).map(artist => ({
                        id: `artist-${artist.id}`,
                        title: artist.name,
                        type: 'Artist' as const,
                        avatar: artist.avatar_url,
                        originalData: artist
                    }))
                    : [];

                const albums: UnifiedSearchResult[] = albumsResult.success
                    ? albumsResult.data.slice(0, 3).map(album => ({
                        id: `album-${album.id}`,
                        title: album.name,
                        type: 'Album' as const,
                        avatar: album.avatar_url || 'https://via.placeholder.com/150',
                        originalData: album
                    }))
                    : [];

                const playlists: UnifiedSearchResult[] = playlistsResult.success
                    ? playlistsResult.data.slice(0, 3).map(playlist => ({
                        id: `playlist-${playlist.id}`,
                        title: playlist.name,
                        type: 'Playlist' as const,
                        avatar: playlist.avatar_url || 'https://via.placeholder.com/150',
                        originalData: playlist
                    }))
                    : [];

                // Combine all results in order: Artists → Albums → Playlists
                const combined = [...artists, ...albums, ...playlists];
                setAllResults(combined);


            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleResultPress = async (result: UnifiedSearchResult) => {
        if (result.type === 'Artist') {
            addToHistory(result.title);
            navigation.navigate('ArtistDetail', {
                artist: result.originalData,
                dominantColor: '#5e35b1' // You could generate a random color or pick based on avatar
            });
            return;
        }

        if (loading) return; // Prevent multiple taps

        setLoading(true);
        console.log('Fetching songs for playlist:', result.originalData.id);
        try {
            const musicResponse = await MusicService.getMusicByPlaylistId(Number(result.originalData.id));

            // Log history
            if (result.type === 'Album' || result.type === 'Playlist') {
                PlaylistService.createHistoryPlaylist({ playlist_id: Number(result.originalData.id) }).catch(console.error);
            }

            if (musicResponse.success) {
                const mappedSongs = musicResponse.data.map((m: MusicResponse) => ({
                    id: m.id,
                    title: m.name,
                    artist: m.artists && m.artists.length > 0 ? m.artists.join(', ') : 'Unknown Artist',
                    cover: m.avatar_url || 'https://via.placeholder.com/150',
                    duration: m.duration,
                    isLiked: false // Default
                }));

                console.log('Navigating to Playlist with', mappedSongs.length, 'songs');
                navigation.navigate('Playlist', {
                    playlistId: result.originalData.id,
                    playlistTitle: result.title,
                    playlistCover: result.avatar,
                    songs: mappedSongs,
                    description: result.subtitle || 'No description',
                    dominantColor: '#121212' // Or calculate/pass color
                });
                addToHistory(result.title);
            } else {
                console.error('Failed to fetch songs:', musicResponse.error);
            }

        } catch (error) {
            console.error('Error handling result press:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = allResults.filter(item => {
        if (activeFilter === 'all') return true; // Keep internal state as keys or english?
        // Wait, activeFilter state is set to filterKey (TranslationKey)
        // So we need to match it.
        if (activeFilter === 'all') return true;
        if (activeFilter === 'artists') return item.type === 'Artist';
        if (activeFilter === 'albums') return item.type === 'Album';
        if (activeFilter === 'playlists') return item.type === 'Playlist';
        return true;
    });

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* 1. Search Bar */}
            <View style={styles.searchHeader}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder={t('whatToListen')}
                        placeholderTextColor="#a7a7a7"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={() => {
                            if (searchText.trim()) {
                                addToHistory(searchText.trim());
                            }
                        }}
                    />
                </View>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>{t('cancel')}</Text>
                </TouchableOpacity>
            </View>

            {/* 2. Chips Filter - Chỉ hiện khi có text search */}
            {searchText.length > 0 && (
                <View style={styles.chipsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {filterKeys.map(filterKey => (
                            <TouchableOpacity
                                key={filterKey}
                                onPress={() => setActiveFilter(filterKey)}
                                style={[styles.chip, activeFilter === filterKey && styles.activeChip]}
                            >
                                <Text style={[styles.chipText, activeFilter === filterKey && styles.activeChipText]}>
                                    {t(filterKey)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {!searchText.trim() ? (
                    <>
                        <Text style={styles.sectionTitle}>{t('recentSearches')}</Text>
                        <View style={styles.quickRecommendations}>
                            {searchHistory.length > 0 ? (
                                searchHistory.map((history) => (
                                    <TouchableOpacity
                                        key={history.id}
                                        style={styles.quickChip}
                                        onPress={() => setSearchText(history.query)}
                                    >
                                        <Text style={styles.quickChipText}>{history.query}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>{t('noSearchHistory')}</Text>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        {loading ? (
                            <ActivityIndicator style={{ marginTop: 50 }} color={COLORS.primary} />
                        ) : (
                            filteredResults.map((result) => (
                                <SearchResultItem
                                    key={result.id}
                                    item={result}
                                    onPress={() => handleResultPress(result)}
                                />
                            ))
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
    sectionTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 18,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    quickRecommendations: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    quickSuggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 12,
    },
    quickChip: {
        backgroundColor: COLORS.glassBg,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    quickChipText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    chipsContainer: {
        paddingVertical: 12,
    },
    chip: {
        backgroundColor: COLORS.glassBg,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    activeChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
    },
    activeChipText: {
        color: '#000',
    },
});

export default MainFindScreen;