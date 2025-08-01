import { Request, Response } from 'express';
import { User } from '../user';

export const getMyProfile = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id).select('-password');
  res.json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};
