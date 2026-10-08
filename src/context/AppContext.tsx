import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Vehicle, LocationHub, Booking, UserProfile, FilterState } from '../types';
import { MOCK_VEHICLES, AUTONEST_LOCATION, MOCK_BOOKINGS, INITIAL_USER } from '../data/mockData';

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
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  updateBookingDraft: (fields: Partial<BookingDraft>) => void;
  toggleFavorite: (vehicleId: string) => void;
  createBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['bookingStatus']) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  switchUserRole: (role: 'user' | 'admin') => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  setAuthModalOpen: (open: boolean) => void;
  setActiveVehicleModal: (vehicle: Vehicle | null) => void;
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

  // Sync to local storage
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

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `AN-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking request ${newBooking.id} submitted!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['bookingStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: status } : b))
    );
    showToast(`Booking ${bookingId} status updated to ${status}`, 'info');
  };

  const addVehicle = (newVehData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...newVehData,
      id: `car-${Date.now().toString().slice(-4)}`
    };
    setVehicles((prev) => [newVeh, ...prev]);
    showToast(`${newVeh.brand} ${newVeh.model} added to Autonest fleet!`, 'success');
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
    showToast('Vehicle details updated', 'success');
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('Vehicle removed from fleet', 'info');
  };

  const switchUserRole = (role: 'user' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
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
      role: 'user',
      memberSince: new Date().getFullYear().toString()
    });
    setAuthModalOpen(false);
    showToast('Signed in to Autonest Account', 'success');
  };

  const logoutUser = () => {
    setUser(null);
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
        setFilters,
        resetFilters,
        updateBookingDraft,
        toggleFavorite,
        createBooking,
        updateBookingStatus,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        switchUserRole,
        loginUser,
        logoutUser,
        showToast,
        setAuthModalOpen,
        setActiveVehicleModal
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
