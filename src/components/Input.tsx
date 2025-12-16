import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface InputProps extends TextInputProps {
    icon?: string;
}

const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {
    return (
        <View style={styles.inputContainer}>
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={COLORS.textMuted || '#888'}
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={COLORS.textMuted || '#888'}
                {...props}
            />
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
});

export default Input;
