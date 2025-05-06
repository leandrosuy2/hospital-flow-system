
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientForm from '@/components/patient/PatientForm';
import { getPatientById, updatePatient } from '@/services/patientService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Patient } from '@/types';

const PatientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = () => {
      try {
        setIsFetching(true);
        const patientData = getPatientById(id);
        
        if (!patientData) {
          toast.error('Paciente não encontrado');
          navigate('/patients');
          return;
        }
        
        setPatient(patientData);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        toast.error('Erro ao carregar dados do paciente');
        navigate('/patients');
      } finally {
        setIsFetching(false);
      }
    };

    fetchPatient();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      updatePatient(id, data);
      navigate('/patients');
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      toast.error('Erro ao atualizar paciente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        {patient && (
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PatientEdit;
