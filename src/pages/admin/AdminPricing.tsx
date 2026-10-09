import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Vehicle } from '../../types';

export const AdminPricing: React.FC = () => {
  const { vehicles, updateVehicle, updateCarStatus } = useApp();

  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [dailyPrice, setDailyPrice] = useState<number>(0);
  const [hourlyPrice, setHourlyPrice] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);

  const startEdit = (car: Vehicle) => {
    setEditingCarId(car.id);
    setDailyPrice(car.dailyPrice || 0);
    setHourlyPrice(car.hourlyPrice || 0);
    setDeposit(car.deposit || 0);
  };

  const saveEdit = async (carId: string) => {
    await updateVehicle(carId, {
      dailyPrice: Number(dailyPrice),
      hourlyPrice: Number(hourlyPrice),
      deposit: Number(deposit),
      pricing: {
        dailyRate: Number(dailyPrice),
        hourlyRate: Number(hourlyPrice),
        securityDeposit: Number(deposit)
      }
    });
    setEditingCarId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">GLOBAL FLEET MATRIX</span>
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">PRICING & AVAILABILITY</h1>
        <p className="text-xs text-zinc-400">Rapid pricing matrix and availability management for all Autonest vehicles</p>
      </div>

      <div className="bg-[#12141d] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider bg-[#090a0f]/50">
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Daily Rate (₹)</th>
                <th className="py-3.5 px-4">Hourly Rate (₹)</th>
                <th className="py-3.5 px-4">Deposit (₹)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {vehicles.filter(c => !c.archivedAt).map((car) => {
                const isEditingThis = editingCarId === car.id;
                const isAvail = car.availabilityStatus === 'Available' || car.available === true;

                return (
                  <tr key={car.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {car.brand} {car.model}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">{car.category}</td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {isEditingThis ? (
                        <input
                          type="number"
                          value={dailyPrice}
                          onChange={(e) => setDailyPrice(Number(e.target.value))}
                          className="w-24 bg-[#090a0f] border border-[#e63946] rounded p-1 text-white"
                        />
                      ) : car.dailyPrice > 0 ? (
                        `₹${car.dailyPrice.toLocaleString()}`
                      ) : (
                        'Price on request'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {isEditingThis ? (
                        <input
                          type="number"
                          value={hourlyPrice}
                          onChange={(e) => setHourlyPrice(Number(e.target.value))}
                          className="w-20 bg-[#090a0f] border border-[#e63946] rounded p-1 text-white"
                        />
                      ) : (
                        `₹${car.hourlyPrice || 0}`
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {isEditingThis ? (
                        <input
                          type="number"
                          value={deposit}
                          onChange={(e) => setDeposit(Number(e.target.value))}
                          className="w-24 bg-[#090a0f] border border-[#e63946] rounded p-1 text-white"
                        />
                      ) : (
                        `₹${car.deposit || 0}`
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={async () => {
                          const next = isAvail ? 'Unavailable' : 'Available';
                          await updateCarStatus(car.id, { availabilityStatus: next });
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isAvail ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isAvail ? 'Available' : 'Unavailable'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isEditingThis ? (
                        <button
                          onClick={() => saveEdit(car.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-bold text-[11px] flex items-center gap-1 ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(car)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-bold text-[11px]"
                        >
                          Quick Edit
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
