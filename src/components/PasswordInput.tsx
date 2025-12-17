import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface PasswordInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChangeText,
    visible,
    setVisible,
    placeholder = 'Mật khẩu',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused
        ]}>
            <Ionicons
                name="lock-closed-outline"
                size={20}
                color={isFocused ? COLORS.primary : COLORS.textSecondary}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                selectionColor={COLORS.primary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!visible}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            <TouchableOpacity
                onPress={() => setVisible(!visible)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={visible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.surface,
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
});

export default PasswordInput;
