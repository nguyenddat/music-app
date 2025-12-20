import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FONTS } from '../../constants/typography';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

// 1. Định nghĩa Type cho đầu vào
export interface Song {
    id: number; // Changed from string to number for consistency
    title: string;
    artist: string;
    cover: string;
    isLiked?: boolean;
    duration?: number;
}

import PlaylistService, { PlayListResponse } from '../../services/PlaylistService';
import MusicService from '../../services/MusicService';
import UserService from '../../services/UserService';

const PlaylistScreen = ({ route, navigation }: any) => {
    const { t } = useLanguage();
    const {
        playlistId: paramPlaylistId,
        id: paramId, // Fallback if playlistId is missing
        playlistTitle = t('playlistTitleDefault'),
        playlistCover,
        songs,
        description = t('playlistDescDefault'),
        dominantColor = '#2a4f38',
        initialIsLiked
    } = route.params || {};

    // Normalize playlistId
    const playlistId = paramPlaylistId || paramId;

    const { currentSong, isPlaying, playSong, expandPlayer } = useMusicPlayer();
    const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked || false);
    const [isLoadingLike, setIsLoadingLike] = useState(false);

    // Add to Playlist State
    const [isAddToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);
    const [selectedSongToAdd, setSelectedSongToAdd] = useState<Song | null>(null);
    const [userPlaylists, setUserPlaylists] = useState<PlayListResponse[]>([]);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        console.log('PlaylistScreen Full Route:', route);
        console.log('PlaylistScreen Params:', route.params);
        console.log('Resolved Playlist ID:', playlistId);

        // Only fetch if initialIsLiked is undefined (e.g. deep link or different nav)
        if (initialIsLiked === undefined && playlistId) {
            checkLikeStatus();
        }
    }, [playlistId, initialIsLiked]);

    const checkLikeStatus = async () => {
        if (!playlistId) {
            console.log('No playlistId to check status');
            return;
        }
        try {
            const res = await PlaylistService.getLikedPlaylistStatus({ playlist_id: Number(playlistId) });
            console.log('Check like status res:', res);
            if (res.success && res.data) {
                setIsLiked(res.data.is_liked);
            } else {
                // Fallback: check list manually if status endpoint fails/returns null
                const listRes = await PlaylistService.getLikedPlaylists();
                if (listRes.success && listRes.data) {
                    const isFound = listRes.data.some((p: any) => p.playlist.id === Number(playlistId));
                    setIsLiked(isFound);
                }
            }
        } catch (e) {
            console.error('Error checking like status:', e);
        }
    };

    const fetchUserPlaylists = async () => {
        setIsLoadingPlaylists(true);
        try {
            const res = await PlaylistService.getUserPlaylists();
            if (res.success && res.data) {
                setUserPlaylists(res.data);
            }
        } catch (error) {
            console.error('Error fetching user playlists:', error);
        } finally {
            setIsLoadingPlaylists(false);
        }
    };

    const openAddToPlaylistModal = (song: Song) => {
        setSelectedSongToAdd(song);
        setAddToPlaylistModalVisible(true);
        fetchUserPlaylists();
    };

    const handleAddToPlaylist = async (targetPlaylistId: number) => {
        if (!selectedSongToAdd) return;

        try {
            const res = await MusicService.addToPlaylist(targetPlaylistId, {
                song_id: selectedSongToAdd.id
            });

            if (res.success) {
                // Success - Just close modal, no alert
                setAddToPlaylistModalVisible(false);
            } else {
                setErrorMessage(t('addToPlaylistError'));
                setIsErrorModalVisible(true);
            }
        } catch (error) {
            console.error('Error adding song to playlist:', error);
            setErrorMessage(t('generalError'));
            setIsErrorModalVisible(true);
        }
    };

    const handleToggleLike = async () => {
        if (!playlistId) {
            console.error('Cannot toggle like: missing playlistId');
            return;
        }
        if (isLoadingLike) return;

        setIsLoadingLike(true);
        try {
            if (isLiked) {
                // Unlike
                console.log('Unliking playlist:', playlistId);
                const res = await PlaylistService.deleteLikedPlaylist({ playlist_id: Number(playlistId) });
                console.log('Unlike res:', res);
                if (res.success) setIsLiked(false);
            } else {
                // Like
                console.log('Liking playlist:', playlistId);
                const res = await PlaylistService.createLikedPlaylist({ playlist_id: Number(playlistId) });
                console.log('Like res:', res);
                if (res.success) setIsLiked(true);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLoadingLike(false);
        }
    };

    // Convert Song to MusicResponse format for context
    const convertToMusicResponse = (song: Song, index: number) => ({
        id: typeof song.id === 'number' ? song.id : parseInt(song.id as any),
        name: song.title,
        artists: [song.artist],
        file_path: '',
        avatar_url: song.cover,
        created_at: new Date().toISOString(),
        duration: song.duration || null,
    });

    // Handle song press
    const handleSongPress = async (song: Song, index: number) => {
        const selectedSong = convertToMusicResponse(song, index);
        const playlist = songs.map((s: Song, i: number) => convertToMusicResponse(s, i));

        // Record playlist history if playlistId exists
        if (playlistId) {
            PlaylistService.createHistoryPlaylist({ playlist_id: Number(playlistId) }).catch(err => {
                console.error('Failed to create playlist history:', err);
            });
        }

        // Play song and expand player
        await playSong(selectedSong, playlist, index, dominantColor);
        expandPlayer();
    };

    // Render từng bài hát (Row Item)
    const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
        <TouchableOpacity
            style={styles.songItem}
            activeOpacity={0.7}
            onPress={() => handleSongPress(item, index)}
        >
            <Image source={{ uri: item.cover }} style={styles.songCover} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
            <TouchableOpacity
                style={styles.moreBtn}
                onPress={() => openAddToPlaylistModal(item)}
            >
                <Ionicons name="ellipsis-vertical" size={20} color="#B3B3B3" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    // Header của FlatList (Phần ảnh to, tên playlist và các nút control)
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Search Bar giả lập (Back button moved to global) */}
            <View style={{ height: 10 }} />

            {/* Playlist Art */}
            <View style={styles.artContainer}>
                <Image
                    source={{ uri: playlistCover }}
                    style={styles.bigCover}
                    resizeMode="cover"
                />
            </View>

            {/* Title & Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.playlistTitle}>{playlistTitle}</Text>
                <Text style={styles.description}>{description}</Text>

                {/* Spotify Logo & Metadata mimic */}
                <View style={styles.metaRow}>
                    <Ionicons name="musical-notes" size={18} color="#1DB954" />
                    <Text style={styles.metaText}> {t('playlistStats').replace('{{count}}', (songs?.length || 0).toString())}</Text>
                </View>
            </View>

            {/* Action Row: Like, Download ... Play Button */}
            <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                    {/* Only show like button if playlistId exists */}
                    {/* Only show like button if playlistId exists */}
                    {playlistId ? (
                        <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => {
                                console.log('[PlaylistScreen] Like button pressed. ID:', playlistId, 'Current Liked:', isLiked);
                                handleToggleLike();
                            }}
                            disabled={isLoadingLike}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        >
                            {isLoadingLike ? (
                                <ActivityIndicator size="small" color="#B3B3B3" />
                            ) : (
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={26}
                                    color={isLiked ? "#FF0000" : "#B3B3B3"} // Red when liked
                                />
                            )}
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="arrow-down-circle-outline" size={26} color="#B3B3B3" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="person-add-outline" size={26} color="#B3B3B3" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#B3B3B3" />
                    </TouchableOpacity>
                </View>

                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.shuffleBtn}>
                        <Ionicons name="shuffle" size={28} color="#1DB954" />
                    </TouchableOpacity>
                    {/* Nút Play Xanh Đặc Trưng */}
                    <TouchableOpacity
                        style={styles.playButton}
                        activeOpacity={0.8}
                        onPress={() => songs && songs.length > 0 && handleSongPress(songs[0], 0)}
                    >
                        <Ionicons name="play" size={28} color="#000" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={[dominantColor, '#121212', '#121212']}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSongItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Add to Playlist Modal */}
            <Modal
                transparent={true}
                visible={isAddToPlaylistModalVisible}
                animationType="fade"
                onRequestClose={() => setAddToPlaylistModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setAddToPlaylistModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('addToPlaylist')}</Text>

                        {isLoadingPlaylists ? (
                            <ActivityIndicator size="large" color="#1DB954" />
                        ) : (
                            <FlatList
                                data={userPlaylists}
                                keyExtractor={(item) => item.id.toString()}
                                style={{ maxHeight: 300 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.playlistItem}
                                        onPress={() => handleAddToPlaylist(item.id)}
                                    >
                                        <Image
                                            source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }}
                                            style={styles.playlistThumb}
                                        />
                                        <Text style={styles.playlistName} numberOfLines={1}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>{t('noPlaylistsFound')}</Text>
                                }
                            />
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setAddToPlaylistModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Custom Error Modal */}
            <Modal
                transparent={true}
                visible={isErrorModalVisible}
                animationType="fade"
                onRequestClose={() => setIsErrorModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsErrorModalVisible(false)}
                >
                    <View style={[styles.modalContent, styles.errorModalContent]}>
                        <Ionicons name="warning" size={48} color="#FF4D4D" style={{ marginBottom: 16 }} />
                        <Text style={styles.errorTitle}>{t('error')}</Text>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>

                        <TouchableOpacity
                            style={styles.errorCloseButton}
                            onPress={() => setIsErrorModalVisible(false)}
                        >
                            <Text style={styles.errorCloseButtonText}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Fallback color
    },
    safeArea: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 150,  // Increased to accommodate mini player (70px) + safe spacing
    },
    // --- Header Styles ---
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 50, // Fixed top position
        left: 20,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // High z-index to ensure clickability
        backgroundColor: 'rgba(0,0,0,0.3)', // Optional: slight background for visibility if over art
        borderRadius: 22,
    },
    artContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    bigCover: {
        width: width * 0.6, // Chiếm 60% chiều ngang màn hình
        height: width * 0.6,
        borderRadius: 4, // Spotify playlist art thường vuông góc hoặc bo rất nhẹ
    },
    infoContainer: {
        marginBottom: 10,
    },
    playlistTitle: {
        fontFamily: FONTS.GilroyBold, // Sử dụng font của bạn
        fontSize: 32, // Tựa đề lớn
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    description: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        color: '#B3B3B3', // Màu xám đặc trưng của Spotify
        lineHeight: 20,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: FONTS.GilroyBold,
    },

    // --- Action Buttons ---
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 10,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // Spacing giữa các icon bên trái
    },
    actionIcon: {
        padding: 4,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    shuffleBtn: {
        opacity: 0.9,
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1DB954', // Spotify Green
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Song List Item Styles ---
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    songCover: {
        width: 48,
        height: 48,
        borderRadius: 4,
    },
    songInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    songTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    songArtist: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        color: '#B3B3B3',
    },
    moreBtn: {
        padding: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FONTS.GilroyBold,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    playlistThumb: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 12,
    },
    playlistName: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
        color: '#FFF',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFF',
        fontFamily: FONTS.GilroyBold,
    },
    emptyText: {
        color: '#B3B3B3',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: FONTS.GilroyMedium,
    },
    // Error Modal Specific
    errorModalContent: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    errorTitle: {
        fontSize: 22,
        fontFamily: FONTS.GilroyBold,
        color: '#FF4D4D',
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
        color: '#CCC',
        textAlign: 'center',
        marginBottom: 24,
    },
    errorCloseButton: {
        backgroundColor: '#FF4D4D',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    errorCloseButtonText: {
        color: '#FFF',
        fontFamily: FONTS.GilroyBold,
        fontSize: 16,
    },
});

export default PlaylistScreen;