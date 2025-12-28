/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role?: 'admin' | 'votant') => Promise<void>;
    logout: () => void;
    loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authApi.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Erreur de connexion',
                isLoading: false
            });
            throw error;
        }
    },

    register: async (email, password, role = 'votant') => {
        set({ isLoading: true, error: null });
        try {
            const data = await authApi.register(email, password, role);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
        } catch (error: any) {
            console.error("Erreur inscription :", error);
            set({
                error: error.response?.data?.error || error.message || 'Erreur d\'inscription',
                isLoading: false
            });
            throw error;
        }
    }
    ,

    logout: () => {
        authApi.logout();
        set({ user: null, token: null });
    },

    loadFromStorage: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ user, token });
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    },
}));
