import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface InputProps extends TextInputProps {
    icon?: string;
}

const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused
        ]}>
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={isFocused ? COLORS.primary : COLORS.textSecondary}
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={COLORS.textSecondary}
                selectionColor={COLORS.primary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
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
});

export default Input;
