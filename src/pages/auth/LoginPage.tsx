import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, refreshData } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = (location.state as any)?.from || '/account';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.customerLogin({ email, password });
      await refreshData();
      showToast('Logged in successfully', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // Direct Google Auth API call simulation / token submission
      const gEmail = prompt('Enter your Google email for demo sign-in:');
      if (!gEmail) {
        setLoading(false);
        return;
      }
      await api.customerGoogleAuth({
        email: gEmail,
        fullName: gEmail.split('@')[0],
        googleId: `google_${Date.now()}`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${gEmail}`
      });
      await refreshData();
      showToast('Signed in with Google successfully', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-[#12141d] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e63946]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-white font-heading tracking-tight">Customer Sign In</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Access your Autonest Self Drive Cars account, bookings, and saved garage
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-white text-zinc-900 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all shadow-md mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#12141d] px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-widest absolute">
            or email
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#e63946] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-xs text-zinc-400">
            Don't have an Autonest account?{' '}
            <Link to="/register" className="text-[#e63946] font-bold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
