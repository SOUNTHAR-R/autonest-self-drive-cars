import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Calendar, Bookmark, Lock, ShieldCheck, KeyRound, Save, LogOut, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/common/VehicleCard';
import { api } from '../services/api';
import type { Booking } from '../types';

export const UserAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'bookings';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const navigate = useNavigate();

  const { user, vehicles, favorites, logoutUser, showToast, refreshData } = useApp();

  // Profile Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Real Customer Bookings State
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const loadCustomerBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const data = await api.getCustomerBookings();
      setCustomerBookings(data);
    } catch (err) {
      console.warn('Could not fetch online bookings, falling back to local context bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCustomerBookings();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-36 pb-20 text-center px-4">
        <div className="max-w-md mx-auto bg-[#12141d] p-8 sm:p-10 rounded-3xl border border-white/10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-heading text-white">Sign In Required</h2>
          <p className="text-xs text-zinc-400">
            Please sign in to view your profile, manage your bookings, and access your saved garage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 py-3 bg-[#e63946] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 hover:bg-[#d62839] transition-all"
            >
              Log In Now
            </Link>
            <Link
              to="/register"
              className="flex-1 py-3 bg-[#191c28] border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#202534] transition-all"
            >
              Register Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const savedVehicles = vehicles.filter((v) => favorites.includes(v.id));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateCustomerProfile({ fullName, phone, address });
      await refreshData();
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setChangingPassword(true);
    try {
      await api.changeCustomerPassword({ currentPassword, newPassword });
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Header Card */}
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#e63946]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#e63946] shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white font-heading">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Driver Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{user.email} • {user.phone}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Member since {user.memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/fleet')}
              className="px-5 py-2.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 transition-all"
            >
              Book New Vehicle
            </button>
            <button
              onClick={() => {
                logoutUser();
                navigate('/');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#191c28] border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20'
                : 'text-zinc-400 hover:text-white bg-[#12141d]/50 border border-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Bookings ({customerBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20'
                : 'text-zinc-400 hover:text-white bg-[#12141d]/50 border border-white/5'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Security
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20'
                : 'text-zinc-400 hover:text-white bg-[#12141d]/50 border border-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved Garage ({savedVehicles.length})
          </button>
        </div>

        {/* TAB 1: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {loadingBookings ? (
              <div className="py-16 text-center text-xs text-zinc-400">Loading your bookings...</div>
            ) : customerBookings.length > 0 ? (
              customerBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#12141d] rounded-2xl p-6 border border-white/10 space-y-4 hover:border-white/20 transition-all shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Booking ID</span>
                      <span className="text-base font-black text-white font-heading">{b.bookingReference || b.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (b.bookingStatus || b.status) === 'CONFIRMED' || (b.bookingStatus || b.status) === 'Confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : (b.bookingStatus || b.status) === 'COMPLETED' || (b.bookingStatus || b.status) === 'Completed'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          : (b.bookingStatus || b.status) === 'CANCELLED' || (b.bookingStatus || b.status) === 'Cancelled'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus || b.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Vehicle</span>
                      <span className="font-bold text-white text-sm">{b.vehicle?.brand || 'Autonest'} {b.vehicle?.model || 'Self Drive'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Pickup Hub</span>
                      <span className="font-semibold text-zinc-200">{b.pickupLocation}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Dates</span>
                      <span className="font-semibold text-zinc-200">{b.pickupDate} ({b.pickupTime}) to {b.returnDate} ({b.returnTime})</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Total Price</span>
                      <span className="font-black text-[#e63946] text-sm">₹{(b.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {b.adminNotes && (
                    <div className="p-3 rounded-xl bg-[#090a0f] border border-white/5 text-xs text-zinc-300">
                      <span className="text-amber-400 font-bold block mb-1">Admin Note:</span>
                      {b.adminNotes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-[#12141d] rounded-2xl border border-white/10 space-y-3">
                <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">No bookings associated with your account yet.</p>
                <button onClick={() => navigate('/fleet')} className="px-5 py-2.5 bg-[#e63946] text-white rounded-xl text-xs font-bold">
                  Browse Available Fleet
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Profile Form */}
            <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <User className="w-6 h-6 text-[#e63946]" />
                <h3 className="text-lg font-black text-white font-heading">Personal Details</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#090a0f]/60 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 89396 06556"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Default Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Thoraipakkam, OMR, Chennai"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Lock className="w-6 h-6 text-[#e63946]" />
                <h3 className="text-lg font-black text-white font-heading">Security & Password</h3>
              </div>

              {pwdError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-3 rounded-xl bg-[#191c28] border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-[#e63946]" /> {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED GARAGE */}
        {activeTab === 'saved' && (
          <div>
            {savedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {savedVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-[#12141d] rounded-2xl border border-white/10 space-y-3">
                <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">Your saved garage is empty.</p>
                <button onClick={() => navigate('/fleet')} className="px-4 py-2 bg-[#e63946] text-white rounded-xl text-xs font-bold">
                  Browse Fleet
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
