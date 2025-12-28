"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const supabase_1 = require("../config/supabase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, password, role = 'votant' } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const { data: existingUser } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }
        // Hasher le mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Créer l'utilisateur
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .insert([
            {
                email,
                password: hashedPassword,
                role: role === 'admin' ? 'admin' : 'votant'
            }
        ])
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        // Générer un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Récupérer l'utilisateur
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        // Vérifier le mot de passe
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        // Générer un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('id, email, role, created_at')
            .eq('id', userId)
            .single();
        if (error) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getProfile = getProfile;
