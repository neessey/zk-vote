import { apiClient } from './client';
import { AuthResponse, User } from '@/types';

export const authApi = {
    register: async (email: string, password: string, role: 'admin' | 'votant' = 'votant'): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/register', { email, password, role });
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
