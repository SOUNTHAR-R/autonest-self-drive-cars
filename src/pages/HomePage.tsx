import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  Phone,
  CheckCircle,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingWidget } from '../components/common/BookingWidget';
import { VehicleCard } from '../components/common/VehicleCard';
import { SplineCarHero } from '../components/3d/SplineCarHero';
import type { VehicleCategory } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, locationInfo, setFilters, filters } = useApp();

  const categories: VehicleCategory[] = ['All', 'Hatchback', 'Sedan', 'SUV', 'Premium'];

  const featuredVehicles = vehicles.filter((v) => {
    if (filters.category === 'All') return true;
    return v.category === filters.category;
  });

  const whyAutonestCards = [
    {
      title: 'QUALITY CARS',
      desc: 'Cars presented for comfortable self-drive journeys.',
      icon: Car
    },
    {
      title: 'EASY BOOKING',
      desc: 'A simple way to request and manage your rental.',
      icon: CheckCircle
    },
    {
      title: 'LOCAL CHENNAI SERVICE',
      desc: 'Based in Thoraipakkam, Chennai.',
      icon: MapPin
    },
    {
      title: 'CUSTOMER FIRST',
      desc: 'Clear communication throughout the booking process.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#090a0f] via-[#0d0f17] to-[#090a0f]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#e63946]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero 2-Column Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4 w-full flex-grow flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
            
            {/* LEFT SIDE: Eyebrow, Headline, Supporting text, CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-5 text-left z-10 pr-0 lg:pr-2"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141d]/90 backdrop-blur-md border border-[#e63946]/30 text-white text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#e63946]" />
                <span>CHENNAI'S SELF-DRIVE CAR RENTAL</span>
              </div>

              {/* Verified Large Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black font-heading tracking-tight text-white uppercase leading-[1.04] break-words">
                YOUR CAR. <br />
                YOUR JOURNEY. <br />
                <span className="text-gradient-red">YOUR FREEDOM.</span>
              </h1>

              {/* Supporting Line */}
              <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-normal max-w-xl leading-relaxed">
                Book a self-drive car and take the road on your terms.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => navigate('/cars')}
                  className="px-7 py-3.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-2xl shadow-[#e63946]/40 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>EXPLORE CARS</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/cars')}
                  className="px-7 py-3.5 rounded-xl bg-[#12141d]/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300"
                >
                  BOOK YOUR CAR
                </button>
              </div>
            </motion.div>

            {/* RIGHT SIDE: Spline 3D Porsche Floating Seamlessly */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-6 h-[320px] sm:h-[420px] lg:h-[520px] xl:h-[580px] w-full flex items-center justify-center relative bg-transparent z-30 pointer-events-auto"
              style={{ touchAction: 'none' }}
            >
              <SplineCarHero />
            </motion.div>

          </div>
        </div>

        {/* 2. BOOKING SEARCH WIDGET */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 w-full">
          <BookingWidget />
        </div>

      </section>

      {/* 3. VERIFIED GOOGLE RATING BANNER */}
      <section className="py-8 bg-[#12141d] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white font-heading">{locationInfo.googleRating} / 5</span>
                <span className="text-xs font-bold uppercase text-amber-400">GOOGLE RATING</span>
              </div>
              <p className="text-xs text-zinc-400">Based on {locationInfo.reviewCount} verified Google reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e63946]" />
              <span>Thoraipakkam, Chennai</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>24 Hours / 7 Days Listing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLEET SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#e63946] uppercase tracking-widest block mb-2 font-heading">
              FIND YOUR PERFECT RIDE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase tracking-tight">
              CHOOSE THE CAR THAT FITS YOUR JOURNEY.
            </h2>
          </div>

          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#e63946] transition-colors group"
          >
            <span>View All Cars ({vehicles.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filters.category === cat
                  ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/30'
                  : 'bg-[#12141d] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#0c0e16] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold text-[#e63946] uppercase tracking-widest font-heading">
              SIMPLE RENTAL PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading uppercase">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 01 */}
            <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <span className="text-6xl font-black font-heading text-[#e63946]/30 block">01</span>
              <h3 className="text-xl font-bold text-white font-heading">CHOOSE YOUR CAR</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Select the car that suits your journey from our hatchback, sedan, SUV, or premium collection.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <span className="text-6xl font-black font-heading text-[#e63946]/30 block">02</span>
              <h3 className="text-xl font-bold text-white font-heading">BOOK YOUR RIDE</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Choose your dates and pickup details for your upcoming trip.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-[#12141d] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <span className="text-6xl font-black font-heading text-[#e63946] block">03</span>
              <h3 className="text-xl font-bold text-white font-heading">HIT THE ROAD</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Collect your car from Thoraipakkam, Chennai and enjoy your journey independently.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. WHY AUTONEST */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#e63946] uppercase tracking-widest font-heading block mb-2">
              RELIABLE SERVICE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase tracking-tight">
              WHY AUTONEST
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyAutonestCards.map((card, i) => {
            const IconComp = card.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#12141d] border border-white/10 space-y-3 hover:border-[#e63946]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center border border-[#e63946]/20">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-heading">{card.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CHENNAI LOCATION SECTION */}
      <section className="py-24 bg-[#0c0e16] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-extrabold text-[#e63946] uppercase tracking-widest font-heading block">
                LOCAL CHENNAI HUB
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white font-heading uppercase tracking-tight">
                VISIT AUTONEST
              </h2>

              <div className="space-y-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3 bg-[#12141d] p-4 rounded-2xl border border-white/10">
                  <MapPin className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Address</strong>
                    <p>{locationInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#12141d] p-4 rounded-2xl border border-white/10">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Call Autonest</strong>
                    <a href={`tel:${locationInfo.phone}`} className="text-emerald-400 font-bold hover:underline">
                      {locationInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={locationInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] flex items-center gap-2 shadow-lg shadow-[#e63946]/30"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                </a>

                <a
                  href={`tel:${locationInfo.phone}`}
                  className="px-6 py-3.5 rounded-xl bg-[#12141d] border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>CALL AUTONEST</span>
                </a>
              </div>
            </div>

            {/* Location Image & Map Card */}
            <div className="lg:col-span-6 relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Autonest Location Thoraipakkam"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#090a0f]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">Thoraipakkam Hub</h4>
                  <p className="text-xs text-zinc-400">24 Hours / 7 Days</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active Location
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
