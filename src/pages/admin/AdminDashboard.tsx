import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardList,
  Plus,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import type { DashboardStats, Booking } from '../../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, bookings } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      // Calculate from local context state if offline
      const activeCars = vehicles.filter((c) => !c.archivedAt);
      const avail = activeCars.filter((c) => c.availabilityStatus === 'Available' || c.available === true).length;
      
      setStats({
        totalCars: activeCars.length,
        availableCars: avail,
        unavailableCars: activeCars.length - avail,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => (b.bookingStatus || b.status || '').toLowerCase() === 'pending').length,
        confirmedBookings: bookings.filter((b) => (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed').length,
        completedBookings: bookings.filter((b) => (b.bookingStatus || b.status || '').toLowerCase() === 'completed').length,
        cancelledBookings: bookings.filter((b) => ['cancelled', 'rejected'].includes((b.bookingStatus || b.status || '').toLowerCase())).length
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [vehicles, bookings]);

  const recentRequests = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">AUTONEST CONTROL CENTER</span>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">ADMIN DASHBOARD</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-[#12141d] border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/admin/cars/new')}
            className="px-4 py-2.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] shadow-lg shadow-[#e63946]/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Car
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-[#12141d] rounded-2xl border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#12141d] p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
              <span>Total Fleet</span>
              <Car className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-black font-heading text-white">{stats?.totalCars || 0}</p>
            <p className="text-[10px] text-zinc-400">Total registered vehicles</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
              <span>Available Cars</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black font-heading text-emerald-400">{stats?.availableCars || 0}</p>
            <p className="text-[10px] text-zinc-400">Ready for booking</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
              <span>Unavailable</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-black font-heading text-rose-400">{stats?.unavailableCars || 0}</p>
            <p className="text-[10px] text-zinc-400">Reserved or Maintenance</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
              <span>Total Requests</span>
              <ClipboardList className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black font-heading text-white">{stats?.totalBookings || 0}</p>
            <p className="text-[10px] text-zinc-400">Submitted customer requests</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
              <span>Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black font-heading text-amber-400">{stats?.pendingBookings || 0}</p>
            <p className="text-[10px] text-zinc-400">Awaiting admin review</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
              <span>Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black font-heading text-emerald-400">{stats?.confirmedBookings || 0}</p>
            <p className="text-[10px] text-zinc-400">Confirmed self-drive rentals</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between text-sky-400 text-xs font-semibold">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-black font-heading text-sky-400">{stats?.completedBookings || 0}</p>
            <p className="text-[10px] text-zinc-400">Fulfilled rentals</p>
          </div>

          <div className="bg-[#12141d] p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
              <span>Cancelled / Rejected</span>
              <XCircle className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-3xl font-black font-heading text-zinc-400">{stats?.cancelledBookings || 0}</p>
            <p className="text-[10px] text-zinc-400">Declined or cancelled</p>
          </div>

        </div>
      )}

      {/* Recent Booking Requests Table */}
      <div className="bg-[#12141d] rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-base font-black font-heading text-white uppercase">Recent Customer Requests</h3>
            <p className="text-xs text-zinc-400">Latest self-drive booking requests submitted via website</p>
          </div>

          <button
            onClick={() => navigate('/admin/requests')}
            className="text-xs font-bold text-[#e63946] hover:text-[#d62839] flex items-center gap-1 transition-colors"
          >
            <span>View All Requests</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Car Requested</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-200">
                {recentRequests.map((b: Booking) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{b.bookingReference || b.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{b.userName}</p>
                      <p className="text-[10px] text-zinc-400">{b.userPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-300">
                      {b.vehicle?.brand} {b.vehicle?.model}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {b.pickupDate} → {b.returnDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        (b.bookingStatus || b.status) === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        (b.bookingStatus || b.status) === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        (b.bookingStatus || b.status) === 'Completed' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {b.bookingStatus || b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/requests`)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 text-xs">
            No booking requests available in the database yet.
          </div>
        )}
      </div>

    </div>
  );
};
