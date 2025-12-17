import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS, TYPOGRAPHY } from '../../constants/typography';
import { useAuth } from '../../hooks/useAuth';
import { MeResponse } from '../../services/UserService';

const SECTIONS = ['Recent', 'Discovery', 'Trending', 'Top', 'Your Playlists', 'Made For You'];

interface GreetingSectionProps {
    onSectionPress: (sectionName: string) => void;
    activeSection: string;
}

// Function to get greeting based on time
const getGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
};

const GreetingSection: React.FC<GreetingSectionProps> = ({ onSectionPress, activeSection }) => {
    const { me } = useAuth();
    const [user, setUser] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState(getGreeting());

    // Gọi API khi component được mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Update greeting every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleSectionPress = (section: string) => {
        onSectionPress(section);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Phần Lời chào - luôn hiển thị */}
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>
                    {greeting}, {user ? user.username : 'Guest'}
                </Text>
            </View>

            {/* Phần Section Navigation */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sectionsContainer}
            >
                {SECTIONS.map((section, index) => {
                    const isActive = activeSection === section;
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => handleSectionPress(section)}
                            style={[
                                styles.chip,
                                isActive ? { backgroundColor: COLORS.primary } : styles.chipInactive
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                isActive ? styles.chipTextActive : styles.chipTextInactive
                            ]}>
                                {section}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 12,
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Styles cho phần Text Greeting
    greetingContainer: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    greetingText: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 28,
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    // Styles cho Sections
    sectionsContainer: {
        paddingHorizontal: 20,
        gap: 12, // Khoảng cách giữa các chip
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipInactive: {
        // Hiệu ứng Glassmorphism cho chip chưa active
        backgroundColor: COLORS.glassBg,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    chipText: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 15,
    },
    chipTextActive: {
        color: '#000000', // Màu chữ đen trên nền primary
        fontFamily: FONTS.GilroySemiBold,
    },
    chipTextInactive: {
        color: COLORS.text,
    }
});

export default GreetingSection;