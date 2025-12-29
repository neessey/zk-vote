import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import electionRoutes from './routes/elections';
import voteRoutes from './routes/votes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par IP
});
app.use(limiter);

// CORS configuration

// Configuration CORS pour Railway + Vercel
const allowedOrigins = [
    'http://localhost:3000',                    // Développement local
    process.env.FRONTEND_URL,                   // Vercel production
    'https://zk-vote-sepia.vercel.app',            // Remplacez par votre URL
    'https://zk-vote-git-main-devyans-projects-805b7991.vercel.app'    // Previews Vercel
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Autorise les requêtes sans origin (mobile, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Origin non autorisée:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend Railway connecté',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        corsOrigin: req.headers.origin
    });
});


// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'ZK-Vote API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚂 Railway server running on port ${PORT}`);
    console.log('✅ CORS configuré pour:', allowedOrigins);
});
export default app;
