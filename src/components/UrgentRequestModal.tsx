import React, { useState } from 'react';
import { X, AlertTriangle, Building2, Phone, Droplet, Clock, CheckCircle2 } from 'lucide-react';
import { UrgentRequest, BloodGroup, ALL_BLOOD_GROUPS, POPULAR_CITIES } from '../types';

interface UrgentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (req: Omit<UrgentRequest, 'id' | 'createdAt' | 'unitsPledged' | 'status' | 'pledges'>) => void;
}

export const UrgentRequestModal: React.FC<UrgentRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequest
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<'Critical (Under 1 hr)' | 'Urgent (Under 4 hrs)' | 'Priority (Today)'>('Critical (Under 1 hr)');
  const [hospital, setHospital] = useState('');
  const [city, setCity] = useState(POPULAR_CITIES[1] || 'Chennai');
  const [area, setArea] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [caseDetails, setCaseDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim() || !hospital.trim() || !contactPerson.trim() || !contactPhone.trim() || !area.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    onSubmitRequest({
      patientName: patientName.trim(),
      bloodGroup,
      unitsNeeded,
      urgency,
      hospital: hospital.trim(),
      city,
      area: area.trim(),
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      caseDetails: caseDetails.trim() || `Urgent transfusion requirement of ${unitsNeeded} units of ${bloodGroup} at ${hospital}.`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 px-4 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Emergency Alert Broadcasted!</h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Your request for <strong>{unitsNeeded} units of {bloodGroup}</strong> at <strong>{hospital}</strong> is now live across the volunteer network and emergency feed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency Broadcast</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mt-1">
                Post Urgent Blood Requirement
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Broadcast an immediate blood requirement to nearby donors and volunteer networks.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 text-xs">
              {/* Patient Name & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Ramanathan"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Units & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Units of Blood Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    required
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as typeof urgency)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Critical (Under 1 hr)">Critical (Under 1 hr)</option>
                    <option value="Urgent (Under 4 hrs)">Urgent (Under 4 hrs)</option>
                    <option value="Priority (Today)">Priority (Today)</option>
                  </select>
                </div>
              </div>

              {/* Hospital & Location */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Hospital Name & Ward/Room *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Speciality Hospitals, Greams Rd, ICU Bed 14"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {POPULAR_CITIES.filter(c => c !== 'All Locations').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thousand Lights / Greams Rd"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Contact Person Name & Relation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh / Suresh (Brother)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Direct Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 99887"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Medical Case Details */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Reason / Surgery / Clinical Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Emergency bypass surgery scheduled at 2:00 PM. Patient has rare antibody requirement."
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm"
              >
                Broadcast Emergency Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
