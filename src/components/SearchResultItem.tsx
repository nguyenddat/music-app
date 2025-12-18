import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

interface SearchResultItemProps {
    item: {
        id: string;
        title: string;
        type: 'Artist' | 'Album' | 'Playlist';
        subtitle?: string;
        avatar: string;
    };
    onPress?: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, onPress }) => {
    const isArtist = item.type === 'Artist';

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={{ uri: item.avatar }}
                style={[styles.avatar, isArtist && styles.artistAvatar]}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {item.type}{item.subtitle ? ` • ${item.subtitle}` : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 4,
        marginRight: 12,
    },
    artistAvatar: {
        borderRadius: 28,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 16,
        marginBottom: 4,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 14,
    },
});

export default SearchResultItem;
