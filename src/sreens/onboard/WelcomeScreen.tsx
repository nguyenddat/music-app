import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Animated,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

// Onboarding config
const TOTAL_STEPS = 4;
const CURRENT_STEP = 1;

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(progressAnim, {
                toValue: CURRENT_STEP / TOTAL_STEPS,
                duration: 600,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const handleNext = () => {
        navigation.navigate('Genre' as never);
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* ===== HEADER ===== */}
                <View style={styles.header}>
                    <View style={[styles.navButton, { opacity: 0 }]}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
                    </View>

                    <Text style={styles.progressText}>
                        {t('step')} {CURRENT_STEP} / {TOTAL_STEPS}
                    </Text>

                    <View style={[styles.navButton, { opacity: 0 }]}>
                        <Text style={styles.skipText}>{t('skip')}</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: progressWidth },
                            ]}
                        />
                    </View>
                </View>

                {/* ===== BODY ===== */}
                <Animated.View
                    style={[
                        styles.body,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Title */}
                    <Text style={styles.title}>{t('welcomeTitle')}</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        {t('welcomeSubtitle')}
                    </Text>

                    {/* Content Card */}
                    <View style={styles.contentCard}>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="musical-notes" size={28} color={COLORS.primary} />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{t('millionsSongs')}</Text>
                                <Text style={styles.featureDesc}>{t('unlimitedListening')}</Text>
                            </View>
                        </View>

                        <View style={styles.featureDivider} />

                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="sparkles" size={28} color={COLORS.primary} />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{t('smartRecommendations')}</Text>
                                <Text style={styles.featureDesc}>{t('aiUnderstand')}</Text>
                            </View>
                        </View>

                        <View style={styles.featureDivider} />

                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="download" size={28} color={COLORS.primary} />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{t('listenOffline')}</Text>
                                <Text style={styles.featureDesc}>{t('downloadAnywhere')}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ===== FOOTER ===== */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ctaGradient}
                        >
                            <Text style={styles.ctaText}>{t('getStarted')}</Text>
                            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#000000', // Pure black like home screen
    },
    container: {
        flex: 1,
    },

    // ===== HEADER =====
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    navButton: {
        padding: 8,
    },
    skipText: {
        fontSize: 14,
        fontFamily: FONTS.GilroyMedium,
        color: COLORS.textSecondary,
    },

    progressText: {
        fontSize: 14,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.textSecondary,
    },


    // Progress Bar
    progressBarContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },

    // ===== BODY =====
    body: {
        flex: 1,
        paddingHorizontal: 20, // Match home screen 20px padding
    },
    title: {
        fontSize: 32,
        fontFamily: FONTS.GilroyBold,
        color: COLORS.white,
        lineHeight: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
        marginBottom: 32,
    },

    // Content Card
    contentCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16, // Match home screen card radius
        padding: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    featureIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 165, 134, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    featureDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 4,
    },

    // ===== FOOTER =====
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    ctaButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    ctaText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },
});

export default WelcomeScreen;