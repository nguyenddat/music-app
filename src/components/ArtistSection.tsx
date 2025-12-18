import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

export interface ArtistItem {
    id: string;
    name: string;
    avatar_url: string;
}

interface ArtistSectionProps {
    title: string;
    artists: ArtistItem[];
    showMore?: boolean;
    onPressArtist?: (artist: ArtistItem) => void;
    onPressMore?: () => void;
}

const ArtistSection: React.FC<ArtistSectionProps> = ({
    title,
    artists,
    showMore = false,
    onPressArtist,
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

            {/* Horizontal ScrollView của các artist cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {artists.map((artist) => (
                    <TouchableOpacity
                        key={artist.id}
                        style={styles.artistCard}
                        activeOpacity={0.7}
                        onPress={() => onPressArtist?.(artist)}
                    >
                        {/* Avatar tròn */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: artist.avatar_url }}
                                style={styles.avatar}
                            />
                        </View>

                        {/* Tên nghệ sĩ */}
                        <Text style={styles.artistName} numberOfLines={2}>
                            {artist.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        paddingHorizontal: 20,
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
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    artistCard: {
        width: 100,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
        marginBottom: 8,
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    artistName: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 13,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 16,
    },
});

export default ArtistSection;
