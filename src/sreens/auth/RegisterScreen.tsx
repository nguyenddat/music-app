import React, { useState, useCallback } from 'react';
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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import GradientBackground from '../../components/GradientBackground';
import GlassContainer from '../../components/GlassContainer';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const { register, loading, error } = useAuth();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        const { fullName, email, password, confirmPassword } = form;

        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return false;
        }

        return true;
    };

    const handleRegister = useCallback(async () => {
        if (!validateForm()) return;

        const result = await register({
            username: form.fullName,
            email: form.email,
            password: form.password,
        });

        if (result) {
            Alert.alert('Thành công', 'Đăng ký tài khoản thành công', [
                { text: 'OK', onPress: () => navigation.navigate('Login' as never) },
            ]);
        }
    }, [form, register]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButtonWrapper}
                                onPress={() => navigation.goBack()}
                            >
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                    style={styles.backButton}
                                >
                                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Tạo tài khoản</Text>
                            <Text style={styles.subtitle}>
                                Đăng ký để bắt đầu trải nghiệm âm nhạc.
                            </Text>
                        </View>

                        {/* Form */}
                        <GlassContainer style={styles.formContainer} intensity="medium">
                            {/* Error */}
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Full name */}
                            <Text style={styles.label}>Họ và tên</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={form.fullName}
                                    onChangeText={v => updateField('fullName', v)}
                                    editable={!loading}
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            {/* Email */}
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="name@example.com"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={form.email}
                                    onChangeText={v => updateField('email', v)}
                                    editable={!loading}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            {/* Password */}
                            <Text style={styles.label}>Mật khẩu</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tạo mật khẩu"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={form.password}
                                    onChangeText={v => updateField('password', v)}
                                    editable={!loading}
                                    secureTextEntry={!showPassword}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm password */}
                            <Text style={styles.label}>Xác nhận mật khẩu</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập lại mật khẩu"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={form.confirmPassword}
                                    onChangeText={v => updateField('confirmPassword', v)}
                                    editable={!loading}
                                    secureTextEntry={!showConfirmPassword}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Button */}
                            <TouchableOpacity
                                style={[styles.registerButtonShadow, loading && styles.disabledButton]}
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FF8ACF', '#7B6CFF']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.registerButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Text style={styles.registerButtonText}>Đăng ký</Text>
                                            <Ionicons name="arrow-forward" size={22} color={COLORS.white} style={styles.buttonIcon} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </GlassContainer>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Đã có tài khoản? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                                <Text style={styles.loginText}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
};


const styles = StyleSheet.create({
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
        marginBottom: 40,
    },
    backButtonWrapper: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
    },
    titleSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    subtitle: {
        fontSize: 17,
        color: 'rgba(255, 255, 255, 0.9)',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    formContainer: {
        paddingVertical: 36,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 20,
        marginBottom: 24,
        paddingHorizontal: 18,
        height: 60,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 1)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    inputIcon: {
        marginRight: 14,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
        height: '100%',
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 10,
    },
    errorContainer: {
        backgroundColor: 'rgba(252, 129, 129, 0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(252, 129, 129, 0.3)',
        overflow: 'hidden',
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
    },
    registerButtonShadow: {
        shadowColor: '#FF8ACF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        marginTop: 8,
        borderRadius: 30,
        overflow: 'hidden',
    },
    disabledButton: {
        opacity: 0.7,
    },
    registerButton: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    registerButtonText: {
        color: COLORS.white,
        fontSize: 19,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    buttonIcon: {
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    loginText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});

export default RegisterScreen;
