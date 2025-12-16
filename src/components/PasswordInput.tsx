import React from 'react';
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
    return (
        <View style={styles.inputContainer}>
            <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted || '#888'}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textMuted || '#888'}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!visible}
                {...props}
            />
            <TouchableOpacity
                onPress={() => setVisible(!visible)}
                style={styles.eyeIcon}
            >
                <Ionicons
                    name={visible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.textMuted || '#888'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white || '#fff',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        height: 56,
        shadowColor: COLORS.glassShadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.transparent || 'transparent',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: COLORS.text || '#000',
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
});

export default PasswordInput;
