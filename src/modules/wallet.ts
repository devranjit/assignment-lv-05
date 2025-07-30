import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  user: mongoose.Schema.Types.ObjectId;
  balance: number;
  isBlocked: boolean;
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 50 },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
