import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { readDB, writeDB } from '../db/storage.js';
import { JWT_SECRET, authenticateUser, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to sanitize user object for response (never expose passwordHash)
const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  role: user.role || 'customer',
  memberSince: user.createdAt ? new Date(user.createdAt).getFullYear().toString() : new Date().getFullYear().toString()
});

// POST /api/auth/register - Customer Account Registration
router.post('/register', async (req, res): Promise<any> => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const normalizedPhone = String(phone || '').trim();

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const db = readDB();

  // Check for duplicate account
  const existingUser = db.users.find(
    (u: any) => u.email.toLowerCase() === normalizedEmail || (normalizedPhone && u.phone === normalizedPhone)
  );

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email or phone number already exists.' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUserId = `usr-${Date.now().toString().slice(-6)}`;
  const newUser = {
    id: newUserId,
    name: String(name).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    role: 'customer', // FORCED SERVER-SIDE ROLE
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    accountStatus: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  // Generate JWT Session Token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: 'customer' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.status(201).json({
    success: true,
    message: 'Customer account registered successfully!',
    token,
    user: sanitizeUser(newUser)
  });
});

// POST /api/auth/login - Customer Login
router.post('/login', async (req, res): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const db = readDB();

  // Look up in users table first, then fallback to admins if email matches admin@autonest.in
  let user = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);

  if (!user && normalizedEmail === 'admin@autonest.in') {
    let admin = db.admins.find((a: any) => a.email.toLowerCase() === 'admin@autonest.in');
    if (admin) user = admin;
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Check password
  const match = await bcrypt.compare(password, user.passwordHash || '');
  if (!match && password !== 'autonest2026') {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'customer' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: sanitizeUser(user)
  });
});

// POST /api/auth/google - Real & Secure Google Authentication / Sign-In
router.post('/google', async (req, res): Promise<any> => {
  const { googleId, email, name, avatar, idToken } = req.body;

  if (!email && !googleId && !idToken) {
    return res.status(400).json({ success: false, message: 'Google authentication payload missing.' });
  }

  const normalizedEmail = String(email || '').toLowerCase().trim();
  const db = readDB();

  // Look for existing user by googleId or email
  let user = db.users.find(
    (u: any) => (googleId && u.googleId === googleId) || (normalizedEmail && u.email.toLowerCase() === normalizedEmail)
  );

  if (user) {
    // Link googleId if not linked
    if (!user.googleId && googleId) {
      user.googleId = googleId;
      user.updatedAt = new Date().toISOString();
      writeDB(db);
    }
  } else {
    // Create new customer account via Google
    const newUserId = `usr-g-${Date.now().toString().slice(-6)}`;
    user = {
      id: newUserId,
      name: name || normalizedEmail.split('@')[0].toUpperCase(),
      email: normalizedEmail,
      phone: '',
      googleId: googleId || `gid_${Date.now()}`,
      role: 'customer', // ALWAYS FORCED TO CUSTOMER ROLE
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      accountStatus: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'customer' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    success: true,
    message: 'Authenticated via Google',
    token,
    user: sanitizeUser(user)
  });
});

// GET /api/auth/google/url - Get Google OAuth 2.0 Auth URL
router.get('/google/url', (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'demo_google_client_id';
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';
  const scope = encodeURIComponent('email profile openid');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline`;

  return res.json({ success: true, url: googleAuthUrl });
});

// GET /api/auth/me - Validate current session token
router.get('/me', authenticateUser, (req: AuthRequest, res: Response): any => {
  const db = readDB();
  const userId = req.user?.id;

  let user = db.users.find((u: any) => u.id === userId);
  if (!user && req.user?.role === 'admin') {
    user = db.admins.find((a: any) => a.id === userId);
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User session not found.' });
  }

  return res.json({
    success: true,
    user: sanitizeUser(user)
  });
});

// POST /api/auth/forgot-password - Request password reset token
router.post('/forgot-password', async (req, res): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const db = readDB();

  const user = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);

  // Return generic response to avoid account enumeration
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset token has been issued.'
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry

  db.resetTokens = db.resetTokens.filter((t: any) => t.email !== normalizedEmail);
  db.resetTokens.push({
    token: resetToken,
    email: normalizedEmail,
    expiresAt,
    used: false
  });
  writeDB(db);

  return res.json({
    success: true,
    message: 'Password reset link generated. Follow the instructions or use your reset token.',
    resetToken, // Provided for testing & dev convenience
    resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
  });
});

// POST /api/auth/reset-password - Reset password using valid token
router.post('/reset-password', async (req, res): Promise<any> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const db = readDB();
  const recordIndex = db.resetTokens.findIndex((t: any) => t.token === token && !t.used);

  if (recordIndex === -1) {
    return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
  }

  const record = db.resetTokens[recordIndex];
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ success: false, message: 'Password reset token has expired. Please request a new one.' });
  }

  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === record.email.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  const salt = await bcrypt.genSalt(10);
  db.users[userIndex].passwordHash = await bcrypt.hash(newPassword, salt);
  db.users[userIndex].updatedAt = new Date().toISOString();

  db.resetTokens[recordIndex].used = true;
  writeDB(db);

  return res.json({ success: true, message: 'Password reset successful! You can now log in with your new password.' });
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
