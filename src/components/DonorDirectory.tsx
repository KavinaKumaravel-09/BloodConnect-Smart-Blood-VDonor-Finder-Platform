import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Filter, 
  Send, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { 
  Donor, 
  BloodGroup, 
  ALL_BLOOD_GROUPS, 
  POPULAR_CITIES, 
  COMPATIBLE_DONORS_FOR_RECIPIENT,
  CAN_DONATE_TO
} from '../types';

interface DonorDirectoryProps {
  donors: Donor[];
  selectedBloodGroup: BloodGroup | 'ALL';
  setSelectedBloodGroup: (bg: BloodGroup | 'ALL') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  smartCompatibility: boolean;
  setSmartCompatibility: (val: boolean) => void;
  onOpenRegisterModal: () => void;
  onOpenUrgentModal: () => void;
  onSendDirectAlert: (donor: Donor) => void;
}

export const DonorDirectory: React.FC<DonorDirectoryProps> = ({
  donors,
  selectedBloodGroup,
  setSelectedBloodGroup,
  selectedCity,
  setSelectedCity,
  smartCompatibility,
  setSmartCompatibility,
  onOpenRegisterModal,
  onOpenUrgentModal,
  onSendDirectAlert
}) => {
  const [areaSearch, setAreaSearch] = useState('');
  const [onlyEmergencyReady, setOnlyEmergencyReady] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Determine allowed blood groups
  let targetBloodGroups: BloodGroup[] = [];
  if (selectedBloodGroup === 'ALL') {
    targetBloodGroups = ALL_BLOOD_GROUPS;
  } else if (smartCompatibility) {
    // For a patient needing selectedBloodGroup, who can donate to them?
    targetBloodGroups = COMPATIBLE_DONORS_FOR_RECIPIENT[selectedBloodGroup] || [selectedBloodGroup];
  } else {
    targetBloodGroups = [selectedBloodGroup];
  }

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    // Blood group match
    const matchesBlood = targetBloodGroups.includes(donor.bloodGroup);
    
    // City match
    const matchesCity = selectedCity === 'All Locations' || donor.city.toLowerCase() === selectedCity.toLowerCase();
    
    // Area/Neighborhood match
    const matchesArea = !areaSearch.trim() || 
      donor.area.toLowerCase().includes(areaSearch.toLowerCase()) || 
      donor.name.toLowerCase().includes(areaSearch.toLowerCase());

    // Emergency ready match
    const matchesEmergency = !onlyEmergencyReady || donor.availableForEmergencyCall;

    return matchesBlood && matchesCity && matchesArea && matchesEmergency;
  });

  const handleCopyPhone = (donor: Donor) => {
    navigator.clipboard.writeText(donor.phone);
    setCopiedPhoneId(donor.id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const getWhatsAppLink = (donor: Donor) => {
    const cleanPhone = donor.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${donor.name}, I found your contact on PulseLink Blood Donor Finder. We urgently need blood donation for a patient in ${donor.city}. Are you currently available to donate?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <section id="find-donors" className="py-8 sm:py-12 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Available Blood Donors
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Find and directly reach out to registered voluntary donors in your city.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRegisterModal}
              className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
            >
              + Register as Donor
            </button>
            <button
              onClick={onOpenUrgentModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              Post Urgent Request
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Blood Group Segmented Selectors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700">Filter by Blood Group</span>
              {selectedBloodGroup !== 'ALL' && smartCompatibility && (
                <span className="text-rose-700 font-medium">
                  Compatible for Recipient {selectedBloodGroup}: {targetBloodGroups.join(', ')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => setSelectedBloodGroup('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedBloodGroup === 'ALL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Groups
              </button>

              {ALL_BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`px-3.5 py-1.5 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters: Location, Area Search, Smart Compatibility, Emergency Ready */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-neutral-100">
            {/* City Dropdown */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                City / Metro
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

            {/* Area / Name Search */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Area, Hospital, or Name
              </label>
              <input
                type="text"
                placeholder="e.g. Adyar, Koramangala..."
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Smart Compatibility Toggle */}
            <div className="flex items-center">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none mt-4 sm:mt-5">
                <input
                  type="checkbox"
                  checked={smartCompatibility}
                  onChange={(e) => setSmartCompatibility(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                />
                <span className="text-neutral-700 font-medium">Smart Universal Match</span>
              </label>
            </div>

            {/* Only Emergency Ready Toggle */}
            <div className="flex items-center">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none mt-4 sm:mt-5">
                <input
                  type="checkbox"
                  checked={onlyEmergencyReady}
                  onChange={(e) => setOnlyEmergencyReady(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                />
                <span className="text-neutral-700 font-medium">Emergency Standby Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500 px-1">
          <div>
            Showing <span className="font-semibold text-neutral-900 font-mono tabular-nums">{filteredDonors.length}</span> donors
            {selectedBloodGroup !== 'ALL' && (
              <span> for blood group <strong className="text-neutral-900">{selectedBloodGroup}</strong></span>
            )}
            {selectedCity !== 'All Locations' && (
              <span> in <strong className="text-neutral-900">{selectedCity}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Sorted by emergency readiness & proximity</span>
          </div>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((donor) => {
              const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');
              const waLink = getWhatsAppLink(donor);

              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between relative group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Blood Group Badge + Verification + Emergency Ready */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Blood Group Display */}
                        <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex flex-col items-center justify-center font-mono font-bold shadow-xs shrink-0">
                          <span className="text-base leading-none">{donor.bloodGroup}</span>
                          <span className="text-[10px] font-sans font-normal opacity-90 mt-0.5">RH</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-neutral-900 text-sm leading-snug">
                              {donor.name}
                            </h3>
                            {donor.verified && (
                              <span title="Identity & Blood Group Verified">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              </span>
                            )}
                          </div>
                          
                          {/* Metadata row with clean unboxed dots */}
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                            <span>{donor.age} yrs</span>
                            <span aria-hidden="true">·</span>
                            <span>{donor.gender}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{donor.donationsCount} donations</span>
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="text-right shrink-0">
                        {donor.isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Available Now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            Recent Donor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & Details */}
                    <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-medium text-neutral-800">{donor.area}, {donor.city}</span>
                      </div>

                      {donor.notes && (
                        <p className="text-neutral-500 line-clamp-2 leading-relaxed">
                          {donor.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>Last donation: {donor.lastDonationDate}</span>
                        {donor.availableForEmergencyCall && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-rose-700 font-medium">Night calls ok</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Call, WhatsApp, Direct Emergency Ping */}
                  <div className="pt-4 mt-4 border-t border-neutral-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => handleCopyPhone(donor)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-2 flex items-center gap-1"
                      >
                        {copiedPhoneId === donor.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Number Copied!</span>
                          </>
                        ) : (
                          <span>Copy Number</span>
                        )}
                      </button>

                      <button
                        onClick={() => onSendDirectAlert(donor)}
                        className="text-xs text-rose-700 hover:text-rose-800 font-medium flex items-center gap-1"
                        title="Dispatch an urgent donation alert to this donor"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Alert</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-neutral-900 text-base">No donors found matching criteria</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                We couldn't find active donors for {selectedBloodGroup} in {selectedCity} with the current filters.
                Try turning on <strong>Smart Universal Match</strong> to see compatible donors, or post an urgent blood request to alert nearby volunteers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedBloodGroup('ALL');
                  setSelectedCity('All Locations');
                  setAreaSearch('');
                  setOnlyEmergencyReady(false);
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={onOpenUrgentModal}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Broadcast Urgent Request
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
