import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const GAP = 12;

const ITEM_WIDTH = (width - (PADDING_HORIZONTAL * 2) - GAP) / 2;
const RECENT_DATA = [
    { id: '1', title: "Today's Top Hits", image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' },
    { id: '2', title: 'Deep Focus', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80' },
    { id: '3', title: 'Chill Lo-Fi Beats', image: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=500&q=80' },
    { id: '4', title: 'Rock Classics', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80' },
    { id: '5', title: 'RapCaviar', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&q=80' },
    { id: '6', title: 'All Out 2010s', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80' },
];

const RecentPlaylists = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Recent playlists</Text>

            <View style={styles.gridContainer}>
                {RECENT_DATA.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.7}
                    >
                        {/* Ảnh bên trái */}
                        <Image
                            source={{ uri: item.image }}
                            style={styles.coverImage}
                        />

                        {/* Text bên phải */}
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
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
    sectionTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 12,
        paddingHorizontal: PADDING_HORIZONTAL,
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
    title: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 18,
    },
});

export default RecentPlaylists;