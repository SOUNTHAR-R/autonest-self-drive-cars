import { Router } from 'express';
import { readDB, writeDB } from '../db/storage.js';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/bookings - List all customer booking requests
router.get('/', authenticateAdmin, (req, res) => {
  const db = readDB();
  const { status, carId, search } = req.query;

  let bookings = [...db.bookings];

  if (status && status !== 'All') {
    bookings = bookings.filter(
      (b: any) =>
        (b.bookingStatus || b.status).toLowerCase() === String(status).toLowerCase()
    );
  }

  if (carId) {
    bookings = bookings.filter((b: any) => b.carId === carId || b.vehicle?.id === carId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    bookings = bookings.filter(
      (b: any) =>
        (b.bookingReference || b.id || '').toLowerCase().includes(q) ||
        (b.userName || b.customer?.name || '').toLowerCase().includes(q) ||
        (b.userPhone || b.customer?.phone || '').toLowerCase().includes(q)
    );
  }

  // Sort newest first
  bookings.sort(
    (a: any, b: any) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return res.json({ success: true, count: bookings.length, bookings });
});

// GET /api/admin/bookings/:id - Single booking details
router.get('/:id', authenticateAdmin, (req, res): any => {
  const db = readDB();
  const booking = db.bookings.find(
    (b: any) => b.id === req.params.id || b.bookingReference === req.params.id
  );
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking request not found' });
  }
  return res.json({ success: true, booking });
});

// Helper function to parse dates for overlap check
const parseDateTime = (dateStr: string, timeStr: string = '10:00 AM') => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date();
  return d;
};

// PATCH /api/admin/bookings/:id/status - Update booking status with overlapping check
router.patch('/:id/status', authenticateAdmin, (req: AuthRequest, res: Response): any => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'New status is required' });
  }

  const validStatuses = ['Pending', 'Contacted', 'Confirmed', 'Rejected', 'Cancelled', 'Completed'];
  const formattedStatus = validStatuses.find(s => s.toLowerCase() === String(status).toLowerCase()) || status;

  const db = readDB();
  const index = db.bookings.findIndex(
    (b: any) => b.id === req.params.id || b.bookingReference === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking request not found' });
  }

  const targetBooking = db.bookings[index];
  const targetCarId = targetBooking.carId || targetBooking.vehicle?.id;

  // OVERLAPPING BOOKING PREVENTION FOR CONFIRMED STATUS
  if (formattedStatus === 'Confirmed' && targetCarId) {
    const targetStart = new Date(targetBooking.pickupDate || targetBooking.pickupDateTime).getTime();
    const targetEnd = new Date(targetBooking.returnDate || targetBooking.returnDateTime).getTime();

    const conflictingBooking = db.bookings.find((b: any) => {
      if (b.id === targetBooking.id) return false;
      const bCarId = b.carId || b.vehicle?.id;
      if (bCarId !== targetCarId) return false;
      const bStatus = (b.bookingStatus || b.status || '').toLowerCase();
      if (bStatus !== 'confirmed') return false;

      const bStart = new Date(b.pickupDate || b.pickupDateTime).getTime();
      const bEnd = new Date(b.returnDate || b.returnDateTime).getTime();

      // Check date range overlap
      return Math.max(targetStart, bStart) < Math.min(targetEnd, bEnd);
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: `Conflict Detected: Vehicle ${targetBooking.vehicle?.brand || ''} ${targetBooking.vehicle?.model || ''} already has a CONFIRMED booking (${conflictingBooking.bookingReference || conflictingBooking.id}) for overlapping dates (${conflictingBooking.pickupDate} to ${conflictingBooking.returnDate}).`
      });
    }
  }

  // Record status history
  const statusEntry = {
    status: formattedStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${formattedStatus} by admin`,
    updatedBy: req.user?.email || 'Admin'
  };

  const statusHistory = Array.isArray(targetBooking.statusHistory)
    ? [...targetBooking.statusHistory, statusEntry]
    : [statusEntry];

  db.bookings[index] = {
    ...targetBooking,
    bookingStatus: formattedStatus,
    status: formattedStatus,
    statusHistory,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);

  return res.json({
    success: true,
    message: `Booking status successfully updated to ${formattedStatus}`,
    booking: db.bookings[index]
  });
});

// PATCH /api/admin/bookings/:id/notes - Update admin internal notes
router.patch('/:id/notes', authenticateAdmin, (req, res): any => {
  const { adminNotes } = req.body;
  const db = readDB();
  const index = db.bookings.findIndex(
    (b: any) => b.id === req.params.id || b.bookingReference === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking request not found' });
  }

  db.bookings[index].adminNotes = adminNotes || '';
  db.bookings[index].updatedAt = new Date().toISOString();

  writeDB(db);

  return res.json({
    success: true,
    message: 'Admin notes saved',
    booking: db.bookings[index]
  });
});

export default router;
