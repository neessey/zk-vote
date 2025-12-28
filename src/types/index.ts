export interface User {
    id: string;
    email: string;
    role: 'admin' | 'votant';
    created_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Election {
    id: string;
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    active: boolean;
    created_by: string;
    created_at: string;
    election_options: ElectionOption[];
}

export interface ElectionOption {
    id: string;
    election_id: string;
    label: string;
    order: number;
}

export interface Vote {
    id: string;
    election_id: string;
    hash_vote: string;
    zk_proof: string;
    timestamp: string;
}

export interface VoteResult {
    option_id: string;
    label: string;
    votes: number;
}

export interface ElectionResults {
    election: {
        id: string;
        titre: string;
        description: string;
    };
    results: VoteResult[];
    totalVotes: number;
}

export interface VoteStatus {
    hasVoted: boolean;
    voteHash?: string;
    timestamp?: string;
}

export interface CreateElectionData {
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    options: string[];
}
