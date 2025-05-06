
import { Patient, PatientStatus } from '@/types';
import { toast } from 'sonner';

// Dados mock iniciais
const initialPatients: Patient[] = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva',
    documentNumber: '123.456.789-00',
    phone: '+5511999999999',
    email: 'joao.silva@email.com',
    birthDate: '1980-05-15',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    emergencyContact: 'Maria Silva, +5511988888888',
    medicalHistory: 'Hipertensão',
    allergies: 'Penicilina',
    medications: 'Losartana',
    status: 'WAITING_TRIAGE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Santos',
    documentNumber: '987.654.321-00',
    phone: '+5511977777777',
    email: 'maria.santos@email.com',
    birthDate: '1975-08-22',
    address: 'Avenida Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    emergencyContact: 'José Santos, +5511966666666',
    medicalHistory: 'Diabetes tipo 2',
    allergies: 'Sulfas',
    medications: 'Metformina',
    status: 'IN_TRIAGE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Oliveira',
    documentNumber: '111.222.333-44',
    phone: '+5511955555555',
    email: 'carlos.oliveira@email.com',
    birthDate: '1990-03-10',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01305-000',
    emergencyContact: 'Ana Oliveira, +5511944444444',
    medicalHistory: 'Asma',
    allergies: 'Poeira, Ácaros',
    medications: 'Salbutamol',
    status: 'WAITING_CONSULTATION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Inicializar localStorage com os dados mock se ainda não existir
const initializePatients = (): void => {
  if (!localStorage.getItem('patients')) {
    localStorage.setItem('patients', JSON.stringify(initialPatients));
  }
};

// Obter todos os pacientes
export const getAllPatients = (): Patient[] => {
  initializePatients();
  return JSON.parse(localStorage.getItem('patients') || '[]');
};

// Obter paciente por ID
export const getPatientById = (id: string): Patient | undefined => {
  const patients = getAllPatients();
  return patients.find(patient => patient.id === id);
};

// Criar um novo paciente
export const createPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient => {
  const patients = getAllPatients();
  const now = new Date().toISOString();
  
  const newPatient: Patient = {
    ...patientData,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  
  localStorage.setItem('patients', JSON.stringify([...patients, newPatient]));
  toast.success('Paciente cadastrado com sucesso!');
  
  return newPatient;
};

// Atualizar um paciente existente
export const updatePatient = (id: string, patientData: Partial<Patient>): Patient | undefined => {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(patient => patient.id === id);
  
  if (patientIndex === -1) {
    toast.error('Paciente não encontrado');
    return undefined;
  }
  
  const updatedPatient: Patient = {
    ...patients[patientIndex],
    ...patientData,
    updatedAt: new Date().toISOString(),
  };
  
  patients[patientIndex] = updatedPatient;
  localStorage.setItem('patients', JSON.stringify(patients));
  toast.success('Paciente atualizado com sucesso!');
  
  return updatedPatient;
};

// Excluir um paciente
export const deletePatient = (id: string): boolean => {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(patient => patient.id === id);
  
  if (patientIndex === -1) {
    toast.error('Paciente não encontrado');
    return false;
  }
  
  patients.splice(patientIndex, 1);
  localStorage.setItem('patients', JSON.stringify(patients));
  toast.success('Paciente excluído com sucesso!');
  
  return true;
};

// Atualizar o status de um paciente
export const updatePatientStatus = (id: string, status: PatientStatus): Patient | undefined => {
  return updatePatient(id, { status });
};
