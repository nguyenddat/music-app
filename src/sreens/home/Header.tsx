import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const AVATAR_URL = 'https://i.pravatar.cc/150?img=4';

interface HeaderProps {
    navigation: any;
}

const Header: React.FC<HeaderProps> = ({ navigation }) => {
    const handleSearchPress = () => {
        navigation.navigate('Find');
    };

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* Left: User Avatar */}
                <TouchableOpacity activeOpacity={0.8}>
                    <Image
                        source={{ uri: AVATAR_URL }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>

                {/* Right: Icon Group */}
                <View style={styles.rightContainer}>
                    {/* Search Button */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        activeOpacity={0.7}
                        onPress={handleSearchPress}
                    >
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    {/* Upload/Match Button */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('AIFind')}
                    >
                        <Ionicons
                            name="cloud-upload-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    {/* Heart/Favorite Button */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Playlists')}
                    >
                        <Ionicons
                            name="heart-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#000000',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    // Avatar styles
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    // Right side container
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    // Circular Icon Button styles
    iconButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default Header;