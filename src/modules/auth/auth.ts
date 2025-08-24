import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../user';
import { Wallet } from '../wallet/wallet';


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

  
    await Wallet.create({ user: user._id });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
