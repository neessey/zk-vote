'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { electionsApi } from '@/lib/api/elections';
import { Election } from '@/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
    const { user, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!user && !loading) {
            router.push('/login');
        }
    }, [user, router, loading]);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await electionsApi.getAll();
                setElections(data);
            } catch (error) {
                console.error('Erreur lors du chargement des élections:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchElections();
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const activeElections = elections.filter(e => {
        const now = new Date();
        const start = new Date(e.date_debut);
        const end = new Date(e.date_fin);
        return e.active && now >= start && now <= end;
    });

    const upcomingElections = elections.filter(e => {
        const now = new Date();
        const start = new Date(e.date_debut);
        return e.active && now < start;
    });

    const pastElections = elections.filter(e => {
        const now = new Date();
        const end = new Date(e.date_fin);
        return now > end || !e.active;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                        Bienvenue, <span className="block sm:inline truncate max-w-full">{user.email}</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Voici un aperçu de vos élections
                    </p>
                </div>

                {user.role === 'admin' && (
                    <div className="mb-6 sm:mb-8">
                        <Link href="/admin/create-election" className="block sm:inline-block">
                            <Button size="lg" className="w-full sm:w-auto">
                                Créer une nouvelle élection
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="space-y-6 sm:space-y-8">
                    {/* Élections actives */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Élections en cours</h2>
                        {activeElections.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-slate-500 text-sm sm:text-base">
                                    Aucune élection en cours
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeElections.map(election => (
                                    <Card key={election.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl truncate">
                                                        {election.titre}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2 text-sm line-clamp-2">
                                                        {election.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge className="bg-green-500 w-fit shrink-0">En cours</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
                                                <p className="truncate">
                                                    Fin: {format(new Date(election.date_fin), 'PPP à HH:mm', { locale: fr })}
                                                </p>
                                                <p>{election.election_options?.length || 0} options disponibles</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Link href={`/vote/${election.id}`} className="flex-1">
                                                    <Button className="w-full text-sm sm:text-base">Voter</Button>
                                                </Link>
                                                <Link href={`/results/${election.id}`} className="flex-1 sm:flex-initial">
                                                    <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                                                        Résultats
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Élections à venir */}
                    {upcomingElections.length > 0 && (
                        <section>
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Élections à venir</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingElections.map(election => (
                                    <Card key={election.id}>
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl truncate">
                                                        {election.titre}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2 text-sm line-clamp-2">
                                                        {election.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="secondary" className="w-fit shrink-0">À venir</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xs sm:text-sm text-slate-600 truncate">
                                                Début: {format(new Date(election.date_debut), 'PPP à HH:mm', { locale: fr })}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Élections passées */}
                    {pastElections.length > 0 && (
                        <section>
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Élections terminées</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pastElections.slice(0, 4).map(election => (
                                    <Card key={election.id}>
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl truncate">
                                                        {election.titre}
                                                    </CardTitle>
                                                </div>
                                                <Badge variant="outline" className="w-fit shrink-0">Terminée</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Link href={`/results/${election.id}`}>
                                                <Button variant="outline" className="w-full text-sm sm:text-base">
                                                    Voir les résultats
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}