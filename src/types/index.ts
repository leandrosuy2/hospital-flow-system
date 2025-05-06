
export type Role = 'ADMIN' | 'RECEPTIONIST' | 'NURSE' | 'DOCTOR';

export type PatientStatus = 
  | 'REGISTERED' 
  | 'WAITING_TRIAGE' 
  | 'IN_TRIAGE' 
  | 'WAITING_CONSULTATION' 
  | 'IN_CONSULTATION' 
  | 'COMPLETED';

export type QueueItemStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Queue {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

export interface QueueItem {
  id: string;
  patientId: string;
  queueId: string;
  position: number;
  status: QueueItemStatus;
  notes: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  queue?: Queue;
}

export interface Triage {
  id: string;
  patientId: string;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painLevel: number;
  weight: number;
  height: number;
  chiefComplaint: string;
  notes: string;
  additionalVitals: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: User;
  prescriptions?: Prescription[];
}

export interface Prescription {
  id: string;
  consultationId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  totalPatients: number;
  activePatients: number;
  todayStats: {
    registered: number;
    triaged: number;
    consulted: number;
    completed: number;
  };
  departmentStats: Record<string, {
    name: string;
    activePatients: number;
    waiting: number;
  }>;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
}
