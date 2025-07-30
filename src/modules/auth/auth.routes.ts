import express from 'express';
import { register } from './auth';
import { login } from './auth';
import { authMiddleware } from './auth.middleware';

const router = express.Router();

console.log('Auth routes loaded');

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware(['user', 'agent', 'admin']), (req, res) => {
  res.json({ message: 'Access granted', user: (req as any).user });
});
export default router;
