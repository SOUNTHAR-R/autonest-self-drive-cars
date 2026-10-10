import { Router, Response } from 'express';
import { storage } from '../db/storage.js';
import { authenticateCustomer, AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

export const customerAccountRouter = Router();

// Protect all account routes with customer auth
customerAccountRouter.use(authenticateCustomer);

// Get Customer Profile
customerAccountRouter.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch profile' });
  }
});

// Update Customer Profile
customerAccountRouter.patch('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, address } = req.body;
    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const updatedUser = await storage.updateUser(req.user!.id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update profile' });
  }
});

// Change Password
customerAccountRouter.post('/change-password', async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.googleId && !user.passwordHash) {
      return res.status(400).json({ success: false, message: 'Accounts created via Google Sign-In do not have a password. Use password reset if needed.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash || '');
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await storage.updateUser(req.user!.id, { passwordHash: newHash });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to change password' });
  }
});

// Get Customer Bookings (filter bookings by user ID or email)
customerAccountRouter.get('/bookings', async (req: AuthRequest, res: Response) => {
  try {
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const allBookings = await storage.getAllBookings();
    // Filter bookings belonging to this customer by userId or matching email
    const customerBookings = allBookings.filter(
      (b) => b.userId === user.id || (b.customerEmail && b.customerEmail.toLowerCase() === user.email.toLowerCase())
    );

    res.json({ success: true, bookings: customerBookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch bookings' });
  }
});
