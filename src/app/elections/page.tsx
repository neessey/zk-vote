'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { electionsApi } from '@/lib/api/elections';
import { Election } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ElectionsPage() {
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState(true);

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

        fetchElections();
    }, []);

    const now = new Date();

    const activeElections = elections.filter(e => {
        const start = new Date(e.date_debut);
        const end = new Date(e.date_fin);
        return e.active && now >= start && now <= end;
    });

    const upcomingElections = elections.filter(e => {
        const start = new Date(e.date_debut);
        return e.active && now < start;
    });

    const pastElections = elections.filter(e => {
        const end = new Date(e.date_fin);
        return now > end || !e.active;
    });

    const ElectionCard = ({ election }: { election: Election }) => {
        const start = new Date(election.date_debut);
        const end = new Date(election.date_fin);
        const isActive = election.active && now >= start && now <= end;
        const isUpcoming = election.active && now < start;
        const isPast = now > end || !election.active;

        return (
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg sm:text-xl truncate">
                                {election.titre}
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm line-clamp-2">
                                {election.description}
                            </CardDescription>
                        </div>
                        <Badge className={`w-fit shrink-0 ${isPast ? 'bg-gray-500' :
                                isUpcoming ? 'bg-blue-500' :
                                    'bg-green-500'
                            }`}>
                            {isPast ? 'Terminée' : isUpcoming ? 'À venir' : 'En cours'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
                        <p className="truncate sm:text-clip">
                            Début: {format(start, 'PPP à HH:mm', { locale: fr })}
                        </p>
                        <p className="truncate sm:text-clip">
                            Fin: {format(end, 'PPP à HH:mm', { locale: fr })}
                        </p>
                        <p>{election.election_options?.length || 0} options disponibles</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        {isActive && (
                            <Link href={`/vote/${election.id}`} className="flex-1">
                                <Button className="w-full text-sm">Voter</Button>
                            </Link>
                        )}
                        <Link href={`/results/${election.id}`} className={isActive ? 'flex-1' : 'w-full'}>
                            <Button variant="outline" className="w-full text-sm">Résultats</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                        Toutes les élections
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Participez aux votes en cours ou consultez les résultats
                    </p>
                </div>

                {loading ? (
                    <p className="text-center text-slate-600">Chargement...</p>
                ) : (
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="mb-6 w-full sm:w-auto grid grid-cols-3 sm:inline-grid">
                            <TabsTrigger value="active" className="text-xs sm:text-sm">
                                En cours ({activeElections.length})
                            </TabsTrigger>
                            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                                À venir ({upcomingElections.length})
                            </TabsTrigger>
                            <TabsTrigger value="past" className="text-xs sm:text-sm">
                                Terminées ({pastElections.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active">
                            {activeElections.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-slate-500 text-sm sm:text-base">
                                        Aucune élection en cours
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {activeElections.map(election => (
                                        <ElectionCard key={election.id} election={election} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="upcoming">
                            {upcomingElections.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-slate-500 text-sm sm:text-base">
                                        Aucune élection à venir
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {upcomingElections.map(election => (
                                        <ElectionCard key={election.id} election={election} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past">
                            {pastElections.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-slate-500 text-sm sm:text-base">
                                        Aucune élection terminée
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {pastElections.map(election => (
                                        <ElectionCard key={election.id} election={election} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}