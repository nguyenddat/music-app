import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';

import { Artist } from '../../models';
import { COLORS } from '../../constants';
import ArtistCard from '../../components/ArtistCard';

// Props
interface ArtistSectionProps {
    title: string;
    artists: Artist[];
    onPressArtist?: (artist: Artist) => void;
}

// Section
const ArtistSection = ({ title, artists, onPressArtist }: ArtistSectionProps) => {
    return (
        <View style={styles.section}>
            {/* SECTION TITLE */}
            <Text style={styles.title}>
                {title}
            </Text>

            {/* HORIZONTAL LIST */}
            <FlatList
                data={artists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ArtistCard
                        artist={item}
                        onPress={() => onPressArtist?.(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 24,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 12,
        paddingHorizontal: 20,
    },

    listContent: {
        paddingLeft: 20,
        paddingRight: 4,
    },
});

export default ArtistSection;