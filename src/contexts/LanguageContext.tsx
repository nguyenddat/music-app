import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, LanguageCode, TranslationKey } from '../i18n/translations';

export type { LanguageCode, TranslationKey };

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<LanguageCode>('vi');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('app_language');
            if (savedLanguage === 'en' || savedLanguage === 'vi') {
                setLanguageState(savedLanguage);
            }
        } catch (error) {
            console.error('Failed to load language', error);
        }
    };

    const setLanguage = async (lang: LanguageCode) => {
        try {
            setLanguageState(lang);
            await AsyncStorage.setItem('app_language', lang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
