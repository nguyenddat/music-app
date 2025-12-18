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
    FlatList,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import ArtistService from '../../services/ArtistService';
import UserService, { OnboardingStep } from '../../services/UserService';

const { width } = Dimensions.get('window');

// Onboarding config
const TOTAL_STEPS = 4;
const CURRENT_STEP = 3; // Artist Screen is Step 3

// Define Artist interface locally or import if available
interface ArtistResponse {
    id: number;
    name: string;
    avatar_url: string;
    crawl_id: string;
    created_at: string;
}

const ArtistScreen = () => {
    const navigation = useNavigation();
    const [artists, setArtists] = useState<ArtistResponse[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value((CURRENT_STEP - 1) / TOTAL_STEPS)).current;

    useEffect(() => {
        // Entry animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
                toValue: CURRENT_STEP / TOTAL_STEPS,
                duration: 600,
                useNativeDriver: false,
            }),
        ]).start();

        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const response = await ArtistService.getArtistsByLikedGenre();
            if (response.success) {
                if (Array.isArray(response.data)) {
                    setArtists(response.data);
                } else {
                    console.warn("Unexpected artist data format:", response.data);
                    setArtists([]);
                }
            } else {
                console.error("Failed to fetch artists:", response.error);
                Alert.alert("Lỗi", "Không thể tải danh sách nghệ sĩ.");
            }
        } catch (error) {
            console.error("Error fetching artists:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };

    const toggleArtist = (id: number) => {
        if (selectedArtists.includes(id)) {
            setSelectedArtists(selectedArtists.filter((aId) => aId !== id));
        } else {
            setSelectedArtists([...selectedArtists, id]);
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
        navigation.navigate('Auth' as never);
    };

    const handleNext = async () => {
        if (selectedArtists.length === 0) return;

        setSubmitting(true);
        try {
            const response = await UserService.sendOnboarding({
                step: OnboardingStep.ARTIST,
                data: selectedArtists
            });

            if (response.success) {
                navigation.navigate('MainTabs' as never);
            } else {
                Alert.alert("Lỗi", "Không thể lưu nghệ sĩ. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error sending artists:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi kết nối.");
        } finally {
            setSubmitting(false);
        }
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const renderArtistItem = ({ item }: { item: ArtistResponse }) => {
        const isSelected = selectedArtists.includes(item.id);
        return (
            <TouchableOpacity
                onPress={() => toggleArtist(item.id)}
                activeOpacity={0.7}
                style={styles.artistItemContainer}
            >
                <View style={[
                    styles.artistImageContainer,
                    isSelected && styles.artistImageSelected
                ]}>
                    <Image
                        source={{ uri: item.avatar_url }}
                        style={styles.artistImage}
                        resizeMode="cover"
                    />

                    {isSelected && (
                        <View style={styles.overlay}>
                            <Ionicons name="checkmark-circle" size={32} color={COLORS.primary} />
                        </View>
                    )}
                </View>

                <Text style={[
                    styles.artistName,
                    isSelected && { color: COLORS.primary }
                ]} numberOfLines={1}>
                    {item.name}
                </Text>
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
                        Step {CURRENT_STEP} / {TOTAL_STEPS}
                    </Text>

                    <TouchableOpacity onPress={handleSkip} style={styles.navButton}>
                        <Text style={styles.skipText}>Skip</Text>
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
                    <Text style={styles.title}>Chọn nghệ sĩ{'\n'}bạn yêu thích</Text>
                    <Text style={styles.subtitle}>
                        Để chúng tôi gợi ý nhạc phù hợp nhất
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={artists}
                            renderItem={renderArtistItem}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3} // Grid layout 3 columns
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
                            (selectedArtists.length === 0 || submitting) && styles.ctaButtonDisabled
                        ]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                        disabled={selectedArtists.length === 0 || submitting}
                    >
                        {selectedArtists.length > 0 ? (
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
                                        <Text style={styles.ctaText}>Tiếp tục ({selectedArtists.length})</Text>
                                        <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                                    </>
                                )}
                            </LinearGradient>
                        ) : (
                            <View style={[styles.ctaGradient, { backgroundColor: COLORS.border }]}>
                                <Text style={[styles.ctaText, { color: COLORS.textSecondary }]}>Chọn nghệ sĩ</Text>
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
        justifyContent: 'space-between',
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
        backgroundColor: COLORS.border,
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
        justifyContent: 'flex-start', // Start to handle 3 columns nicely
        gap: 16, // Use gap for simpler spacing
        marginBottom: 20,
    },

    // Artist Item
    artistItemContainer: {
        width: (width - 48 - 32) / 3, // (Screen - padding - gaps) / 3
        alignItems: 'center',
    },
    artistImageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 999, // Circle
        overflow: 'hidden',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: COLORS.surface,
    },
    artistImageSelected: {
        borderColor: COLORS.primary,
    },
    artistImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    artistName: {
        fontSize: 14,
        fontFamily: FONTS.GilroyMedium,
        color: COLORS.textSecondary,
        textAlign: 'center',
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

export default ArtistScreen;
