import React, { useState, useMemo } from 'react';
import { Users, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { CustomerSummary, Booking } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { bookings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  // Compute customers from current bookings
  const customers = useMemo(() => {
    const map: { [key: string]: CustomerSummary } = {};

    bookings.forEach((b) => {
      const rawPhone = b.userPhone || b.userName;
      const phone = rawPhone.replace(/\s+/g, '');
      if (!phone) return;

      const name = b.userName || 'Customer';
      const email = b.userEmail || '';
      const isConfirmed = (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed';

      if (!map[phone]) {
        map[phone] = {
          id: `cust_${phone.slice(-6)}`,
          name,
          phone: b.userPhone,
          email,
          totalRequests: 0,
          confirmedBookings: 0,
          lastRequestDate: b.createdAt || new Date().toISOString(),
          bookings: []
        };
      }

      map[phone].totalRequests += 1;
      if (isConfirmed) map[phone].confirmedBookings += 1;
      map[phone].bookings.push(b);

      if (new Date(b.createdAt).getTime() > new Date(map[phone].lastRequestDate).getTime()) {
        map[phone].lastRequestDate = b.createdAt;
      }
    });

    return Object.values(map);
  }, [bookings]);

  // Search filter
  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">CUSTOMER DIRECTORY</span>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">MANAGE CUSTOMERS</h1>
          <p className="text-xs text-zinc-400">View customer rental histories derived from verified booking records</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#12141d] p-4 rounded-2xl border border-white/10 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e63946]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#12141d] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider bg-[#090a0f]/50">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Total Requests</th>
                  <th className="py-3.5 px-4">Confirmed</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-200">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{c.phone}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{c.email || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{c.totalRequests}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{c.confirmedBookings}</td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {new Date(c.lastRequestDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[11px]"
                      >
                        History ({c.bookings.length})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Users className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No customer records found.</p>
          </div>
        )}
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 max-w-xl w-full space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#090a0f] text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Customer History Timeline</span>
              <h3 className="text-xl font-black font-heading text-white">{selectedCustomer.name}</h3>
              <p className="text-xs text-zinc-400">{selectedCustomer.phone} • {selectedCustomer.email || 'No email'}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Booking History ({selectedCustomer.bookings.length})</h4>
              {selectedCustomer.bookings.map((b: Booking) => (
                <div key={b.id} className="p-4 rounded-2xl bg-[#090a0f] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{b.bookingReference || b.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (b.bookingStatus || b.status) === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {b.bookingStatus || b.status}
                    </span>
                  </div>

                  <p className="text-zinc-300 font-semibold">{b.vehicle?.brand} {b.vehicle?.model}</p>
                  <p className="text-[11px] text-zinc-400">{b.pickupDate} to {b.returnDate}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-[#e63946] text-white rounded-xl text-xs font-bold"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
