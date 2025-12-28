"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElectionResults = exports.deleteElection = exports.updateElection = exports.getElection = exports.getElections = exports.createElection = void 0;
const supabase_1 = require("../config/supabase");
const createElection = async (req, res) => {
    try {
        const { titre, description, date_debut, date_fin, options } = req.body;
        const userId = req.user?.id;
        if (!titre || !description || !date_debut || !date_fin || !options || options.length < 2) {
            return res.status(400).json({ error: 'Données invalides. Au moins 2 options requises.' });
        }
        // Créer l'élection
        const { data: election, error: electionError } = await supabase_1.supabase
            .from('elections')
            .insert([
            {
                titre,
                description,
                date_debut,
                date_fin,
                active: true,
                created_by: userId
            }
        ])
            .select()
            .single();
        if (electionError) {
            return res.status(400).json({ error: electionError.message });
        }
        // Créer les options de vote
        const optionsData = options.map((label, index) => ({
            election_id: election.id,
            label,
            order: index
        }));
        const { error: optionsError } = await supabase_1.supabase
            .from('election_options')
            .insert(optionsData);
        if (optionsError) {
            // Rollback: supprimer l'élection si les options échouent
            await supabase_1.supabase.from('elections').delete().eq('id', election.id);
            return res.status(400).json({ error: optionsError.message });
        }
        // Récupérer l'élection complète avec les options
        const { data: fullElection } = await supabase_1.supabase
            .from('elections')
            .select(`
        *,
        election_options (*)
      `)
            .eq('id', election.id)
            .single();
        res.status(201).json(fullElection);
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createElection = createElection;
const getElections = async (req, res) => {
    try {
        const { data: elections, error } = await supabase_1.supabase
            .from('elections')
            .select(`
        *,
        election_options (*),
        users!elections_created_by_fkey (email)
      `)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(elections);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des élections:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getElections = getElections;
const getElection = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: election, error } = await supabase_1.supabase
            .from('elections')
            .select(`
        *,
        election_options (*),
        users!elections_created_by_fkey (email)
      `)
            .eq('id', id)
            .single();
        if (error) {
            return res.status(404).json({ error: 'Élection non trouvée' });
        }
        res.json(election);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getElection = getElection;
const updateElection = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description, date_debut, date_fin, active } = req.body;
        const userId = req.user?.id;
        // Vérifier que l'utilisateur est le créateur ou un admin
        const { data: election } = await supabase_1.supabase
            .from('elections')
            .select('created_by')
            .eq('id', id)
            .single();
        if (!election || (election.created_by !== userId && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const { data, error } = await supabase_1.supabase
            .from('elections')
            .update({ titre, description, date_debut, date_fin, active })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateElection = updateElection;
const deleteElection = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // Vérifier que l'utilisateur est le créateur ou un admin
        const { data: election } = await supabase_1.supabase
            .from('elections')
            .select('created_by')
            .eq('id', id)
            .single();
        if (!election || (election.created_by !== userId && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const { error } = await supabase_1.supabase
            .from('elections')
            .delete()
            .eq('id', id);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ message: 'Élection supprimée avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteElection = deleteElection;
const getElectionResults = async (req, res) => {
    try {
        const { id } = req.params;
        // Récupérer l'élection
        const { data: election, error: electionError } = await supabase_1.supabase
            .from('elections')
            .select(`
        *,
        election_options (*)
      `)
            .eq('id', id)
            .single();
        if (electionError || !election) {
            return res.status(404).json({ error: 'Élection non trouvée' });
        }
        // Compter les votes pour chaque option
        const results = await Promise.all(election.election_options.map(async (option) => {
            const { count } = await supabase_1.supabase
                .from('votes')
                .select('*', { count: 'exact', head: true })
                .eq('election_id', id)
                .eq('option_id', option.id);
            return {
                option_id: option.id,
                label: option.label,
                votes: count || 0
            };
        }));
        // Compter le total des votes
        const { count: totalVotes } = await supabase_1.supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('election_id', id);
        res.json({
            election: {
                id: election.id,
                titre: election.titre,
                description: election.description
            },
            results,
            totalVotes: totalVotes || 0
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getElectionResults = getElectionResults;
