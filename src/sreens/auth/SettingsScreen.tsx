import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';
import UserService, { MeResponse } from '../../services/UserService';
import { useLanguage } from '../../contexts/LanguageContext';

interface SettingsScreenProps {
    navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const [user, setUser] = useState<MeResponse | null>(null);
    const { language, setLanguage, t } = useLanguage();
    const [isLangModalVisible, setLangModalVisible] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const response = await UserService.me();
        if (response.success && response.data) {
            setUser(response.data);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const renderSettingItem = (icon: string, title: string, onPress: () => void) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon as any} size={24} color={COLORS.text} />
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: user?.avatar_url || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{user?.username || 'User'}</Text>

                    <TouchableOpacity style={styles.editProfileButton}>
                        <Text style={styles.editProfileText}>{t('editProfile')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsGroup}>
                    {renderSettingItem('globe-outline', t('language'), () => setLangModalVisible(true))}
                    {renderSettingItem('color-palette-outline', t('color'), () => { })}
                </View>

                {/* Language Selection Modal */}
                <Modal
                    transparent={true}
                    visible={isLangModalVisible}
                    animationType="fade"
                    onRequestClose={() => setLangModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setLangModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('language')}</Text>

                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => {
                                    setLanguage('vi');
                                    setLangModalVisible(false);
                                }}
                            >
                                <Text style={[styles.optionText, language === 'vi' && styles.activeOption]}>{t('vietnamese')}</Text>
                                {language === 'vi' && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => {
                                    setLanguage('en');
                                    setLangModalVisible(false);
                                }}
                            >
                                <Text style={[styles.optionText, language === 'en' && styles.activeOption]}>{t('english')}</Text>
                                {language === 'en' && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setLangModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>{t('close')}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Additional settings can be added here */}
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
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 20,
        marginLeft: 10,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    username: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyBold,
        fontSize: 24,
        marginBottom: 16,
    },
    editProfileButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.glassBg,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    editProfileText: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 14,
    },
    settingsGroup: {
        width: '100%',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.glassBorder,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingTitle: {
        color: COLORS.text,
        fontFamily: FONTS.GilroyMedium,
        fontSize: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FONTS.GilroyBold,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    optionText: {
        fontSize: 16,
        fontFamily: FONTS.GilroyMedium,
        color: '#FFF',
    },
    activeOption: {
        color: COLORS.primary,
        fontFamily: FONTS.GilroyBold,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFF',
        fontFamily: FONTS.GilroyBold,
    },
});

export default SettingsScreen;
