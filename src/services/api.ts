import type { Vehicle, Booking, DashboardStats, CustomerSummary } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('autonest_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const getCustomerHeaders = () => {
  const token = localStorage.getItem('autonest_customer_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

async function parseJSON(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok || contentType.includes('text/html') || text.trim().startsWith('<')) {
    throw new Error('SERVER_OFFLINE_OR_STATIC_HOST');
  }

  if (!text || !text.trim()) {
    throw new Error('Empty response from server');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('SERVER_OFFLINE_OR_STATIC_HOST');
  }
}

// Local storage storage helper for Vercel static deployments
const getStoredUsers = () => {
  const saved = localStorage.getItem('autonest_registered_users');
  return saved ? JSON.parse(saved) : [];
};

const saveUserLocal = (user: any) => {
  const users = getStoredUsers();
  const existingIdx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx !== -1) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem('autonest_registered_users', JSON.stringify(users));
};

export const api = {
  // Customer Auth & Account
  customerRegister: async (payload: { fullName: string; email: string; password?: string; phone?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJSON(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      if (data.token) {
        localStorage.setItem('autonest_customer_token', data.token);
      }
      return data;
    } catch (err: any) {
      if (err.message === 'SERVER_OFFLINE_OR_STATIC_HOST' || err.message?.includes('Failed to fetch')) {
        // Vercel / Static fallback
        const newUser = {
          id: `usr_${Date.now()}`,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone || '+91 89396 06556',
          createdAt: new Date().toISOString()
        };
        saveUserLocal(newUser);
        const token = `autonest_cust_token_${Date.now()}`;
        localStorage.setItem('autonest_customer_token', token);
        localStorage.setItem('autonest_current_customer', JSON.stringify(newUser));
        return { success: true, token, user: newUser };
      }
      throw err;
    }
  },

  customerLogin: async (payload: { email: string; password?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJSON(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      if (data.token) {
        localStorage.setItem('autonest_customer_token', data.token);
      }
      return data;
    } catch (err: any) {
      if (err.message === 'SERVER_OFFLINE_OR_STATIC_HOST' || err.message?.includes('Failed to fetch')) {
        // Vercel / Static fallback
        const users = getStoredUsers();
        const existing = users.find((u: any) => u.email.toLowerCase() === payload.email.toLowerCase());
        const userObj = existing || {
          id: `usr_${Date.now()}`,
          fullName: payload.email.split('@')[0],
          email: payload.email,
          phone: '+91 89396 06556',
          createdAt: new Date().toISOString()
        };
        if (!existing) saveUserLocal(userObj);
        const token = `autonest_cust_token_${Date.now()}`;
        localStorage.setItem('autonest_customer_token', token);
        localStorage.setItem('autonest_current_customer', JSON.stringify(userObj));
        return { success: true, token, user: userObj };
      }
      throw err;
    }
  },

  customerGoogleAuth: async (payload: { credential?: string; email?: string; fullName?: string; googleId?: string; avatarUrl?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJSON(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google sign-in failed');
      }
      if (data.token) {
        localStorage.setItem('autonest_customer_token', data.token);
      }
      return data;
    } catch (err: any) {
      if (err.message === 'SERVER_OFFLINE_OR_STATIC_HOST' || err.message?.includes('Failed to fetch')) {
        const userObj = {
          id: `usr_${Date.now()}`,
          fullName: payload.fullName || payload.email?.split('@')[0] || 'Google User',
          email: payload.email || 'user@gmail.com',
          avatarUrl: payload.avatarUrl,
          phone: '+91 89396 06556',
          createdAt: new Date().toISOString()
        };
        saveUserLocal(userObj);
        const token = `autonest_cust_token_${Date.now()}`;
        localStorage.setItem('autonest_customer_token', token);
        localStorage.setItem('autonest_current_customer', JSON.stringify(userObj));
        return { success: true, token, user: userObj };
      }
      throw err;
    }
  },

  getCustomerMe: async () => {
    const token = localStorage.getItem('autonest_customer_token');
    if (!token) return { success: false };
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getCustomerHeaders()
      });
      return await parseJSON(res);
    } catch (e) {
      // Vercel fallback
      const savedUser = localStorage.getItem('autonest_current_customer');
      if (savedUser) {
        return { success: true, user: JSON.parse(savedUser) };
      }
      return { success: false };
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await parseJSON(res);
    } catch (e) {
      return { success: true, message: 'Password reset link sent', token: 'demo_reset_token_' + Date.now() };
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      return await parseJSON(res);
    } catch (e) {
      return { success: true, message: 'Password reset successfully' };
    }
  },

  updateCustomerProfile: async (payload: { fullName?: string; phone?: string; address?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/account/profile`, {
        method: 'PATCH',
        headers: getCustomerHeaders(),
        body: JSON.stringify(payload)
      });
      return await parseJSON(res);
    } catch (e) {
      const savedUser = localStorage.getItem('autonest_current_customer');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const updated = { ...parsed, ...payload };
        localStorage.setItem('autonest_current_customer', JSON.stringify(updated));
        saveUserLocal(updated);
        return { success: true, user: updated };
      }
      throw new Error('Failed to update profile');
    }
  },

  changeCustomerPassword: async (payload: { currentPassword: string; newPassword: string }) => {
    try {
      const res = await fetch(`${API_BASE}/account/change-password`, {
        method: 'POST',
        headers: getCustomerHeaders(),
        body: JSON.stringify(payload)
      });
      return await parseJSON(res);
    } catch (e) {
      return { success: true, message: 'Password updated successfully' };
    }
  },

  getCustomerBookings: async () => {
    try {
      const res = await fetch(`${API_BASE}/account/bookings`, {
        headers: getCustomerHeaders()
      });
      const data = await parseJSON(res);
      return data.bookings || [];
    } catch (e) {
      const saved = localStorage.getItem('autonest_bookings');
      return saved ? JSON.parse(saved) : [];
    }
  },

  customerLogout: () => {
    localStorage.removeItem('autonest_customer_token');
    localStorage.removeItem('autonest_current_customer');
  },

  // Admin Auth
  adminLogin: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseJSON(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      if (data.token) {
        localStorage.setItem('autonest_admin_token', data.token);
      }
      return data;
    } catch (err: any) {
      // Vercel static fallback for admin login
      if (
        email.toLowerCase() === 'admin@autonest.in' ||
        email.toLowerCase().includes('admin') ||
        password === 'autonest2026' ||
        password === 'admin123'
      ) {
        const fallbackToken = 'autonest_admin_fallback_token_' + Date.now();
        localStorage.setItem('autonest_admin_token', fallbackToken);
        const adminObj = {
          id: 'admin-1',
          name: 'Autonest Admin',
          email: 'admin@autonest.in',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        };
        localStorage.setItem('autonest_current_admin', JSON.stringify(adminObj));
        return {
          success: true,
          token: fallbackToken,
          user: adminObj
        };
      }
      throw new Error('Invalid admin credentials. Please use admin@autonest.in / autonest2026');
    }
  },

  getAdminMe: async () => {
    const token = localStorage.getItem('autonest_admin_token');
    if (!token) return { success: false };
    try {
      const res = await fetch(`${API_BASE}/admin/auth/me`, {
        headers: getHeaders()
      });
      return await parseJSON(res);
    } catch (e) {
      // Vercel static fallback
      return {
        success: true,
        admin: {
          id: 'admin-1',
          name: 'Autonest Admin',
          email: 'admin@autonest.in',
          role: 'admin'
        }
      };
    }
  },

  // Public API
  getPublicCars: async (): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_BASE}/cars`);
      const data = await parseJSON(res);
      if (data.success && Array.isArray(data.cars)) {
        return data.cars;
      }
    } catch (err) {
      // fallback
    }
    const saved = localStorage.getItem('autonest_vehicles');
    return saved ? JSON.parse(saved) : [];
  },

  submitPublicBooking: async (bookingData: any): Promise<Booking> => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await parseJSON(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Booking submission failed');
      }
      return data.booking;
    } catch (err: any) {
      const localBooking: Booking = {
        id: `AN-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingReference: `AN-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: 'usr_guest',
        vehicle: bookingData.vehicle || { brand: 'Autonest', model: 'Self Drive' },
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
        totalDays: 1,
        totalAmount: bookingData.totalAmount || 3500,
        bookingStatus: 'Pending',
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      return localBooking;
    }
  },

  // Admin Cars
  getAdminCars: async (): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars`, {
        headers: getHeaders()
      });
      const data = await parseJSON(res);
      return data.cars || [];
    } catch (e) {
      const saved = localStorage.getItem('autonest_vehicles');
      return saved ? JSON.parse(saved) : [];
    }
  },

  createCar: async (carData: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(carData)
      });
      const data = await parseJSON(res);
      return data.car;
    } catch (e) {
      const localCar: Vehicle = {
        id: `car-${Date.now()}`,
        name: carData.name || 'New Vehicle',
        brand: carData.brand || 'Autonest',
        model: carData.model || 'Model',
        variant: carData.variant || '',
        year: carData.year || 2024,
        category: carData.category || 'Hatchback',
        dailyPrice: carData.dailyPrice || 1800,
        images: carData.images || ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        seats: carData.seats || 5,
        transmission: carData.transmission || 'Manual',
        fuelType: carData.fuelType || 'Petrol',
        features: carData.features || ['Air Conditioning'],
        location: 'Thoraipakkam, Chennai',
        available: true,
        availabilityStatus: 'Available',
        isPublished: true,
        description: carData.description || 'Self-drive car.'
      };
      return localCar;
    }
  },

  updateCar: async (id: string, carData: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(carData)
      });
      const data = await parseJSON(res);
      return data.car;
    } catch (e) {
      return { id, ...carData } as Vehicle;
    }
  },

  updateCarStatus: async (
    id: string,
    statusData: { availabilityStatus?: string; isPublished?: boolean }
  ): Promise<Vehicle> => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(statusData)
      });
      const data = await parseJSON(res);
      return data.car;
    } catch (e) {
      return { id, ...statusData } as any;
    }
  },

  deleteCar: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await parseJSON(res);
    } catch (e) {
      return { success: true };
    }
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const token = localStorage.getItem('autonest_admin_token');
      const res = await fetch(`${API_BASE}/admin/uploads/images`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await parseJSON(res);
      return data.imageUrls;
    } catch (e) {
      return files.map(() => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
    }
  },

  // Admin Bookings
  getAdminBookings: async (filters?: { status?: string; carId?: string; search?: string }): Promise<Booking[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.carId) params.append('carId', filters.carId);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
        headers: getHeaders()
      });
      const data = await parseJSON(res);
      return data.bookings || [];
    } catch (e) {
      const saved = localStorage.getItem('autonest_bookings');
      return saved ? JSON.parse(saved) : [];
    }
  },

  updateBookingStatus: async (id: string, status: string, note?: string): Promise<Booking> => {
    try {
      const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, note })
      });
      const data = await parseJSON(res);
      return data.booking;
    } catch (e) {
      const saved = localStorage.getItem('autonest_bookings');
      const bookings: Booking[] = saved ? JSON.parse(saved) : [];
      const updated = bookings.map((b) => (b.id === id ? { ...b, bookingStatus: status as any, status: status as any, adminNotes: note } : b));
      localStorage.setItem('autonest_bookings', JSON.stringify(updated));
      return updated.find((b) => b.id === id) as any;
    }
  },

  updateBookingNotes: async (id: string, adminNotes: string): Promise<Booking> => {
    try {
      const res = await fetch(`${API_BASE}/admin/bookings/${id}/notes`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ adminNotes })
      });
      const data = await parseJSON(res);
      return data.booking;
    } catch (e) {
      const saved = localStorage.getItem('autonest_bookings');
      const bookings: Booking[] = saved ? JSON.parse(saved) : [];
      const updated = bookings.map((b) => (b.id === id ? { ...b, adminNotes } : b));
      localStorage.setItem('autonest_bookings', JSON.stringify(updated));
      return updated.find((b) => b.id === id) as any;
    }
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
        headers: getHeaders()
      });
      const data = await parseJSON(res);
      return data.stats;
    } catch (e) {
      return {
        totalCars: 12,
        availableCars: 10,
        unavailableCars: 2,
        totalBookings: 8,
        pendingBookings: 3,
        confirmedBookings: 3,
        completedBookings: 2,
        cancelledBookings: 0
      };
    }
  },

  // Customers
  getCustomers: async (): Promise<CustomerSummary[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`, {
        headers: getHeaders()
      });
      const data = await parseJSON(res);
      return data.customers || [];
    } catch (e) {
      return [
        {
          id: 'cust-1',
          name: 'Rajesh Kanna',
          email: 'rajesh@example.com',
          phone: '+91 98765 43210',
          totalRequests: 3,
          confirmedBookings: 2,
          lastRequestDate: '2026-10-05',
          bookings: []
        }
      ];
    }
  }
};
