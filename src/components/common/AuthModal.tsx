import React, { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, loginUser } = useApp();
  const [email, setEmail] = useState('rajesh.kanna@velocityluxe.com');
  const [password, setPassword] = useState('••••••••');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      loginUser(email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12141d] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Top Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#e63946]/20 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#191c28] text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center mx-auto mb-3 border border-[#e63946]/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-heading">
            {mode === 'login' ? 'Access Your VIP Account' : 'Create VIP Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'login' ? 'Unlock member pricing and instant reservations' : 'Join South India’s premier luxury car collective'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 transition-all duration-300 mt-2"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

        {/* Demo Quick Sign-in Note */}
        <div className="mt-5 p-3 rounded-xl bg-[#191c28] border border-white/5 text-center">
          <p className="text-[11px] text-zinc-400">
            <span className="text-amber-400 font-bold">Demo Quick Access:</span> You can sign in with any email to instantly explore the user experience.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};
