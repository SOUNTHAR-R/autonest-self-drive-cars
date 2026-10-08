import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Gauge, Users, Fuel, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const { activeVehicleModal, setActiveVehicleModal, updateBookingDraft } = useApp();
  const navigate = useNavigate();

  if (!activeVehicleModal) return null;

  const vehicle = activeVehicleModal;

  const handleBookNow = () => {
    updateBookingDraft({ vehicle });
    setActiveVehicleModal(null);
    navigate('/booking');
  };

  const handleViewFull = () => {
    setActiveVehicleModal(null);
    navigate(`/vehicle/${vehicle.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#12141d] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveVehicleModal(null)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#090a0f]/80 text-white hover:bg-[#e63946] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-auto bg-[#090a0f]">
            <img
              src={vehicle.images[0]}
              alt={vehicle.model}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141d] md:bg-gradient-to-r md:from-transparent md:to-[#12141d]" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e63946] text-white">
                {vehicle.category}
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold text-[#e63946] uppercase tracking-widest">{vehicle.brand}</p>
              <h3 className="text-2xl font-black text-white font-heading">{vehicle.model}</h3>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3">{vehicle.description}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span><strong>{vehicle.transmission}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Gauge className="w-4 h-4 text-[#e63946]" />
                <span><strong>{vehicle.year || '2024'} Model</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Users className="w-4 h-4 text-sky-400" />
                <span><strong>{vehicle.seats} Seats</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Fuel className="w-4 h-4 text-emerald-400" />
                <span><strong>{vehicle.fuelType}</strong></span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-heading">
                  {vehicle.dailyPrice > 0 ? (
                    <>
                      ₹{vehicle.dailyPrice.toLocaleString()}
                      <span className="text-xs text-zinc-400 font-normal"> / day</span>
                    </>
                  ) : (
                    <span className="text-sm text-zinc-300">Price available on request</span>
                  )}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Self-Drive Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleViewFull}
                  className="py-2.5 rounded-xl bg-[#191c28] border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Full Specs & Gallery
                </button>
                <button
                  onClick={handleBookNow}
                  className="py-2.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] shadow-lg shadow-[#e63946]/30 transition-colors flex items-center justify-center gap-1"
                >
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
