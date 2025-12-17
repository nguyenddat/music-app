export const COLORS = {
    // === PHÂN CẤP MÀU CHÍNH (BRAND COLORS) ===
    // Primary: Màu Cam Đào nổi bật nhất trên nền tối (Dùng cho nút chính, active state)
    primary: '#FFA586',
    primaryLight: '#FFC2A8', // Màu cam nhạt hơn (cho hover hoặc background nhẹ)
    primaryDark: '#D68266',  // Màu cam đậm hơn

    // Secondary: Màu Đỏ Thẫm (Dùng cho gradient, nút phụ)
    secondary: '#B51A2B',
    secondaryLight: '#D4384B',
    secondaryDark: '#8F1220',

    // Accent: Màu Đỏ Tía đậm (Dùng cho bóng đổ, điểm nhấn sâu)
    accent: '#541A2E',

    // === MÀU NỀN & BỐ CỤC (BACKGROUNDS) ===
    // Background chính: Xanh đen đậm nhất
    background: '#161E2F',

    // Surface/Card: Xanh đen vừa (Dùng cho thẻ bài hát, thanh player)
    surface: '#242F49',

    // Border/Divider: Xanh xám (Dùng cho đường kẻ chia cách)
    border: '#384358',

    // Gradient nền tổng thể (Ví dụ: từ Đỏ tía lên Xanh đen)
    backgroundGradientStart: '#541A2E',
    backgroundGradientEnd: '#161E2F',

    // === TYPOGRAPHY (TEXT) ===
    // Text chính: Trắng (Bắt buộc cho Dark Mode để dễ đọc)
    text: '#FFFFFF',

    // Text phụ: Xám xanh (Lấy từ màu nhạt nhất trong nhóm xanh) hoặc Cam nhạt
    textSecondary: '#A0AEC0',

    // Text mờ: Xanh xám đậm
    textMuted: '#384358',

    // Text highlight: Cam đào (Dùng cho các từ khóa nhấn mạnh)
    textHighlight: '#FFA586',

    // === ICONS & UI ELEMENTS ===
    icon: '#FFA586',        // Icon chính theo màu Primary
    iconInactive: '#384358', // Icon chưa active theo màu Border
    divider: 'rgba(56, 67, 88, 0.5)', // Dùng màu #384358 với opacity

    // === STATUS (Trạng thái) ===
    // Điều chỉnh nhẹ để dịu mắt hơn trên nền tối
    success: '#4FD1C5',
    warning: '#F6AD55',
    error: '#FF6B6B', // Đỏ tươi hơn chút để báo lỗi rõ trên nền tối
    info: '#63B3ED',

    // === GLASSMORPHISM (Hiệu ứng kính) ===
    // Hiệu ứng kính trên nền tối cần border sáng mờ và nền tối có độ trong suốt
    glassBg: 'rgba(36, 47, 73, 0.6)', // Dựa trên màu Surface #242F49
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassShadow: 'rgba(0, 0, 0, 0.4)',

    // === GRADIENTS ===
    // Gradient chính: Cam đào sang Đỏ thẫm (Rất đẹp cho nút bấm hoặc Card "Now Playing")
    gradientPrimary: ['#FFA586', '#B51A2B'],

    // Gradient phụ: Đỏ thẫm sang Đỏ tía
    gradientSecondary: ['#B51A2B', '#541A2E'],

    // Gradient Aurora (Cực quang): Dùng làm nền mờ phía sau
    gradientAurora: ['#161E2F', '#B51A2B', '#FFA586'],

    // === BASE COLORS ===
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // === PALETTE GỐC (Tham chiếu từ ảnh) ===
    palette: {
        deepBlue: '#161E2F',  //
        navy: '#242F49',      //
        slate: '#384358',     //
        peach: '#FFA586',     //
        crimson: '#B51A2B',   //
        burgundy: '#541A2E',  //
    }
} as const;