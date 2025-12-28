import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Features } from '@/components/layout/Features';
import Blog from '@/components/layout/Blog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
    Lock,
    Shield,
    CheckCircle,
    TrendingUp,
    Globe,
    FileCheck
} from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="w-full mx-auto px-4 py-12 sm:py-16 md:py-20 bg-slate-100">
                    <div className="text-center max-w-5xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6">
                            <span className="text-slate-700">ZK-Vote</span>
                            <br className="hidden sm:block" />
                            <span className="block sm:inline"> la plateforme de vote sécurisé et anonyme pour tous</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 px-4">
                            Une plateforme de vote électronique qui garantit l&apos;anonymat total grâce aux Zero-Knowledge Proofs
                        </p>

                        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                Sécurisé
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                Rapide
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                Made in Côte d&apos;Ivoire
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-base sm:text-lg md:text-xl">
                                    Commencer maintenant
                                    <span className="ml-2">→</span>
                                </Button>
                            </Link>
                            <Link href="/elections" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full text-base sm:text-lg">
                                    Voir les élections
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-500">
                        Pourquoi choisir <span className="text-slate-700">ZK-Vote</span> ?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Anonymat total</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Votez en toute confiance. Vos choix restent privés grâce aux preuves cryptographiques Zero-Knowledge.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Vérification publique</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Chaque vote est vérifiable publiquement sans révéler l&apos;identité du votant.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Sécurité maximale</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Protection contre la fraude avec des preuves cryptographiques et l&apos;intégrité mathématique.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Résultats en temps réel</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Consultez les résultats instantanément avec des graphiques interactifs.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Gouvernance décentralisée</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Idéal pour les DAO, associations et organisations recherchant la transparence.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <span>Interface simple</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm sm:text-base">
                                    Une expérience utilisateur intuitive pour tous, sans compromis sur la sécurité.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-12 text-gray-500">
                        <span className="text-slate-700">ZK-Vote</span>, tout ce qu&apos;il vous faut !
                    </h2>
                    <p className="text-center text-sm sm:text-base text-slate-600 mb-12 sm:mb-20 px-4">
                        ZK-Vote permet aux organisations de gérer facilement des élections en ligne sécurisées
                        <br className="hidden sm:block" />
                        Rejoignez nous et transformez vos processus électoraux grâce à une technologie fiable, transparente et efficace.
                    </p>
                    <Features />
                </section>

                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-8 text-gray-500">
                        Blog Vote
                    </h2>
                    <p className="text-center text-sm sm:text-base md:text-lg text-slate-600 mb-8 sm:mb-15 px-4">
                        Découvrez nos conseils et bonnes pratiques pour organiser des
                        <br className="hidden sm:block" /> votes sécurisés et fiables.
                    </p>
                    <Blog />
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
                    <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-8 sm:p-10 md:p-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                            Prêt à organiser votre première élection ?
                        </h2>
                        <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 px-4">
                            Rejoignez des centaines d&apos;organisations qui font confiance à ZK-Vote
                        </p>
                        <Link href="/register">
                            <Button size="lg" variant="secondary" className="text-base sm:text-lg">
                                Créer un compte gratuitement
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}