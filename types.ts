export interface Reading {
  id: number;
  userId: number;
  date: string; // YYYY-MM-DD
  timeOfDay: 'Morning' | 'Evening';
  readingNumber: 1 | 2;
  systolic: number;
  diastolic: number;
  pulse: number;
  notes?: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  password?: string;
}

export enum BPCategory {
    Normal = 'Normal',
    Elevated = 'Elevated',
    Hypertension1 = 'Hypertension Stage 1',
    Hypertension2 = 'Hypertension Stage 2',
    HypertensiveCrisis = 'Hypertensive Crisis',
}