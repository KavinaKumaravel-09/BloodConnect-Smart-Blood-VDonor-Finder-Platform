import React, { useState } from 'react';
import { Droplet, ArrowRight, Check, X, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { 
  BloodGroup, 
  ALL_BLOOD_GROUPS, 
  COMPATIBLE_DONORS_FOR_RECIPIENT, 
  CAN_DONATE_TO 
} from '../types';

interface CompatibilityGuideProps {
  onSelectGroupAndSearch: (group: BloodGroup) => void;
}

export const CompatibilityGuide: React.FC<CompatibilityGuideProps> = ({
  onSelectGroupAndSearch
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const compatibleDonors = COMPATIBLE_DONORS_FOR_RECIPIENT[selectedGroup];
  const canDonateToGroups = CAN_DONATE_TO[selectedGroup];

  return (
    <section id="compatibility" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="border-b border-neutral-200 pb-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <Droplet className="w-4 h-4 fill-current" />
            <span>Transfusion Science Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Blood Group Compatibility Guide
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            During medical emergencies, finding an exact match is ideal, but universal compatible matches can save a patient's life when specific groups are in short supply.
          </p>
        </div>

        {/* Interactive Matrix Selector */}
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-neutral-800">
              Select a Blood Group to inspect compatibility:
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-sm font-bold transition-all shadow-xs ${
                    selectedGroup === bg
                      ? 'bg-rose-600 text-white ring-2 ring-rose-600 ring-offset-2'
                      : 'bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Flow Cards: Can Receive From vs Can Give To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Can Receive From (If Patient has selectedGroup) */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    If Patient is <span className="text-rose-600 font-mono">{selectedGroup}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Can safely receive Red Blood Cells from:
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  IN
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_BLOOD_GROUPS.map((bg) => {
                  const isMatch = compatibleDonors.includes(bg);
                  return (
                    <div
                      key={bg}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                        isMatch
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-400 opacity-60'
                      }`}
                    >
                      {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-neutral-400" />}
                      <span>{bg}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-xs text-neutral-600">
                {selectedGroup === 'AB+' ? (
                  <p className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg">
                    🌟 <strong>Universal Recipient:</strong> Individuals with AB positive blood can safely receive red blood cells from any blood type.
                  </p>
                ) : selectedGroup === 'O-' ? (
                  <p className="p-2.5 bg-rose-50 text-rose-900 rounded-lg">
                    ⚠️ <strong>Rare Receiver:</strong> O-negative patients have no A, B, or Rh antigens and can ONLY safely receive blood from other O-negative donors.
                  </p>
                ) : (
                  <p className="text-neutral-500">
                    Matches include exact type and compatible universal negative types.
                  </p>
                )}
              </div>

              <button
                onClick={() => onSelectGroupAndSearch(selectedGroup)}
                className="w-full mt-2 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Find Donors Compatible with {selectedGroup}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Can Donate Blood To */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    If Donor is <span className="text-rose-600 font-mono">{selectedGroup}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Can safely donate Red Blood Cells to:
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  OUT
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_BLOOD_GROUPS.map((bg) => {
                  const isMatch = canDonateToGroups.includes(bg);
                  return (
                    <div
                      key={bg}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                        isMatch
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-400 opacity-60'
                      }`}
                    >
                      {isMatch ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <X className="w-3.5 h-3.5 text-neutral-400" />}
                      <span>{bg}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-xs text-neutral-600">
                {selectedGroup === 'O-' ? (
                  <p className="p-2.5 bg-rose-50 text-rose-900 rounded-lg">
                    🩸 <strong>Universal Red Cell Donor:</strong> O-negative blood can be given to patients of virtually ANY blood group in urgent trauma resuscitation.
                  </p>
                ) : selectedGroup === 'AB+' ? (
                  <p className="p-2.5 bg-neutral-100 text-neutral-800 rounded-lg">
                    💡 <strong>Specific Red Cell Recipient:</strong> AB+ donors can only give red cells to AB+ patients, but are universal donors for blood plasma!
                  </p>
                ) : (
                  <p className="text-neutral-500">
                    Can donate to {canDonateToGroups.length} recipient blood groups safely.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Master Reference Grid */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200">
            <h3 className="font-bold text-neutral-900 text-sm">
              Universal Blood Group Compatibility Reference Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Patient Group</th>
                  <th className="px-4 py-3">Can Receive Red Blood Cells From</th>
                  <th className="px-4 py-3">Can Donate Red Blood Cells To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                {ALL_BLOOD_GROUPS.map((bg) => (
                  <tr key={bg} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-neutral-900">{bg}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">
                      {COMPATIBLE_DONORS_FOR_RECIPIENT[bg].join(', ')}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {CAN_DONATE_TO[bg].join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
