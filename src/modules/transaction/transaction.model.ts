import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: 'add' | 'withdraw' | 'send' | 'receive' | 'cash-in' | 'cash-out';
  amount: number;
  from?: mongoose.Types.ObjectId; 
  to?: mongoose.Types.ObjectId;   
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String,  enum: ['add', 'withdraw', 'send', 'receive', 'cash-in', 'cash-out'], required: true },
    amount: { type: Number, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
