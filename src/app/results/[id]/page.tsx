/* eslint-disable prefer-const */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { electionsApi } from '@/lib/api/elections';
import { ElectionResults } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

export default function ResultsPage() {
    const params = useParams();
    const id = params.id as string;
    const { user, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const [results, setResults] = useState<ElectionResults | null>(null);
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
        const fetchResults = async () => {
            try {
                const data = await electionsApi.getResults(id);
                setResults(data);
            } catch (error) {
                console.error('Erreur lors du chargement des résultats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchResults();
        }
    }, [user, id]);

    const exportToPDF = () => {
        if (!results) return;

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Résultats de l\'élection', 20, 20);

        doc.setFontSize(14);
        doc.text(results.election.titre, 20, 35);

        doc.setFontSize(10);
        doc.text(`Total des votes: ${results.totalVotes}`, 20, 45);

        let y = 60;
        results.results.forEach((result, index) => {
            const percentage = results.totalVotes > 0
                ? ((result.votes / results.totalVotes) * 100).toFixed(1)
                : '0';
            doc.text(`${result.label}: ${result.votes} votes (${percentage}%)`, 20, y + (index * 10));
        });

        doc.save(`resultats-${results.election.id}.pdf`);
    };

    const exportToCSV = () => {
        if (!results) return;

        const headers = ['Option', 'Votes', 'Pourcentage'];
        const rows = results.results.map(result => {
            const percentage = results.totalVotes > 0
                ? ((result.votes / results.totalVotes) * 100).toFixed(1)
                : '0';
            return [result.label, result.votes.toString(), `${percentage}%`];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultats-${results.election.id}.csv`;
        a.click();
    };

    if (!user || loading) {
        return null;
    }

    if (!results) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <p>Chargement des résultats...</p>
                </main>
            </div>
        );
    }

    const chartData = results.results.map(result => ({
        name: result.label,
        votes: result.votes,
        pourcentage: results.totalVotes > 0
            ? ((result.votes / results.totalVotes) * 100).toFixed(1)
            : 0
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                        {results.election.titre}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        {results.election.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl sm:text-2xl">{results.totalVotes}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Total des votes</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl sm:text-2xl">{results.results.length}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Options de vote</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-2xl truncate">
                                {results.results.reduce((max, r) => r.votes > max.votes ? r : max, results.results[0])?.label || 'N/A'}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Option en tête</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">Résultats par option</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Legend fontSize={12} />
                                    <Bar dataKey="votes" fill="#0f172a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">Répartition des votes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.percent}%`}
                                        outerRadius={60}
                                        className="sm:outerRadius-[80px]"
                                        fill="#8884d8"
                                        dataKey="votes"
                                        fontSize={10}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6 sm:mb-8">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Détails des résultats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.results.map((result, index) => {
                                const percentage = results.totalVotes > 0
                                    ? (result.votes / results.totalVotes) * 100
                                    : 0;

                                return (
                                    <div key={result.option_id} className="space-y-2">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="font-medium text-sm sm:text-base truncate flex-1">
                                                {result.label}
                                            </span>
                                            <span className="text-xs sm:text-sm text-slate-600 shrink-0">
                                                {result.votes} votes ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 sm:h-3">
                                            <div
                                                className="h-2 sm:h-3 rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button onClick={exportToPDF} variant="outline" className="w-full sm:w-auto text-sm">
                        Télécharger PDF
                    </Button>
                    <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto text-sm">
                        Télécharger CSV
                    </Button>
                    <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full sm:w-auto text-sm">
                        Retour au tableau de bord
                    </Button>
                </div>
            </main>
        </div>
    );
}