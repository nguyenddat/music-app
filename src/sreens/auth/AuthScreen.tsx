import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AuthScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header / Logo Area */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="musical-notes" size={40} color={COLORS.primary} />
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    Hàng triệu bài hát.{'\n'}Miễn phí trên Music.
                </Text>

                <View style={styles.buttonContainer}>
                    {/* Primary Action */}
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => navigation.navigate('Login' as never)}
                    >
                        <Text style={styles.primaryButtonText}>Đăng nhập</Text>
                    </TouchableOpacity>

                    {/* Social Actions */}
                    <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                        <Ionicons name="logo-google" size={20} color={COLORS.text} style={styles.buttonIcon} />
                        <Text style={styles.outlineButtonText}>Tiếp tục với Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                        <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.buttonIcon} />
                        <Text style={styles.outlineButtonText}>Tiếp tục với Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                        <Ionicons name="logo-apple" size={20} color={COLORS.text} style={styles.buttonIcon} />
                        <Text style={styles.outlineButtonText}>Tiếp tục với Apple</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.textLinkButton}
                        onPress={() => navigation.navigate('Register' as never)}
                    >
                        <Text style={styles.textLink}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.backgroundGradientStart,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.glassShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    content: {
        flex: 0.7,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 36,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12, // React Native 0.71+ support gap
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center text mostly
        position: 'relative',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        marginBottom: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    outlineButton: {
        backgroundColor: COLORS.transparent,
        borderWidth: 1,
        borderColor: COLORS.textMuted,
    },
    outlineButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        position: 'absolute',
        left: 20,
    },
    textLinkButton: {
        marginTop: 20,
        padding: 10,
    },
    textLink: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AuthScreen;
