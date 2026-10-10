import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      setSubmitted(true);
      if (res.token) {
        setResetToken(res.token);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-[#12141d] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Enter your email address to receive password reset instructions.
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
              <p className="font-bold text-sm">Reset link requested!</p>
              <p className="text-zinc-400">
                If an account exists for <span className="text-white font-semibold">{email}</span>, password reset instructions have been generated.
              </p>
            </div>

            {resetToken && (
              <div className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-left space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Dev / Local Reset Token Link:</span>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="text-xs text-[#e63946] hover:underline font-mono break-all block"
                >
                  /reset-password?token={resetToken}
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/25 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
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
