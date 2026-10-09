import React, { useState, useMemo } from 'react';
import {
  Search,
  Phone,
  MessageSquare,
  X,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Booking, BookingStatus } from '../../types';

export const AdminBookingRequests: React.FC = () => {
  const { bookings, vehicles, updateBookingStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [carFilter, setCarFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Admin notes state inside inspect modal
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [conflictWarning, setConflictWarning] = useState<string>('');

  const handleInspect = (b: Booking) => {
    setSelectedBooking(b);
    setAdminNotes(b.adminNotes || '');
    setConflictWarning('');
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (statusFilter !== 'All') {
          const current = (b.bookingStatus || b.status || '').toLowerCase();
          if (current !== statusFilter.toLowerCase()) return false;
        }
        if (carFilter !== 'All') {
          const bCarId = b.carId || b.vehicle?.id;
          if (bCarId !== carFilter) return false;
        }
        if (search) {
          const q = search.toLowerCase();
          const refMatch = (b.bookingReference || b.id || '').toLowerCase().includes(q);
          const nameMatch = (b.userName || '').toLowerCase().includes(q);
          const phoneMatch = (b.userPhone || '').toLowerCase().includes(q);
          if (!refMatch && !nameMatch && !phoneMatch) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [bookings, search, statusFilter, carFilter]);

  // Handle status update with overlapping check
  const handleStatusChange = async (targetBooking: Booking, newStatus: string) => {
    setConflictWarning('');
    try {
      await updateBookingStatus(targetBooking.id, newStatus);
      if (selectedBooking && selectedBooking.id === targetBooking.id) {
        setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: newStatus as BookingStatus } : null));
      }
    } catch (err: any) {
      setConflictWarning(err.message || 'Status update failed due to booking conflict.');
    }
  };

  // Format WhatsApp URL
  const getWhatsAppUrl = (phone: string, ref?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello! This is Autonest Self Drive Cars regarding your booking request ${ref || ''}.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">REQUEST MANAGEMENT</span>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">BOOKING REQUESTS</h1>
          <p className="text-xs text-zinc-400">Inspect customer self-drive requests, confirm bookings, & handle scheduling</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#12141d] p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reference, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e63946]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="All">Status: All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={carFilter}
            onChange={(e) => setCarFilter(e.target.value)}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="All">Vehicle: All Cars</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-[#12141d] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider bg-[#090a0f]/50">
                  <th className="py-3.5 px-4">Ref ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Car Requested</th>
                  <th className="py-3.5 px-4">Pickup & Return</th>
                  <th className="py-3.5 px-4">Est. Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-200">
                {filteredBookings.map((b) => {
                  const currentStatus = b.bookingStatus || b.status || 'Pending';

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {b.bookingReference || b.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{b.userName}</p>
                        <p className="text-[10px] text-zinc-400">{b.userPhone}</p>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-zinc-300">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300">
                        <p>{b.pickupDate} ({b.pickupTime})</p>
                        <p className="text-[10px] text-zinc-500">to {b.returnDate} ({b.returnTime})</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#e63946]">
                        {b.totalAmount > 0 ? `₹${b.totalAmount.toLocaleString()}` : 'On Request'}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(b, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
                            currentStatus === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            currentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            currentStatus === 'Completed' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                            'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${b.userPhone}`}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <a
                            href={getWhatsAppUrl(b.userPhone, b.bookingReference || b.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                            title="WhatsApp Customer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleInspect(b)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[11px]"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <ClipboardList className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No booking requests found matching your filter.</p>
          </div>
        )}
      </div>

      {/* Booking Details Inspector Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#090a0f] text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e63946] flex items-center justify-center text-white font-bold">
                AN
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Booking Request Inspector</span>
                <h3 className="text-xl font-black font-heading text-white">{selectedBooking.bookingReference || selectedBooking.id}</h3>
              </div>
            </div>

            {conflictWarning && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{conflictWarning}</span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Customer Info Card */}
              <div className="bg-[#090a0f] p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-zinc-500 font-bold block uppercase text-[10px]">Customer Details</span>
                <p className="text-sm font-bold text-white">{selectedBooking.userName}</p>
                <p className="text-zinc-300">Phone: {selectedBooking.userPhone}</p>
                <p className="text-zinc-400">Email: {selectedBooking.userEmail || 'Not provided'}</p>
                {selectedBooking.drivingLicenceNo && (
                  <p className="text-zinc-400">Licence: {selectedBooking.drivingLicenceNo}</p>
                )}
                
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`tel:${selectedBooking.userPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>
                  <a
                    href={getWhatsAppUrl(selectedBooking.userPhone, selectedBooking.bookingReference || selectedBooking.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Vehicle & Date Card */}
              <div className="bg-[#090a0f] p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-zinc-500 font-bold block uppercase text-[10px]">Vehicle & Period</span>
                <p className="text-sm font-bold text-white">{selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.model}</p>
                <p className="text-zinc-300">Pickup: {selectedBooking.pickupDate} ({selectedBooking.pickupTime})</p>
                <p className="text-zinc-300">Return: {selectedBooking.returnDate} ({selectedBooking.returnTime})</p>
                <p className="text-zinc-400">Duration: {selectedBooking.totalDays || 1} Day(s)</p>
                <p className="text-sm font-black text-[#e63946]">
                  Total Est: {selectedBooking.totalAmount > 0 ? `₹${selectedBooking.totalAmount.toLocaleString()}` : 'Price on request'}
                </p>
              </div>

            </div>

            {/* Customer Special Request Message */}
            {selectedBooking.customerMessage && (
              <div className="bg-[#090a0f] p-4 rounded-2xl border border-white/5 space-y-1 text-xs">
                <span className="text-zinc-500 font-bold block uppercase text-[10px]">Customer Notes</span>
                <p className="text-zinc-300 italic">"{selectedBooking.customerMessage}"</p>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="space-y-2 text-xs">
              <label className="text-zinc-300 font-bold block">Internal Admin Notes (Private)</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add private admin notes regarding customer verification, vehicle prep..."
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            {/* Status History */}
            {selectedBooking.statusHistory && selectedBooking.statusHistory.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="text-zinc-400 font-bold block uppercase text-[10px]">Status Audit Log</span>
                <div className="space-y-1.5 bg-[#090a0f] p-3 rounded-xl border border-white/5">
                  {selectedBooking.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>• {h.status} ({h.note || 'Updated'})</span>
                      <span>{new Date(h.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">Change Status:</span>
                <select
                  value={selectedBooking.bookingStatus || selectedBooking.status || 'Pending'}
                  onChange={(e) => handleStatusChange(selectedBooking, e.target.value)}
                  className="bg-[#090a0f] border border-white/10 rounded-xl py-2 px-3 text-white text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 bg-[#e63946] text-white rounded-xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
