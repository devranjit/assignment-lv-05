import express from 'express';
import { addMoney, withdrawMoney, sendMoney, getMyTransactions } from './wallet.controller';
import { authMiddleware } from './auth/auth.middleware';
import { Wallet } from './wallet';



const router = express.Router();

router.post('/add', authMiddleware(['user', 'agent', 'admin']), addMoney);
router.post('/withdraw', authMiddleware(['user']), withdrawMoney);
router.post('/send', authMiddleware(['user']), sendMoney);

router.get('/balance', authMiddleware(['user','agent','admin']), async (req, res) => {
  const userId = (req as any).user.id;
  const w = await Wallet.findOne({ user: userId });
  if (!w) return res.status(404).json({ message: 'Wallet not found' });
  res.json({ balance: w.balance });
});

router.get('/transactions', authMiddleware(['user','agent','admin']), getMyTransactions);

export default router;
