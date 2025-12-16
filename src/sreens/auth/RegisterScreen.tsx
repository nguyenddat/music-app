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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../constants/colors';
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Tạo tài khoản</Text>
                        <Text style={styles.subtitle}>
                            Đăng ký để bắt đầu trải nghiệm âm nhạc.
                        </Text>
                    </View>

                    {/* Error */}
                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Full name */}
                        <Input
                            icon="person-outline"
                            placeholder="Họ và tên"
                            value={form.fullName}
                            editable={!loading}
                            onChangeText={v => updateField('fullName', v)}
                        />

                        {/* Email */}
                        <Input
                            icon="mail-outline"
                            placeholder="Email"
                            value={form.email}
                            editable={!loading}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={v => updateField('email', v)}
                        />

                        {/* Password */}
                        <PasswordInput
                            placeholder="Mật khẩu"
                            value={form.password}
                            visible={showPassword}
                            setVisible={setShowPassword}
                            editable={!loading}
                            onChangeText={v => updateField('password', v)}
                        />

                        {/* Confirm password */}
                        <PasswordInput
                            placeholder="Xác nhận mật khẩu"
                            value={form.confirmPassword}
                            visible={showConfirmPassword}
                            setVisible={setShowConfirmPassword}
                            editable={!loading}
                            onChangeText={v => updateField('confirmPassword', v)}
                        />

                        {/* Button */}
                        <TouchableOpacity
                            style={[styles.registerButton, loading && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.registerButtonText}>Đăng ký</Text>
                            )}
                        </TouchableOpacity>
                    </View>

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
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    titleSection: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        marginBottom: 30,
    },
    registerButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    registerButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 30,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    loginText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
