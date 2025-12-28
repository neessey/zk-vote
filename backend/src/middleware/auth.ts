/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    headers: any;
    body: { titre: any; description: any; date_debut: any; date_fin: any; active: any; };
    params: { id: any; };
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé - Administrateur requis' });
    }
    next();
};
