export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  area: string;
  phone: string;
  email: string;
  lastDonationDate: string; // ISO date or 'Never'
  isAvailable: boolean;
  availableForEmergencyCall: boolean;
  verified: boolean;
  donationsCount: number;
  weightKg?: number;
  notes?: string;
  avatarUrl?: string;
}

export interface UrgentRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsPledged: number;
  hospital: string;
  city: string;
  area: string;
  urgency: 'Critical (Under 1 hr)' | 'Urgent (Under 4 hrs)' | 'Priority (Today)';
  contactPerson: string;
  contactPhone: string;
  caseDetails: string;
  createdAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';
  pledges: Array<{
    donorName: string;
    phone: string;
    units: number;
    pledgedAt: string;
  }>;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  emergencyHelpline: string;
  operatingHours: string;
  stock: Record<BloodGroup, number>;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  bloodGroup?: BloodGroup;
  hospital?: string;
  city?: string;
  timestamp: string;
  requestId?: string;
  read: boolean;
  type: 'urgent_request' | 'donor_pledge' | 'match_found' | 'general';
}

// Blood compatibility matrix
export const COMPATIBLE_DONORS_FOR_RECIPIENT: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Can only receive from O-
};

export const CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'] // Recipient only for AB+
};

export const ALL_BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const POPULAR_CITIES = [
  'All Locations',
  'Chennai',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'Delhi NCR',
  'Kolkata',
  'Pune',
  'Coimbatore'
];
