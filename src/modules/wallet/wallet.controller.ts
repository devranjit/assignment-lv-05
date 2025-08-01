import { Request, Response } from 'express';
import { Wallet } from './wallet';
import { User } from '../user';
import { Transaction } from '../transaction/transaction.model';





export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body as { amount: number };
    const userId = (req as any).user.id;

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({ user: wallet.user, type: 'add', amount });

    return res.json({ message: 'Money added successfully', balance: wallet.balance });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body as { amount: number };
    const userId = (req as any).user.id;

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({ user: wallet.user, type: 'withdraw', amount });

    return res.json({ message: 'Withdrawal successful', balance: wallet.balance });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const { receiverEmail, amount } = req.body as { receiverEmail: string; amount: number };
    const senderId = (req as any).user.id;

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const senderWallet = await Wallet.findOne({ user: senderId });
    if (!senderWallet) return res.status(404).json({ message: 'Sender wallet not found' });

    if (senderWallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    const receiverWallet = await Wallet.findOne({ user: receiver._id });
    if (!receiverWallet) return res.status(404).json({ message: 'Receiver wallet not found' });

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    await Transaction.create({ user: senderWallet.user, type: 'send', amount, to: receiver._id });
    await Transaction.create({ user: receiver._id, type: 'receive', amount, from: senderWallet.user });

    return res.json({ message: 'Transfer successful', senderBalance: senderWallet.balance });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = Number(req.query.limit || 20);
    const page = Number(req.query.page || 1);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Transaction.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments({ user: userId })
    ]);

    return res.json({ total, page, limit, items });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};
