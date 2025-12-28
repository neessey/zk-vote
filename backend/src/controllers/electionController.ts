/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const createElection = async (req: AuthRequest, res: Response) => {
    try {
        const { titre, description, date_debut, date_fin, options } = req.body as unknown as { titre: string; description: string; date_debut: string; date_fin: string; options: string[] };
        const userId = req.user?.id;

        if (!titre || !description || !date_debut || !date_fin || !options || options.length < 2) {
            return res.status(400).json({ error: 'Données invalides. Au moins 2 options requises.' });
        }

        // Créer l'élection
        const { data: election, error: electionError } = await supabase
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
        const optionsData = options.map((label: string, index: number) => ({
            election_id: election.id,
            label,
            order: index
        }));

        const { error: optionsError } = await supabase
            .from('election_options')
            .insert(optionsData);

        if (optionsError) {
            // Rollback: supprimer l'élection si les options échouent
            await supabase.from('elections').delete().eq('id', election.id);
            return res.status(400).json({ error: optionsError.message });
        }

        // Récupérer l'élection complète avec les options
        const { data: fullElection } = await supabase
            .from('elections')
            .select(`
        *,
        election_options (*)
      `)
            .eq('id', election.id)
            .single();

        res.status(201).json(fullElection);
    } catch (error) {
        console.error('Erreur lors de la création de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getElections = async (req: AuthRequest, res: Response) => {
    try {
        const { data: elections, error } = await supabase
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
    } catch (error) {
        console.error('Erreur lors de la récupération des élections:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getElection = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const { data: election, error } = await supabase
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
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateElection = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { titre, description, date_debut, date_fin, active } = req.body;
        const userId = req.user?.id;

        // Vérifier que l'utilisateur est le créateur ou un admin
        const { data: election } = await supabase
            .from('elections')
            .select('created_by')
            .eq('id', id)
            .single();

        if (!election || (election.created_by !== userId && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const { data, error } = await supabase
            .from('elections')
            .update({ titre, description, date_debut, date_fin, active })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteElection = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Vérifier que l'utilisateur est le créateur ou un admin
        const { data: election } = await supabase
            .from('elections')
            .select('created_by')
            .eq('id', id)
            .single();

        if (!election || (election.created_by !== userId && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const { error } = await supabase
            .from('elections')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Élection supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'élection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getElectionResults = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Récupérer l'élection
        const { data: election, error: electionError } = await supabase
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
        const results = await Promise.all(
            election.election_options.map(async (option: any) => {
                const { count } = await supabase
                    .from('votes')
                    .select('*', { count: 'exact', head: true })
                    .eq('election_id', id)
                    .eq('option_id', option.id);

                return {
                    option_id: option.id,
                    label: option.label,
                    votes: count || 0
                };
            })
        );

        // Compter le total des votes
        const { count: totalVotes } = await supabase
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
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
