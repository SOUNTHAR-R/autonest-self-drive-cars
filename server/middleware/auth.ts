import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'autonest_secret_key_2026_chennai';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateUser(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
    }
    next();
  });
};

export const authenticateCustomer = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateUser(req, res, () => {
    if (req.user?.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Forbidden: Customer account required.' });
    }
    next();
  });
};
