import React, { useState } from 'react';
import { Building2, Phone, MapPin, Clock, AlertCircle, Droplet, Search } from 'lucide-react';
import { BloodBank, BloodGroup, ALL_BLOOD_GROUPS, POPULAR_CITIES } from '../types';

interface BloodBanksDirectoryProps {
  bloodBanks: BloodBank[];
}

export const BloodBanksDirectory: React.FC<BloodBanksDirectoryProps> = ({ bloodBanks }) => {
  const [selectedCity, setSelectedCity] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = bloodBanks.filter((bank) => {
    const matchesCity = selectedCity === 'All Locations' || bank.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <section id="blood-banks" className="py-8 sm:py-12 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Institutional Facilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              24/7 Verified Blood Banks & Storage Units
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Official hospital blood transfusion units and Red Cross centers with live unit reserves.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Inventories refreshed hourly</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-64">
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Search Blood Bank or Hospital Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="e.g. Red Cross, Victoria Memorial, Apollo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Banks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    {bank.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{bank.address}</span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                  {bank.operatingHours}
                </span>
              </div>

              {/* Blood Stock Inventory Matrix */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-semibold uppercase tracking-wider text-neutral-600">Available Units Reserve</span>
                  <span>Updated {bank.lastUpdated}</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {ALL_BLOOD_GROUPS.map((bg) => {
                    const count = bank.stock[bg] ?? 0;
                    const isLow = count < 2;

                    return (
                      <div
                        key={bg}
                        className={`p-1.5 rounded-lg text-center border ${
                          isLow
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="text-[10px] font-bold font-mono">{bg}</div>
                        <div className="text-xs font-mono font-bold tabular-nums mt-0.5">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Call & Emergency Helpline */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Emergency Helpline:</span>
                  <span className="font-mono font-bold text-rose-700">{bank.emergencyHelpline}</span>
                </div>

                <a
                  href={`tel:${bank.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          ))}

          {filteredBanks.length === 0 && (
            <div className="col-span-2 p-8 text-center bg-white rounded-xl border border-neutral-200">
              <p className="text-neutral-500 text-xs">No blood banks found in the selected location.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
