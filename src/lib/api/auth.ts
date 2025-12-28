import { apiClient } from './client';
import { AuthResponse, User } from '@/types';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://zk-vote-production.up.railway.app";

export const authApi = {
    register: async (email: string, password: string, role: 'admin' | 'votant' = 'votant'): Promise<AuthResponse> => {
        const response = await apiClient.post(`${API_URL}/api/auth/register`, { email, password, role });
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await apiClient.post(`${API_URL}/api/auth/login`, { email, password });
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get(`${API_URL}/api/auth/profile`);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
