import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const GAP = 12;

const ITEM_WIDTH = (width - (PADDING_HORIZONTAL * 2) - GAP) / 2;

export interface AlbumItem {
    id: string;
    title: string;
    image: string;
}

interface AlbumSectionProps {
    title: string;
    albums: AlbumItem[];
    showMore?: boolean;
    onPressAlbum?: (album: AlbumItem) => void;
    onPressMore?: () => void;
}

const AlbumSection: React.FC<AlbumSectionProps> = ({
    title,
    albums,
    showMore = false,
    onPressAlbum,
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

            {/* Grid của các album */}
            <View style={styles.gridContainer}>
                {albums.map((album) => (
                    <TouchableOpacity
                        key={album.id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => onPressAlbum?.(album)}
                    >
                        {/* Ảnh bên trái */}
                        <Image
                            source={{ uri: album.image }}
                            style={styles.coverImage}
                        />

                        {/* Text bên phải */}
                        <View style={styles.textContainer}>
                            <Text style={styles.albumTitle} numberOfLines={2}>
                                {album.title}
                            </Text>
                        </View>
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
        height: 56,
        backgroundColor: 'rgba(56, 67, 88, 0.4)',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    coverImage: {
        width: 56,
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    albumTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 18,
    },
});

export default AlbumSection;
