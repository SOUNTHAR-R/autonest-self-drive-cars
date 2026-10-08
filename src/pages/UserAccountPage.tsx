import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Calendar, Bookmark, CreditCard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/common/VehicleCard';

export const UserAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'bookings';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const navigate = useNavigate();

  const { user, bookings, vehicles, favorites, setAuthModalOpen } = useApp();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto bg-[#12141d] p-10 rounded-3xl border border-white/10 space-y-4">
          <User className="w-12 h-12 text-[#e63946] mx-auto" />
          <h2 className="text-2xl font-black font-heading text-white">Sign In Required</h2>
          <p className="text-xs text-zinc-400">Please sign in to view your profile, active bookings, and saved garage.</p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 bg-[#e63946] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  const savedVehicles = vehicles.filter((v) => favorites.includes(v.id));

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Header Card */}
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#e63946]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white font-heading">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Driver Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{user.email} • {user.phone}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Member since {user.memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/fleet')}
              className="px-5 py-2.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider"
            >
              Book New Vehicle
            </button>
          </div>
        </div>

        {/* Account Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#e63946] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-[#e63946] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved Garage ({savedVehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'payment'
                ? 'bg-[#e63946] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Payment Methods
          </button>
        </div>

        {/* TAB 1: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#12141d] rounded-2xl p-6 border border-white/10 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Booking ID</span>
                      <span className="text-base font-black text-white font-heading">{b.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        b.bookingStatus === 'COMPLETED' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                        b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block">Vehicle</span>
                      <span className="font-bold text-white text-sm">{b.vehicle.brand} {b.vehicle.model}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Pickup Hub</span>
                      <span className="font-semibold text-zinc-200">{b.pickupLocation}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Dates</span>
                      <span className="font-semibold text-zinc-200">{b.pickupDate} to {b.returnDate}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Total Price</span>
                      <span className="font-black text-[#e63946] text-sm">₹{b.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-[#12141d] rounded-2xl border border-white/10">
                <p className="text-xs text-zinc-400">No active or past bookings found.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED GARAGE */}
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

        {/* TAB 3: PAYMENT METHODS */}
        {activeTab === 'payment' && (
          <div className="bg-[#12141d] rounded-2xl p-6 border border-white/10 space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white font-heading uppercase">Saved Cards & UPI Handles</h3>
            <div className="p-4 rounded-xl bg-[#090a0f] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#e63946]" />
                <div>
                  <span className="font-bold text-white block">HDFC Bank Visa Infinite</span>
                  <span className="text-zinc-500">•••• •••• •••• 8901</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Primary</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
