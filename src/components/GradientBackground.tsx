import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* Base gradient - Rich purple to pink */}
            <LinearGradient
                colors={['#5B4FE5', '#7B6CFF', '#9F8CFF', '#FFD1E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Overlay gradient 1 - Top left glow */}
            <LinearGradient
                colors={['rgba(143, 227, 255, 0.4)', 'transparent', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 0.6 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Overlay gradient 2 - Bottom right glow */}
            <LinearGradient
                colors={['transparent', 'transparent', 'rgba(255, 138, 207, 0.5)']}
                start={{ x: 0.4, y: 0.4 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Radial-like center glow effect */}
            <LinearGradient
                colors={['transparent', 'rgba(185, 179, 255, 0.3)', 'transparent']}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 0.7 }}
                style={StyleSheet.absoluteFillObject}
            />

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;
