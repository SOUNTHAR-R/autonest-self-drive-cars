import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar } from 'lucide-react';
import { AUTONEST_LOCATION } from '../../data/mockData';

export const MobileStickyBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090a0f]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 shadow-2xl">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${AUTONEST_LOCATION.phone}`}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#12141d] border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Call Autonest</span>
        </a>

        <button
          onClick={() => navigate('/cars')}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#e63946] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#d62839] transition-colors shadow-lg shadow-[#e63946]/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};
