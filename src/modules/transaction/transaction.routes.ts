import express from 'express';
import { transferMoney } from './transaction.controller'; 
import { authMiddleware } from '../auth/auth.middleware';

const router = express.Router();


router.post('/transfer', authMiddleware(['user']), transferMoney); 

export default router;
