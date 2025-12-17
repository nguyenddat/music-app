import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "./ApiService";

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    is_onboarded: boolean;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}


// Enum các onboarding steps
export enum OnboardingStep {
    GENRE = 'genre',
    ARTIST = 'artist',
}

export interface OnboardingRequest {
    step: OnboardingStep;
    data: number[];
}

export interface OnboardingResponse {
    success: boolean;
}

export interface MeResponse {
    username: string;
    avatar_url: string;
    is_active: boolean;
}

class UserService {
    // Đăng ký
    async register(request: RegisterRequest): Promise<{ success: boolean; data: TokenResponse | null; error: any }> {
        try {
            const response = await api.post("/user/register", request);
            await this.saveToken(response.data);
            return { "success": true, "data": response.data, "error": null };
        } catch (error) {
            return { "success": false, "data": null, "error": error };
        }
    }

    // Đăng nhập
    async login(request: LoginRequest): Promise<{ success: boolean; data: TokenResponse | null; error: any }> {
        const formData = new URLSearchParams();
        formData.append("username", request.email);
        formData.append("password", request.password);

        try {
            const response = await api.post("/user/login", formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
            await this.saveToken(response.data);
            return { "success": true, "data": response.data, "error": null };
        } catch (error) {
            return { "success": false, "data": null, "error": error };
        }
    }

    async saveToken(token: TokenResponse): Promise<void> {
        await AsyncStorage.multiSet([
            ["access_token", token.access_token],
            ["refresh_token", token.refresh_token],
        ])
    }


    // Gửi kết quả onboarding, kèm với bearer token
    async sendOnboarding(request: OnboardingRequest): Promise<{ success: boolean; data: any, error: any }> {
        try {
            const response = await api.post('/user/onboard', request);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }

    // Lấy thông tin người dùng
    async me(): Promise<{ success: boolean; data: MeResponse | null; error: any }> {
        try {
            const response = await api.get('/user/me');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }
}

export default new UserService();