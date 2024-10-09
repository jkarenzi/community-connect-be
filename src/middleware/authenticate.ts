import { Request, Response, NextFunction } from 'express';
import { IUser } from '../custom'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface Decoded {
    user: IUser
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string) as Decoded;

    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};