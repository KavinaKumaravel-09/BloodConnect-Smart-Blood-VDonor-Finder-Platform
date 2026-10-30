import React from 'react';
import { AlertCircle, Phone, ArrowRight, Play, Check } from 'lucide-react';
import { UrgentRequest } from '../types';

interface UrgentAlertBannerProps {
  urgentRequests: UrgentRequest[];
  onSelectRequest: (req: UrgentRequest) => void;
  onSimulateUrgentRequest: () => void;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({
  urgentRequests,
  onSelectRequest,
  onSimulateUrgentRequest
}) => {
  const critical = urgentRequests.filter(r => r.status !== 'FULFILLED')[0];

  if (!critical) return null;

  return (
    <div className="bg-rose-50 border-b border-rose-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <div className="flex items-center gap-2 text-rose-950 truncate">
              <span className="font-semibold text-rose-700 uppercase tracking-wider text-xs whitespace-nowrap">
                Urgent Alert
              </span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span className="font-bold text-rose-900 bg-rose-200 px-1.5 py-0.5 rounded text-xs">
                {critical.bloodGroup} Needed
              </span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span className="truncate text-neutral-800">
                {critical.unitsNeeded - critical.unitsPledged} unit(s) at {critical.hospital}, {critical.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => onSelectRequest(critical)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-xs transition-colors shadow-xs"
            >
              <span>View & Pledge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onSimulateUrgentRequest}
              title="Test real-time emergency dispatch and alert chime"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
            >
              <Play className="w-3 h-3 text-neutral-500 fill-current" />
              <span>Simulate Broadcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
