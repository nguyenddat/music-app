import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

// Interface cho một item playlist
interface PlaylistItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
}

interface UniversalSectionProps {
    title: string;
    subTitle?: string;
    data: PlaylistItem[];
    onPressItem?: (item: PlaylistItem) => void;
}

const CARD_WIDTH = 140;
const CARD_GAP = 16;

const UniversalSection: React.FC<UniversalSectionProps> = ({ title, subTitle, data, onPressItem }) => {

    const renderItem = ({ item }: { item: PlaylistItem }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            onPress={() => onPressItem && onPressItem(item)}
        >
            {/* Ảnh bìa Playlist (Vuông & Bo góc nhẹ) */}
            <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
            />

            {/* Tiêu đề Playlist */}
            <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
            </Text>

            {/* Mô tả phụ (VD: Tên tác giả / Made for...) */}
            <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.subtitle}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header của Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {/* Chỉ hiển thị subtitle nếu có truyền vào */}
                {subTitle && (
                    <Text style={styles.sectionSubtitle}>{subTitle}</Text>
                )}
            </View>

            {/* Danh sách cuộn ngang */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginBottom: 12,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        color: '#A0AEC0', // Màu xám nhạt (Text Secondary)
        lineHeight: 20,
    },
    listContent: {
        paddingHorizontal: 20, // Padding 2 bên để item đầu/cuối không sát mép
    },
    // Card Styles
    cardContainer: {
        width: CARD_WIDTH,
    },
    cardImage: {
        width: CARD_WIDTH,
        height: CARD_WIDTH, // Hình vuông
        borderRadius: 6,    // Bo góc nhẹ giống ảnh mẫu
        marginBottom: 10,   // Khoảng cách từ ảnh xuống chữ
        backgroundColor: '#2A2A2A', // Màu nền placeholder
    },
    cardTitle: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 13,
        color: '#A0AEC0', // Màu xám
    },
});

export default UniversalSection;