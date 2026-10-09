import type { Vehicle, Booking, DashboardStats, CustomerSummary } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('autonest_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Admin Auth
  adminLogin: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('autonest_admin_token', data.token);
    }
    return data;
  },

  getAdminMe: async () => {
    const res = await fetch(`${API_BASE}/admin/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Public API
  getPublicCars: async (): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_BASE}/cars`);
      const data = await res.json();
      if (data.success && Array.isArray(data.cars)) {
        return data.cars;
      }
    } catch (err) {
      console.warn('API getPublicCars failed, falling back to local data:', err);
    }
    return [];
  },

  submitPublicBooking: async (bookingData: any): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Booking submission failed');
    }
    return data.booking;
  },

  // Admin Cars
  getAdminCars: async (): Promise<Vehicle[]> => {
    const res = await fetch(`${API_BASE}/admin/cars`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch admin cars');
    }
    return data.cars;
  },

  createCar: async (carData: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE}/admin/cars`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(carData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create car');
    }
    return data.car;
  },

  updateCar: async (id: string, carData: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(carData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update car');
    }
    return data.car;
  },

  updateCarStatus: async (
    id: string,
    statusData: { availabilityStatus?: string; isPublished?: boolean }
  ): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE}/admin/cars/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update car status');
    }
    return data.car;
  },

  deleteCar: async (id: string) => {
    const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete car');
    }
    return data;
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const token = localStorage.getItem('autonest_admin_token');
    const res = await fetch(`${API_BASE}/admin/uploads/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Upload failed');
    }
    return data.imageUrls;
  },

  // Admin Bookings
  getAdminBookings: async (filters?: { status?: string; carId?: string; search?: string }): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.carId) params.append('carId', filters.carId);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }
    return data.bookings;
  },

  updateBookingStatus: async (id: string, status: string, note?: string): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update booking status');
    }
    return data.booking;
  },

  updateBookingNotes: async (id: string, adminNotes: string): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/notes`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ adminNotes })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update notes');
    }
    return data.booking;
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch stats');
    }
    return data.stats;
  },

  // Customers
  getCustomers: async (): Promise<CustomerSummary[]> => {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch customers');
    }
    return data.customers;
  }
};
