import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { initMongoDB } from './db/storage.js';

import adminAuthRouter from './routes/adminAuth.js';
import adminCarsRouter from './routes/adminCars.js';
import adminBookingsRouter from './routes/adminBookings.js';
import adminDashboardRouter from './routes/adminDashboard.js';
import adminCustomersRouter from './routes/adminCustomers.js';
import adminUploadsRouter from './routes/adminUploads.js';
import publicApiRouter from './routes/publicApi.js';

import customerAuthRouter from './routes/customerAuth.js';
import { customerAccountRouter } from './routes/customerAccount.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded images statically
const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', customerAuthRouter);
app.use('/api/account', customerAccountRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/cars', adminCarsRouter);
app.use('/api/admin/bookings', adminBookingsRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/customers', adminCustomersRouter);
app.use('/api/admin/uploads', adminUploadsRouter);
app.use('/api', publicApiRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Autonest Self Drive Cars API', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Autonest API Server running at http://localhost:${PORT}`);
  initMongoDB();
});
