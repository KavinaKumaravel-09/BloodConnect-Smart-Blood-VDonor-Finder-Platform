import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  Building2, 
  CheckCircle2, 
  HeartHandshake, 
  Share2, 
  User, 
  Plus, 
  MessageSquare,
  Check
} from 'lucide-react';
import { UrgentRequest, BloodGroup } from '../types';

interface UrgentRequestsFeedProps {
  requests: UrgentRequest[];
  onOpenUrgentModal: () => void;
  onPledgeToRequest: (requestId: string, donorName: string, phone: string, units: number) => void;
  onFulfillRequest: (requestId: string) => void;
}

export const UrgentRequestsFeed: React.FC<UrgentRequestsFeedProps> = ({
  requests,
  onOpenUrgentModal,
  onPledgeToRequest,
  onFulfillRequest
}) => {
  const [activePledgeModalReq, setActivePledgeModalReq] = useState<UrgentRequest | null>(null);
  const [pledgeName, setPledgeName] = useState('');
  const [pledgePhone, setPledgePhone] = useState('');
  const [pledgeUnits, setPledgeUnits] = useState(1);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'FULFILLED'>('OPEN');
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'OPEN') return req.status !== 'FULFILLED';
    if (statusFilter === 'FULFILLED') return req.status === 'FULFILLED';
    return true;
  });

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePledgeModalReq || !pledgeName || !pledgePhone) return;

    onPledgeToRequest(activePledgeModalReq.id, pledgeName, pledgePhone, pledgeUnits);
    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeSuccess(false);
      setActivePledgeModalReq(null);
      setPledgeName('');
      setPledgePhone('');
      setPledgeUnits(1);
    }, 1500);
  };

  const handleShare = (req: UrgentRequest) => {
    const shareText = `URGENT BLOOD REQUIREMENT: ${req.bloodGroup} needed for ${req.patientName} at ${req.hospital}, ${req.city}. Units needed: ${req.unitsNeeded - req.unitsPledged}. Contact: ${req.contactPhone}`;
    if (navigator.share) {
      navigator.share({
        title: `Urgent ${req.bloodGroup} Blood Request`,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShareId(req.id);
      setTimeout(() => setCopiedShareId(null), 2000);
    }
  };

  return (
    <section id="urgent-feed" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Real-Time Hospital Dispatches</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Urgent Blood Requests Feed
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Live emergency transfusions and surgeries requiring immediate volunteer donor pledges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter segmented buttons */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStatusFilter('OPEN')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'OPEN' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Active Emergency
              </button>
              <button
                onClick={() => setStatusFilter('FULFILLED')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'FULFILLED' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Fulfilled Cases
              </button>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'ALL' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </button>
            </div>

            <button
              onClick={onOpenUrgentModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Request</span>
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isFulfilled = req.status === 'FULFILLED' || req.unitsPledged >= req.unitsNeeded;
            const remainingUnits = Math.max(0, req.unitsNeeded - req.unitsPledged);
            const progressPercent = Math.min(100, Math.round((req.unitsPledged / req.unitsNeeded) * 100));

            return (
              <div
                key={req.id}
                className={`rounded-xl border transition-all p-5 ${
                  isFulfilled
                    ? 'bg-neutral-50/80 border-neutral-200 opacity-80'
                    : req.urgency.includes('Critical')
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-neutral-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left block: Blood group, patient, hospital, details */}
                  <div className="flex items-start gap-4">
                    {/* Big Blood Badge */}
                    <div className="w-14 h-14 rounded-xl bg-rose-600 text-white flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-xs">
                      <span className="text-lg leading-none">{req.bloodGroup}</span>
                      <span className="text-[10px] font-sans font-normal opacity-90 mt-0.5">NEEDED</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-neutral-900 text-base">
                          {req.patientName}
                        </h3>
                        
                        {/* Urgency indicator text */}
                        <span className="text-neutral-400" aria-hidden="true">·</span>
                        <span className={`text-xs font-semibold ${
                          req.urgency.includes('Critical') ? 'text-rose-700' : 'text-amber-700'
                        }`}>
                          {req.urgency}
                        </span>

                        <span className="text-neutral-400" aria-hidden="true">·</span>
                        <span className="text-xs text-neutral-500 font-mono">
                          Posted recently
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-medium text-neutral-800">{req.hospital}</span>
                        </div>
                        <span className="text-neutral-400" aria-hidden="true">·</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{req.area}, {req.city}</span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 max-w-3xl leading-relaxed">
                        {req.caseDetails}
                      </p>

                      {/* Units progress */}
                      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">Requirement:</span>
                          <span className="font-mono font-bold text-neutral-900 tabular-nums">
                            {req.unitsPledged} of {req.unitsNeeded} units pledged
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-32 bg-neutral-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFulfilled ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        {remainingUnits > 0 ? (
                          <span className="text-rose-700 font-medium">
                            {remainingUnits} unit{remainingUnits > 1 ? 's' : ''} still required
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right block: Action buttons (Pledge, Call, WhatsApp, Share) */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!isFulfilled ? (
                        <button
                          onClick={() => setActivePledgeModalReq(req)}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          <span>I Can Donate</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Case Fulfilled
                        </span>
                      )}

                      <a
                        href={`tel:${req.contactPhone}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors"
                        title={`Call ${req.contactPerson}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      <a
                        href={`https://wa.me/${req.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello, I am reaching out regarding the urgent ${req.bloodGroup} blood request for ${req.patientName} at ${req.hospital}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chat</span>
                      </a>

                      <button
                        onClick={() => handleShare(req)}
                        className="p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        title="Share request"
                      >
                        {copiedShareId === req.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-neutral-500 w-full">
                      <span>Attendant: <strong>{req.contactPerson}</strong></span>
                      {!isFulfilled && (
                        <button
                          onClick={() => onFulfillRequest(req.id)}
                          className="text-neutral-500 hover:text-neutral-800 underline underline-offset-2 text-[11px]"
                        >
                          Mark as fulfilled
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display pledges if any */}
                {req.pledges.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-100/90 text-xs">
                    <p className="font-semibold text-neutral-700 mb-1">
                      Pledged Volunteer Donors:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {req.pledges.map((p, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md text-xs font-medium"
                        >
                          <User className="w-3 h-3 text-neutral-500" />
                          <span>{p.donorName}</span>
                          <span className="text-neutral-400">({p.units} unit)</span>
                          <span className="text-neutral-400">·</span>
                          <span className="text-neutral-500 text-[11px]">{p.pledgedAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-900 text-base">No active emergency requests in this view</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                All listed medical emergencies have been fulfilled or have sufficient donor pledges.
              </p>
              <button
                onClick={onOpenUrgentModal}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium"
              >
                Post New Blood Requirement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pledge Modal */}
      {activePledgeModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">
                  Pledge Blood Donation
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  For {activePledgeModalReq.patientName} ({activePledgeModalReq.bloodGroup}) at {activePledgeModalReq.hospital}
                </p>
              </div>
              <button
                onClick={() => setActivePledgeModalReq(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {pledgeSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-neutral-900 text-base">Thank you for pledging!</h4>
                <p className="text-xs text-neutral-600">
                  The hospital attendant has been notified of your support. Please proceed to {activePledgeModalReq.hospital}.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={pledgeName}
                    onChange={(e) => setPledgeName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Your Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={pledgePhone}
                    onChange={(e) => setPledgePhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Units You Can Provide
                  </label>
                  <select
                    value={pledgeUnits}
                    onChange={(e) => setPledgeUnits(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value={1}>1 Unit (Standard whole blood donation)</option>
                    <option value={2}>2 Units (with family/friend donor companion)</option>
                  </select>
                </div>

                <div className="p-3 bg-rose-50 rounded-lg text-rose-800 leading-relaxed text-[11px]">
                  <strong>Medical Notice:</strong> Please ensure you are well hydrated, have eaten in the past 4 hours, and haven't donated blood in the last 90 days.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setActivePledgeModalReq(null)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-xs"
                  >
                    Confirm Pledge
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
