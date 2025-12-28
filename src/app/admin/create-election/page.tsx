/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { electionsApi } from '@/lib/api/elections';

export default function CreateElectionPage() {
    const { user, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!titre || !description || !dateDebut || !dateFin) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            setError('Au moins 2 options sont requises');
            return;
        }

        const start = new Date(dateDebut);
        const end = new Date(dateFin);
        if (end <= start) {
            setError('La date de fin doit être après la date de début');
            return;
        }

        setLoading(true);

        try {
            const election = await electionsApi.create({
                titre,
                description,
                date_debut: new Date(dateDebut).toISOString(),
                date_fin: new Date(dateFin).toISOString(),
                options: validOptions
            });

            router.push(`/vote/${election.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de la création de l\'élection');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Créer une nouvelle élection</CardTitle>
                        <CardDescription>
                            Configurez les paramètres de votre élection sécurisée
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="titre">Titre de l&apos;élection *</Label>
                                <Input
                                    id="titre"
                                    value={titre}
                                    onChange={(e) => setTitre(e.target.value)}
                                    placeholder="Ex: Élection du délégué de classe 2025"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez le contexte et les enjeux de cette élection..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateDebut">Date et heure de début *</Label>
                                    <Input
                                        id="dateDebut"
                                        type="datetime-local"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateFin">Date et heure de fin *</Label>
                                    <Input
                                        id="dateFin"
                                        type="datetime-local"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Options de vote *</Label>
                                    <Button type="button" onClick={addOption} variant="outline" size="sm">
                                        + Ajouter une option
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                required
                                            />
                                            {options.length > 2 && (
                                                <Button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    ✕
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">
                                    Minimum 2 options requises
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Sécurité et anonymat</h4>
                                <p className="text-sm text-blue-800">
                                    Cette élection utilisera les Zero-Knowledge Proofs pour garantir l&apos;anonymat total des votants
                                    tout en permettant la vérification publique des résultats.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Création...' : 'Créer l\'élection'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
