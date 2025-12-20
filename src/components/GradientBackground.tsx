import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
    Canvas,
    Rect,
    Group,
    Fill,
    BlurMask,
    Circle,
    Paint,
    vec,
    LinearGradient,
    mix,
} from "@shopify/react-native-skia";

import { COLORS } from "../constants/colors";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";

// Helper functions to manipulate colors
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const darkenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = 1 - percent / 100;
    const r = Math.floor(rgb.r * factor);
    const g = Math.floor(rgb.g * factor);
    const b = Math.floor(rgb.b * factor);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const lightenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    const r = Math.floor(rgb.r + (255 - rgb.r) * factor);
    const g = Math.floor(rgb.g + (255 - rgb.g) * factor);
    const b = Math.floor(rgb.b + (255 - rgb.b) * factor);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const { width, height } = Dimensions.get('window');

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
    const { dominantColor } = useMusicPlayer();
    const r1 = width * 0.8;
    const r2 = width * 0.6;

    // Tạo bảng màu từ dominant color của album
    const primaryColor = dominantColor || COLORS.primary;
    const secondaryColor = lightenColor(primaryColor, 15);
    const accentColor = darkenColor(primaryColor, 20);

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {/* 1. NỀN TỔNG THỂ: Dùng Linear Gradient từ màu album 
            để tạo độ sâu ngay từ lớp dưới cùng. */}
                <Rect x={0} y={0} width={width} height={height}>
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(width, height)}
                        colors={[COLORS.background, darkenColor(primaryColor, 60)]} // Từ nền tối -> màu album tối
                    />
                </Rect>

                {/* 2. CÁC KHỐI MÀU (SHAPES) - CỐ ĐỊNH VỊ TRÍ (Fixed Layout) */}

                {/* Shape 1: Top-Left (Góc Trên Trái) - Màu chính từ album
            Mô phỏng: Mặt trời hoặc nguồn sáng, rọi xuống nội dung.
        */}
                <Circle cx={0} cy={0} r={r1} color={primaryColor}>
                    {/* Blur cực lớn để phá vỡ hình dáng tròn, biến nó thành quầng sáng */}
                    <BlurMask blur={100} style="normal" />
                    <Paint opacity={0.5} />
                </Circle>

                {/* Shape 2: Bottom-Right (Góc Dưới Phải) - Màu phụ từ album
            Tác dụng: Neo giữ chân trang, tạo đối trọng với góc trên.
        */}
                <Circle cx={width} cy={height} r={r1} color={secondaryColor}>
                    <BlurMask blur={80} style="normal" />
                    <Paint opacity={0.4} blendMode="screen" />
                    {/* blendMode="screen" hoặc "overlay" giúp màu sáng lên khi hòa trộn */}
                </Circle>

                {/* Shape 3: Middle-Left (Giữa Trái) - Màu nhấn từ album
            Tác dụng: Kết nối 2 mảng trên và dưới, lấp đầy khoảng trống bên sườn.
            Đặt lệch trái để chừa không gian bên phải cho nội dung (nếu có).
        */}
                <Circle cx={-40} cy={height * 0.5} r={r2} color={accentColor}>
                    <BlurMask blur={90} style="normal" />
                    <Paint opacity={0.3} blendMode="softLight" />
                </Circle>

                {/* 3. LỚP PHỦ HOÀN THIỆN (FINISHING TEXTURE) 
            Không dùng Turbulence quá mạnh gây rối mắt. 
            Ta dùng một lớp phủ mờ (vignette) hoặc noise cực nhẹ.
        */}
                {/* Tùy chọn: Thêm một chút Noise nhẹ nếu muốn style Retro/Film */}
                {/* <Group opacity={0.03}>
            <Turbulence freqX={0.5} freqY={0.5} octaves={2} />
         </Group> */}

            </Canvas>

            {/* Nội dung App - Sử dụng SafeAreaView hoặc Padding hợp lý */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
    },
    content: {
        flex: 1,
        zIndex: 10,
        // Không fix cứng padding 20, để bên ngoài tự quyết định layout
    },
});

export default GradientBackground;