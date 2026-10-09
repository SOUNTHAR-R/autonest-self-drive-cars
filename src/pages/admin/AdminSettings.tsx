import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { locationInfo, showToast } = useApp();

  const [address, setAddress] = useState(locationInfo.address);
  const [phone, setPhone] = useState(locationInfo.phone);
  const [hours, setHours] = useState(locationInfo.hours);
  const [googleRating, setGoogleRating] = useState(locationInfo.googleRating);
  const [reviewCount, setReviewCount] = useState(locationInfo.reviewCount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Autonest business settings saved', 'success');
  };

  return (
    <div className="space-[#12141d] space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">BUSINESS CONFIGURATION</span>
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">WEBSITE SETTINGS</h1>
        <p className="text-xs text-zinc-400">Manage verified Autonest business location details and hotline contact numbers</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-heading uppercase">Verified Business Information</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-300 font-bold block mb-1">Business Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Customer Hotline Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Operating Hours</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Verified Google Rating</label>
              <div className="relative">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  step="0.1"
                  value={googleRating}
                  onChange={(e) => setGoogleRating(Number(e.target.value))}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Verified Review Count</label>
              <input
                type="number"
                value={reviewCount}
                onChange={(e) => setReviewCount(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-3 px-4 text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Business Settings
          </button>
        </div>
      </form>

    </div>
  );
};
