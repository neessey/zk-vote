import { Router } from 'express';
import {
    createElection,
    getElections,
    getElection,
    updateElection,
    deleteElection,
    getElectionResults
} from '../controllers/electionController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, createElection);
router.get('/', authMiddleware, getElections);
router.get('/:id', authMiddleware, getElection);
router.put('/:id', authMiddleware, adminMiddleware, updateElection);
router.delete('/:id', authMiddleware, adminMiddleware, deleteElection);
router.get('/:id/results', authMiddleware, getElectionResults);

export default router;
