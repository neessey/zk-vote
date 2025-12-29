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
const PORT = Number(process.env.PORT) || 5000;



// CORS configuration

// Configuration CORS pour Railway + Vercel
const allowedOrigins: string[] = [
    "http://localhost:3000",
    "https://zk-vote-sepia.vercel.app",
    "https://zk-vote-git-main-devyans-projects-805b7991.vercel.app"
].filter((o): o is string => typeof o === "string");


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin as string || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);   // 👈 C'EST ÇA QUI MANQUAIT
    }
    next();
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par IP
});
app.use(limiter);

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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
