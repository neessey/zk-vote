# ZK-Vote - Plateforme de Vote Électronique Sécurisée

Une plateforme de vote électronique utilisant les Zero-Knowledge Proofs pour garantir l'anonymat total des votants tout en permettant la vérification publique des résultats.

# 🚀 Technologies
 ##Frontend
**Next.js 14** - Framework React
**TypeScript** - Typage statique
**Tailwind CSS** - Styling
**shadcn/ui** - Composants UI
**Recharts** - Graphiques
**Zustand** - State management
**Axios** - HTTP client

##Backend

**Node.js + Express** - Serveur API
**TypeScript** - Typage statique
**Supabase (PostgreSQL)** - Base de données
**JWT** - Authentification
**bcrypt** - Hachage des mots de passe
**ZK-Proofs** - Preuves cryptographiques (implémentation simplifiée)

##📋 Fonctionnalités
###✅ Authentification sécurisée

**Inscription / Connexion**
**Rôles (Admin / Votant)**
**Tokens JWT**

###✅ Gestion des élections

Création d'élections (admin)
Définition de la période de vote
Multiple options de vote
Activation/désactivation
✅ Système de vote

Vote anonyme avec ZK-Proofs
Un seul vote par utilisateur
Impossible de modifier après soumission
Hash de vérification
✅ Résultats et transparence

Résultats en temps réel
Graphiques interactifs (Bar chart, Pie chart)
Export PDF et CSV
Vérification publique des votes
🛠️ Installation
Prérequis
Node.js 18+ ou Bun
Compte Supabase (gratuit)
1. Cloner le projet
git clone <repository-url>

cd zk-vote
2. Configuration de Supabase
Créer un projet sur Supabase
Aller dans SQL Editor
Exécuter le script backend/supabase-schema.sql
Récupérer l'URL et les clés API dans Project Settings > API
3. Backend
cd backend


# Copier et configurer les variables d'environnement

cp .env.example .env


# Éditer .env avec vos clés Supabase

# SUPABASE_URL=votre_url

# SUPABASE_ANON_KEY=votre_anon_key

# SUPABASE_SERVICE_KEY=votre_service_key

# JWT_SECRET=votre_secret_jwt


# Installer les dépendances

bun install


# Démarrer le serveur

bun run dev
Le backend sera accessible sur http://localhost:5000

4. Frontend
# Dans le dossier racine zk-vote

bun install


# Démarrer le serveur de développement

bun run dev
Le frontend sera accessible sur http://localhost:3000

📁 Structure du projet
zk-vote/
├── backend/                    # API Express
│   ├── src/
│   │   ├── config/            # Configuration (Supabase)
│   │   ├── controllers/       # Logique métier
│   │   ├── middleware/        # Middleware (auth)
│   │   ├── routes/            # Routes API
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Utilitaires (ZK-Proofs)
│   │   └── index.ts           # Point d'entrée
│   ├── supabase-schema.sql    # Schéma de la base de données
│   └── package.json
│
├── src/                        # Frontend Next.js
│   ├── app/                   # Pages Next.js
│   │   ├── admin/             # Pages admin
│   │   ├── dashboard/         # Tableau de bord
│   │   ├── elections/         # Liste des élections
│   │   ├── results/           # Résultats
│   │   ├── vote/              # Page de vote
│   │   ├── login/             # Connexion
│   │   └── register/          # Inscription
│   ├── components/            # Composants React
│   │   ├── auth/              # Authentification
│   │   ├── election/          # Élections
│   │   ├── layout/            # Layout
│   │   └── ui/                # Composants UI (shadcn)
│   ├── lib/
│   │   └── api/               # Services API
│   ├── stores/                # State management (Zustand)
│   └── types/                 # Types TypeScript
│
└── README.md
🔐 Sécurité
Zero-Knowledge Proofs - Anonymat garanti
Helmet - Protection des headers HTTP
Rate Limiting - Protection contre les attaques
CORS - Configuration sécurisée
JWT - Authentification sécurisée
bcrypt - Hachage des mots de passe
RLS Supabase - Row Level Security
📊 Schéma de la base de données
Tables principales
users

id (UUID)
email (VARCHAR)
password (VARCHAR - hashé)
role (VARCHAR - 'admin' | 'votant')
created_at (TIMESTAMP)
elections

id (UUID)
titre (VARCHAR)
description (TEXT)
date_debut (TIMESTAMP)
date_fin (TIMESTAMP)
active (BOOLEAN)
created_by (UUID - FK vers users)
election_options

id (UUID)
election_id (UUID - FK vers elections)
label (VARCHAR)
order (INTEGER)
votes

id (UUID)
election_id (UUID - FK vers elections)
user_id (UUID - FK vers users)
option_id (UUID - FK vers election_options)
zk_proof (TEXT)
hash_vote (VARCHAR - unique)
timestamp (TIMESTAMP)
🎯 API Endpoints
Auth
POST /api/auth/register - Inscription
POST /api/auth/login - Connexion
GET /api/auth/profile - Profil (authentifié)
Elections
GET /api/elections - Liste des élections
GET /api/elections/:id - Détails d'une élection
POST /api/elections - Créer (admin)
PUT /api/elections/:id - Modifier (admin)
DELETE /api/elections/:id - Supprimer (admin)
GET /api/elections/:id/results - Résultats
Votes
POST /api/votes - Voter
GET /api/votes/verify/:hash - Vérifier un vote
GET /api/votes/status/:election_id - Statut de vote
GET /api/votes/election/:election_id - Tous les votes (anonymes)
👤 Compte admin par défaut
Email: admin@zkvote.com Mot de passe: admin123

⚠️ IMPORTANT: Changez ces identifiants en production !

📝 Notes sur les ZK-Proofs
L'implémentation actuelle des Zero-Knowledge Proofs est simplifiée à des fins de démonstration.

Pour une utilisation en production, remplacez-la par une vraie bibliothèque ZK-SNARK :

snarkjs - Bibliothèque JavaScript pour ZK-SNARKs
circom - Langage pour créer des circuits ZK
ZoKrates - Toolbox pour ZK-SNARKs
🚀 Déploiement
Backend
Déployer sur Railway, Render, ou Heroku
Configurer les variables d'environnement
Utiliser PostgreSQL de production (Supabase)
Frontend
Déployer sur Vercel, Netlify, ou Cloudflare Pages
Configurer NEXT_PUBLIC_API_URL
Build automatique avec bun run build
📄 License
MIT

🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un PR.

📧 Contact
Pour toute question ou suggestion, contactez-nous !

ZK-Vote - Vote sécurisé et anonyme avec les Zero-Knowledge Proofs 🔒


