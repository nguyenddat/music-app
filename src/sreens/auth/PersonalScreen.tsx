
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import MusicService, { MusicResponse, MusicHistoryItem } from '../../services/MusicService';
import PlaylistService, { PlayListResponse, PlaylistHistoryItem } from '../../services/PlaylistService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UserService, { MeResponse } from '../../services/UserService';
import AlbumSection, { AlbumItem } from '../../components/AlbumSection';
import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';


const PersonalScreen = () => {
    const navigation = useNavigation<any>();
    const { t } = useLanguage();
    const { playSong } = useMusicPlayer();
    const [loading, setLoading] = useState(true);
    const [songHistory, setSongHistory] = useState<MusicHistoryItem[]>([]);
    const [playlistHistory, setPlaylistHistory] = useState<PlaylistHistoryItem[]>([]);
    const [albumHistory, setAlbumHistory] = useState<PlaylistHistoryItem[]>([]);

    // New state for liked and user playlists
    const [likedPlaylists, setLikedPlaylists] = useState<AlbumItem[]>([]);
    const [userPlaylists, setUserPlaylists] = useState<AlbumItem[]>([]);
    const [userId, setUserId] = useState<number | null>(null);


    useFocusEffect(
        React.useCallback(() => {
            fetchHistory();
        }, [])
    );

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const [songsRes, playlistsRes, userResInfo] = await Promise.all([
                MusicService.getHistory(),
                PlaylistService.getHistoryPlaylists(),
                UserService.me()
            ]);

            if (userResInfo.success && userResInfo.data) {
                setUserId(userResInfo.data.id);
            }

            if (songsRes.success && songsRes.data) {
                setSongHistory(songsRes.data);
            }

            if (playlistsRes.success && playlistsRes.data) {
                const allPlaylists = playlistsRes.data;
                const playlists = allPlaylists.filter(p => p.playlist.playlist_type === 'Playlist' || p.playlist.playlist_type === 'playlist');
                const albums = allPlaylists.filter(p => p.playlist.playlist_type === 'Album' || p.playlist.playlist_type === 'album');

                setPlaylistHistory(playlists);
                setAlbumHistory(albums);
            }

            // Fetch Liked Playlists
            const likedRes = await PlaylistService.getLikedPlaylists();
            if (likedRes.success && likedRes.data) {
                const mappedLiked = likedRes.data.map(p => ({
                    id: p.playlist.id,
                    title: p.playlist.name,
                    image: p.playlist.avatar_url || 'https://via.placeholder.com/150'
                }));
                setLikedPlaylists(mappedLiked);
            }

            // Fetch User Playlists
            const userRes = await PlaylistService.getUserPlaylists();
            if (userRes.success && userRes.data) {
                const mappedUser = userRes.data.map(p => ({
                    id: p.id,
                    title: p.name,
                    image: p.avatar_url || 'https://via.placeholder.com/150'
                }));
                setUserPlaylists(mappedUser);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleSongPress = (rawSong: MusicResponse) => {
        const historyPlaylist = songHistory.map(item => ({
            ...item.song,
            artists: Array.isArray(item.song.artists) ? item.song.artists : []
        }));

        const songIndex = historyPlaylist.findIndex(s => s.id === rawSong.id);

        const safeSong = songIndex !== -1 ? historyPlaylist[songIndex] : {
            ...rawSong,
            artists: Array.isArray(rawSong.artists) ? rawSong.artists : []
        };

        playSong(safeSong, historyPlaylist, songIndex !== -1 ? songIndex : 0);
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
            const [musicResponse, likedStatusResponse] = await Promise.all([
                MusicService.getMusicByPlaylistId(item.id),
                PlaylistService.getLikedPlaylistStatus({ playlist_id: item.id })
            ]);

            // Safely access is_liked from the object response
            const isLiked = (likedStatusResponse.success && likedStatusResponse.data) ? likedStatusResponse.data.is_liked : false;

            if (musicResponse.success) {
                const mappedSongs = musicResponse.data.map((m: MusicResponse) => ({
                    id: m.id,
                    title: m.name,
                    artist: Array.isArray(m.artists) && m.artists.length > 0 ? m.artists.join(', ') : 'Unknown Artist',
                    cover: m.avatar_url || 'https://via.placeholder.com/150',
                    duration: m.duration,
                    isLiked: false
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: item.name,
                    playlistCover: item.avatar_url,
                    playlistId: item.id,
                    songs: mappedSongs,
                    description: '',
                    dominantColor: '#121212',
                    initialIsLiked: isLiked // Pass the initial liked status
                });
            }
        } catch (e) {
            console.error(e);
        }
    }


    // State for Create Playlist Modal
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên playlist');
            return;
        }

        if (!userId) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }

        setIsCreating(true);
        try {
            const res = await PlaylistService.createUserPlaylist({
                name: newPlaylistName.trim(),
                is_public: false,
                playlist_type: 'personal',
                user_id: userId
            });

            if (res.success) {
                setCreateModalVisible(false);
                setNewPlaylistName('');
                fetchHistory();
            } else {
                Alert.alert('Lỗi', 'Không thể tạo playlist. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo playlist.');
        } finally {
            setIsCreating(false);
        }
    };

    const renderCodeItem = (item: any, type: 'song' | 'playlist' | 'album') => {
        let data: MusicResponse | PlayListResponse;
        if (type === 'song') {
            const historyItem = item as MusicHistoryItem;
            data = historyItem.song;
        } else {
            const historyItem = item as PlaylistHistoryItem;
            data = historyItem.playlist;
        }

        let title = data.name;
        let subtitle = '';
        if (type === 'song') {
            const songData = data as MusicResponse;
            subtitle = Array.isArray(songData.artists) ? songData.artists.join(', ') : '';
        }

        let image = data.avatar_url;

        if (!image) image = 'https://via.placeholder.com/150';

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.itemContainer}
                onPress={() => {
                    if (type === 'song') handleSongPress(data as MusicResponse);
                    else handlePlaylistPress(data as PlayListResponse, type === 'album');
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
                <Text style={styles.headerTitle}>{t('personal')}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>


                {/* User Created Playlists Section - TOP PRIORITY */}
                <AlbumSection
                    title={t('yourPlaylists')}
                    albums={userPlaylists}
                    showMore={false}
                    headerRight={
                        <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
                            <Ionicons name="add-circle-outline" size={28} color={COLORS.primary} />
                        </TouchableOpacity>
                    }
                    emptyComponent={
                        <View style={styles.emptyPlaylistContainer}>
                            <Text style={styles.emptyPlaylistText}>{t('noPlaylist')}</Text>
                            <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
                                <Text style={styles.createButtonText}>{t('createPlaylist')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    onPressAlbum={(item) => {
                        const playlistData: PlayListResponse = {
                            id: item.id,
                            name: item.title,
                            avatar_url: item.image,
                            user_id: null,
                            is_public: true,
                            playlist_type: 'Playlist',
                            created_at: ''
                        };
                        handlePlaylistPress(playlistData, false);
                    }}
                />

                {/* Liked Playlists Section - Using Recent Playlist Layout */}
                {likedPlaylists.length > 0 && (
                    <AlbumSection
                        title={t('likedPlaylists')}
                        albums={likedPlaylists}
                        showMore={false}
                        onPressAlbum={(item) => {
                            // Need to reconstruct PlayListResponse structure for handlePlaylistPress
                            // Or handle navigation directly
                            const playlistData: PlayListResponse = {
                                id: item.id,
                                name: item.title,
                                avatar_url: item.image,
                                user_id: null, // Unknown context
                                is_public: true,
                                playlist_type: 'Playlist',
                                created_at: ''
                            };
                            handlePlaylistPress(playlistData, false);
                        }}
                    />
                )}



                {renderSection(t('listeningHistory'), songHistory, 'song')}
                {renderSection(t('listenedPlaylists'), playlistHistory, 'playlist')}
                {renderSection(t('listenedAlbums'), albumHistory, 'album')}

                {songHistory.length === 0 && playlistHistory.length === 0 && albumHistory.length === 0 && (
                    <Text style={styles.emptyText}>{t('noHistory')}</Text>
                )}
            </ScrollView>

            {/* Create Playlist Modal */}
            <Modal
                visible={isCreateModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('createPlaylist')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên playlist"
                            placeholderTextColor={COLORS.textSecondary}
                            value={newPlaylistName}
                            onChangeText={setNewPlaylistName}
                            autoFocus={true}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setCreateModalVisible(false);
                                    setNewPlaylistName('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.createModalButton]}
                                onPress={handleCreatePlaylist}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.createModalButtonText}>{t('create')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    username: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 20,
    },
    settingsButton: {
        padding: 10,
    },
    emptyPlaylistContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        marginHorizontal: 20,
    },
    emptyPlaylistText: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        marginBottom: 12,
    },
    createButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        fontFamily: FONTS.GilroyBold,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        paddingHorizontal: 16,
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 16,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
    },
    createModalButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 16,
    },
    createModalButtonText: {
        color: '#fff',
        fontFamily: FONTS.GilroyBold,
        fontSize: 16,
    }
});

export default PersonalScreen;
