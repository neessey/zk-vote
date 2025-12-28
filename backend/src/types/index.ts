export interface User {
    id: string;
    email: string;
    role: 'admin' | 'votant';
    created_at: string;
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
    options: ElectionOption[];
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
    user_id: string;
    zk_proof: string;
    hash_vote: string;
    timestamp: string;
}

export interface VoteRequest {
    election_id: string;
    option_id: string;
}

export interface CreateElectionRequest {
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    options: string[];
}

export interface AuthRequest {
    email: string;
    password: string;
}
