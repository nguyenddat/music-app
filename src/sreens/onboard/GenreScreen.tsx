import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

    StatusBar,
    Animated,
    Dimensions,
    ActivityIndicator,
    Alert,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import GenreService, { GenreResponse } from '../../services/GenreService';
import UserService, { OnboardingStep } from '../../services/UserService';
import { useLanguage } from '../../contexts/LanguageContext';


const { width } = Dimensions.get('window');

// Onboarding config
const TOTAL_STEPS = 4;
const CURRENT_STEP = 2; // Genre Screen is Step 2

const GenreScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const [genres, setGenres] = useState<GenreResponse[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true, // Use true for opacity/transform
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
                toValue: CURRENT_STEP / TOTAL_STEPS,
                duration: 600,
                useNativeDriver: false, // Width doesn't support native driver
            }),
        ]).start();

        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        setLoading(true);
        try {
            const response = await GenreService.getGenres();
            if (response.success) {
                setGenres(response.data);
            } else {
                console.error("Failed to fetch genres:", response.error);
                Alert.alert(t('error'), t('cannotLoadGenres'));
            }
        } catch (error) {
            console.error("Error fetching genres:", error);
            Alert.alert(t('error'), t('connectionError'));
        } finally {
            setLoading(false);
        }
    };

    const toggleGenre = (id: number) => {
        if (selectedGenres.includes(id)) {
            setSelectedGenres(selectedGenres.filter((gId) => gId !== id));
        } else {
            setSelectedGenres([...selectedGenres, id]);
        }
    };

    const handleBack = () => {
        // Animate progress bar backwards before navigating
        Animated.timing(progressAnim, {
            toValue: (CURRENT_STEP - 1) / TOTAL_STEPS,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            navigation.goBack();
        });
    };

    const handleSkip = () => {
        // Skip to Auth (or next step if exists)
        navigation.navigate('Artist' as never);
    };

    const handleNext = async () => {
        if (selectedGenres.length === 0) return;

        setSubmitting(true);
        try {
            const response = await UserService.sendOnboarding({
                step: OnboardingStep.GENRE,
                data: selectedGenres
            });

            if (response.success) {
                // Navigate to next screen (Artist)
                navigation.navigate('Artist' as never);
            } else {
                Alert.alert(t('error'), t('cannotSaveGenres'));
            }
        } catch (error) {
            console.error("Error sending genres:", error);
            Alert.alert(t('error'), t('connectionError'));
        } finally {
            setSubmitting(false);
        }
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const renderGenreItem = ({ item }: { item: GenreResponse }) => {
        const isSelected = selectedGenres.includes(item.id);
        return (
            <TouchableOpacity
                onPress={() => toggleGenre(item.id)}
                activeOpacity={0.7}
                style={[
                    styles.genreItem,
                    isSelected && styles.genreItemSelected,
                ]}
            >
                {isSelected && (
                    <LinearGradient
                        colors={COLORS.gradientPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}

                <Text style={[
                    styles.genreText,
                    isSelected && styles.genreTextSelected
                ]}>
                    {item.name}
                </Text>

                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* ===== HEADER ===== */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.navButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <Text style={styles.progressText}>
                        {t('step')} {CURRENT_STEP} / {TOTAL_STEPS}
                    </Text>

                    <TouchableOpacity onPress={handleSkip} style={styles.navButton}>
                        <Text style={styles.skipText}>{t('skip')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: progressWidth },
                            ]}
                        />
                    </View>
                </View>

                {/* ===== BODY ===== */}
                <Animated.View
                    style={[
                        styles.body,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.title}>{t('chooseGenres')}</Text>
                    <Text style={styles.subtitle}>
                        {t('recommendBestMusic')}
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={genres}
                            renderItem={renderGenreItem}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2} // Grid layout
                            columnWrapperStyle={styles.columnWrapper}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </Animated.View>

                {/* ===== FOOTER ===== */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.ctaButton,
                            (selectedGenres.length === 0 || submitting) && styles.ctaButtonDisabled
                        ]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                        disabled={selectedGenres.length === 0 || submitting}
                    >
                        {selectedGenres.length > 0 ? (
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaGradient}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <>
                                        <Text style={styles.ctaText}>{t('continue')} ({selectedGenres.length})</Text>
                                        <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                                    </>
                                )}
                            </LinearGradient>
                        ) : (
                            <View style={[styles.ctaGradient, { backgroundColor: COLORS.border }]}>
                                <Text style={[styles.ctaText, { color: COLORS.textSecondary }]}>{t('selectGenres')}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#000000', // Pure black like home screen
    },
    container: {
        flex: 1,
    },

    // ===== HEADER =====
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed to space-between for Back/Title/Skip
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    navButton: {
        padding: 8,
    },
    progressText: {
        fontSize: 14,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.textSecondary,
    },
    skipText: {
        fontSize: 14,
        fontFamily: FONTS.GilroyMedium,
        color: COLORS.textSecondary,
    },

    // Progress Bar
    progressBarContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: COLORS.border, // Darker bg
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },

    // ===== BODY =====
    body: {
        flex: 1,
        paddingHorizontal: 20, // Match home screen 20px padding
    },
    title: {
        fontSize: 28,
        fontFamily: FONTS.GilroyBold,
        color: COLORS.white,
        lineHeight: 36,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.GilroyRegular,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // List
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    genreItem: {
        flex: 0.48, // ~48% to fit 2 columns with space
        height: 100,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden', // Contain gradient
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    genreItemSelected: {
        borderColor: 'transparent',
    },
    genreText: {
        fontSize: 16,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.textSecondary,
        zIndex: 2, // Above gradient
    },
    genreTextSelected: {
        color: COLORS.white,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },

    // ===== FOOTER =====
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    ctaButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    ctaButtonDisabled: {
        // Optional styling for disabled state
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    ctaText: {
        fontSize: 18,
        fontFamily: FONTS.GilroySemiBold,
        color: COLORS.white,
    },
});

export default GenreScreen;
