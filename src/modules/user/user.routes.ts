import express from 'express';
import { getMyProfile, getAllUsers } from './user.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware(['user', 'admin', 'agent']), getMyProfile);
router.get('/', authMiddleware(['admin']), getAllUsers);

export default router;
