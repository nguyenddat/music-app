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

const { width, height } = Dimensions.get('window');

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
    // Cấu hình kích thước Blob dựa trên màn hình để scale tốt trên mọi thiết bị
    const r1 = width * 0.8; // Bán kính lớn cho mảng màu chính
    const r2 = width * 0.6; // Bán kính vừa cho điểm nhấn

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {/* 1. NỀN TỔNG THỂ: Dùng Linear Gradient thay vì Fill đơn sắc 
            để tạo độ sâu ngay từ lớp dưới cùng. */}
                <Rect x={0} y={0} width={width} height={height}>
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(width, height)}
                        colors={[COLORS.background, "#1a1a2e"]} // Ví dụ: Màu nền -> Màu tối hơn chút ở đáy
                    />
                </Rect>

                {/* 2. CÁC KHỐI MÀU (SHAPES) - CỐ ĐỊNH VỊ TRÍ (Fixed Layout) */}

                {/* Shape 1: Top-Left (Góc Trên Trái) - Ánh sáng chính (Primary)
            Mô phỏng: Mặt trời hoặc nguồn sáng, rọi xuống nội dung.
        */}
                <Circle cx={0} cy={0} r={r1} color={COLORS.primary}>
                    {/* Blur cực lớn để phá vỡ hình dáng tròn, biến nó thành quầng sáng */}
                    <BlurMask blur={100} style="normal" />
                    <Paint opacity={0.5} />
                </Circle>

                {/* Shape 2: Bottom-Right (Góc Dưới Phải) - Màu nhấn (Accent/Secondary)
            Tác dụng: Neo giữ chân trang, tạo đối trọng với góc trên.
        */}
                <Circle cx={width} cy={height} r={r1} color={COLORS.secondary}>
                    <BlurMask blur={80} style="normal" />
                    <Paint opacity={0.4} blendMode="screen" />
                    {/* blendMode="screen" hoặc "overlay" giúp màu sáng lên khi hòa trộn */}
                </Circle>

                {/* Shape 3: Middle-Left (Giữa Trái) - Màu bổ trợ
            Tác dụng: Kết nối 2 mảng trên và dưới, lấp đầy khoảng trống bên sườn.
            Đặt lệch trái để chừa không gian bên phải cho nội dung (nếu có).
        */}
                <Circle cx={-40} cy={height * 0.5} r={r2} color={COLORS.accent}>
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