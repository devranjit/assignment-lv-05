import { Request, Response } from 'express';
import { Transaction } from '../transaction/transaction.model';
import { Wallet } from '../wallet/wallet';
import { User } from '../user';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments();
    const items = await Transaction.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, items });
  } catch (err) {
    console.error('Admin transactions fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const toggleBlockWallet = async (req: Request, res: Response) => {
  try {
    const userId = (req.params.userId || '').trim();
    console.log('Toggle block wallet for user:', userId);

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      console.log('Wallet not found');
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.isBlocked = !wallet.isBlocked;
    await wallet.save();

    return res.json({ message: `Wallet ${wallet.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    console.error('Toggle block wallet error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const toggleAgentStatus = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') return res.status(404).json({ message: 'Agent not found' });

    agent.status = agent.status === 'approved' ? 'suspended' : 'approved';
    await agent.save();

    return res.json({ message: `Agent is now ${agent.status}` });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.find().populate('user', 'name email role');
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string | undefined; 
    const limit = Number(req.query.limit || 10);
    const page = Number(req.query.page || 1);
    const skip = (page - 1) * limit;

    const filter = role ? { role } : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    return res.json({ total, page, limit, users });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

