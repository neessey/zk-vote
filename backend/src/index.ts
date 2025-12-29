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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

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

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
