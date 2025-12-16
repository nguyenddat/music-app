import React from 'react';
import {
    View,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const NavigationBar = () => {
    return (
        <View style={styles.navContainer}>
            <View style={styles.content}>

                {/* AVATAR */}
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.avatar}
                        />
                        <View style={styles.statusDot} />
                    </View>
                </TouchableOpacity>

                {/* SEARCH */}
                <View style={styles.searchBox}>
                    <Ionicons
                        name="search"
                        size={18}
                        color={COLORS.textMuted}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        placeholder="Search songs, artists..."
                        placeholderTextColor={COLORS.textMuted}
                        style={styles.searchInput}
                    />
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                        <Ionicons
                            name="library-outline"
                            size={22}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.separator} />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        zIndex: 100,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 6,
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        height: 72,
    },

    avatarWrapper: {
        marginRight: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 2,
        borderColor: COLORS.primaryLight,
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.success,
        borderWidth: 2,
        borderColor: COLORS.white,
    },

    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundGradientStart,
        borderRadius: 14,
        height: 44,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.text,
    },

    actions: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },

    separator: {
        height: 1,
        backgroundColor: COLORS.divider,
    },
});

export default NavigationBar;
