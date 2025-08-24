import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'agent' | 'admin';
  isActive: boolean;
  status: 'approved' | 'suspended'; 
}

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: { type: String, enum: ['user', 'agent', 'admin'], required: true },
  status: { type: String, enum: ['approved', 'suspended'], default: 'approved' }, 
});
;

export const User = mongoose.model<IUser>('User', userSchema);
