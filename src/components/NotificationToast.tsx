import React from 'react';
import { AlertCircle, X, ArrowRight, Heart } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  toast: AppNotification | null;
  onClose: () => void;
  onView: (toast: AppNotification) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toast,
  onClose,
  onView
}) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-neutral-900 text-white rounded-xl shadow-2xl p-4 border border-neutral-800 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold leading-tight text-white">{toast.title}</h4>
            <p className="text-[11px] text-neutral-300 leading-snug line-clamp-2">
              {toast.message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 rounded-md"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800 text-xs">
        <span className="text-[10px] text-neutral-400 font-mono">{toast.timestamp}</span>
        <button
          onClick={() => onView(toast)}
          className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 text-[11px]"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
