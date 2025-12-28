const features = [
    { name: "Vote par liste nominative", color: "bg-slate-900", text: "text-white" },
    { name: "Vote à option unique", color: "bg-blue-100" },
    { name: "Vote en ligne sécurisé", color: "bg-blue-100", text: "text-slate-700" },
    { name: "Vote en salle", color: "bg-blue-100" },
    { name: "Vote anticipé", color: "bg-slate-900", text: "text-white" },
    { name: "Vote étalé sur plusieurs jours", color: "bg-blue-100" },
    { name: "Scrutin en temps réel", color: "bg-blue-100", text: "text-slate-700" },
    { name: "Application disponible en plusieurs langues", color: "bg-blue-100" },
    { name: "Suivi automatique du quorum", color: "bg-slate-900", text: "text-white" },
    { name: "Stockage sécurisé des clés de vote", color: "bg-blue-100" },
    { name: "Authentification multi-facteurs", color: "bg-blue-100", text: "text-slate-700" },
    { name: "Audit complet des résultats", color: "bg-blue-100" },
    { name: "Tableau de bord en temps réel", color: "bg-slate-900", text: "text-white" },
    { name: "Historique complet des scrutins", color: "bg-blue-100" },
    { name: "Vote mobile sécurisé", color: "bg-blue-100", text: "text-slate-700" },
    { name: "Vote hors ligne avec synchronisation", color: "bg-blue-100" },
    { name: "Chiffrement de bout en bout des votes", color: "bg-blue-100", text: "text-slate-700" },
    { name: "Import/export de listes électorales", color: "bg-blue-100" },
    { name: "Analyse statistique des résultats", color: "bg-slate-900", text: "text-white" },
];

export function Features() {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {features.map((item, index) => (
                <span
                    key={index}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-slate-200 shadow-sm ${item.color} ${item.text || ''} transition-transform hover:scale-105`}
                >
                    {item.name}
                </span>
            ))}
        </div>
    );
}