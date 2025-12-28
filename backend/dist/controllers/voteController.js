"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVotes = exports.getUserVoteStatus = exports.verifyVote = exports.castVote = void 0;
const supabase_1 = require("../config/supabase");
const zkProof_1 = require("../utils/zkProof");
const castVote = async (req, res) => {
    try {
        const { election_id, option_id } = req.body;
        const userId = req.user?.id;
        if (!election_id || !option_id) {
            return res.status(400).json({ error: 'Données invalides' });
        }
        // Vérifier que l'élection existe et est active
        const { data: election, error: electionError } = await supabase_1.supabase
            .from('elections')
            .select('*')
            .eq('id', election_id)
            .single();
        if (electionError || !election) {
            return res.status(404).json({ error: 'Élection non trouvée' });
        }
        if (!election.active) {
            return res.status(400).json({ error: 'Cette élection n\'est pas active' });
        }
        // Vérifier la période de vote
        const now = new Date();
        const dateDebut = new Date(election.date_debut);
        const dateFin = new Date(election.date_fin);
        if (now < dateDebut) {
            return res.status(400).json({ error: 'Le vote n\'a pas encore commencé' });
        }
        if (now > dateFin) {
            return res.status(400).json({ error: 'Le vote est terminé' });
        }
        // Vérifier que l'option existe
        const { data: option } = await supabase_1.supabase
            .from('election_options')
            .select('*')
            .eq('id', option_id)
            .eq('election_id', election_id)
            .single();
        if (!option) {
            return res.status(404).json({ error: 'Option non trouvée' });
        }
        // Vérifier que l'utilisateur n'a pas déjà voté
        const { data: existingVote } = await supabase_1.supabase
            .from('votes')
            .select('*')
            .eq('election_id', election_id)
            .eq('user_id', userId)
            .single();
        if (existingVote) {
            return res.status(400).json({ error: 'Vous avez déjà voté pour cette élection' });
        }
        // Générer la preuve ZK et le hash du vote
        const timestamp = Date.now();
        const zkProof = (0, zkProof_1.generateZKProof)(userId, option_id, election_id);
        const voteHash = (0, zkProof_1.generateVoteHash)(option_id, election_id, timestamp);
        // Enregistrer le vote
        const { data: vote, error: voteError } = await supabase_1.supabase
            .from('votes')
            .insert([
            {
                election_id,
                user_id: userId,
                option_id,
                zk_proof: zkProof,
                hash_vote: voteHash,
                timestamp: new Date(timestamp).toISOString()
            }
        ])
            .select()
            .single();
        if (voteError) {
            return res.status(400).json({ error: voteError.message });
        }
        // Retourner une confirmation sans révéler l'option votée
        res.status(201).json({
            message: 'Vote enregistré avec succès',
            voteHash: vote.hash_vote,
            zkProof: vote.zk_proof,
            timestamp: vote.timestamp
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'enregistrement du vote:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.castVote = castVote;
const verifyVote = async (req, res) => {
    try {
        const { voteHash } = req.params;
        const { data: vote, error } = await supabase_1.supabase
            .from('votes')
            .select(`
        id,
        hash_vote,
        zk_proof,
        timestamp,
        elections (titre)
      `)
            .eq('hash_vote', voteHash)
            .single();
        if (error || !vote) {
            return res.status(404).json({ error: 'Vote non trouvé' });
        }
        // Vérifier la preuve ZK
        const isValid = (0, zkProof_1.verifyZKProof)(vote.zk_proof);
        res.json({
            valid: isValid,
            voteHash: vote.hash_vote,
            timestamp: vote.timestamp,
            election: vote.elections[0].titre,
            message: isValid ? 'Vote vérifié et valide' : 'Preuve invalide'
        });
    }
    catch (error) {
        console.error('Erreur lors de la vérification du vote:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.verifyVote = verifyVote;
const getUserVoteStatus = async (req, res) => {
    try {
        const { election_id } = req.params;
        const userId = req.user?.id;
        const { data: vote } = await supabase_1.supabase
            .from('votes')
            .select('id, hash_vote, timestamp')
            .eq('election_id', election_id)
            .eq('user_id', userId)
            .single();
        if (vote) {
            res.json({
                hasVoted: true,
                voteHash: vote.hash_vote,
                timestamp: vote.timestamp
            });
        }
        else {
            res.json({
                hasVoted: false
            });
        }
    }
    catch (error) {
        console.error('Erreur lors de la vérification du statut de vote:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getUserVoteStatus = getUserVoteStatus;
const getAllVotes = async (req, res) => {
    try {
        const { election_id } = req.params;
        // Récupérer tous les votes (sans révéler les identités)
        const { data: votes, error } = await supabase_1.supabase
            .from('votes')
            .select('id, hash_vote, zk_proof, timestamp')
            .eq('election_id', election_id)
            .order('timestamp', { ascending: true });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({
            total: votes.length,
            votes: votes.map(vote => ({
                hash: vote.hash_vote,
                zkProof: vote.zk_proof,
                timestamp: vote.timestamp,
                verified: (0, zkProof_1.verifyZKProof)(vote.zk_proof)
            }))
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des votes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getAllVotes = getAllVotes;
