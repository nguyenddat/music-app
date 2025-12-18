import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BAR_HEIGHT = 60;

const COLORS = {
    activeIcon: '#FFFFFF',
    inactiveIcon: 'rgba(255, 255, 255, 0.5)',
    barBackground: 'rgba(0, 0, 0, 0.85)',
    activeText: '#FFFFFF',
    inactiveText: 'rgba(255, 255, 255, 0.5)',
};

// Tab configuration with icons and labels
const TAB_CONFIG: Record<string, { icon: string; activeIcon: string; label: string }> = {
    Home: { icon: 'home-outline', activeIcon: 'home', label: 'Trang chủ' },
    Find: { icon: 'search-outline', activeIcon: 'search', label: 'Tìm kiếm' },
    Playlists: { icon: 'musical-notes-outline', activeIcon: 'musical-notes', label: 'Playlist' },
    Settings: { icon: 'settings-outline', activeIcon: 'settings', label: 'Cài đặt' },
};

const CustomBottomBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.barContent}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const config = TAB_CONFIG[route.name];

                    if (!config) return null;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={(isFocused ? config.activeIcon : config.icon) as any}
                                size={24}
                                color={isFocused ? COLORS.activeIcon : COLORS.inactiveIcon}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    { color: isFocused ? COLORS.activeText : COLORS.inactiveText }
                                ]}
                            >
                                {config.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: COLORS.barBackground,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    barContent: {
        height: BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    tabButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
    },
});

export default CustomBottomBar;