import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(token, newPassword);
      setSubmitted(true);
      showToast('Password updated successfully!', 'success');
    } catch (err: any) {
      setError(err.message || 'Password reset failed or token has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-[#12141d] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight">Set New Password</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Enter your new password to regain access to your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <p className="font-bold text-sm">Password Reset Complete!</p>
              <p className="text-zinc-400">You can now sign in with your new password.</p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#090a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
