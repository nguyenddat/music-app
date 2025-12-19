import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login, loading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const emailInputRef = useRef<TextInput>(null);

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
        ]).start(() => {
            // Fix accessibility issue on Web: Move focus to the new screen
            if (Platform.OS === 'web') {
                emailInputRef.current?.focus();
            }
        });
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        try {
            const result = await login({ email, password });
            if (result) {
                if (result.is_onboarded) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });
                } else {
                    navigation.navigate('Welcome' as never);
                }
            }
        } catch (e) {
            console.log("Login error", e);
        }
    };

    const isFormValid = email.length > 0 && password.length > 0;

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
                            <Text style={styles.title}>Chào mừng trở lại!</Text>
                            <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>

                            {/* Form */}
                            <View style={styles.form}>
                                {/* Email Input */}
                                <View style={[
                                    styles.inputContainer,
                                    emailFocused && styles.inputContainerFocused
                                ]}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={emailFocused ? COLORS.primary : COLORS.textSecondary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={emailInputRef}
                                        style={styles.input}
                                        placeholder="Email hoặc tên đăng nhập"
                                        placeholderTextColor={COLORS.textSecondary}
                                        selectionColor={COLORS.primary}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                    />
                                </View>

                                {/* Password Input */}
                                <View style={[
                                    styles.inputContainer,
                                    passwordFocused && styles.inputContainerFocused
                                ]}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={passwordFocused ? COLORS.primary : COLORS.textSecondary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Mật khẩu"
                                        placeholderTextColor={COLORS.textSecondary}
                                        selectionColor={COLORS.primary}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color={COLORS.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Forgot Password */}
                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                                </TouchableOpacity>

                                {/* Error message */}
                                {error && (
                                    <View style={styles.errorContainer}>
                                        <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                )}
                            </View>
                        </Animated.View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    (!isFormValid || loading) && styles.loginButtonDisabled
                                ]}
                                onPress={handleLogin}
                                disabled={!isFormValid || loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isFormValid ? [COLORS.primary, COLORS.secondary] : [COLORS.border, COLORS.border]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButtonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                                            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.registerRow}>
                                <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                                    <Text style={styles.registerLink}>Đăng ký ngay</Text>
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
        marginBottom: 40,
    },

    // Form
    form: {
        gap: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: COLORS.white,
        fontSize: 16,
        height: '100%',
        backgroundColor: 'transparent',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: COLORS.primary,
        fontFamily: FONTS.GilroySemiBold,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        flex: 1,
    },

    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    loginButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    loginButtonText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
    },
    registerLink: {
        fontSize: 16,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.primary,
    },
});

export default LoginScreen;
