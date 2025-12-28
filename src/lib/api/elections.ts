import { apiClient } from './client';
import { Election, ElectionResults, CreateElectionData } from '@/types';

export const electionsApi = {
    getAll: async (): Promise<Election[]> => {
        const response = await apiClient.get('/elections');
        return response.data;
    },

    getById: async (id: string): Promise<Election> => {
        const response = await apiClient.get(`/elections/${id}`);
        return response.data;
    },

    create: async (data: CreateElectionData): Promise<Election> => {
        const response = await apiClient.post('/elections', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateElectionData>): Promise<Election> => {
        const response = await apiClient.put(`/elections/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/elections/${id}`);
    },

    getResults: async (id: string): Promise<ElectionResults> => {
        const response = await apiClient.get(`/elections/${id}/results`);
        return response.data;
    },
};
