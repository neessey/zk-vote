'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo2.png"
                            alt=" Logo"
                            width={40}
                            height={40}
                            className="sm:w-12 sm:h-12 rounded-lg"
                        />
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700">
                            ZK-Vote
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-sm xl:text-base text-slate-700 hover:text-slate-900 font-medium">
                                    Tableau de bord
                                </Link>
                                <Link href="/elections" className="text-sm xl:text-base text-slate-700 hover:text-slate-900 font-medium">
                                    Élections
                                </Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin/create-election" className="text-sm xl:text-base text-slate-700 hover:text-slate-900 font-medium">
                                        Créer une élection
                                    </Link>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs xl:text-sm text-slate-700 truncate max-w-[150px]">
                                            {user.email}
                                        </span>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <Button onClick={handleLogout} variant="outline" size="sm">
                                        Déconnexion
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Commencer
                                        <span className="ml-2">→</span>
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button size="sm" className='bg-gradient-to-tr from-purple-900 to-blue-900'>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden mt-4 pb-4 space-y-3 border-t pt-4">
                        {user ? (
                            <>
                                <div className="flex flex-col space-y-2 mb-4 pb-4 border-b">
                                    <span className="text-sm text-slate-700">{user.email}</span>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs w-fit">
                                        {user.role}
                                    </Badge>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="block text-slate-700 hover:text-slate-900 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Tableau de bord
                                </Link>
                                <Link
                                    href="/elections"
                                    className="block text-slate-700 hover:text-slate-900 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Élections
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin/create-election"
                                        className="block text-slate-700 hover:text-slate-900 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Créer une élection
                                    </Link>
                                )}
                                <Button onClick={handleLogout} variant="outline" className="w-full mt-4">
                                    Déconnexion
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/login" className="block">
                                    <Button variant="outline" className="w-full">
                                        Commencer →
                                    </Button>
                                </Link>
                                <Link href="/" className="block">
                                    <Button className='w-full bg-gradient-to-tr from-purple-900 to-blue-900'>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}