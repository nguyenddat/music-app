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

const { width } = Dimensions.get('window');

// 1. Định nghĩa Type cho đầu vào
export interface Song {
    id: string;
    title: string;
    artist: string;
    cover: string;
    isLiked?: boolean;
}

const PlaylistScreen = ({ route, navigation }: any) => {
    // Lấy dữ liệu từ params (hoặc dùng props tùy cách bạn điều hướng)
    const {
        playlistTitle = "Alex + Sam",
        playlistCover,
        songs,
        description = "A blend of music for Sam and Alex. Updates daily.",
        dominantColor = '#2a4f38' // Màu mặc định nếu không có
    } = route.params || {};

    // Render từng bài hát (Row Item)
    const renderSongItem = ({ item }: { item: Song }) => (
        <TouchableOpacity style={styles.songItem} activeOpacity={0.7}>
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
            {/* Search Bar giả lập (Back button) */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

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
                    <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
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

            {/* Mini Player giả lập (Bottom Sheet) */}
            <View style={styles.miniPlayer}>
                <View style={styles.miniPlayerContent}>
                    <Image source={{ uri: songs[0]?.cover }} style={styles.miniCover} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.miniTitle}>{songs[0]?.title || "Radio"}</Text>
                        <Text style={styles.miniArtist}>{songs[0]?.artist || "Unknown"}</Text>
                    </View>
                    <Ionicons name="bluetooth-outline" size={20} color="#1DB954" style={{ marginRight: 15 }} />
                    <TouchableOpacity><Ionicons name="play" size={28} color="#FFF" /></TouchableOpacity>
                </View>
                {/* Progress bar giả */}
                <View style={styles.progressBar} />
            </View>
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
        paddingBottom: 80, // Chừa chỗ cho mini player
    },
    // --- Header Styles ---
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
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

    // --- Mini Player Styles (Optional) ---
    miniPlayer: {
        position: 'absolute',
        bottom: 10, // Cách đáy một chút giống ảnh
        left: 8,
        right: 8,
        backgroundColor: '#382522', // Màu nâu đỏ giống trong ảnh (dynamic theo bài hát)
        borderRadius: 8,
        padding: 8,
        paddingBottom: 0, // cho progress bar nằm sát đáy
        overflow: 'hidden',
    },
    miniPlayerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    miniCover: {
        width: 38,
        height: 38,
        borderRadius: 4,
        backgroundColor: '#555',
    },
    miniTitle: {
        color: '#FFF',
        fontFamily: FONTS.GilroyBold,
        fontSize: 13,
    },
    miniArtist: {
        color: '#BBB',
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
    },
    progressBar: {
        height: 2,
        backgroundColor: '#FFF',
        width: '40%', // Giả lập đang chạy
        alignSelf: 'flex-start',
        marginBottom: 0,
    },
});

export default PlaylistScreen;