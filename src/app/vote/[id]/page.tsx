/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { electionsApi } from '@/lib/api/elections';
import { votesApi } from '@/lib/api/votes';
import { Election } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export default function VotePage() {
    const params = useParams();
    const id = params.id as string;
    const { user, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const [election, setElection] = useState<Election | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [voteHash, setVoteHash] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!user && !loading) {
            router.push('/login');
        }
    }, [user, router, loading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const electionData = await electionsApi.getById(id);
                setElection(electionData);

                try {
                    const voteStatus = await votesApi.getStatus(id);
                    setHasVoted(voteStatus.hasVoted);
                    if (voteStatus.hasVoted) {
                        setVoteHash(voteStatus.voteHash || '');
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (voteError) {
                    console.log('Statut du vote non disponible');
                    setHasVoted(false);
                }
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                setError('Impossible de charger l\'élection');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, id]);

    const handleVote = async () => {
        if (!selectedOption) {
            setError('Veuillez sélectionner une option');
            return;
        }

        setVoting(true);
        setError('');

        try {
            const result = await votesApi.cast(id, selectedOption);
            setSuccess(true);
            setVoteHash(result.voteHash);
            setHasVoted(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors du vote');
        } finally {
            setVoting(false);
        }
    };

    if (!user || loading) {
        return null;
    }

    if (!election) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>Élection non trouvée</AlertDescription>
                    </Alert>
                </main>
            </div>
        );
    }

    const now = new Date();
    const start = new Date(election.date_debut);
    const end = new Date(election.date_fin);
    const canVote = election.active && now >= start && now <= end && !hasVoted;
    const notStarted = now < start;
    const ended = now > end;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl sm:text-2xl mb-2">
                                    {election.titre}
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    {election.description}
                                </CardDescription>
                            </div>
                            <Badge className={`w-fit shrink-0 ${ended || !election.active ? 'bg-gray-500' :
                                notStarted ? 'bg-blue-500' :
                                    'bg-green-500'
                                }`}>
                                {ended || !election.active ? 'Terminée' :
                                    notStarted ? 'À venir' :
                                        'En cours'}
                            </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                            <p className="truncate sm:text-clip">
                                Début: {format(start, 'PPP à HH:mm', { locale: fr })}
                            </p>
                            <p className="truncate sm:text-clip">
                                Fin: {format(end, 'PPP à HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {success && (
                            <Alert className="mb-6 bg-green-50 border-green-200">
                                <AlertDescription className="text-green-800 text-sm">
                                    <p className="font-semibold mb-2">Vote enregistré avec succès !</p>
                                    <p className="text-xs sm:text-sm break-all">
                                        Hash de vérification: <code className="bg-green-100 px-2 py-1 rounded">{voteHash}</code>
                                    </p>
                                    <p className="text-xs sm:text-sm mt-2">
                                        Conservez ce hash pour vérifier votre vote ultérieurement.
                                    </p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {hasVoted && !success && (
                            <Alert className="mb-6 bg-blue-50 border-blue-200">
                                <AlertDescription className="text-blue-800 text-sm">
                                    <p className="font-semibold">Vous avez déjà voté pour cette élection</p>
                                    <p className="text-xs sm:text-sm mt-1 break-all">
                                        Hash: <code className="bg-blue-100 px-2 py-1 rounded">{voteHash}</code>
                                    </p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {notStarted && (
                            <Alert className="mb-6">
                                <AlertDescription className="text-sm">
                                    Le vote n&apos;a pas encore commencé. Revenez le {format(start, 'PPP à HH:mm', { locale: fr })}.
                                </AlertDescription>
                            </Alert>
                        )}

                        {ended && (
                            <Alert className="mb-6">
                                <AlertDescription className="text-sm">
                                    Le vote est terminé. <a href={`/results/${id}`} className="underline font-medium">Voir les résultats</a>
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        {canVote && (
                            <>
                                <h3 className="font-semibold text-base sm:text-lg mb-4">Faites votre choix:</h3>
                                <div className="space-y-3 mb-6">
                                    {election.election_options
                                        ?.sort((a, b) => a.order - b.order)
                                        .map(option => (
                                            <div
                                                key={option.id}
                                                className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${selectedOption === option.id
                                                    ? 'border-slate-900 bg-slate-50'
                                                    : 'border-slate-200 hover:border-slate-400'
                                                    }`}
                                                onClick={() => setSelectedOption(option.id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${selectedOption === option.id
                                                        ? 'border-slate-900'
                                                        : 'border-slate-300'
                                                        }`}>
                                                        {selectedOption === option.id && (
                                                            <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-sm sm:text-base">{option.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <Button
                                    onClick={handleVote}
                                    disabled={voting || !selectedOption}
                                    className="w-full text-sm sm:text-base"
                                    size="lg"
                                >
                                    {voting ? 'Enregistrement du vote...' : 'Confirmer mon vote'}
                                </Button>

                                <p className="text-xs text-slate-500 mt-4 text-center px-2">
                                    Votre vote est anonyme et sécurisé grâce aux preuves Zero-Knowledge.
                                    Il ne pourra pas être modifié après confirmation.
                                </p>
                            </>
                        )}

                        {!canVote && !notStarted && !ended && hasVoted && (
                            <div className="text-center">
                                <Button onClick={() => router.push(`/results/${id}`)} variant="outline" className="w-full sm:w-auto">
                                    Voir les résultats
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}