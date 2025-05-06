
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '@/components/patient/PatientForm';
import { createPatient } from '@/services/patientService';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const PatientCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      createPatient(data);
      navigate('/patients');
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      toast.error('Erro ao criar paciente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <PatientForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default PatientCreate;
