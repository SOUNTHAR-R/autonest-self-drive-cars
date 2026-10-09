import { Router } from 'express';
import { readDB } from '../db/storage.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/customers - Normalized customer directory from bookings
router.get('/', authenticateAdmin, (_req, res) => {
  const db = readDB();
  const customerMap: { [key: string]: any } = {};

  db.bookings.forEach((b: any) => {
    const phone = (b.userPhone || b.customer?.phone || '').replace(/\s+/g, '');
    if (!phone) return;

    const name = b.userName || b.customer?.name || 'Customer';
    const email = b.userEmail || b.customer?.email || '';
    const isConfirmed = (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed';

    if (!customerMap[phone]) {
      customerMap[phone] = {
        id: `cust_${phone.slice(-6)}`,
        name,
        phone,
        email,
        totalRequests: 0,
        confirmedBookings: 0,
        lastRequestDate: b.createdAt || new Date().toISOString(),
        bookings: []
      };
    }

    customerMap[phone].totalRequests += 1;
    if (isConfirmed) customerMap[phone].confirmedBookings += 1;
    customerMap[phone].bookings.push(b);

    if (new Date(b.createdAt).getTime() > new Date(customerMap[phone].lastRequestDate).getTime()) {
      customerMap[phone].lastRequestDate = b.createdAt;
    }
  });

  const customers = Object.values(customerMap);
  return res.json({ success: true, count: customers.length, customers });
});

export default router;
