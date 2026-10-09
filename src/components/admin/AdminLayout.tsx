import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ClipboardList,
  Users,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logoutUser, bookings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Require admin role
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#12141d] p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black font-heading text-white">Admin Authentication Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Access to the Autonest Control Panel is restricted to authorized personnel. Please log in with admin credentials.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full py-3 bg-[#e63946] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 hover:bg-[#d62839] transition-colors"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  const pendingRequestsCount = bookings.filter(
    (b) => (b.bookingStatus || b.status || '').toLowerCase() === 'pending'
  ).length;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Cars', path: '/admin/cars', icon: Car },
    { name: 'Add New Car', path: '/admin/cars/new', icon: PlusCircle },
    { name: 'Booking Requests', path: '/admin/requests', icon: ClipboardList, badge: pendingRequestsCount },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Pricing & Availability', path: '/admin/pricing', icon: Tag },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#12141d] border-r border-white/10 shrink-0 min-h-screen sticky top-0 justify-between">
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e63946] to-[#b81d2a] p-0.5 shadow-lg shadow-[#e63946]/30 flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-white tracking-wider leading-none">AUTONEST</h2>
              <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Admin Control
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-[#090a0f] border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#e63946]" /> View Live Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090a0f] border border-white/5">
            <div className="flex items-center gap-2.5">
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#e63946]" />
              <div className="truncate max-w-[90px]">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[9px] text-zinc-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-[#12141d] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e63946] flex items-center justify-center text-white">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-black text-sm text-white">AUTONEST ADMIN</h2>
            <p className="text-[9px] text-amber-400 font-bold uppercase">Control Center</p>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-[#090a0f] border border-white/10 text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-[#12141d] border-b border-white/10 p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-[#e63946] text-white' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full mt-4 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
};
