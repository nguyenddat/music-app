import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface GlassContainerProps extends ViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: 'light' | 'medium' | 'strong';
}

const GlassContainer: React.FC<GlassContainerProps> = ({
    children,
    style,
    intensity = 'medium',
    ...props
}) => {
    const getBackgroundColor = () => {
        switch (intensity) {
            case 'light': return 'rgba(255, 255, 255, 0.25)';
            case 'strong': return 'rgba(255, 255, 255, 0.9)';
            case 'medium':
            default:
                return 'rgba(255, 255, 255, 0.5)';
        }
    };

    const getBorderColor = () => {
        switch (intensity) {
            case 'light': return 'rgba(255, 255, 255, 0.25)';
            case 'strong': return 'rgba(255, 255, 255, 0.8)';
            case 'medium':
            default:
                return 'rgba(255, 255, 255, 0.5)';
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 28,
        borderWidth: 2,

        // Enhanced shadow for more depth
        shadowColor: '#7B6CFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,

        padding: 20,
        overflow: 'hidden',
    },
});

export default GlassContainer;
