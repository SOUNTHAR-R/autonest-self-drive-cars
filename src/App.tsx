import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { ToastNotification } from './components/common/ToastNotification';
import { AuthModal } from './components/common/AuthModal';
import { QuickViewModal } from './components/common/QuickViewModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { FleetPage } from './pages/FleetPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Imports
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminManageCars } from './pages/admin/AdminManageCars';
import { AdminCarForm } from './pages/admin/AdminCarForm';
import { AdminBookingRequests } from './pages/admin/AdminBookingRequests';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminSettings } from './pages/admin/AdminSettings';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Scroll To Top component on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Layout Wrapper distinguishing Admin vs Public routes
const MainContent = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (pathname === '/admin/login') {
      return <AdminLogin />;
    }

    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminManageCars />} />
          <Route path="/admin/cars/new" element={<AdminCarForm />} />
          <Route path="/admin/cars/edit/:id" element={<AdminCarForm />} />
          <Route path="/admin/requests" element={<AdminBookingRequests />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-[#e63946] selection:text-white pb-16 md:pb-0">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<FleetPage />} />
          <Route path="/cars/:id" element={<VehicleDetailPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/booking" element={<BookingFlowPage />} />
          <Route path="/account" element={<UserAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <MobileStickyBar />

      {/* Global Modals & Notifications */}
      <ToastNotification />
      <AuthModal />
      <QuickViewModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <MainContent />
      </Router>
    </AppProvider>
  );
}

export default App;
