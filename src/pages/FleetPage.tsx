import React, { useMemo } from 'react';
import { Search, RotateCcw, Car, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/common/VehicleCard';
import type { Vehicle, VehicleCategory } from '../types';

export const FleetPage: React.FC = () => {
  const { vehicles, filters, setFilters, resetFilters } = useApp();

  const categories: VehicleCategory[] = ['All', 'Hatchback', 'Sedan', 'SUV', 'Premium'];

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Category filter
      if (filters.category !== 'All' && v.category !== filters.category) return false;

      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = (v.name || '').toLowerCase().includes(q);
        const matchBrand = v.brand.toLowerCase().includes(q);
        const matchModel = v.model.toLowerCase().includes(q);
        const matchCategory = v.category.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchModel && !matchCategory) return false;
      }

      // Transmission
      if (filters.transmission !== 'All' && v.transmission !== filters.transmission) return false;

      // Fuel Type
      if (filters.fuelType !== 'All' && v.fuelType !== filters.fuelType) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.dailyPrice - b.dailyPrice;
      if (filters.sortBy === 'price-high') return b.dailyPrice - a.dailyPrice;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [vehicles, filters]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-4 mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141d] border border-[#e63946]/30 text-white text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#e63946]" />
            <span>AUTONEST SELF DRIVE CARS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white uppercase tracking-tight">
            FIND YOUR PERFECT RIDE
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Choose the car that fits your journey. Available for self-drive rental from Thoraipakkam, Chennai.
          </p>
        </div>

        {/* Search & Main Filter Controls Bar */}
        <div className="bg-[#12141d] rounded-2xl p-4 border border-white/10 mb-8 space-y-4">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search Swift, City, Creta, Thar..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e63946]"
              />
            </div>

            {/* Category Pills (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 bg-[#090a0f] p-1 rounded-xl border border-white/5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filters.category === cat
                      ? 'bg-[#e63946] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Reset */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-[#090a0f] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <button
                onClick={resetFilters}
                className="py-2 px-3 rounded-xl bg-[#191c28] hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

          </div>

        </div>

        {/* Fleet Count Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-400">
          <span>Showing <strong className="text-white">{filteredVehicles.length}</strong> vehicles</span>
          {filters.category !== 'All' && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#e63946]/10 text-[#e63946] font-semibold border border-[#e63946]/20">
              Filtered: {filters.category}
            </span>
          )}
        </div>

        {/* Vehicle Cards Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#12141d] rounded-3xl border border-white/10 space-y-4">
            <Car className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-bold text-white font-heading">Fleet Details Coming Soon</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No vehicles found for the selected category. Contact Autonest at +91 89396 06556 for custom requirements.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#e63946] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
