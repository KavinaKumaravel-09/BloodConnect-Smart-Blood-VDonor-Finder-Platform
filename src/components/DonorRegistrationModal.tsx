import React, { useState } from 'react';
import { X, Droplet, ShieldCheck, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Donor, BloodGroup, ALL_BLOOD_GROUPS, POPULAR_CITIES } from '../types';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterDonor: (donor: Omit<Donor, 'id' | 'donationsCount' | 'verified'>) => void;
}

export const DonorRegistrationModal: React.FC<DonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterDonor
}) => {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [weightKg, setWeightKg] = useState<number>(65);
  const [city, setCity] = useState(POPULAR_CITIES[1] || 'Chennai');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState('2026-06-01');
  const [availableForEmergencyCall, setAvailableForEmergencyCall] = useState(true);
  const [notes, setNotes] = useState('');
  
  // Safety checklist checkboxes
  const [checklistAge, setChecklistAge] = useState(true);
  const [checklistWeight, setChecklistWeight] = useState(true);
  const [checklistHealth, setChecklistHealth] = useState(true);
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (age < 18 || age > 65) {
      setErrorMessage('Donors must be between 18 and 65 years of age according to health regulations.');
      return;
    }

    if (weightKg < 50) {
      setErrorMessage('Donors must weigh at least 50 kg for whole blood donation safety.');
      return;
    }

    if (!area.trim() || !phone.trim()) {
      setErrorMessage('Please provide your neighborhood/area and contact phone number.');
      return;
    }

    if (!checklistHealth) {
      setErrorMessage('Please confirm you have no active viral infection or recent major surgery.');
      return;
    }

    onRegisterDonor({
      name,
      bloodGroup,
      age,
      gender,
      weightKg,
      city,
      area: area.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      lastDonationDate: isFirstTime ? 'Never' : lastDonationDate,
      isAvailable: true,
      availableForEmergencyCall,
      notes: notes.trim() || `Voluntary ${bloodGroup} donor in ${area}, ${city}.`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-neutral-200 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 px-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Registration Successful!</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Thank you, <strong>{name}</strong>! Your profile is now live in the PulseLink Blood Donor directory. Families and hospitals in {city} will be able to reach you during emergencies.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-current" />
                <span>Become a Hero</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                Volunteer Blood Donor Registration
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Join our emergency response network to help save lives during hospital trauma and surgical emergencies.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Personal & Medical Info */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sengupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg} {bg === 'O-' ? '(Universal Donor)' : bg === 'AB+' ? '(Universal Recipient)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age, Gender, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Age (18-65) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    min={45}
                    max={150}
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    City / Metro *
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
                    placeholder="e.g. Adyar, Besant Nagar, Koramangala"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Last Donation Date */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-700">Donation History</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isFirstTime}
                      onChange={(e) => setIsFirstTime(e.target.checked)}
                      className="w-3.5 h-3.5 text-rose-600 rounded"
                    />
                    <span>First-time donor</span>
                  </label>
                </div>

                {!isFirstTime && (
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">
                      Date of Most Recent Blood Donation
                    </label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                    />
                  </div>
                )}
              </div>

              {/* Emergency Call Availability */}
              <label className="flex items-start gap-2.5 p-3 bg-rose-50/50 border border-rose-200/80 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableForEmergencyCall}
                  onChange={(e) => setAvailableForEmergencyCall(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-rose-600 rounded border-neutral-300 focus:ring-rose-500"
                />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    Available for Emergency Night & Rapid Transit Requests
                  </span>
                  <span className="text-neutral-500 text-[11px] block mt-0.5">
                    Hospitals may call during critical overnight trauma surgeries.
                  </span>
                </div>
              </label>

              {/* Health & Safety Checklist */}
              <div className="space-y-1.5 text-[11px] text-neutral-600 border-t border-neutral-100 pt-3">
                <span className="font-semibold text-neutral-700 block text-xs">
                  Mandatory Medical Criteria Confirmation:
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistHealth}
                    onChange={(e) => setChecklistHealth(e.target.checked)}
                    className="w-3.5 h-3.5 text-rose-600 rounded"
                  />
                  <span>I am free from fever, infectious illness, and haven't had a tattoo or major surgery in the last 6 months.</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
              >
                Complete Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
