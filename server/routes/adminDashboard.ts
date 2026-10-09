import { Router } from 'express';
import { readDB } from '../db/storage.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/dashboard/stats - Real database metrics
router.get('/stats', authenticateAdmin, (_req, res) => {
  const db = readDB();

  const activeCars = db.cars.filter((c: any) => !c.archivedAt);
  const totalCars = activeCars.length;
  const availableCars = activeCars.filter((c: any) => c.availabilityStatus === 'Available' || c.available === true).length;
  const unavailableCars = totalCars - availableCars;

  const totalBookings = db.bookings.length;
  const pendingBookings = db.bookings.filter((b: any) => (b.bookingStatus || b.status || '').toLowerCase() === 'pending').length;
  const confirmedBookings = db.bookings.filter((b: any) => (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed').length;
  const completedBookings = db.bookings.filter((b: any) => (b.bookingStatus || b.status || '').toLowerCase() === 'completed').length;
  const cancelledBookings = db.bookings.filter((b: any) => (b.bookingStatus || b.status || '').toLowerCase() === 'cancelled' || (b.bookingStatus || b.status || '').toLowerCase() === 'rejected').length;

  return res.json({
    success: true,
    stats: {
      totalCars,
      availableCars,
      unavailableCars,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings
    }
  });
});

export default router;
