import React from 'react';
import { Droplet, Bell, Volume2, VolumeX, AlertTriangle, UserPlus } from 'lucide-react';
import { AppNotification } from '../types';

interface HeaderProps {
  activeTab: 'find' | 'urgent' | 'banks' | 'compatibility';
  setActiveTab: (tab: 'find' | 'urgent' | 'banks' | 'compatibility') => void;
  onOpenRegisterModal: () => void;
  onOpenUrgentModal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegisterModal,
  onOpenUrgentModal,
  soundEnabled,
  setSoundEnabled,
  notifications,
  onOpenNotifications,
  urgentCount
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); setActiveTab('find'); }}
              className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-rose-700 transition-colors"
            >
              PulseLink <span className="text-rose-600 font-semibold">Blood</span>
            </a>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('find')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 ${
                activeTab === 'find' ? 'text-rose-600 font-semibold border-b-2 border-rose-600 pb-0.5' : ''
              }`}
            >
              Find Donors
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 ${
                activeTab === 'urgent' ? 'text-rose-600 font-semibold border-b-2 border-rose-600 pb-0.5' : ''
              }`}
            >
              <span>Urgent Requests</span>
              {urgentCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-mono font-medium">
                  {urgentCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('banks')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 ${
                activeTab === 'banks' ? 'text-rose-600 font-semibold border-b-2 border-rose-600 pb-0.5' : ''
              }`}
            >
              Blood Banks
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 ${
                activeTab === 'compatibility' ? 'text-rose-600 font-semibold border-b-2 border-rose-600 pb-0.5' : ''
              }`}
            >
              Compatibility Guide
            </button>
          </nav>

          {/* Zone 3: Primary action & quick controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio chime toggle */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              title={soundEnabled ? 'Emergency sound enabled (click to mute)' : 'Emergency sound muted (click to unmute)'}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle alert sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Notification center trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </button>

            {/* Register as Donor Secondary CTA on larger screens */}
            <button
              onClick={onOpenRegisterModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register as Donor</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenUrgentModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Request Blood</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-100 py-2.5 text-xs font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('find')}
            className={`whitespace-nowrap ${activeTab === 'find' ? 'text-rose-600 font-bold' : ''}`}
          >
            Find Donors
          </button>
          <button
            onClick={() => setActiveTab('urgent')}
            className={`whitespace-nowrap ${activeTab === 'urgent' ? 'text-rose-600 font-bold' : ''}`}
          >
            Urgent ({urgentCount})
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`whitespace-nowrap ${activeTab === 'banks' ? 'text-rose-600 font-bold' : ''}`}
          >
            Blood Banks
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`whitespace-nowrap ${activeTab === 'compatibility' ? 'text-rose-600 font-bold' : ''}`}
          >
            Compatibility
          </button>
          <button
            onClick={onOpenRegisterModal}
            className="text-neutral-900 font-semibold underline underline-offset-2 whitespace-nowrap"
          >
            + Register
          </button>
        </div>
      </div>
    </header>
  );
};
