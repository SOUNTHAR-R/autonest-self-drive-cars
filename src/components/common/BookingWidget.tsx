import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Search, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BookingWidget: React.FC = () => {
  const navigate = useNavigate();
  const { bookingDraft, updateBookingDraft } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cars');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl shadow-black/80"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-2 items-center">
          
          {/* Pickup Location */}
          <div className="flex flex-col bg-[#090a0f]/80 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#e63946]" /> Pickup Location
            </label>
            <select
              value={bookingDraft.pickupLocation}
              onChange={(e) => updateBookingDraft({ pickupLocation: e.target.value, returnLocation: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer appearance-none truncate"
            >
              <option value="Thoraipakkam, Chennai" className="bg-[#12141d] text-white">
                Thoraipakkam, Chennai
              </option>
            </select>
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col bg-[#090a0f]/80 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#e63946]" /> Date
            </label>
            <input
              type="date"
              value={bookingDraft.pickupDate}
              onChange={(e) => updateBookingDraft({ pickupDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* Pickup Time */}
          <div className="flex flex-col bg-[#090a0f]/80 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#e63946]" /> Pickup Time
            </label>
            <select
              value={bookingDraft.pickupTime}
              onChange={(e) => updateBookingDraft({ pickupTime: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'].map((t) => (
                <option key={t} value={t} className="bg-[#12141d] text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Return Date */}
          <div className="flex flex-col bg-[#090a0f]/80 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#e63946]" /> Return Date
            </label>
            <input
              type="date"
              value={bookingDraft.returnDate}
              onChange={(e) => updateBookingDraft({ returnDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 lg:col-span-1 h-full min-h-[54px] flex items-center">
            <button
              type="submit"
              className="w-full h-full min-h-[54px] px-4 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#e63946]/30 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4" />
              <span>Check Available Cars</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
