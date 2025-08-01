import { Request, Response } from 'express';
import { Wallet } from '../wallet/wallet'; 
import { Transaction } from './transaction.model'; 

export const transferMoney = async (req: Request, res: Response) => {
  try {
    const senderId = req.user.id; 
    const { receiverId, amount } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    const senderWallet = await Wallet.findOne({ user: senderId });
    const receiverWallet = await Wallet.findOne({ user: receiverId });

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }


    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();


    await Transaction.create([
      {
        user: senderId,
        type: 'send',
        amount,
        to: receiverId,
      },
      {
        user: receiverId,
        type: 'receive',
        amount,
        from: senderId,
      },
    ]);

    res.status(200).json({ message: "Transfer successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
