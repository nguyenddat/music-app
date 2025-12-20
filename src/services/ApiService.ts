import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../config/env.config';

// Axios Instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Interceptors
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return config;
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Axios Error Handler
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('access_token');
            // Emit event for UI to handle (e.g., navigate to Login)
            DeviceEventEmitter.emit('auth_session_expired');
        }
        return Promise.reject(error);
    }
);

export default api;