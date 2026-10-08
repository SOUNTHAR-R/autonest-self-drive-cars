import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User as UserIcon, Shield, Bookmark, LogOut, ChevronRight, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, favorites, setAuthModalOpen, switchUserRole, logoutUser, locationInfo } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/cars' && location.pathname === '/cars') return true;
    if (path !== '/' && !path.includes('#') && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090a0f]/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-[#090a0f] via-[#090a0f]/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e63946] to-[#b81d2a] p-0.5 shadow-lg shadow-[#e63946]/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Car className="w-4 h-4 text-[#e63946]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg tracking-wider text-white leading-none">
                AUTONEST
              </span>
              <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">
                Self Drive Cars
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 relative py-1 ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e63946] rounded-full shadow-[0_0_8px_#e63946]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Phone Hotline Link */}
            <a
              href={`tel:${locationInfo.phone}`}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locationInfo.phone}</span>
            </a>

            <div className="h-4 w-[1px] bg-white/10" />

            {/* Saved Garage Bookmark */}
            <Link
              to="/account?tab=saved"
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              title="Saved Vehicles"
            >
              <Bookmark className="w-4.5 h-4.5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#e63946] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#090a0f]">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* User Dropdown Profile & Role Manager */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#e63946]/60"
                  />
                  <span className="text-xs font-bold text-white max-w-[90px] truncate">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#12141d] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    {/* Role Switcher Toggle */}
                    <div className="px-2 py-1.5 my-1 bg-[#090a0f] rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-zinc-400">Mode</span>
                      <div className="flex items-center gap-1 bg-[#191c28] p-0.5 rounded-lg border border-white/10">
                        <button
                          onClick={() => switchUserRole('user')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            user.role === 'user' ? 'bg-[#e63946] text-white' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          User
                        </button>
                        <button
                          onClick={() => switchUserRole('admin')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                            user.role === 'admin' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </button>
                      </div>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#e63946]" /> My Profile & Bookings
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-xl flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2.5 transition-colors mt-1 border-t border-white/5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs font-bold text-white hover:text-[#e63946] px-3 py-1.5 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Book Now Primary Button */}
            <button
              onClick={() => navigate('/cars')}
              className="px-5 py-2.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 hover:bg-[#d62839] hover:shadow-[#e63946]/40 transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Book Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#12141d] border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#e63946]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090a0f]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/30'
                    : 'text-zinc-300 hover:bg-[#12141d]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
            ))}
          </nav>

          {/* Mobile Role Switcher */}
          <div className="p-3 bg-[#12141d] rounded-xl border border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Switch Mode</span>
            <div className="flex items-center gap-1 bg-[#090a0f] p-1 rounded-lg">
              <button
                onClick={() => switchUserRole('user')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  user?.role === 'user' ? 'bg-[#e63946] text-white' : 'text-zinc-400'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  user?.role === 'admin' ? 'bg-amber-500 text-black' : 'text-zinc-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-3">
            <a
              href={`tel:${locationInfo.phone}`}
              className="w-full py-3 bg-[#12141d] border border-white/10 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> Call {locationInfo.phone}
            </a>

            <button
              onClick={() => {
                navigate('/cars');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#e63946] text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
