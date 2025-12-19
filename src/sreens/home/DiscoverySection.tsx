import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';

import DiscoveryCard, { DiscoveryItem } from '../../components/DiscoveryCard';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import MusicService, { MusicResponse } from '../../services/MusicService';

const { width } = Dimensions.get('window');

const DISCOVERY_DATA = [
    {
        id: '1',
        title: 'Nhạc tuần này',
        subtitle: 'Playlist chọn lọc xu hướng mới nhất.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
        backgroundColor: '#E3C7F6', // tím nhạt
    },
    {
        id: '2',
        title: 'Idols mới ra nhạc',
        subtitle: 'Đừng bỏ lỡ ca khúc mới từ nghệ sĩ yêu thích.',
        image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=2070&auto=format&fit=crop',
        backgroundColor: '#C7F6E8', // xanh bạc hà nhạt
    },
    {
        id: '3',
        title: 'Bài nhạc theo gu',
        subtitle: 'Những giai điệu phù hợp âm nhạc.',
        image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=2070&auto=format&fit=crop',
        backgroundColor: '#F6E3C7', // cam nhạt
    },
    {
        id: '4',
        title: 'Nghệ sĩ mới',
        subtitle: 'Khám phá tài năng mới và các bài hit tiềm năng.',
        image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=2070&auto=format&fit=crop',
        backgroundColor: '#FFD6D6', // hồng nhạt
    },
    {
        id: '5',
        title: 'Thử dòng nhạc mới',
        subtitle: 'Nghe thử thể loại chưa từng thử.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
        backgroundColor: '#C7D6F6', // xanh dương nhạt
    },
];

interface DiscoverySectionProps {
    navigation?: any;
}

const DiscoverySection: React.FC<DiscoverySectionProps> = ({ navigation }) => {
    const progress = useSharedValue(0);

    const handlePlayPress = async (itemId: string) => {
        const musicService = MusicService;

        if (itemId === '1' && navigation) {
            // Card 1: Nhạc tuần này
            const result = await musicService.getWeeklyMusic();

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Various Artists',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: 'Nhạc Tuần Này',
                    playlistCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
                    description: 'Playlist chọn lọc xu hướng mới nhất trong tuần',
                    songs: songs,
                    dominantColor: '#E3C7F6',
                });
            }
        } else if (itemId === '2' && navigation) {
            // Card 2: Idols mới ra nhạc (từ nghệ sĩ yêu thích)
            const result = await musicService.getMusicByLikedArtists();

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Unknown Artist',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: 'Idols Mới Ra Nhạc',
                    playlistCover: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=2070&auto=format&fit=crop',
                    description: 'Đừng bỏ lỡ ca khúc mới từ nghệ sĩ yêu thích',
                    songs: songs,
                    dominantColor: '#C7F6E8',
                });
            }
        } else if (itemId === '3' && navigation) {
            // Card 3: Bài nhạc theo gu (từ thể loại yêu thích)
            const result = await musicService.getMusicByLikedGenres();

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Various Artists',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: 'Bài Nhạc Theo Gu',
                    playlistCover: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=2070&auto=format&fit=crop',
                    description: 'Những giai điệu phù hợp với sở thích âm nhạc của bạn',
                    songs: songs,
                    dominantColor: '#F6E3C7',
                });
            }
        } else if (itemId === '4' && navigation) {
            // Card 4: Nghệ sĩ mới
            const result = await musicService.getMusicByNewArtists();

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Various Artists',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: 'Nghệ Sĩ Mới',
                    playlistCover: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=2070&auto=format&fit=crop',
                    description: 'Khám phá tài năng mới và các bài hit tiềm năng',
                    songs: songs,
                    dominantColor: '#FFD6D6',
                });
            }
        } else if (itemId === '5' && navigation) {
            // Card 5: Thử dòng nhạc mới (thể loại người dùng chưa thích)
            const result = await musicService.getMusicByNewGenres();

            if (result.success && result.data) {
                const songs = result.data.map((music: MusicResponse) => ({
                    id: music.id.toString(),
                    title: music.name,
                    artist: music.artists?.join(', ') || 'Various Artists',
                    cover: music.avatar_url,
                }));

                navigation.navigate('Playlist', {
                    playlistTitle: 'Thử Dòng Nhạc Mới',
                    playlistCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
                    description: 'Nghe thử thể loại chưa từng thử',
                    songs: songs,
                    dominantColor: '#C7D6F6',
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Curated & trending</Text>

            <Carousel
                loop
                width={width}
                height={180}
                data={DISCOVERY_DATA}
                pagingEnabled
                snapEnabled
                scrollAnimationDuration={900}
                onProgressChange={(_, absoluteProgress) =>
                    (progress.value = absoluteProgress)
                }
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.88,   // card kế nhỏ hơn
                    parallaxScrollingOffset: 50,   // offset để tạo chiều sâu
                }}
                renderItem={({ item }) => (
                    <View style={{ width, alignItems: 'center' }}>
                        <DiscoveryCard
                            item={item}
                            onPlayPress={() => handlePlayPress(item.id)}
                        />
                    </View>
                )}
            />

            {/* Dot indicator */}
            <Dots data={DISCOVERY_DATA} progress={progress} />
        </View>
    );
};

// Separate Dot component to avoid hooks violation
const Dot = ({ index, progress }: { index: number; progress: ReturnType<typeof useSharedValue<number>> }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            progress.value,
            [index - 0.5, index, index + 0.5],
            [0.3, 1, 0.3]
        );

        const scale = interpolate(
            progress.value,
            [index - 0.5, index, index + 0.5],
            [0.8, 1.4, 0.8]
        );

        const colorProgress = interpolate(
            progress.value,
            [index - 0.5, index, index + 0.5],
            [0, 1, 0]
        );

        return {
            opacity,
            transform: [{ scale }],
            backgroundColor: colorProgress > 0.5 ? COLORS.primary : '#4A4A4A',
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const Dots = ({ data, progress }: { data: DiscoveryItem[]; progress: ReturnType<typeof useSharedValue<number>> }) => {
    return (
        <View style={styles.dotContainer}>
            {data.map((_, index) => (
                <Dot key={index} index={index} progress={progress} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    dotContainer: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default DiscoverySection;