import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { locationInfo } = useApp();

  return (
    <footer className="bg-[#090a0f] text-zinc-400 border-t border-white/10 pt-14 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e63946] flex items-center justify-center shadow-lg shadow-[#e63946]/30">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-wider text-white">
                  AUTONEST
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">
                  Self Drive Cars
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Self-drive car rentals in Chennai. Giving customers the freedom and flexibility to experience their journey independently.
            </p>

            {/* Google Rating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12141d] border border-white/10 text-xs text-white font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span><strong>{locationInfo.googleRating} / 5</strong> Google Rating ({locationInfo.reviewCount} Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm font-heading tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/cars" className="hover:text-white transition-colors">Cars & Fleet</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Autonest</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Business Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm font-heading tracking-wider uppercase">Chennai Office</h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e63946] shrink-0 mt-0.5" />
                <span>{locationInfo.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${locationInfo.phone}`} className="hover:text-white font-bold text-white transition-colors">
                  {locationInfo.phone}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Autonest Self Drive Cars. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
              Admin Portal
            </Link>
            <Link to="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
