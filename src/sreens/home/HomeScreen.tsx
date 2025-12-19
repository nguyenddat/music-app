import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Header from './Header';
import GreetingSection from './GreetingSection';
import DiscoverySection from './DiscoverySection';
import RecentPlaylistsSection from './RecentPlaylistsSection';
import UniversalSection from './UniversalSection';
import { TRENDING_PLAYLISTS, TOP_PLAYLISTS, YOUR_PLAYLISTS, MADE_FOR_YOU } from './playlistData';

interface HomeScreenProps {
    navigation: any;
}

import { useLanguage } from '../../contexts/LanguageContext';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { t } = useLanguage();
    const scrollViewRef = useRef<ScrollView>(null);
    const recentRef = useRef<View>(null);
    const discoveryRef = useRef<View>(null);
    const trendingRef = useRef<View>(null);
    const topRef = useRef<View>(null);
    const yourPlaylistsRef = useRef<View>(null);
    const madeForYouRef = useRef<View>(null);

    const [activeSection, setActiveSection] = useState('Recent');

    const scrollToSection = (sectionName: string) => {
        setActiveSection(sectionName);
        let targetRef = null;

        switch (sectionName) {
            case 'Recent':
                targetRef = recentRef;
                break;
            case 'Discovery':
                targetRef = discoveryRef;
                break;
            case 'Trending':
                targetRef = trendingRef;
                break;
            case 'Top':
                targetRef = topRef;
                break;
            case 'Your Playlists':
                targetRef = yourPlaylistsRef;
                break;
            case 'Made For You':
                targetRef = madeForYouRef;
                break;
        }

        if (targetRef?.current && scrollViewRef.current) {
            targetRef.current.measureLayout(
                scrollViewRef.current as any,
                (x, y) => {
                    scrollViewRef.current?.scrollTo({ y: y - 10, animated: true });
                },
                () => console.log('Failed to measure layout')
            );
        }
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <View style={styles.stickyChipsContainer}>
                <GreetingSection
                    onSectionPress={scrollToSection}
                    activeSection={activeSection}
                />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View ref={recentRef}>
                    <RecentPlaylistsSection />
                </View>

                <View ref={discoveryRef}>
                    <DiscoverySection navigation={navigation} />
                </View>

                {/* Trending Playlists */}
                <View ref={trendingRef}>
                    <UniversalSection
                        title={t('trendingPlaylists')}
                        data={TRENDING_PLAYLISTS}
                        onPressItem={(item) => console.log('Pressed:', item.title)}
                    />
                </View>

                {/* Top Playlists */}
                <View ref={topRef}>
                    <UniversalSection
                        title={t('topPlaylists')}
                        data={TOP_PLAYLISTS}
                        onPressItem={(item) => console.log('Pressed:', item.title)}
                    />
                </View>

                {/* Your Playlists */}
                <View ref={yourPlaylistsRef}>
                    <UniversalSection
                        title={t('yourPlaylists')}
                        data={YOUR_PLAYLISTS}
                        onPressItem={(item) => console.log('Pressed:', item.title)}
                    />
                </View>

                {/* Made For You */}
                <View ref={madeForYouRef}>
                    <UniversalSection
                        title={t('madeForYou')} // "Các Playlist Chúng Tôi Tạo Cho Bạn" is close enough or add specific key
                        data={MADE_FOR_YOU}
                        onPressItem={(item) => console.log('Pressed:', item.title)}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    stickyChipsContainer: {
        backgroundColor: '#000000',
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#000000',
    },
    scrollContent: {
        paddingBottom: 80,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 15,
        borderRadius: 16,
        shadowColor: '#7B6CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImg: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        marginRight: 15,
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#2D2E4A',
    },
    cardSub: {
        color: '#A1A4C8',
        marginTop: 4,
    }
});

export default HomeScreen;