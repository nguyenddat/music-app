import React from 'react';
import {
    View, Text, ImageBackground,
    StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '../constants';

// Kích thước card
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;

// Component Props
interface MusicCardProps {
    id: number;
    title: string;
    avatar_url: string;
    genre: string;
    onPress: () => void;
}

// Component
const MusicCard: React.FC<MusicCardProps> = ({ id, title, avatar_url, onPress, genre }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.container}
        >
            <ImageBackground
                source={{ uri: avatar_url }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                {/* Lớp phủ Gradient để text dễ đọc hơn */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
                    style={styles.gradientOverlay}
                >
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.genre}>{genre}</Text>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.3,
        marginRight: 15,
        borderRadius: 24,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        backgroundColor: COLORS.white,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderRadius: 24,
    },
    gradientOverlay: {
        padding: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        height: '50%',
        justifyContent: 'flex-end',
    },
    title: {
        color: COLORS.textLight,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    genre: {
        color: COLORS.secondaryLight,
        fontSize: 13,
        fontWeight: '500',
    },
});

export default MusicCard;