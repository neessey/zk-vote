"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const elections_1 = __importDefault(require("./routes/elections"));
const votes_1 = __importDefault(require("./routes/votes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par IP
});
app.use(limiter);
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/elections', elections_1.default);
app.use('/api/votes', votes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'ZK-Vote API is running' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur interne' });
});
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
