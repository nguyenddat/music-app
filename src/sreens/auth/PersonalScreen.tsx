import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import MusicService, { MusicResponse } from '../../services/MusicService';
import PlaylistService, { PlayListResponse } from '../../services/PlaylistService';
import { useNavigation } from '@react-navigation/native';

const PersonalScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [songHistory, setSongHistory] = useState<MusicResponse[]>([]);
    const [playlistHistory, setPlaylistHistory] = useState<PlayListResponse[]>([]);
    const [albumHistory, setAlbumHistory] = useState<PlayListResponse[]>([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const [songsRes, playlistsRes] = await Promise.all([
                MusicService.getHistory(),
                PlaylistService.getHistoryPlaylists()
            ]);

            if (songsRes.success && songsRes.data) {
                setSongHistory(songsRes.data);
            }

            if (playlistsRes.success && playlistsRes.data) {
                const allPlaylists = playlistsRes.data;
                const playlists = allPlaylists.filter(p => p.playlist_type === 'Playlist' || p.playlist_type === 'playlist');
                const albums = allPlaylists.filter(p => p.playlist_type === 'Album' || p.playlist_type === 'album');

                setPlaylistHistory(playlists);
                setAlbumHistory(albums);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSongPress = (song: MusicResponse) => {
        console.log('Play song:', song.name);
    };

    const handlePlaylistPress = (item: PlayListResponse, isAlbum: boolean) => {
        navigation.navigate('Playlist', {
            playlistTitle: item.name,
            playlistCover: item.avatar_url,
            playlistId: item.id,
            description: '',
            dominantColor: '#121212',
            songs: []
        });
        fetchAndNavigateToPlaylist(item);
    };

    const fetchAndNavigateToPlaylist = async (item: PlayListResponse) => {
        try {
            const musicResponse = await MusicService.getMusicByPlaylistId(item.id);
            if (musicResponse.success) {
                const mappedSongs = musicResponse.data.map((m: MusicResponse) => ({
                    id: m.id.toString(),
                    title: m.name,
                    artist: m.artists && m.artists.length > 0 ? m.artists.join(', ') : 'Unknown Artist',
                    cover: m.avatar_url || 'https://via.placeholder.com/150',
                    duration: m.duration,
                    isLiked: false
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: item.name,
                    playlistCover: item.avatar_url,
                    songs: mappedSongs,
                    description: '',
                    dominantColor: '#121212'
                });
            }
        } catch (e) {
            console.error(e);
        }
    }


    const renderCodeItem = (item: any, type: 'song' | 'playlist' | 'album') => {
        let title = item.name;
        let subtitle = type === 'song' && item.artists ? item.artists.join(', ') : '';
        let image = item.avatar_url;

        if (!image) image = 'https://via.placeholder.com/150';

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.itemContainer}
                onPress={() => {
                    if (type === 'song') handleSongPress(item);
                    else handlePlaylistPress(item, type === 'album');
                }}
            >
                <Image source={{ uri: image }} style={styles.itemImage} />
                <Text style={styles.itemTitle} numberOfLines={1}>{title}</Text>
                {subtitle ? <Text style={styles.itemSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
            </TouchableOpacity>
        );
    };

    const renderSection = (title: string, data: any[], type: 'song' | 'playlist' | 'album') => {
        if (!data || data.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {data.map(item => renderCodeItem(item, type))}
                </ScrollView>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cá nhân</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {renderSection('Lịch sử nghe bài hát', songHistory, 'song')}
                {renderSection('Playlist đã nghe', playlistHistory, 'playlist')}
                {renderSection('Album đã nghe', albumHistory, 'album')}

                {songHistory.length === 0 && playlistHistory.length === 0 && albumHistory.length === 0 && (
                    <Text style={styles.emptyText}>Chưa có lịch sử nghe nhạc</Text>
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 24, // Slightly smaller to fit with back button
        paddingHorizontal: 0,
        marginLeft: 10,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 20,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        marginRight: 16,
        width: 120,
    },
    itemImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: COLORS.glassBg,
    },
    itemTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        marginBottom: 4,
    },
    itemSubtitle: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    }
});

export default PersonalScreen;
