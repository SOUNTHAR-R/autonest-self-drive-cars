import { Router } from 'express';
import { readDB, writeDB } from '../db/storage.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/cars - List all cars in inventory
router.get('/', authenticateAdmin, (_req, res) => {
  const db = readDB();
  const cars = db.cars.filter((c: any) => !c.archivedAt);
  return res.json({ success: true, count: cars.length, cars });
});

// GET /api/admin/cars/:id - Single car details
router.get('/:id', authenticateAdmin, (req, res): any => {
  const db = readDB();
  const car = db.cars.find((c: any) => c.id === req.params.id);
  if (!car) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }
  return res.json({ success: true, car });
});

// POST /api/admin/cars - Create a new vehicle
router.post('/', authenticateAdmin, (req, res): any => {
  const {
    name,
    brand,
    model,
    variant,
    year,
    category,
    description,
    images,
    specifications,
    pricing,
    availabilityStatus,
    isPublished
  } = req.body;

  if (!name || !brand || !model || !category) {
    return res.status(400).json({ success: false, message: 'Display Name, Brand, Model, and Category are required.' });
  }

  const db = readDB();
  const newId = `car-${Date.now().toString().slice(-6)}`;

  const newCar = {
    id: newId,
    name,
    brand,
    model,
    variant: variant || '',
    year: Number(year) || 2024,
    category,
    description: description || '',
    images: Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: specifications || {
      transmission: 'Manual',
      fuelType: 'Petrol',
      seatingCapacity: 5,
      doors: 4,
      airConditioning: true,
      powerSteering: true,
      infotainmentSystem: true,
      bluetooth: true,
      rearCamera: true,
      parkingSensors: true,
      abs: true,
      additionalFeatures: []
    },
    pricing: pricing || {
      hourlyRate: 150,
      dailyRate: 1800,
      weekendRate: 2200,
      securityDeposit: 3000,
      includedKm: '250 km / day',
      extraKmCharge: '₹12 / km',
      minRentalDuration: '24 Hours'
    },
    // Flattened price for quick public rendering
    dailyPrice: pricing?.dailyRate !== undefined ? Number(pricing.dailyRate) : 1800,
    hourlyPrice: pricing?.hourlyRate !== undefined ? Number(pricing.hourlyRate) : 150,
    weekendPrice: pricing?.weekendRate !== undefined ? Number(pricing.weekendRate) : 2200,
    deposit: pricing?.securityDeposit !== undefined ? Number(pricing.securityDeposit) : 3000,
    kilometerAllowance: pricing?.includedKm || '250 km / day',
    extraKmCharge: pricing?.extraKmCharge || '₹12 / km',
    seats: specifications?.seatingCapacity ? Number(specifications.seatingCapacity) : 5,
    transmission: specifications?.transmission || 'Manual',
    fuelType: specifications?.fuelType || 'Petrol',
    features: specifications?.additionalFeatures || ['Air Conditioning', 'Bluetooth'],
    location: 'Thoraipakkam, Chennai',
    available: availabilityStatus === 'Available' || availabilityStatus === undefined,
    availabilityStatus: availabilityStatus || 'Available',
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.cars.unshift(newCar);
  writeDB(db);

  return res.status(201).json({ success: true, message: 'Vehicle created successfully', car: newCar });
});

// PATCH /api/admin/cars/:id - Update vehicle details
router.patch('/:id', authenticateAdmin, (req, res): any => {
  const db = readDB();
  const index = db.cars.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  const existing = db.cars[index];
  const updatedData = req.body;

  const updatedCar = {
    ...existing,
    ...updatedData,
    id: existing.id,
    dailyPrice: updatedData.pricing?.dailyRate !== undefined ? Number(updatedData.pricing.dailyRate) : (updatedData.dailyPrice !== undefined ? Number(updatedData.dailyPrice) : existing.dailyPrice),
    available: updatedData.availabilityStatus ? updatedData.availabilityStatus === 'Available' : (updatedData.available !== undefined ? updatedData.available : existing.available),
    updatedAt: new Date().toISOString()
  };

  db.cars[index] = updatedCar;
  writeDB(db);

  return res.json({ success: true, message: 'Vehicle updated successfully', car: updatedCar });
});

// PATCH /api/admin/cars/:id/status - Update vehicle availability & publication state
router.patch('/:id/status', authenticateAdmin, (req, res): any => {
  const { availabilityStatus, isPublished } = req.body;
  const db = readDB();
  const index = db.cars.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  if (availabilityStatus !== undefined) {
    db.cars[index].availabilityStatus = availabilityStatus;
    db.cars[index].available = availabilityStatus === 'Available';
  }
  if (isPublished !== undefined) {
    db.cars[index].isPublished = Boolean(isPublished);
  }
  db.cars[index].updatedAt = new Date().toISOString();

  writeDB(db);
  return res.json({ success: true, message: 'Vehicle status updated', car: db.cars[index] });
});

// DELETE /api/admin/cars/:id - Soft-delete or remove car
router.delete('/:id', authenticateAdmin, (req, res): any => {
  const db = readDB();
  const index = db.cars.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  const carId = req.params.id;
  const hasBookings = db.bookings.some((b: any) => b.carId === carId || b.vehicle?.id === carId);

  if (hasBookings) {
    // Soft delete to protect booking records
    db.cars[index].archivedAt = new Date().toISOString();
    db.cars[index].isPublished = false;
    db.cars[index].available = false;
  } else {
    db.cars.splice(index, 1);
  }

  writeDB(db);
  return res.json({ success: true, message: 'Car deleted/archived successfully' });
});

export default router;
