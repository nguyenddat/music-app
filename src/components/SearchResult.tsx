import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface SearchResultItemProps {
    item: {
        imageUrl: string;
        title: string;
        type: string;
        description: string;
    };
}

const SearchResultItem = ({ item }: SearchResultItemProps) => {
    // Kiểm tra loại để quyết định bo tròn ảnh hay không
    const isArtist = item.type === 'Artist';

    return (
        <TouchableOpacity style={styles.itemContainer}>
            <Image
                source={{ uri: item.imageUrl }}
                style={[styles.image, isArtist ? styles.artistImage : styles.albumImage]}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.type} • {item.description}</Text>
            </View>
            <TouchableOpacity style={styles.moreBtn}>
                <Text style={{ color: '#a7a7a7', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    artistImage: {
        borderRadius: 25, // Hình tròn cho Nghệ sĩ
    },
    albumImage: {
        borderRadius: 4, // Hình vuông bo góc nhẹ cho Bài hát/Album
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    subtitle: {
        color: '#a7a7a7',
        fontSize: 13,
        marginTop: 2,
    },
    moreBtn: {
        padding: 10,
    }
});

export default SearchResultItem;