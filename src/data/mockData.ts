import type { Vehicle, LocationHub, Booking, UserProfile } from '../types';

export const AUTONEST_LOCATION: LocationHub = {
  id: 'loc-autonest-chennai',
  name: 'Autonest Self Drive Cars',
  address: 'No. 20, 1st Main Road, Raj Nagar, Thoraipakkam, Chennai, Tamil Nadu 600097',
  phone: '+91 89396 06556',
  hours: '24 Hours / 7 Days',
  googleRating: 4.9,
  reviewCount: 59,
  googleMapsUrl: 'https://maps.google.com/?q=No.+20,+1st+Main+Road,+Raj+Nagar,+Thoraipakkam,+Chennai,+Tamil+Nadu+600097'
};

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'car-01',
    name: 'Swift ZXi',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi Dual Tone',
    year: 2024,
    category: 'Hatchback',
    dailyPrice: 1800,
    hourlyPrice: 150,
    weekendPrice: 2200,
    deposit: 3000,
    kilometerAllowance: '250 km / day',
    extraKmCharge: '₹12 / km',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    seats: 5,
    transmission: 'Manual',
    fuelType: 'Petrol',
    features: [
      'Touchscreen Infotainment',
      'Bluetooth & USB',
      'Power Windows',
      'Dual Airbags',
      'ABS with EBD',
      'Air Conditioning'
    ],
    location: 'Thoraipakkam, Chennai',
    available: true,
    description: 'Agile hatchback ideal for navigating Chennai city traffic and casual weekend drives.'
  },
  {
    id: 'car-02',
    name: 'City i-VTEC',
    brand: 'Honda',
    model: 'City',
    variant: 'VX CVT',
    year: 2024,
    category: 'Sedan',
    dailyPrice: 2600,
    hourlyPrice: 220,
    weekendPrice: 3100,
    deposit: 5000,
    kilometerAllowance: '250 km / day',
    extraKmCharge: '₹15 / km',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    features: [
      'CVT Automatic Transmission',
      'Sunroof',
      'Leatherette Upholstery',
      'Rear AC Vents',
      'Cruise Control',
      'Apple CarPlay & Android Auto'
    ],
    location: 'Thoraipakkam, Chennai',
    available: true,
    description: 'Refined executive sedan offering smooth highway cruising and spacious cabin comfort.'
  },
  {
    id: 'car-03',
    name: 'Creta SX',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) Turbo',
    year: 2024,
    category: 'SUV',
    dailyPrice: 3200,
    hourlyPrice: 280,
    weekendPrice: 3800,
    deposit: 5000,
    kilometerAllowance: '250 km / day',
    extraKmCharge: '₹18 / km',
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80'
    ],
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    features: [
      'Panoramic Sunroof',
      'Bose Premium Audio',
      'Ventilated Seats',
      'Drive Modes',
      'Wireless Smartphone Charger',
      '360 Degree Camera'
    ],
    location: 'Thoraipakkam, Chennai',
    available: true,
    description: 'Popular compact SUV combining high seating stance, modern tech, and effortless drivability.'
  },
  {
    id: 'car-04',
    name: 'Thar 4x4 Hard Top',
    brand: 'Mahindra',
    model: 'Thar',
    variant: 'LX 4WD AT',
    year: 2024,
    category: 'SUV',
    dailyPrice: 3800,
    hourlyPrice: 320,
    weekendPrice: 4500,
    deposit: 7000,
    kilometerAllowance: '250 km / day',
    extraKmCharge: '₹20 / km',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    seats: 4,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: [
      '4WD Low Ratio Transfer Case',
      'Convertible/Hard Top',
      'Touchscreen Infotainment',
      'All-Terrain Tires',
      'Roll Cage Protection',
      'Tire Pressure Monitoring'
    ],
    location: 'Thoraipakkam, Chennai',
    available: true,
    description: 'Iconic 4x4 off-roader built for coastal road trips and weekend adventure getaways.'
  },
  {
    id: 'car-05',
    name: 'Fortuner 4x2 AT',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: 'Legender 4x2 AT',
    year: 2024,
    category: 'Premium',
    dailyPrice: 5500,
    hourlyPrice: 450,
    weekendPrice: 6500,
    deposit: 10000,
    kilometerAllowance: '250 km / day',
    extraKmCharge: '₹25 / km',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    ],
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: [
      '7 Seater Capacity',
      'JBL 11 Speaker Sound System',
      'Sequential Turn Indicators',
      'Kick Sensor Powered Tailgate',
      'Dual Zone Climate Control',
      'Power Adjustable Seats'
    ],
    location: 'Thoraipakkam, Chennai',
    available: true,
    description: 'Commanding 7-seater luxury SUV designed for group travel and family vacations.'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-autonest-01',
  name: 'K. Rajesh Kanna',
  email: 'rajesh@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  role: 'admin',
  memberSince: '2024'
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'AN-9481',
    userId: 'usr-autonest-01',
    userName: 'K. Rajesh Kanna',
    userPhone: '+91 98765 43210',
    userEmail: 'rajesh@example.com',
    drivingLicenceNo: 'TN-07-2022-00984',
    vehicle: MOCK_VEHICLES[0],
    pickupLocation: 'Thoraipakkam, Chennai',
    returnLocation: 'Thoraipakkam, Chennai',
    pickupDate: '2026-10-15',
    pickupTime: '10:00 AM',
    returnDate: '2026-10-17',
    returnTime: '10:00 AM',
    totalDays: 2,
    totalAmount: 3600,
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-10-06'
  }
];
