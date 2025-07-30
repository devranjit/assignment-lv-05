import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import walletRoutes from './modules/wallet.routes';


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

export default app;
