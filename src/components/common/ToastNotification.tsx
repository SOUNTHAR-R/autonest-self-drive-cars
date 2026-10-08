import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-semibold ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
            : toast.type === 'error'
            ? 'bg-red-950/90 text-red-200 border-red-500/30'
            : 'bg-[#12141d]/95 text-white border-white/20'
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-[#e63946] shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
