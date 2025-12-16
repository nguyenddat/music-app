import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import GradientBackground from '../../components/GradientBackground';
import GlassContainer from '../../components/GlassContainer';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        try {
            const result = await login({ email, password });
            if (result) {
                navigation.navigate('Home' as never);
            }
        } catch (e) {
            console.log("Login error", e);
        }
    };

    return (
        <View style={styles.mainContainer}>
            {/* Atmospheric Background with Decorative Blobs */}
            <LinearGradient
                colors={[COLORS.backgroundGradientStart, COLORS.backgroundGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative Blob 1 - Top Left */}
            <View style={[styles.blob, styles.blob1]} />

            {/* Decorative Blob 2 - Top Right */}
            <View style={[styles.blob, styles.blob2]} />

            {/* Decorative Blob 3 - Bottom Center */}
            <View style={[styles.blob, styles.blob3]} />

            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Branding Section with Logo */}
                        <View style={styles.brandingSection}>
                            <LinearGradient
                                colors={COLORS.gradientPrimary}
                                style={styles.logoGradient}
                            >
                                <Ionicons name="musical-notes" size={48} color={COLORS.white} />
                            </LinearGradient>
                            <Text style={styles.appName}>Music App</Text>
                            <Text style={styles.tagline}>Hàng triệu bài hát, vô vàn cảm xúc</Text>
                        </View>

                        {/* Title Section */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Chào mừng trở lại!</Text>
                            <Text style={styles.subtitle}>Đăng nhập để tiếp tục hành trình âm nhạc</Text>
                        </View>

                        {/* Form Section - True Glassmorphism */}
                        <View style={styles.glassFormContainer}>
                            {/* Email Input */}
                            <Text style={styles.label}>Email/Username</Text>
                            <View style={[
                                styles.inputWrapper,
                                emailFocused && styles.inputWrapperFocused
                            ]}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập email hoặc username"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            {/* Password Input */}
                            <Text style={styles.label}>Mật khẩu</Text>
                            <View style={[
                                styles.inputWrapper,
                                passwordFocused && styles.inputWrapperFocused
                            ]}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập mật khẩu"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    secureTextEntry={!showPassword}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity style={styles.forgotPasswordContainer}>
                                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>

                            {/* Error Message */}
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Login Button with Glow */}
                            <TouchableOpacity
                                style={[styles.loginButtonShadow, loading && styles.disabledButton]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={COLORS.gradientPrimary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>hoặc tiếp tục với</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Social Login Buttons - Circular */}
                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-apple" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                                <Text style={styles.registerText}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    // Decorative Background Blobs for Depth
    blob: {
        position: 'absolute',
        borderRadius: 1000,
    },
    blob1: {
        width: 300,
        height: 300,
        backgroundColor: COLORS.primary,
        opacity: 0.15,
        top: -100,
        left: -50,
    },
    blob2: {
        width: 250,
        height: 250,
        backgroundColor: COLORS.secondary,
        opacity: 0.12,
        top: 100,
        right: -80,
    },
    blob3: {
        width: 200,
        height: 200,
        backgroundColor: COLORS.accent,
        opacity: 0.1,
        bottom: 150,
        left: '40%',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    // Enhanced Branding Section
    brandingSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4,
    },
    tagline: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    titleSection: {
        marginBottom: 28,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    // True Glassmorphism Container
    glassFormContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        paddingVertical: 32,
        paddingHorizontal: 24,
        marginBottom: 24,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 16,
        overflow: 'hidden',
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 10,
        fontWeight: '700',
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(243, 241, 255, 0.5)',
        borderRadius: 16,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    inputWrapperFocused: {
        borderColor: COLORS.primary,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 28,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(252, 129, 129, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 20,
        gap: 8,
        overflow: 'hidden',
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    // Enhanced Button with Glow Effect
    loginButtonShadow: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
        borderRadius: 29,
        overflow: 'hidden',
    },
    disabledButton: {
        opacity: 0.6,
    },
    loginButton: {
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 28,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.divider,
    },
    dividerText: {
        marginHorizontal: 16,
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    // Social Login Buttons - Circular
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingVertical: 20,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    registerText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '800',
    },
});

export default LoginScreen;
