import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS, TYPOGRAPHY } from '../../constants/typography';
import { useAuth } from '../../hooks/useAuth';
import { MeResponse } from '../../services/UserService';
import { useLanguage, TranslationKey } from '../../contexts/LanguageContext';

const SECTIONS_KEYS: TranslationKey[] = ['recent', 'discovery', 'trending', 'top', 'yourPlaylists', 'madeForYou'];

interface GreetingSectionProps {
    onSectionPress: (sectionName: string) => void;
    activeSection: string;
}

const getGreetingKey = (): TranslationKey => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'goodMorning';
    } else if (hour >= 12 && hour < 18) {
        return 'goodAfternoon';
    } else {
        return 'goodEvening';
    }
};

const GreetingSection: React.FC<GreetingSectionProps> = ({ onSectionPress, activeSection }) => {
    const { me } = useAuth();
    const { t } = useLanguage();
    const [user, setUser] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [greetingKey, setGreetingKey] = useState(getGreetingKey());

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
            setGreetingKey(getGreetingKey());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleSectionPress = (sectionKey: TranslationKey) => {
        // Map key back to original section string expected by HomeScreen if needed,
        // or HomeScreen should handle keys.
        // For now let's map back to English or just pass what HomeScreen expects.
        // HomeScreen expects specific strings for scrollToSection switch case.
        // Let's assume HomeScreen uses the translated string matching? No, HomeScreen logic relies on hardcoded strings "Recent", "Discovery" etc.
        // So we should pass the expected internal ID, but display the translated label.

        // We can reconstruct the internal ID from the key or map it.
        // Let's create a map or just switch.
        let internalSection = 'Recent';
        switch (sectionKey) {
            case 'recent': internalSection = 'Recent'; break;
            case 'discovery': internalSection = 'Discovery'; break;
            case 'trending': internalSection = 'Trending'; break;
            case 'top': internalSection = 'Top'; break;
            case 'yourPlaylists': internalSection = 'Your Playlists'; break;
            case 'madeForYou': internalSection = 'Made For You'; break;
        }
        onSectionPress(internalSection);
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
                    {t(greetingKey)}, {user ? user.username : t('guest')}
                </Text>
            </View>

            {/* Phần Section Navigation */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sectionsContainer}
            >
                {SECTIONS_KEYS.map((sectionKey, index) => {
                    // We need to map activeSection (internal ID) to key to check isActive
                    // internal "Recent" -> key "recent"
                    let internalSection = 'Recent';
                    switch (sectionKey) {
                        case 'recent': internalSection = 'Recent'; break;
                        case 'discovery': internalSection = 'Discovery'; break;
                        case 'trending': internalSection = 'Trending'; break;
                        case 'top': internalSection = 'Top'; break;
                        case 'yourPlaylists': internalSection = 'Your Playlists'; break;
                        case 'madeForYou': internalSection = 'Made For You'; break;
                    }

                    const isActive = activeSection === internalSection;
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => handleSectionPress(sectionKey)}
                            style={[
                                styles.chip,
                                isActive ? { backgroundColor: COLORS.primary } : styles.chipInactive
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                isActive ? styles.chipTextActive : styles.chipTextInactive
                            ]}>
                                {t(sectionKey)}
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