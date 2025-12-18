import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const GAP = 16;

const ITEM_WIDTH = (width - (PADDING_HORIZONTAL * 2) - GAP) / 2;

export interface PlaylistItem {
    id: string;
    title: string;
    image: string;
}

interface PlaylistSectionProps {
    title: string;
    playlists: PlaylistItem[];
    showMore?: boolean;
    onPressPlaylist?: (playlist: PlaylistItem) => void;
    onPressMore?: () => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
    title,
    playlists,
    showMore = false,
    onPressPlaylist,
    onPressMore,
}) => {
    return (
        <View style={styles.container}>
            {/* Header với title và nút "Xem thêm" */}
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {showMore && (
                    <TouchableOpacity
                        onPress={onPressMore}
                        activeOpacity={0.7}
                        style={styles.moreButton}
                    >
                        <Text style={styles.moreText}>Xem thêm</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Grid 2 cột của các playlist cards */}
            <View style={styles.gridContainer}>
                {playlists.map((playlist) => (
                    <TouchableOpacity
                        key={playlist.id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => onPressPlaylist?.(playlist)}
                    >
                        {/* Ảnh vuông lớn ở trên */}
                        <Image
                            source={{ uri: playlist.image }}
                            style={styles.coverImage}
                        />

                        {/* Tên playlist ở dưới */}
                        <Text style={styles.playlistTitle} numberOfLines={2}>
                            {playlist.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 20,
        color: COLORS.text,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    moreText: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        paddingHorizontal: PADDING_HORIZONTAL,
    },
    card: {
        width: ITEM_WIDTH,
        marginBottom: 8,
    },
    coverImage: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
        marginBottom: 8,
    },
    playlistTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 18,
    },
});

export default PlaylistSection;
