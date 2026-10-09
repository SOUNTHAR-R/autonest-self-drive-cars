import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Vehicle, LocationHub, Booking, UserProfile, FilterState } from '../types';
import { MOCK_VEHICLES, AUTONEST_LOCATION, MOCK_BOOKINGS, INITIAL_USER } from '../data/mockData';
import { api } from '../services/api';

interface BookingDraft {
  vehicle: Vehicle | null;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

interface AppContextType {
  vehicles: Vehicle[];
  locationInfo: LocationHub;
  bookings: Booking[];
  user: UserProfile | null;
  favorites: string[];
  bookingDraft: BookingDraft;
  filters: FilterState;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  isAuthModalOpen: boolean;
  activeVehicleModal: Vehicle | null;
  isLoading: boolean;
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  updateBookingDraft: (fields: Partial<BookingDraft>) => void;
  toggleFavorite: (vehicleId: string) => void;
  createBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: string, note?: string) => Promise<void>;
  addVehicle: (vehicleData: Partial<Vehicle>) => Promise<Vehicle>;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => Promise<void>;
  updateCarStatus: (id: string, statusData: { availabilityStatus?: string; isPublished?: boolean }) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  switchUserRole: (role: 'user' | 'admin') => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  setAuthModalOpen: (open: boolean) => void;
  setActiveVehicleModal: (vehicle: Vehicle | null) => void;
  refreshData: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  transmission: 'All',
  fuelType: 'All',
  sortBy: 'recommended'
};

const defaultDraft: BookingDraft = {
  vehicle: null,
  pickupLocation: 'Thoraipakkam, Chennai',
  returnLocation: 'Thoraipakkam, Chennai',
  pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  pickupTime: '10:00 AM',
  returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  returnTime: '10:00 AM'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('autonest_vehicles');
    return saved ? JSON.parse(saved) : MOCK_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('autonest_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [favorites, setFavorites] = useState<string[]>(['car-01', 'car-03']);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>(defaultDraft);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [activeVehicleModal, setActiveVehicleModal] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial Sync from Backend API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch public cars or admin cars
      const token = localStorage.getItem('autonest_admin_token');
      if (token) {
        try {
          const adminCars = await api.getAdminCars();
          if (adminCars && adminCars.length > 0) setVehicles(adminCars);

          const adminBookings = await api.getAdminBookings();
          if (adminBookings && adminBookings.length > 0) setBookings(adminBookings);
        } catch (e) {
          const publicCars = await api.getPublicCars();
          if (publicCars && publicCars.length > 0) setVehicles(publicCars);
        }
      } else {
        const publicCars = await api.getPublicCars();
        if (publicCars && publicCars.length > 0) setVehicles(publicCars);
      }
    } catch (err) {
      console.log('Using local state cache for vehicles and bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Local storage persistence fallback
  useEffect(() => {
    localStorage.setItem('autonest_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('autonest_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const resetFilters = () => setFilters(defaultFilters);

  const updateBookingDraft = (fields: Partial<BookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...fields }));
  };

  const toggleFavorite = (vehicleId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(vehicleId);
      const next = isFav ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId];
      showToast(isFav ? 'Removed from saved vehicles' : 'Saved to favorites', 'info');
      return next;
    });
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      const newBooking = await api.submitPublicBooking({
        carId: bookingData.vehicle.id,
        userName: bookingData.userName,
        userPhone: bookingData.userPhone,
        userEmail: bookingData.userEmail,
        drivingLicenceNo: bookingData.drivingLicenceNo,
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        returnDate: bookingData.returnDate,
        returnTime: bookingData.returnTime,
        customerMessage: bookingData.customerMessage
      });

      setBookings((prev) => [newBooking, ...prev]);
      showToast(`Booking request ${newBooking.bookingReference || newBooking.id} submitted!`, 'success');
      return newBooking;
    } catch (err: any) {
      // Local fallback
      const localBooking: Booking = {
        ...bookingData,
        id: `AN-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingReference: `AN-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingStatus: 'Pending',
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      setBookings((prev) => [localBooking, ...prev]);
      showToast(`Booking request ${localBooking.id} submitted!`, 'success');
      return localBooking;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, note?: string) => {
    try {
      const updated = await api.updateBookingStatus(bookingId, status, note);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId || b.bookingReference === bookingId ? updated : b))
      );
      showToast(`Booking ${bookingId} status updated to ${status}`, 'success');
    } catch (err: any) {
      // If error is an overlapping conflict, show explicit error toast & throw!
      showToast(err.message || 'Status update failed', 'error');
      throw err;
    }
  };

  const addVehicle = async (newVehData: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const created = await api.createCar(newVehData);
      setVehicles((prev) => [created, ...prev]);
      showToast(`${created.brand} ${created.model} added to Autonest fleet!`, 'success');
      return created;
    } catch (err: any) {
      const localId = `car-${Date.now().toString().slice(-4)}`;
      const localVeh: Vehicle = {
        id: localId,
        name: newVehData.name || 'New Vehicle',
        brand: newVehData.brand || 'Autonest',
        model: newVehData.model || 'Model',
        variant: newVehData.variant || '',
        year: newVehData.year || 2024,
        category: newVehData.category || 'Hatchback',
        dailyPrice: newVehData.dailyPrice || 1800,
        images: newVehData.images || ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        seats: newVehData.seats || 5,
        transmission: newVehData.transmission || 'Manual',
        fuelType: newVehData.fuelType || 'Petrol',
        features: newVehData.features || ['Air Conditioning'],
        location: 'Thoraipakkam, Chennai',
        available: true,
        availabilityStatus: 'Available',
        isPublished: true,
        description: newVehData.description || 'Self-drive car.'
      };
      setVehicles((prev) => [localVeh, ...prev]);
      showToast(`${localVeh.brand} ${localVeh.model} added to fleet!`, 'success');
      return localVeh;
    }
  };

  const updateVehicle = async (id: string, updated: Partial<Vehicle>) => {
    try {
      const updatedCar = await api.updateCar(id, updated);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedCar : v))
      );
      showToast('Vehicle updated successfully', 'success');
    } catch (err: any) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
      );
      showToast('Vehicle updated in local state', 'info');
    }
  };

  const updateCarStatus = async (id: string, statusData: { availabilityStatus?: string; isPublished?: boolean }) => {
    try {
      const updatedCar = await api.updateCarStatus(id, statusData);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedCar : v))
      );
    } catch (err: any) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          return {
            ...v,
            ...(statusData.availabilityStatus ? { availabilityStatus: statusData.availabilityStatus as any, available: statusData.availabilityStatus === 'Available' } : {}),
            ...(statusData.isPublished !== undefined ? { isPublished: statusData.isPublished } : {})
          };
        })
      );
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await api.deleteCar(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast('Vehicle removed from fleet', 'info');
    } catch (err: any) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast('Vehicle removed from fleet', 'info');
    }
  };

  const switchUserRole = (role: 'user' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
      showToast(`Switched to ${role.toUpperCase()} View`, 'info');
    } else {
      setUser({
        id: 'admin-1',
        name: 'Autonest Admin',
        email: 'admin@autonest.in',
        phone: '+91 89396 06556',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role,
        memberSince: new Date().getFullYear().toString()
      });
      showToast(`Switched to ${role.toUpperCase()} View`, 'info');
    }
  };

  const loginUser = (email: string) => {
    setUser({
      id: 'usr-' + Math.floor(100 + Math.random() * 900),
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+91 89396 06556',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      role: email.includes('admin') ? 'admin' : 'user',
      memberSince: new Date().getFullYear().toString()
    });
    setAuthModalOpen(false);
    showToast('Signed in to Autonest Account', 'success');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('autonest_admin_token');
    showToast('Signed out of account', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        locationInfo: AUTONEST_LOCATION,
        bookings,
        user,
        favorites,
        bookingDraft,
        filters,
        toast,
        isAuthModalOpen,
        activeVehicleModal,
        isLoading,
        setFilters,
        resetFilters,
        updateBookingDraft,
        toggleFavorite,
        createBooking,
        updateBookingStatus,
        addVehicle,
        updateVehicle,
        updateCarStatus,
        deleteVehicle,
        switchUserRole,
        loginUser,
        logoutUser,
        showToast,
        setAuthModalOpen,
        setActiveVehicleModal,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
