import React, { useState } from 'react';
import { Phone, MapPin, Send, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { locationInfo, showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to Autonest.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold text-[#e63946] uppercase tracking-widest font-heading">
            THORAIPAKKAM, CHENNAI
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white uppercase tracking-tight">
            CONTACT AUTONEST
          </h1>
          <p className="text-zinc-400 text-sm">
            Reach out directly for self-drive car inquiries, availability details, or location assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Left (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <Phone className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-heading">Call Autonest</h3>
              </div>
              <a href={`tel:${locationInfo.phone}`} className="text-sm font-bold text-white hover:text-emerald-400 block transition-colors">
                {locationInfo.phone}
              </a>
            </div>

            <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#e63946]">
                <MapPin className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-heading">Address</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{locationInfo.address}</p>
              <a
                href={locationInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e63946] hover:underline pt-1"
              >
                <Navigation className="w-3.5 h-3.5" /> Get Google Maps Directions
              </a>
            </div>

            <div className="bg-[#12141d] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-amber-400">
                <Clock className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-heading">Listing Hours</h3>
              </div>
              <p className="text-xs text-zinc-300 font-semibold">{locationInfo.hours}</p>
            </div>
          </div>

          {/* Form Right (7 Cols) */}
          <div className="lg:col-span-7 bg-[#12141d] p-8 rounded-3xl border border-white/10">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black font-heading text-white uppercase">Message Sent to Autonest</h3>
                <p className="text-xs text-zinc-400">Thank you for reaching out. We will contact you at {phone}.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold font-heading text-white uppercase mb-4">Send Message</h3>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about car availability or rental dates..."
                    className="w-full bg-[#090a0f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#e63946]/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
