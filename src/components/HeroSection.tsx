import React from 'react';
import { Search, MapPin, Droplet, Sparkles, Shield, Clock, Heart, Users } from 'lucide-react';
import { BloodGroup, ALL_BLOOD_GROUPS, POPULAR_CITIES } from '../types';

interface HeroSectionProps {
  selectedBloodGroup: BloodGroup | 'ALL';
  setSelectedBloodGroup: (bg: BloodGroup | 'ALL') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  smartCompatibility: boolean;
  setSmartCompatibility: (val: boolean) => void;
  onExecuteSearch: () => void;
  onOpenRegisterModal: () => void;
  onOpenUrgentModal: () => void;
  totalDonors: number;
  totalRequests: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedBloodGroup,
  setSelectedBloodGroup,
  selectedCity,
  setSelectedCity,
  smartCompatibility,
  setSmartCompatibility,
  onExecuteSearch,
  onOpenRegisterModal,
  onOpenUrgentModal,
  totalDonors,
  totalRequests
}) => {
  return (
    <div className="relative bg-white border-b border-neutral-200 overflow-hidden">
      {/* Background ambient medical glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission, Headlines, Quick Search Filter */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>Centralized Emergency Blood Network</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Find verified blood donors nearby within minutes.
              </h1>
              
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                During medical emergencies, every minute counts. Connect directly with voluntary donors matching your exact blood group and location, or broadcast real-time urgent hospital requests.
              </p>
            </div>

            {/* Quick Search Box */}
            <div className="p-4 sm:p-5 bg-neutral-50 rounded-xl border border-neutral-200/90 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Blood Group Select */}
                <div className="sm:col-span-5 space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Required Blood Group
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBloodGroup}
                      onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup | 'ALL')}
                      className="w-full bg-white border border-neutral-300 rounded-lg py-2.5 pl-3 pr-8 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="ALL">Any Blood Group</option>
                      {ALL_BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Group {bg === 'O-' ? '(Universal Donor)' : bg === 'AB+' ? '(Universal Recipient)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City Select */}
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    City / Region
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg py-2.5 pl-3 pr-8 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3 flex items-end">
                  <button
                    onClick={onExecuteSearch}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Donors</span>
                  </button>
                </div>
              </div>

              {/* Compatibility toggle helper */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200/80 text-xs text-neutral-600">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={smartCompatibility}
                    onChange={(e) => setSmartCompatibility(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                  />
                  <span className="font-medium text-neutral-800">
                    Smart Compatibility Mode (include universal compatible donors)
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenRegisterModal}
                    className="text-rose-700 hover:text-rose-800 font-semibold underline underline-offset-2"
                  >
                    Register as voluntary donor
                  </button>
                </div>
              </div>
            </div>

            {/* Evidence & Quick Metrics Adjacency */}
            <div className="grid grid-cols-3 gap-4 pt-1 border-t border-neutral-100">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                  {totalDonors}
                </p>
                <p className="text-xs text-neutral-500">Verified Donors Listed</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                  100%
                </p>
                <p className="text-xs text-neutral-500">Direct Contact (No Middlemen)</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-rose-600 font-mono tabular-nums">
                  &lt; 15 min
                </p>
                <p className="text-xs text-neutral-500">Avg. Emergency Response</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-100 shadow-md aspect-4/3 lg:aspect-auto lg:h-[420px]">
              <img
                src="/src/assets/images/hero_blood_donation_care_1793347606813.jpg"
                alt="Modern compassionate blood donation clinic and voluntary donors"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback styled state if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('flex', 'items-center', 'justify-center', 'p-8', 'bg-rose-50');
                  }
                }}
              />
              
              {/* Subtle scrim overlay with live status badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/10 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-900 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Heart className="w-5 h-5 fill-rose-600" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-neutral-900">Hospital Emergency Hotline</p>
                    <p className="text-neutral-500">24/7 Red Cross Dispatch: 108 / 1910</p>
                  </div>
                </div>

                <button
                  onClick={onOpenUrgentModal}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  Post Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
