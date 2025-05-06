import { Consultation } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'consultations';

export const getAllConsultations = (): Consultation[] => {
  try {
    const consultations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return consultations;
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    toast.error('Erro ao carregar lista de consultas');
    return [];
  }
};

export const getConsultationById = (id: string): Consultation | null => {
  try {
    const consultations = getAllConsultations();
    return consultations.find(consultation => consultation.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    toast.error('Erro ao carregar dados da consulta');
    return null;
  }
};

export const saveConsultation = (consultation: Consultation): boolean => {
  try {
    const consultations = getAllConsultations();
    const existingIndex = consultations.findIndex(c => c.id === consultation.id);

    if (existingIndex >= 0) {
      consultations[existingIndex] = {
        ...consultation,
        updatedAt: new Date().toISOString()
      };
    } else {
      consultations.push({
        ...consultation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
    toast.success(existingIndex >= 0 ? 'Consulta atualizada com sucesso!' : 'Consulta agendada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
    toast.error('Erro ao salvar consulta');
    return false;
  }
};

export const deleteConsultation = (id: string): boolean => {
  try {
    const consultations = getAllConsultations();
    const filteredConsultations = consultations.filter(consultation => consultation.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConsultations));
    toast.success('Consulta excluída com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao excluir consulta:', error);
    toast.error('Erro ao excluir consulta');
    return false;
  }
}; 