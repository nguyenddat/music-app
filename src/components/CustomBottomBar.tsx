import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'Trang chủ' },
    { name: 'Search', icon: 'search-outline', activeIcon: 'search', label: 'Tìm kiếm' },
    { name: 'Playlists', icon: 'musical-notes-outline', activeIcon: 'musical-notes', label: 'Playlist' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', label: 'Cài đặt' },
];

const BAR_HEIGHT = 60;

const COLORS = {
    activeIcon: '#FFFFFF',
    inactiveIcon: 'rgba(255, 255, 255, 0.5)',
    barBackground: 'rgba(0, 0, 0, 0.85)',
    activeText: '#FFFFFF',
    inactiveText: 'rgba(255, 255, 255, 0.5)',
};

const CustomBottomBar = () => {
    const [activeTab, setActiveTab] = useState('Home');

    const handlePress = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <View style={styles.container}>
            <View style={styles.barContent}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.name;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tabButton}
                            onPress={() => handlePress(tab.name)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={(isActive ? tab.activeIcon : tab.icon) as any}
                                size={24}
                                color={isActive ? COLORS.activeIcon : COLORS.inactiveIcon}
                            />
                            <Text style={[
                                styles.label,
                                { color: isActive ? COLORS.activeText : COLORS.inactiveText }
                            ]}>
                                {tab.label}
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