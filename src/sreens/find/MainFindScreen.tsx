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
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Artists', 'Songs', 'Albums', 'Playlists'];
    const [allResults, setAllResults] = useState<UnifiedSearchResult[]>([]);
    const [loading, setLoading] = useState(false);



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

    const handleResultPress = (result: UnifiedSearchResult) => {
        // TODO: Navigate to appropriate detail screen based on type
        console.log('Result pressed:', result);
    };

    const filteredResults = allResults.filter(item => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Artists') return item.type === 'Artist';
        if (activeFilter === 'Albums') return item.type === 'Album';
        if (activeFilter === 'Playlists') return item.type === 'Playlist';
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
                        placeholder="Bạn muốn nghe gì?"
                        placeholderTextColor="#a7a7a7"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
            </View>

            {/* 2. Chips Filter - Chỉ hiện khi có text search */}
            {searchText.length > 0 && (
                <View style={styles.chipsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {filters.map(filter => (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[styles.chip, activeFilter === filter && styles.activeChip]}
                            >
                                <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {!searchText.trim() ? (
                    <>
                        <Text style={styles.sectionTitle}>Nội dung tìm kiếm gần đây</Text>
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