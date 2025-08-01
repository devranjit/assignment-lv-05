import express from 'express';
import { cashInToUser, cashOutFromUser } from './agent.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { getAgentTransactions } from './agent.controller';


const router = express.Router();

router.post('/cash-in', authMiddleware(['agent']), cashInToUser);
router.post('/cash-out', authMiddleware(['agent']), cashOutFromUser);
router.get('/transactions', authMiddleware(['agent']), getAgentTransactions);


export default router;
