import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { Artist } from '../models';
import { COLORS } from '../constants';

interface ArtistCardProps {
    artist: Artist;
    onPress?: () => void;
}

const AVATAR_SIZE = 72;
const ArtistCard = ({ artist, onPress }: ArtistCardProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={styles.avatarWrapper}>
                <Image
                    source={{ uri: artist.avatar_url }}
                    style={styles.avatar}
                />
            </View>

            <Text style={styles.name} numberOfLines={1}>
                {artist.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 110,
        alignItems: 'center',
        marginRight: 16,
    },

    avatarWrapper: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primaryLight,

        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,

        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: AVATAR_SIZE - 6,
        height: AVATAR_SIZE - 6,
        borderRadius: (AVATAR_SIZE - 6) / 2,
    },

    name: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },

    listeners: {
        marginTop: 2,
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
});

export default ArtistCard;