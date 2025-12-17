import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

const { width } = Dimensions.get('window');

// Kích thước card (Full màn hình trừ đi lề 2 bên 20px -> Tổng 40px)
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 160; // Giảm chiều cao chút cho thon gọn giống design

export interface DiscoveryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    backgroundColor: string;
}

interface DiscoveryCardProps {
    item: DiscoveryItem;
    onPlayPress?: () => void;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ item, onPlayPress }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>

                {/* Left Content: Text Info & Actions */}
                <View style={styles.leftContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                        <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">{item.subtitle}</Text>
                    </View>

                    <View style={styles.controlsRow}>
                        <TouchableOpacity
                            style={styles.playButton}
                            activeOpacity={0.8}
                            onPress={onPlayPress}
                        >
                            <Ionicons name="play" size={18} color={item.backgroundColor} style={{ marginLeft: 2 }} />
                        </TouchableOpacity>

                        <View style={styles.iconGroup}>
                            <TouchableOpacity>
                                <Ionicons name="heart-outline" size={20} color="#2E183B" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="arrow-down-circle-outline" size={20} color="#2E183B" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#2E183B" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Right Content: Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        justifyContent: 'center',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
    },
    leftContent: {
        flex: 1,
        justifyContent: 'space-between',
        zIndex: 2,
        paddingRight: 10,
    },
    imageContainer: {
        width: 130, // chiều ngang cố định cho ảnh
        justifyContent: 'center', // căn giữa theo chiều dọc
        paddingTop: 10,           // khoảng cách với lề trên
        paddingBottom: 10,        // khoảng cách với lề dưới
    },
    image: {
        width: 130,
        height: CARD_HEIGHT - 20, // trừ padding top+bottom
        borderRadius: 12,
    },
    title: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 20,
        color: '#2E183B',
        marginBottom: 6,
        lineHeight: 24,
    },
    subtitle: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
        color: '#5D4068',
        lineHeight: 16,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2E183B',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    iconGroup: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
});

export default DiscoveryCard;