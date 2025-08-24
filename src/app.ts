import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import agentRoutes from './modules/agent/agent.routes';
import adminRoutes from './modules/admin/admin.route';
import userRoutes from './modules/user/user.routes';
import transactionRoutes from './modules/transaction/transaction.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Digital Wallet API is running');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api/wallet', walletRoutes);

app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', transactionRoutes);
export default app;
