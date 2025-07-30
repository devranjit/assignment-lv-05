import { Request, Response } from 'express';
import { Wallet } from './wallet';

export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = (req as any).user.id;

    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    wallet.balance += amount;
    await wallet.save();

    res.json({ message: 'Money added successfully', balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
