import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Fuel, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, updateBookingDraft } = useApp();
  const isFavorite = favorites.includes(vehicle.id);

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateBookingDraft({ vehicle });
    navigate('/booking');
  };

  const handleCardClick = () => {
    navigate(`/cars/${vehicle.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#12141d] rounded-2xl border border-white/10 overflow-hidden hover:border-[#e63946]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#e63946]/10 flex flex-col cursor-pointer"
    >
      {/* Image Container with Zoom effect */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#090a0f]">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141d] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#090a0f]/80 backdrop-blur-md text-white border border-white/10">
            {vehicle.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(vehicle.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/40 scale-110'
                : 'bg-[#090a0f]/70 text-zinc-300 hover:text-white hover:bg-[#090a0f]'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save vehicle'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Brand & Model */}
          <p className="text-xs font-bold text-[#e63946] uppercase tracking-widest font-heading mb-1">
            {vehicle.brand}
          </p>
          <h3 className="text-lg font-extrabold text-white font-heading tracking-tight group-hover:text-[#e63946] transition-colors duration-200">
            {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
          </h3>
          {vehicle.variant && (
            <p className="text-xs text-zinc-400 mt-0.5">{vehicle.variant}</p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-zinc-400">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Trans</span>
            <span className="font-semibold text-zinc-200 truncate w-full">{vehicle.transmission}</span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Seats</span>
            <span className="font-semibold text-zinc-200 flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-400" /> {vehicle.seats}
            </span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Fuel</span>
            <span className="font-semibold text-zinc-200 flex items-center gap-1">
              <Fuel className="w-3 h-3 text-zinc-400" /> {vehicle.fuelType}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {vehicle.dailyPrice > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white font-heading">
                  ₹{vehicle.dailyPrice.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-400 font-medium">/ day</span>
              </div>
            ) : (
              <span className="text-xs font-bold text-amber-400">Price on request</span>
            )}
          </div>

          <button
            onClick={handleBookClick}
            className="px-4 py-2.5 rounded-xl bg-[#191c28] border border-white/10 text-white text-xs font-bold hover:bg-[#e63946] hover:border-[#e63946] transition-all duration-300 flex items-center gap-1 group/btn shadow-md"
          >
            <span>{vehicle.dailyPrice > 0 ? 'Book' : 'Check'}</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
