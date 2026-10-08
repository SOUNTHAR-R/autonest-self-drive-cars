export type VehicleCategory = 'All' | 'Hatchback' | 'Sedan' | 'SUV' | 'Premium';

export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  category: VehicleCategory;
  dailyPrice: number; // 0 means "Price available on request"
  hourlyPrice?: number;
  weekendPrice?: number;
  deposit?: number;
  kilometerAllowance?: string;
  extraKmCharge?: string;
  images: string[];
  seats: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  features: string[];
  location: string;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  description: string;
}

export interface LocationHub {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  googleRating: number;
  reviewCount: number;
  googleMapsUrl: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  drivingLicenceNo?: string;
  vehicle: Vehicle;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  totalDays: number;
  totalAmount: number;
  bookingStatus: 'REQUESTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: VehicleCategory;
  transmission: string;
  fuelType: string;
  sortBy: 'recommended' | 'price-low' | 'price-high';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin';
  memberSince: string;
}
