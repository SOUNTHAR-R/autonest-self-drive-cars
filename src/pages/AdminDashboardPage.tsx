import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Vehicle } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { vehicles, bookings, locationInfo, updateBookingStatus, deleteVehicle, addVehicle, updateVehicle } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'bookings'>('overview');

  // Modal for adding a new vehicle
  const [isAddVehicleOpen, setAddVehicleOpen] = useState(false);
  const [newName, setNewName] = useState('Swift ZXi');
  const [newBrand, setNewBrand] = useState('Maruti Suzuki');
  const [newModel, setNewModel] = useState('Swift');
  const [newVariant, setNewVariant] = useState('ZXi');
  const [newPrice, setNewPrice] = useState(1800);
  const [newHourlyPrice, setNewHourlyPrice] = useState(150);
  const [newWeekendPrice, setNewWeekendPrice] = useState(2200);
  const [newDeposit, setNewDeposit] = useState(3000);
  const [newKmAllowance, setNewKmAllowance] = useState('250 km / day');
  const [newExtraKm, setNewExtraKm] = useState('₹12 / km');
  const [newCategory, setNewCategory] = useState<Vehicle['category']>('Hatchback');

  // Analytics Metrics
  const activeRentals = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
  const availableCarsCount = vehicles.filter((v) => v.available).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      name: newName,
      brand: newBrand,
      model: newModel,
      variant: newVariant,
      year: 2024,
      category: newCategory,
      dailyPrice: Number(newPrice),
      hourlyPrice: Number(newHourlyPrice),
      weekendPrice: Number(newWeekendPrice),
      deposit: Number(newDeposit),
      kilometerAllowance: newKmAllowance,
      extraKmCharge: newExtraKm,
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ],
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      features: ['Air Conditioning', 'Power Windows', 'Touchscreen'],
      location: 'Thoraipakkam, Chennai',
      available: true,
      description: 'Comfortable self-drive vehicle for Chennai trips.'
    });
    setAddVehicleOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-amber-500/20 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" /> Autonest Admin Dashboard
            </div>
            <h1 className="text-3xl font-black font-heading text-white uppercase">AUTONEST CONTROL CENTER</h1>
            <p className="text-xs text-zinc-400">Thoraipakkam, Chennai • Phone: {locationInfo.phone}</p>
          </div>

          <button
            onClick={() => setAddVehicleOpen(true)}
            className="px-5 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] flex items-center gap-2 shadow-lg shadow-[#e63946]/30 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Total Fleet Size</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-heading">{vehicles.length}</span>
              <span className="text-xs text-zinc-400">{availableCarsCount} Available</span>
            </div>
          </div>

          <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Confirmed Bookings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#e63946] font-heading">{activeRentals}</span>
              <span className="text-xs text-zinc-400">Active</span>
            </div>
          </div>

          <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Total Booking Requests</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400 font-heading">{bookings.length}</span>
              <span className="text-xs text-zinc-400">Requests</span>
            </div>
          </div>

        </div>

        {/* Dashboard Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-[#e63946] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fleet' ? 'bg-[#e63946] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Manage Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-[#e63946] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
        </div>

        {/* FLEET TAB */}
        {(activeTab === 'overview' || activeTab === 'fleet') && (
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-heading text-white uppercase">Vehicle Fleet & Pricing</h2>
            </div>

            <div className="bg-[#12141d] rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-[#090a0f] text-zinc-400 uppercase font-heading text-[10px]">
                    <tr>
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Daily Rate</th>
                      <th className="p-4">Deposit</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-3">
                          <img src={v.images[0]} alt={v.model} className="w-12 h-9 object-cover rounded-md border border-white/10" />
                          <div>
                            <span className="block">{v.name || `${v.brand} ${v.model}`}</span>
                            <span className="text-[10px] text-zinc-500 font-normal">{v.variant || v.transmission}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-zinc-300">{v.category}</td>
                        <td className="p-4 font-black text-white">
                          {v.dailyPrice > 0 ? `₹${v.dailyPrice.toLocaleString()}/day` : 'Price on request'}
                        </td>
                        <td className="p-4 text-amber-400 font-bold">{v.deposit ? `₹${v.deposit.toLocaleString()}` : '-'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => updateVehicle(v.id, { available: !v.available })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.available
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {v.available ? 'Available' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => deleteVehicle(v.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Remove Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <div className="space-y-6">
            <h2 className="text-xl font-black font-heading text-white uppercase">Booking Requests</h2>

            <div className="bg-[#12141d] rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-[#090a0f] text-zinc-400 uppercase font-heading text-[10px]">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-black text-[#e63946]">{b.id}</td>
                        <td className="p-4 font-semibold text-white">{b.userName}</td>
                        <td className="p-4 text-emerald-400 font-semibold">{b.userPhone}</td>
                        <td className="p-4">{b.vehicle.brand} {b.vehicle.model}</td>
                        <td className="p-4 text-zinc-400">{b.pickupDate} to {b.returnDate}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' :
                            b.bookingStatus === 'REQUESTED' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-black font-bold text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal to Add New Vehicle */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black font-heading text-white uppercase">Add Vehicle to Autonest Fleet</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Display Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Brand & Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Brand" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                  <input type="text" placeholder="Model" value={newModel} onChange={(e) => setNewModel(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Variant</label>
                <input type="text" value={newVariant} onChange={(e) => setNewVariant(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white">
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Daily Price (₹)</label>
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Deposit (₹)</label>
                  <input type="number" value={newDeposit} onChange={(e) => setNewDeposit(Number(e.target.value))} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Hourly Price (₹)</label>
                  <input type="number" value={newHourlyPrice} onChange={(e) => setNewHourlyPrice(Number(e.target.value))} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Weekend Price (₹)</label>
                  <input type="number" value={newWeekendPrice} onChange={(e) => setNewWeekendPrice(Number(e.target.value))} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Included Kilometres</label>
                  <input type="text" value={newKmAllowance} onChange={(e) => setNewKmAllowance(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Extra KM Charge</label>
                  <input type="text" value={newExtraKm} onChange={(e) => setNewExtraKm(e.target.value)} className="w-full bg-[#090a0f] p-2.5 rounded-xl border border-white/10 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setAddVehicleOpen(false)} className="px-4 py-2 bg-[#191c28] text-white rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#e63946] text-white rounded-xl font-bold">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
