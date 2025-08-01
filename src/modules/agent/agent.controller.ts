import { Request, Response } from 'express';
import { Wallet } from '../wallet/wallet';
import { User } from '../user';
import { Transaction } from '../transaction/transaction.model';

export const cashInToUser = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    const agentId = (req as any).user.id;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userWallet = await Wallet.findOne({ user: user._id });
    if (!userWallet) return res.status(404).json({ message: 'Wallet not found' });

    userWallet.balance += amount;
    await userWallet.save();

    await Transaction.create({
      user: user._id,
      amount,
      type: 'cash-in',
      from: agentId
    });

    return res.json({ message: 'Cash-in successful', balance: userWallet.balance });
  } catch (error) {
     console.error('Cash-in error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const cashOutFromUser = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    const agentId = (req as any).user.id;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userWallet = await Wallet.findOne({ user: user._id });
    if (!userWallet) return res.status(404).json({ message: 'Wallet not found' });

    if (userWallet.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });

    userWallet.balance -= amount;
    await userWallet.save();

    await Transaction.create({
      user: user._id,
      amount,
      type: 'cash-out',
      to: agentId
    });

    return res.json({ message: 'Cash-out successful', balance: userWallet.balance });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAgentTransactions = async (req: Request, res: Response) => {
  try {
    const agentId = (req as any).user.id;
    console.log('Agent ID:', agentId);

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    console.log('Pagination:', { limit, page, skip });

    const filter = {
      $or: [{ from: agentId }, { to: agentId }],
    };

    const total = await Transaction.countDocuments(filter);
    console.log('Total Transactions:', total);

    const items = await Transaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log('Fetched Items:', items.length);

    res.json({ total, page, limit, items });
  } catch (err) {
    console.error('Agent transactions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
