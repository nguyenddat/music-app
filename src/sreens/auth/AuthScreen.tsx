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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const AuthScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={styles.logoGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="musical-notes" size={48} color={COLORS.white} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.logoText}>MusicApp</Text>
                </View>

                {/* Content */}
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.title}>
                        {t('musicWorld')}
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('experienceAudio')}
                    </Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        {/* Primary Button - Login with Email */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Login' as never)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.primaryButtonText}>{t('login')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Apple Login */}
                        <TouchableOpacity style={styles.appleButton} activeOpacity={0.7}>
                            <View style={styles.appleButtonContent}>
                                <Ionicons name="logo-apple" size={24} color={COLORS.white} />
                                <Text style={styles.appleButtonText}>{t('continueWithApple')}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('noAccount')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                        <Text style={styles.registerLink}>{t('registerNow')}</Text>
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
    // Logo Section
    logoSection: {
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24, // Consistent rounded style
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
        marginBottom: 20,
    },
    logoGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 32,
        fontFamily: FONTS.GilroyBold,
        color: COLORS.white,
        letterSpacing: 0.5,
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 20, // Match home screen 20px padding
        justifyContent: 'center',
        paddingBottom: 60,
    },
    title: {
        fontSize: 36,
        fontFamily: FONTS.GilroyBold,
        color: COLORS.white,
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
        paddingHorizontal: 20,
    },

    // Buttons
    buttonContainer: {
        gap: 16,
        width: '100%',
    },
    primaryButton: {
        borderRadius: 16, // Match home screen card radius
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },
    appleButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Match home screen glassmorphism
        borderRadius: 16, // Match home screen card radius
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Match home screen border
        alignItems: 'center',
    },
    appleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appleButtonText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingBottom: 50,
    },
    footerText: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    registerLink: {
        fontSize: 16,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;
