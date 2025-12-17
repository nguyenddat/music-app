export const FONTS = {
    // Gilroy Font Family
    GilroyLight: 'Gilroy-Light',
    GilroyRegular: 'Gilroy-Regular',
    GilroyMedium: 'Gilroy-Medium',
    GilroySemiBold: 'Gilroy-SemiBold',
    GilroyBold: 'Gilroy-Bold',
} as const;

export const FONT_WEIGHTS = {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
} as const;

export const TYPOGRAPHY = {
    // Headings
    h1: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    h3: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.2,
    },
    h4: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
    },

    // Body Text
    bodyLarge: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
    },
    body: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
    },
    bodySmall: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
    },

    // Special Text Styles
    label: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    caption: {
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
    },
    button: {
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
    },

    // Header/Navigation
    headerTitle: {
        fontFamily: FONTS.GilroyLight,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: 0.5,
    },
    tabLabel: {
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
    },
} as const;
