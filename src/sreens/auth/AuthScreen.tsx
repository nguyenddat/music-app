import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../constants/colors';
import GradientBackground from '../../components/GradientBackground';
import GlassContainer from '../../components/GlassContainer';

const AuthScreen = () => {
    const navigation = useNavigation();

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* Floating decorative elements */}
                <View style={styles.floatingElements}>
                    <View style={[styles.floatingCircle, styles.circle1]} />
                    <View style={[styles.floatingCircle, styles.circle2]} />
                    <View style={[styles.floatingCircle, styles.circle3]} />
                </View>

                <View style={styles.contentContainer}>
                    {/* Header / Logo Area */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoWrapper}>
                            {/* Outer glow ring */}
                            <View style={styles.logoGlowRing}>
                                <LinearGradient
                                    colors={['rgba(123, 108, 255, 0.4)', 'rgba(255, 138, 207, 0.4)']}
                                    style={styles.logoGlowGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            </View>

                            {/* Main logo */}
                            <LinearGradient
                                colors={['#FF8ACF', '#7B6CFF']}
                                style={styles.logoGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="musical-notes" size={60} color={COLORS.white} />
                            </LinearGradient>
                        </View>

                        <Text style={styles.appName}>MusicVibe</Text>
                        <Text style={styles.appTagline}>Your soundtrack to life</Text>
                    </View>

                    {/* Glass Card for Main Actions */}
                    <GlassContainer style={styles.glassCard} intensity="medium">
                        <Text style={styles.title}>
                            Hàng triệu bài hát.{'\n'}
                            <Text style={styles.highlightText}>Miễn phí cho bạn.</Text>
                        </Text>

                        <View style={styles.buttonContainer}>
                            {/* Primary Action - Login */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Login' as never)}
                                style={styles.primaryButtonShadow}
                            >
                                <LinearGradient
                                    colors={['#FF8ACF', '#7B6CFF']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryButton}
                                >
                                    <Text style={styles.primaryButtonText}>Đăng nhập</Text>
                                    <Ionicons name="arrow-forward" size={22} color={COLORS.white} style={styles.buttonIconRight} />
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider with Text */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social Actions Row */}
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                        style={styles.socialButtonGradient}
                                    >
                                        <Ionicons name="logo-google" size={26} color="#EA4335" />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                        style={styles.socialButtonGradient}
                                    >
                                        <Ionicons name="logo-facebook" size={26} color="#1877F2" />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                        style={styles.socialButtonGradient}
                                    >
                                        <Ionicons name="logo-apple" size={26} color={COLORS.black} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            {/* Register Link */}
                            <TouchableOpacity
                                style={styles.registerLinkButton}
                                onPress={() => navigation.navigate('Register' as never)}
                            >
                                <Text style={styles.registerText}>
                                    Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký ngay</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </GlassContainer>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingElements: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    floatingCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 150,
        height: 150,
        top: '10%',
        right: '-10%',
    },
    circle2: {
        width: 100,
        height: 100,
        top: '30%',
        left: '-5%',
    },
    circle3: {
        width: 80,
        height: 80,
        bottom: '20%',
        right: '10%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 50,
        paddingTop: 30,
        zIndex: 1,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: 60,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 24,
    },
    logoGlowRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        top: -20,
        left: -20,
        borderRadius: 70,
        overflow: 'hidden',
    },
    logoGlowGradient: {
        width: '100%',
        height: '100%',
    },
    logoGradient: {
        width: 120,
        height: 120,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF8ACF',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 25,
        elevation: 15,
        transform: [{ rotate: '-8deg' }],
        overflow: 'hidden',
    },
    appName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
        letterSpacing: 1.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    appTagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    glassCard: {
        width: '100%',
        paddingVertical: 36,
        paddingHorizontal: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 36,
        lineHeight: 38,
    },
    highlightText: {
        color: COLORS.primary,
    },
    buttonContainer: {
        width: '100%',
        gap: 24,
    },
    primaryButtonShadow: {
        shadowColor: '#FF8ACF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        borderRadius: 30,
        overflow: 'hidden',
    },
    primaryButton: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 19,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    buttonIconRight: {
        marginLeft: 12,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: COLORS.textMuted,
        opacity: 0.3,
    },
    dividerText: {
        marginHorizontal: 20,
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderRadius: 32,
        overflow: 'hidden',
    },
    socialButtonGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
    },
    registerLinkButton: {
        marginTop: 8,
        alignItems: 'center',
    },
    registerText: {
        color: COLORS.textSecondary,
        fontSize: 15,
    },
    registerTextBold: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default AuthScreen;
