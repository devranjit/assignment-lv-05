import express from 'express';
import { addMoney } from './wallet.controller';
import { authMiddleware } from './auth/auth.middleware';

const router = express.Router();

router.post('/add', authMiddleware(['user', 'agent', 'admin']), addMoney);

export default router;
