import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { ToastNotification } from './components/common/ToastNotification';
import { AuthModal } from './components/common/AuthModal';
import { QuickViewModal } from './components/common/QuickViewModal';

import { HomePage } from './pages/HomePage';
import { FleetPage } from './pages/FleetPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Scroll To Top component on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
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
              <Route path="/admin" element={<AdminDashboardPage />} />
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
      </Router>
    </AppProvider>
  );
}

export default App;
