import Constants from 'expo-constants';

const getConfigValue = (key: string): string => {
    const value = Constants.expoConfig?.extra?.[key];
    if (!value) {
        console.warn(`Missing config value for: ${key}`);
        return '';
    }
    return value;
};

export const API_BASE_URL = getConfigValue('apiBaseUrl');