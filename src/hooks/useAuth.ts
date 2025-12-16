import { useState } from 'react';

import UserService, { RegisterRequest, LoginRequest, TokenResponse } from '../services/UserService';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Đăng nhập
    const login = async (request: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            const result = await UserService.login(request);
            if (!result.success) { throw result.error; }
            return result.data;
        } catch (err: any) {
            setError(
                err?.message ||
                'Đăng nhập thất bại'
            )
        } finally {
            setLoading(false);
        }
    }

    const register = async (request: RegisterRequest) => {
        try {
            setLoading(true);
            setError(null);

            const result = await UserService.register(request);
            if (!result.success) { throw result.error; }
            return result.data;
        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(
                err?.message ||
                'Đăng ký thất bại'
            )
        } finally {
            setLoading(false);
        }
    }

    return { login, register, loading, error };
}   