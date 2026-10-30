import React from 'react';
import { Droplet, Heart, Shield, PhoneCall } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'find' | 'urgent' | 'banks' | 'compatibility') => void;
  onOpenRegisterModal: () => void;
  onOpenUrgentModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenRegisterModal,
  onOpenUrgentModal
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">PulseLink Blood</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Bridging the gap between medical emergencies and volunteer blood donors. Fast, organized, and direct.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => { setActiveTab('find'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Find Blood Donors
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('urgent'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Urgent Requests Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('banks'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  24/7 Blood Bank Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('compatibility'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Compatibility Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">Emergency Helplines</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">108</span>
                <span>National Emergency Ambulance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">1910</span>
                <span>National Blood Transfusion Helpline</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">102</span>
                <span>Maternity & Neonatal Emergency</span>
              </li>
            </ul>
          </div>

          {/* Actions & Safety Notice */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">Volunteer Network</h4>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              100% voluntary initiative. Never pay anyone asking for money in exchange for blood donation. Report fraudulent solicitations immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenRegisterModal}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Register as Donor
              </button>
              <button
                onClick={onOpenUrgentModal}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Request Blood
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} PulseLink Blood Donor Finder. Emergency medical assistance network.</p>
          <div className="flex items-center gap-3">
            <span>Voluntary Donors Only</span>
            <span aria-hidden="true">·</span>
            <span>Zero Brokerage</span>
            <span aria-hidden="true">·</span>
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
