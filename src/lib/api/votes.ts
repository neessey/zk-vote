import { apiClient } from './client';
import { VoteStatus } from '@/types';

export const votesApi = {
    cast: async (election_id: string, option_id: string) => {
        const response = await apiClient.post('/votes', { election_id, option_id });
        return response.data;
    },

    verify: async (voteHash: string) => {
        const response = await apiClient.get(`/votes/verify/${voteHash}`);
        return response.data;
    },

    getStatus: async (election_id: string): Promise<VoteStatus> => {
        const response = await apiClient.get(`/votes/status/${election_id}`);
        return response.data;
    },

    getAll: async (election_id: string) => {
        const response = await apiClient.get(`/votes/election/${election_id}`);
        return response.data;
    },
};
