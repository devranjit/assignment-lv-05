import express from 'express';
import { getAllTransactions, toggleAgentStatus, getAllWallets, toggleBlockWallet, getAllUsers } from './admin.controller';

import { authMiddleware } from '../auth/auth.middleware';

const router = express.Router();

router.get('/transactions', authMiddleware(['admin']), getAllTransactions);
router.patch('/agent/toggle-status/:agentId', authMiddleware(['admin']), toggleAgentStatus);
router.patch('/wallets/toggle-block/:userId', authMiddleware(['admin']), toggleBlockWallet);
router.get('/users', authMiddleware(['admin']), getAllUsers);

router.get('/wallets', authMiddleware(['admin']), getAllWallets);

export default router;
