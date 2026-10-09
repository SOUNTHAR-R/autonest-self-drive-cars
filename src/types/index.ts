export type VehicleCategory =
  | 'All'
  | 'Hatchback'
  | 'Sedan'
  | 'SUV'
  | 'MUV / MPV'
  | 'Luxury'
  | 'Premium'
  | 'Electric'
  | 'Other';

export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type AvailabilityStatus = 'Available' | 'Unavailable' | 'Maintenance';

export interface VehicleSpecifications {
  transmission: TransmissionType;
  fuelType: FuelType;
  seatingCapacity: number;
  doors: number;
  engineCapacity?: string;
  mileageRange?: string;
  airConditioning: boolean;
  powerSteering: boolean;
  infotainmentSystem: boolean;
  bluetooth: boolean;
  rearCamera: boolean;
  parkingSensors: boolean;
  airbags?: number;
  abs: boolean;
  additionalFeatures: string[];
}

export interface VehiclePricing {
  hourlyRate?: number;
  dailyRate: number;
  weekendRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  securityDeposit?: number;
  includedKm?: string;
  extraKmCharge?: string;
  minRentalDuration?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  registrationNo?: string;
  year: number;
  category: VehicleCategory;
  description: string;
  images: string[];
  
  // Public flattened fields
  dailyPrice: number; // 0 means "Price available on request"
  hourlyPrice?: number;
  weekendPrice?: number;
  deposit?: number;
  kilometerAllowance?: string;
  extraKmCharge?: string;
  seats: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  features: string[];
  location: string;
  available: boolean;
  rating?: number;
  reviewCount?: number;

  // Rich admin structure
  specifications?: VehicleSpecifications;
  pricing?: VehiclePricing;
  availabilityStatus?: AvailabilityStatus;
  isPublished?: boolean;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
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

export type BookingStatus =
  | 'Pending'
  | 'Contacted'
  | 'Confirmed'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed'
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Booking {
  id: string;
  bookingReference?: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  drivingLicenceNo?: string;
  carId?: string;
  vehicle: Vehicle;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  totalDays: number;
  totalAmount: number;
  estimatedPrice?: number;
  bookingStatus: BookingStatus;
  status?: BookingStatus;
  customerMessage?: string;
  adminNotes?: string;
  statusHistory?: StatusHistoryEntry[];
  createdAt: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalRequests: number;
  confirmedBookings: number;
  lastRequestDate: string;
  bookings: Booking[];
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

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  unavailableCars: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}
