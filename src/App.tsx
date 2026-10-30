/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BloodGroup, 
  Donor, 
  UrgentRequest, 
  BloodBank, 
  AppNotification 
} from './types';
import { 
  INITIAL_DONORS, 
  INITIAL_URGENT_REQUESTS, 
  INITIAL_BLOOD_BANKS 
} from './mockData';
import { playEmergencyAlertSound } from './utils/sound';

import { Header } from './components/Header';
import { UrgentAlertBanner } from './components/UrgentAlertBanner';
import { HeroSection } from './components/HeroSection';
import { DonorDirectory } from './components/DonorDirectory';
import { UrgentRequestsFeed } from './components/UrgentRequestsFeed';
import { BloodBanksDirectory } from './components/BloodBanksDirectory';
import { CompatibilityGuide } from './components/CompatibilityGuide';
import { DonorRegistrationModal } from './components/DonorRegistrationModal';
import { UrgentRequestModal } from './components/UrgentRequestModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'find' | 'urgent' | 'banks' | 'compatibility'>('find');

  // Search filter states
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('All Locations');
  const [smartCompatibility, setSmartCompatibility] = useState<boolean>(true);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Active toast notification
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Donors state with LocalStorage persistence
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem('pulselink_donors');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DONORS;
  });

  // Urgent Requests state with LocalStorage persistence
  const [urgentRequests, setUrgentRequests] = useState<UrgentRequest[]>(() => {
    try {
      const saved = localStorage.getItem('pulselink_urgent_requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_URGENT_REQUESTS;
  });

  // Blood Banks
  const [bloodBanks] = useState<BloodBank[]>(INITIAL_BLOOD_BANKS);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Urgent O- Request in Chennai',
      message: 'Apollo Speciality Hospitals urgently needs 3 units of O-negative for cardiac bypass surgery.',
      bloodGroup: 'O-',
      hospital: 'Apollo Speciality Hospitals',
      city: 'Chennai',
      timestamp: '25m ago',
      requestId: 'req-1',
      read: false,
      type: 'urgent_request'
    },
    {
      id: 'notif-2',
      title: 'Donor Pledged in Bengaluru',
      message: 'Rajesh Nair pledged 1 unit for Baby Aaradhya at Manipal Hospital.',
      bloodGroup: 'B-',
      hospital: 'Manipal Hospital',
      city: 'Bengaluru',
      timestamp: '35m ago',
      requestId: 'req-2',
      read: false,
      type: 'donor_pledge'
    }
  ]);

  // Persist donors to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pulselink_donors', JSON.stringify(donors));
    } catch (e) {
      console.warn('Could not save donors to localStorage:', e);
    }
  }, [donors]);

  // Persist urgent requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pulselink_urgent_requests', JSON.stringify(urgentRequests));
    } catch (e) {
      console.warn('Could not save urgent requests to localStorage:', e);
    }
  }, [urgentRequests]);

  // Helper to trigger a new notification
  const triggerNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);

    if (soundEnabled) {
      playEmergencyAlertSound();
    }

    // Auto dismiss toast after 6s
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotif.id ? null : current);
    }, 6000);
  };

  // Donor Registration Handler
  const handleRegisterDonor = (newDonorData: Omit<Donor, 'id' | 'donationsCount' | 'verified'>) => {
    const newDonor: Donor = {
      ...newDonorData,
      id: `donor-${Date.now()}`,
      donationsCount: 1,
      verified: true
    };

    setDonors(prev => [newDonor, ...prev]);

    triggerNotification({
      title: 'New Volunteer Donor Registered',
      message: `${newDonor.name} (${newDonor.bloodGroup}) registered in ${newDonor.area}, ${newDonor.city}.`,
      bloodGroup: newDonor.bloodGroup,
      city: newDonor.city,
      type: 'general'
    });
  };

  // Urgent Request Submission Handler
  const handleSubmitUrgentRequest = (requestData: Omit<UrgentRequest, 'id' | 'createdAt' | 'unitsPledged' | 'status' | 'pledges'>) => {
    const newRequest: UrgentRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      unitsPledged: 0,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      pledges: []
    };

    setUrgentRequests(prev => [newRequest, ...prev]);
    setActiveTab('urgent');

    triggerNotification({
      title: `Emergency: ${newRequest.bloodGroup} Needed Urgently`,
      message: `${newRequest.unitsNeeded} units needed for ${newRequest.patientName} at ${newRequest.hospital}, ${newRequest.city}.`,
      bloodGroup: newRequest.bloodGroup,
      hospital: newRequest.hospital,
      city: newRequest.city,
      requestId: newRequest.id,
      type: 'urgent_request'
    });
  };

  // Pledge to request handler
  const handlePledgeToRequest = (requestId: string, donorName: string, phone: string, units: number) => {
    setUrgentRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedPledges = [
          ...req.pledges,
          { donorName, phone, units, pledgedAt: 'Just now' }
        ];
        const newPledgedCount = req.unitsPledged + units;
        const newStatus = newPledgedCount >= req.unitsNeeded ? 'FULFILLED' : 'IN_PROGRESS';

        triggerNotification({
          title: `Pledge Received for ${req.bloodGroup} Request`,
          message: `${donorName} pledged ${units} unit(s) for ${req.patientName} at ${req.hospital}.`,
          bloodGroup: req.bloodGroup,
          hospital: req.hospital,
          city: req.city,
          requestId: req.id,
          type: 'donor_pledge'
        });

        return {
          ...req,
          unitsPledged: newPledgedCount,
          status: newStatus,
          pledges: updatedPledges
        };
      }
      return req;
    }));
  };

  // Mark request as fulfilled
  const handleFulfillRequest = (requestId: string) => {
    setUrgentRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'FULFILLED', unitsPledged: req.unitsNeeded };
      }
      return req;
    }));
  };

  // Direct alert to donor handler
  const handleSendDirectAlert = (donor: Donor) => {
    triggerNotification({
      title: `Emergency Alert Dispatched to ${donor.name}`,
      message: `Emergency SMS and push dispatch ping sent to ${donor.name} (${donor.bloodGroup}) in ${donor.city}.`,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      type: 'general'
    });
  };

  // Simulate real-time urgent broadcast
  const handleSimulateUrgentRequest = () => {
    const simulationPool = [
      {
        patientName: 'Kavita Menon (Emergency C-Section)',
        bloodGroup: 'O-' as BloodGroup,
        unitsNeeded: 2,
        hospital: 'Fortis Malar Hospital, Gandhi Nagar',
        city: 'Chennai',
        area: 'Adyar',
        urgency: 'Critical (Under 1 hr)' as const,
        contactPerson: 'Dr. Srinivasan (OB-GYN)',
        contactPhone: '+91 98401 55667',
        caseDetails: 'Postpartum hemorrhage during emergency cesarean delivery. Negative Rh crossmatch required urgently.'
      },
      {
        patientName: 'Kiran Verma (Road Trauma)',
        bloodGroup: 'B-' as BloodGroup,
        unitsNeeded: 3,
        hospital: 'St. John’s Medical College Hospital',
        city: 'Bengaluru',
        area: 'Koramangala',
        urgency: 'Critical (Under 1 hr)' as const,
        contactPerson: 'Aditya (Paramedic)',
        contactPhone: '+91 98450 77889',
        caseDetails: 'Multiple pelvic fractures from highway accident. Fresh whole blood requested by trauma theater.'
      },
      {
        patientName: 'Deepak Saxena (Cardiac ICU)',
        bloodGroup: 'AB-' as BloodGroup,
        unitsNeeded: 2,
        hospital: 'Care Hospitals, Road No. 1',
        city: 'Hyderabad',
        area: 'Banjara Hills',
        urgency: 'Urgent (Under 4 hrs)' as const,
        contactPerson: 'Ramesh (Attendant)',
        contactPhone: '+91 98492 44332',
        caseDetails: 'Aortic aneurysm repair. AB-negative units urgently requested.'
      }
    ];

    const randomCase = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    handleSubmitUrgentRequest(randomCase);
  };

  // Jump to specific request from notification or banner
  const handleSelectRequest = (req: UrgentRequest) => {
    setActiveTab('urgent');
    // Scroll smoothly to feed
    setTimeout(() => {
      document.getElementById('urgent-feed')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Jump from compatibility guide to donor search
  const handleSelectGroupAndSearch = (group: BloodGroup) => {
    setSelectedBloodGroup(group);
    setSmartCompatibility(true);
    setActiveTab('find');
    setTimeout(() => {
      document.getElementById('find-donors')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleExecuteSearch = () => {
    setActiveTab('find');
    setTimeout(() => {
      document.getElementById('find-donors')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const openUrgentRequestsCount = urgentRequests.filter(r => r.status !== 'FULFILLED').length;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        urgentCount={openUrgentRequestsCount}
      />

      {/* Emergency Alert Banner */}
      <UrgentAlertBanner
        urgentRequests={urgentRequests}
        onSelectRequest={handleSelectRequest}
        onSimulateUrgentRequest={handleSimulateUrgentRequest}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          selectedBloodGroup={selectedBloodGroup}
          setSelectedBloodGroup={setSelectedBloodGroup}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          smartCompatibility={smartCompatibility}
          setSmartCompatibility={setSmartCompatibility}
          onExecuteSearch={handleExecuteSearch}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
          totalDonors={donors.length}
          totalRequests={openUrgentRequestsCount}
        />

        {/* View Content based on activeTab */}
        {activeTab === 'find' && (
          <DonorDirectory
            donors={donors}
            selectedBloodGroup={selectedBloodGroup}
            setSelectedBloodGroup={setSelectedBloodGroup}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            smartCompatibility={smartCompatibility}
            setSmartCompatibility={setSmartCompatibility}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
            onSendDirectAlert={handleSendDirectAlert}
          />
        )}

        {activeTab === 'urgent' && (
          <UrgentRequestsFeed
            requests={urgentRequests}
            onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
            onPledgeToRequest={handlePledgeToRequest}
            onFulfillRequest={handleFulfillRequest}
          />
        )}

        {activeTab === 'banks' && (
          <BloodBanksDirectory
            bloodBanks={bloodBanks}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityGuide
            onSelectGroupAndSearch={handleSelectGroupAndSearch}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <DonorRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterDonor={handleRegisterDonor}
      />

      <UrgentRequestModal
        isOpen={isUrgentModalOpen}
        onClose={() => setIsUrgentModalOpen(false)}
        onSubmitRequest={handleSubmitUrgentRequest}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onSelectNotification={(notif) => {
          if (notif.requestId) {
            const req = urgentRequests.find(r => r.id === notif.requestId);
            if (req) handleSelectRequest(req);
          }
          setIsNotificationDrawerOpen(false);
        }}
      />

      <NotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onView={(notif) => {
          if (notif.requestId) {
            const req = urgentRequests.find(r => r.id === notif.requestId);
            if (req) handleSelectRequest(req);
          } else {
            setActiveTab('find');
          }
          setActiveToast(null);
        }}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
      />
    </div>
  );
}
