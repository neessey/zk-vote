import { Router } from 'express';
import {
    castVote,
    verifyVote,
    getUserVoteStatus,
    getAllVotes
} from '../controllers/voteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, castVote);
router.get('/verify/:voteHash', verifyVote);
router.get('/status/:election_id', authMiddleware, getUserVoteStatus);
router.get('/election/:election_id', authMiddleware, getAllVotes);

export default router;
