import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';

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

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
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
        ]).start();
    }, []);

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

        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
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
            if (result.is_onboarded) {
                navigation.navigate('MainTabs' as never);
            } else {
                navigation.navigate('Welcome' as never);
            }
        }
    }, [form, register]);

    const isFormValid = form.fullName && form.email && form.password && form.confirmPassword;

    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Body */}
                        <Animated.View
                            style={[
                                styles.body,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.title}>Tạo tài khoản</Text>
                            <Text style={styles.subtitle}>
                                Đăng ký để bắt đầu trải nghiệm âm nhạc
                            </Text>

                            {/* Error */}
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* Form */}
                            <View style={styles.form}>
                                <Input
                                    icon="person-outline"
                                    placeholder="Họ và tên"
                                    value={form.fullName}
                                    editable={!loading}
                                    onChangeText={v => updateField('fullName', v)}
                                />

                                <Input
                                    icon="mail-outline"
                                    placeholder="Email"
                                    value={form.email}
                                    editable={!loading}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={v => updateField('email', v)}
                                />

                                <PasswordInput
                                    placeholder="Mật khẩu"
                                    value={form.password}
                                    visible={showPassword}
                                    setVisible={setShowPassword}
                                    editable={!loading}
                                    onChangeText={v => updateField('password', v)}
                                />

                                <PasswordInput
                                    placeholder="Xác nhận mật khẩu"
                                    value={form.confirmPassword}
                                    visible={showConfirmPassword}
                                    setVisible={setShowConfirmPassword}
                                    editable={!loading}
                                    onChangeText={v => updateField('confirmPassword', v)}
                                />
                            </View>
                        </Animated.View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.registerButton,
                                    (!isFormValid || loading) && styles.registerButtonDisabled
                                ]}
                                onPress={handleRegister}
                                disabled={!isFormValid || loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isFormValid ? [COLORS.primary, COLORS.secondary] : [COLORS.border, COLORS.border]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.registerButtonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Text style={styles.registerButtonText}>Đăng ký</Text>
                                            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.loginRow}>
                                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                                    <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    scrollContent: {
        flexGrow: 1,
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
    },
    backButton: {
        width: 44, // Match home screen icon button size
        height: 44,
        borderRadius: 22, // Match home screen circular buttons
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Match home screen glassmorphism
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Body
    body: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontFamily: FONTS.GilroyBold,
        color: COLORS.white,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
        marginBottom: 32,
    },

    // Error
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: 12,
        borderRadius: 12,
        gap: 8,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        flex: 1,
    },

    // Form
    form: {
        gap: 0,
    },

    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    registerButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    registerButtonText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    loginLink: {
        fontSize: 16,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.primary,
    },
});

export default RegisterScreen;
