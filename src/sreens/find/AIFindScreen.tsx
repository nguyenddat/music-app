import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import MusicService, { MusicMatchResponse } from '../../services/MusicService';

const { width } = Dimensions.get('window');

interface AIFindScreenProps {
    navigation: any;
}

const AIFindScreen: React.FC<AIFindScreenProps> = ({ navigation }) => {
    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [matchResults, setMatchResults] = useState<MusicMatchResponse[]>([]);
    const musicService = MusicService;

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['audio/*', 'video/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const file = result.assets[0];
                console.log('Selected file:', file);
                setSelectedFile(file);
                // Reset previous results when new file is picked
                setMatchResults([]);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const handleFind = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setMatchResults([]);

        try {
            const response = await musicService.getMusicByFile(selectedFile);
            if (response.success) {
                setMatchResults(response.data);
            } else {
                Alert.alert('Error', 'Failed to match music');
            }
        } catch (error) {
            console.error('Error matching music:', error);
            Alert.alert('Error', 'An error occurred while matching music');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* Header - Only Cancel Button */}
            <View style={styles.header}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.glassCard}>
                        <Text style={styles.title}>
                            Find Song by Audio/Video
                        </Text>
                        <Text style={styles.description}>
                            Upload a video or audio file to find the matching song.
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.uploadArea,
                                selectedFile && styles.uploadAreaSelected
                            ]}
                            activeOpacity={0.7}
                            onPress={handlePickDocument}
                        >
                            <View style={[
                                styles.iconCircle,
                                selectedFile && styles.iconCircleSelected
                            ]}>
                                <Ionicons
                                    name={selectedFile ? "musical-note" : "cloud-upload-outline"}
                                    size={40}
                                    color={selectedFile ? COLORS.success : COLORS.primary}
                                />
                            </View>

                            {selectedFile ? (
                                <>
                                    <Text style={styles.uploadText} numberOfLines={1} ellipsizeMode="middle">
                                        {selectedFile.name}
                                    </Text>
                                    <Text style={styles.uploadSubText}>
                                        {(selectedFile.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                                    </Text>
                                    <Text style={styles.changeFileText}>Tap to change file</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.uploadText}>Tap to Upload File</Text>
                                    <Text style={styles.uploadSubText}>Supports MP3, MP4</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        {/* Find Button */}
                        <TouchableOpacity
                            style={[
                                styles.findButton,
                                (!selectedFile || isLoading) && styles.findButtonDisabled
                            ]}
                            activeOpacity={0.7}
                            onPress={handleFind}
                            disabled={!selectedFile || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.findButtonText}>
                                    {selectedFile ? "Find Match" : "Select a file first"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* Results List */}
                    {matchResults.length > 0 && (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.resultsTitle}>Matching Results</Text>
                            {matchResults.map((result, index) => (
                                <View key={result.id || index} style={styles.resultItem}>
                                    <Image
                                        source={{ uri: result.avatar_url }}
                                        style={styles.resultImage}
                                    />
                                    <View style={styles.resultInfo}>
                                        <Text style={styles.resultName} numberOfLines={1}>{result.name}</Text>
                                        <Text style={styles.resultArtist} numberOfLines={1}>
                                            {result.artists.join(', ')}
                                        </Text>
                                    </View>
                                    <View style={styles.scoreContainer}>
                                        <Text style={[
                                            styles.scoreText,
                                            { color: result.match_score > 70 ? COLORS.success : COLORS.error }
                                        ]}>
                                            {result.match_score}%
                                        </Text>
                                        <Text style={styles.scoreLabel}>Match</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        height: 50,
    },
    cancelText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    glassCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    title: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    uploadArea: {
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    uploadAreaSelected: {
        borderColor: COLORS.success,
        borderStyle: 'solid',
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(123, 108, 255, 0.1)', // Light tint of primary color
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircleSelected: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    uploadText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroySemiBold,
        fontSize: 18,
        marginBottom: 6,
        textAlign: 'center',
    },
    uploadSubText: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 14,
    },
    changeFileText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 12,
        marginTop: 8,
        opacity: 0.6,
    },
    findButton: {
        width: '100%',
        height: 56,
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    findButtonDisabled: {
        opacity: 0.6,
    },
    findButtonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.GilroyBold,
        fontSize: 18,
    },
    resultsContainer: {
        width: '100%',
        marginTop: 30,
    },
    resultsTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 20,
        marginBottom: 16,
        textAlign: 'left',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    resultImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    resultInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    resultName: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 16,
        marginBottom: 4,
    },
    resultArtist: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 12,
    },
    scoreText: {
        fontFamily: FONTS.GilroyBold,
        fontSize: 18,
    },
    scoreLabel: {
        color: COLORS.textSecondary,
        fontFamily: FONTS.GilroyRegular,
        fontSize: 12,
        marginTop: 2,
    },
});

export default AIFindScreen;
