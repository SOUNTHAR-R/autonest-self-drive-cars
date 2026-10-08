import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Heart,
  ShieldCheck,
  Car,
  Fuel,
  Users,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/common/VehicleCard';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, favorites, toggleFavorite, updateBookingDraft, locationInfo } = useApp();

  const vehicle = vehicles.find((v) => v.id === id) || vehicles[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isFavorite = favorites.includes(vehicle.id);
  const similarVehicles = vehicles.filter((v) => v.id !== vehicle.id && v.category === vehicle.category).slice(0, 3);

  const handleBookNow = () => {
    updateBookingDraft({ vehicle });
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation breadcrumb */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <button
            onClick={() => navigate('/cars')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cars
          </button>
          
          <button
            onClick={() => toggleFavorite(vehicle.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-[#e63946] border-[#e63946] text-white'
                : 'bg-[#12141d] border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Main Grid: Gallery & Specs Left | Sticky Booking Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Gallery & Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title & Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e63946] text-white">
                  {vehicle.category}
                </span>
                <span className="text-xs text-zinc-400 font-semibold bg-[#12141d] px-3 py-1 rounded-full border border-white/10">
                  {vehicle.brand} {vehicle.model}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
                {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
              </h1>
              {vehicle.variant && (
                <p className="text-sm text-zinc-400 font-medium mt-1">{vehicle.variant}</p>
              )}
              <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#e63946]" /> Pickup Hub: <strong>{locationInfo.address}</strong>
              </p>
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#12141d] border border-white/10 shadow-2xl">
                <img
                  src={vehicle.images[selectedImageIndex] || vehicle.images[0]}
                  alt={vehicle.model}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Thumbnails */}
              {vehicle.images.length > 1 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-28 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#e63946] scale-105 shadow-lg shadow-[#e63946]/30'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specs Grid */}
            <div className="bg-[#12141d] rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading border-b border-white/5 pb-3">
                Vehicle Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#090a0f] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Transmission</span>
                  <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#e63946]" /> {vehicle.transmission}
                  </div>
                </div>

                <div className="bg-[#090a0f] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Fuel Type</span>
                  <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-emerald-400" /> {vehicle.fuelType}
                  </div>
                </div>

                <div className="bg-[#090a0f] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Seating</span>
                  <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-400" /> {vehicle.seats} Seats
                  </div>
                </div>

                <div className="bg-[#090a0f] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Kilometers Included</span>
                  <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> {vehicle.kilometerAllowance || 'Standard Allowance'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white font-heading">Overview</h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">{vehicle.description}</p>
            </div>

            {/* Features List */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">Key Features & Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {vehicle.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#12141d] border border-white/5 text-zinc-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#e63946] shrink-0" />
                      <span className="font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Booking & Price Sidebar (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#12141d] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
              
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  Daily Rental Rate
                </span>
                {vehicle.dailyPrice > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-heading">
                      ₹{vehicle.dailyPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">/ day</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-amber-400 font-heading">
                    Price available on request
                  </div>
                )}
              </div>

              {/* Verified Location */}
              <div className="space-y-2 border-y border-white/10 py-4 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Pickup Location</span>
                  <span className="font-bold text-white">Thoraipakkam, Chennai</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contact Phone</span>
                  <a href={`tel:${locationInfo.phone}`} className="font-bold text-emerald-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {locationInfo.phone}
                  </a>
                </div>
              </div>

              {/* Book CTA */}
              <button
                onClick={handleBookNow}
                className="w-full py-4 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#e63946]/40 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{vehicle.dailyPrice > 0 ? 'CHECK AVAILABILITY' : 'REQUEST CAR'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Autonest Self Drive Cars • Thoraipakkam</span>
              </div>

            </div>
          </div>

        </div>

        {/* Similar Cars Section */}
        {similarVehicles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10 space-y-8">
            <h2 className="text-2xl font-black font-heading text-white uppercase">
              SIMILAR CATEGORY CARS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
