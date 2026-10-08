import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, ChevronRight, Navigation, Star } from 'lucide-react';
import { AUTONEST_LOCATION } from '../data/mockData';

export const LocationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-4 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141d] border border-[#e63946]/30 text-white text-xs font-semibold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-[#e63946]" />
            <span>Chennai Self-Drive Location</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
            VISIT AUTONEST
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
            Conveniently located on 1st Main Road, Raj Nagar, Thoraipakkam. Visit our location or call us to reserve your self-drive vehicle.
          </p>
        </div>

        {/* Location Details Card */}
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">Thoraipakkam, Chennai</span>
              <h2 className="text-3xl font-black font-heading text-white mt-1">{AUTONEST_LOCATION.name}</h2>
            </div>

            <div className="flex items-center gap-3 bg-[#090a0f] px-4 py-3 rounded-2xl border border-white/10 shrink-0">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-base font-bold text-white block leading-none">{AUTONEST_LOCATION.googleRating} / 5</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{AUTONEST_LOCATION.reviewCount} Verified Reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#090a0f] p-5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[#e63946] font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </div>
              <p className="text-zinc-300 font-medium leading-relaxed">{AUTONEST_LOCATION.address}</p>
            </div>

            <div className="bg-[#090a0f] p-5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>Phone Hotline</span>
              </div>
              <p className="text-zinc-300 font-medium text-sm">{AUTONEST_LOCATION.phone}</p>
            </div>

            <div className="bg-[#090a0f] p-5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Business Hours</span>
              </div>
              <p className="text-zinc-300 font-medium">{AUTONEST_LOCATION.hours}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href={AUTONEST_LOCATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#e63946]/30 flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => navigate('/cars')}
              className="flex-1 py-4 rounded-xl bg-[#191c28] border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Fleet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
