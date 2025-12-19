import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FONTS } from '../../constants/typography';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

const { width } = Dimensions.get('window');

// 1. Định nghĩa Type cho đầu vào
export interface Song {
    id: string;
    title: string;
    artist: string;
    cover: string;
    isLiked?: boolean;
    duration?: number;
}

const PlaylistScreen = ({ route, navigation }: any) => {
    const {
        playlistTitle = "Alex + Sam",
        playlistCover,
        songs,
        description = "A blend of music for Sam and Alex. Updates daily.",
        dominantColor = '#2a4f38'
    } = route.params || {};

    const { currentSong, isPlaying, playSong, expandPlayer } = useMusicPlayer();

    // Convert Song to MusicResponse format for context
    const convertToMusicResponse = (song: Song, index: number) => ({
        id: parseInt(song.id),
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
            <TouchableOpacity style={styles.moreBtn}>
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
                    <Text style={styles.metaText}> Playlist • {songs?.length || 0} songs</Text>
                </View>
            </View>

            {/* Action Row: Like, Download ... Play Button */}
            <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="heart-outline" size={26} color="#B3B3B3" />
                    </TouchableOpacity>
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
                    keyExtractor={(item) => item.id}
                    renderItem={renderSongItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            {/* Floating Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
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
});

export default PlaylistScreen;