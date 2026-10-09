import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Booking } from '../types';

export const BookingFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    vehicles,
    locationInfo,
    bookingDraft,
    updateBookingDraft,
    createBooking,
    user
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedVehicle, setSelectedVehicle] = useState(bookingDraft.vehicle || vehicles[0]);

  // Customer details
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [dlNumber, setDlNumber] = useState('');

  // Confirmation booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const calculateDays = () => {
    const p = new Date(bookingDraft.pickupDate).getTime();
    const r = new Date(bookingDraft.returnDate).getTime();
    const diff = Math.max(1, Math.ceil((r - p) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const totalDays = calculateDays();
  const vehiclePriceTotal = selectedVehicle.dailyPrice * totalDays;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const created = await createBooking({
      userId: user?.id || 'usr-guest',
      userName: customerName,
      userPhone: customerPhone,
      userEmail: customerEmail,
      drivingLicenceNo: dlNumber,
      vehicle: selectedVehicle,
      pickupLocation: locationInfo.address,
      returnLocation: locationInfo.address,
      pickupDate: bookingDraft.pickupDate,
      pickupTime: bookingDraft.pickupTime,
      returnDate: bookingDraft.returnDate,
      returnTime: bookingDraft.returnTime,
      totalDays,
      totalAmount: vehiclePriceTotal,
      bookingStatus: 'REQUESTED'
    });

    setConfirmedBooking(created);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Tracker */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3">
              <span className="text-[#e63946]">Step {step} of 4</span>
              <span className="text-zinc-400">
                {step === 1 && 'Choose Vehicle'}
                {step === 2 && 'Dates & Pickup'}
                {step === 3 && 'Customer Details'}
                {step === 4 && 'Summary & Submit'}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#12141d] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#e63946] to-emerald-400 transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: CHOOSE VEHICLE */}
        {step === 1 && (
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase">
                Step 1: Choose Vehicle
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Select the car for your journey from Autonest Self Drive Cars.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((veh) => {
                const isSelected = selectedVehicle.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicle(veh);
                      updateBookingDraft({ vehicle: veh });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'bg-[#090a0f] border-[#e63946] shadow-xl shadow-[#e63946]/10'
                        : 'bg-[#090a0f] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={veh.images[0]} alt={veh.model} className="w-20 h-16 object-cover rounded-xl border border-white/10" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#e63946] block">{veh.category}</span>
                      <h4 className="text-sm font-bold text-white font-heading">{veh.brand} {veh.model}</h4>
                      <p className="text-xs text-zinc-400">{veh.transmission} • {veh.fuelType}</p>
                      {veh.dailyPrice > 0 ? (
                        <p className="text-xs font-bold text-white mt-1">₹{veh.dailyPrice.toLocaleString()} / day</p>
                      ) : (
                        <p className="text-xs font-bold text-amber-400 mt-1">Price on request</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] flex items-center gap-2"
              >
                <span>Continue to Dates & Pickup</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATES & TIME */}
        {step === 2 && (
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase">
                Step 2: Pickup & Return Dates
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Pickup location: {locationInfo.address}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Pickup Date</label>
                <input
                  type="date"
                  value={bookingDraft.pickupDate}
                  onChange={(e) => updateBookingDraft({ pickupDate: e.target.value })}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Pickup Time</label>
                <select
                  value={bookingDraft.pickupTime}
                  onChange={(e) => updateBookingDraft({ pickupTime: e.target.value })}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map((t) => (
                    <option key={t} value={t} className="bg-[#12141d] text-white">{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Return Date</label>
                <input
                  type="date"
                  value={bookingDraft.returnDate}
                  onChange={(e) => updateBookingDraft({ returnDate: e.target.value })}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Return Time</label>
                <select
                  value={bookingDraft.returnTime}
                  onChange={(e) => updateBookingDraft({ returnTime: e.target.value })}
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map((t) => (
                    <option key={t} value={t} className="bg-[#12141d] text-white">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-[#191c28] text-zinc-300 text-xs font-bold hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] flex items-center gap-2"
              >
                <span>Continue to Customer Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER DETAILS */}
        {step === 3 && (
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase">
                Step 3: Customer Information
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Provide your contact details for verification.</p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Driving Licence Information
                </label>
                <input
                  type="text"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  placeholder="DL Number (Optional during request)"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-[#191c28] text-zinc-300 text-xs font-bold hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!customerName || !customerPhone}
                className="px-8 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839] flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & SUBMIT */}
        {step === 4 && (
          <div className="bg-[#12141d] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase">
                Step 4: Booking Summary
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Review your rental details before submitting request.</p>
            </div>

            <div className="bg-[#090a0f] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <img src={selectedVehicle.images[0]} alt={selectedVehicle.model} className="w-20 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="text-base font-bold text-white font-heading">{selectedVehicle.brand} {selectedVehicle.model}</h4>
                  <p className="text-zinc-400">{selectedVehicle.category} • {selectedVehicle.transmission}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-zinc-500 block">Pickup Location</span>
                  <span className="font-bold text-white">{locationInfo.address}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Customer</span>
                  <span className="font-bold text-white">{customerName} ({customerPhone})</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Pickup Date/Time</span>
                  <span className="font-bold text-white">{bookingDraft.pickupDate} @ {bookingDraft.pickupTime}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Return Date/Time</span>
                  <span className="font-bold text-white">{bookingDraft.returnDate} @ {bookingDraft.returnTime}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white uppercase">Estimated Rental</span>
                {selectedVehicle.dailyPrice > 0 ? (
                  <span className="text-2xl font-black text-[#e63946] font-heading">₹{vehiclePriceTotal.toLocaleString()}</span>
                ) : (
                  <span className="text-sm font-bold text-amber-400">Price available on request</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-[#191c28] text-zinc-300 text-xs font-bold hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839]"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        )}

        {/* STEP 5: CONFIRMATION PAGE */}
        {step === 5 && confirmedBooking && (
          <div className="bg-[#12141d] rounded-3xl p-8 sm:p-14 border border-white/10 text-center space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest font-heading">
                BOOKING REQUEST SUBMITTED
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight">
                REQUEST RECEIVED
              </h1>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Thank you, {confirmedBooking.userName}. Your request for the <strong className="text-white">{confirmedBooking.vehicle.brand} {confirmedBooking.vehicle.model}</strong> has been received by Autonest Self Drive Cars.
              </p>
            </div>

            {/* Request Summary Card */}
            <div className="bg-[#090a0f] p-6 rounded-2xl border border-white/10 text-left space-y-3 text-xs max-w-md mx-auto">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Request Reference</span>
                <span className="font-black text-[#e63946] font-heading">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">{confirmedBooking.bookingStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pickup Location</span>
                <span className="font-bold text-white truncate max-w-[200px]">{confirmedBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Contact Number</span>
                <span className="font-bold text-white">{confirmedBooking.userPhone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`tel:${locationInfo.phone}`}
                className="px-6 py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d62839]"
              >
                Call Autonest (+91 89396 06556)
              </a>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3.5 rounded-xl bg-[#191c28] text-white text-xs font-bold hover:bg-white/10"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
