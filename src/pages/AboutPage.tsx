import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, MapPin, Phone, Car, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { locationInfo } = useApp();

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141d] border border-[#e63946]/30 text-white text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#e63946]" />
            <span>AUTONEST SELF DRIVE CARS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white uppercase tracking-tight">
            DRIVE YOUR WAY
          </h1>
          <p className="text-zinc-300 text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Autonest Self Drive Cars provides self-drive car rental services from its Thoraipakkam location in Chennai, giving customers the flexibility to choose a car and experience their journey independently.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center border border-[#e63946]/20">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">LOCAL CHENNAI HUB</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conveniently located at No. 20, 1st Main Road, Raj Nagar, Thoraipakkam, Chennai.
            </p>
          </div>

          <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center border border-[#e63946]/20">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">FLEXIBLE RENTALS</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select the car that fits your journey from our hatchback, sedan, SUV, or premium collection.
            </p>
          </div>

          <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center border border-[#e63946]/20">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">CLEAR COMMUNICATION</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Customer first approach with transparent service throughout the booking process.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#12141d] via-[#191c28] to-[#090a0f] p-10 rounded-3xl border border-white/10 text-center space-y-6">
          <h2 className="text-3xl font-black font-heading text-white uppercase">READY TO EXPLORE CHENNAI?</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/cars')}
              className="px-8 py-4 bg-[#e63946] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#e63946]/30 inline-flex items-center gap-2"
            >
              <span>Explore Available Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${locationInfo.phone}`}
              className="px-8 py-4 bg-[#12141d] border border-white/15 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> Call {locationInfo.phone}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
