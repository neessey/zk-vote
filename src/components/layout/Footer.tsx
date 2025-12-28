export function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#050B1C] via-[#071229] to-[#050B1C] text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 flex items-center justify-center text-white font-bold">
                            ✓
                        </div>
                        <span className="text-lg sm:text-xl font-semibold text-white">
                            Zk-Vote
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Solution de vote électronique sécurisé,
                        fiable et démocratique.
                    </p>
                </div>

                {/* Produit */}
                <div>
                    <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produit</h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                    </ul>
                </div>

                {/* Ressources */}
                <div>
                    <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Ressources</h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Guide de démarrage</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                    </ul>
                </div>

                {/* Légal */}
                <div>
                    <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Légal</h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">CGV</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2 text-center sm:text-left">
                    <p>
                        © 2025 ZK-Vote. Tous droits réservés
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> - </span>
                        <span className="block sm:inline mt-1 sm:mt-0">Plateforme de vote électronique sécurisé avec Zero-Knowledge Proofs</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}