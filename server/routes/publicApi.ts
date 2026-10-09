import { Router } from 'express';
import { readDB, writeDB } from '../db/storage.js';

const router = Router();

// GET /api/cars - Get all published cars for public website
router.get('/cars', (_req, res) => {
  const db = readDB();
  const publishedCars = db.cars.filter(
    (c: any) => c.isPublished !== false && !c.archivedAt
  );
  return res.json({ success: true, count: publishedCars.length, cars: publishedCars });
});

// GET /api/cars/:id - Public car details
router.get('/cars/:id', (req, res): any => {
  const db = readDB();
  const car = db.cars.find(
    (c: any) => c.id === req.params.id && c.isPublished !== false && !c.archivedAt
  );
  if (!car) {
    return res.status(404).json({ success: false, message: 'Vehicle not found or unavailable' });
  }
  return res.json({ success: true, car });
});

// POST /api/bookings - Submit public customer booking request
router.post('/bookings', (req, res): any => {
  const {
    carId,
    userName,
    userPhone,
    userEmail,
    drivingLicenceNo,
    pickupLocation,
    returnLocation,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    customerMessage
  } = req.body;

  if (!userName || !userPhone || !carId || !pickupDate || !returnDate) {
    return res.status(400).json({
      success: false,
      message: 'Full Name, Phone Number, Vehicle, Pickup Date, and Return Date are required.'
    });
  }

  const db = readDB();
  const car = db.cars.find((c: any) => c.id === carId && !c.archivedAt);

  if (!car) {
    return res.status(404).json({ success: false, message: 'Selected vehicle does not exist or is no longer available.' });
  }

  if (car.availabilityStatus === 'Unavailable' || car.available === false) {
    return res.status(400).json({ success: false, message: 'Selected vehicle is currently unavailable for booking.' });
  }

  // Calculate rental duration in days
  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  if (isNaN(start) || isNaN(end) || end < start) {
    return res.status(400).json({ success: false, message: 'Return date must be on or after pickup date.' });
  }

  const diffTime = Math.abs(end - start);
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculate estimated price
  const dailyRate = car.pricing?.dailyRate || car.dailyPrice || 0;
  const estimatedPrice = dailyRate > 0 ? dailyRate * totalDays : 0;

  const bookingRef = `AN-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newBooking = {
    id: bookingRef,
    bookingReference: bookingRef,
    userId: `usr-${Math.floor(100 + Math.random() * 900)}`,
    userName,
    userPhone,
    userEmail: userEmail || '',
    drivingLicenceNo: drivingLicenceNo || '',
    carId: car.id,
    vehicle: {
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      category: car.category,
      dailyPrice: dailyRate,
      images: car.images || [],
      seats: car.seats || 5,
      transmission: car.transmission || 'Manual',
      fuelType: car.fuelType || 'Petrol',
      location: car.location || 'Thoraipakkam, Chennai',
      available: car.available,
      description: car.description || ''
    },
    pickupLocation: pickupLocation || 'Thoraipakkam, Chennai',
    returnLocation: returnLocation || 'Thoraipakkam, Chennai',
    pickupDate,
    pickupTime: pickupTime || '10:00 AM',
    returnDate,
    returnTime: returnTime || '10:00 AM',
    totalDays,
    totalAmount: estimatedPrice,
    estimatedPrice,
    bookingStatus: 'Pending',
    status: 'Pending',
    customerMessage: customerMessage || '',
    adminNotes: '',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now,
        note: 'Request submitted by customer via public website'
      }
    ],
    createdAt: now
  };

  db.bookings.unshift(newBooking);
  writeDB(db);

  return res.status(201).json({
    success: true,
    message: `Booking request ${bookingRef} submitted successfully! Autonest will contact you shortly.`,
    bookingReference: bookingRef,
    booking: newBooking
  });
});

export default router;
