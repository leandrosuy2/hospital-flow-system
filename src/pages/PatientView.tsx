
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById } from '@/services/patientService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Patient, PatientStatus } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

// Componente para mapear o status para um Badge com cor apropriada
const StatusBadge = ({ status }: { status: PatientStatus }) => {
  switch (status) {
    case 'REGISTERED':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Registrado</Badge>;
    case 'WAITING_TRIAGE':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Aguardando Triagem</Badge>;
    case 'IN_TRIAGE':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Em Triagem</Badge>;
    case 'WAITING_CONSULTATION':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Aguardando Consulta</Badge>;
    case 'IN_CONSULTATION':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Em Consulta</Badge>;
    case 'COMPLETED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Finalizado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-hospital-dark">
            Detalhes do Paciente
          </h1>
        </div>
        <Button 
          onClick={() => navigate(`/patients/${id}/edit`)}
          variant="outline"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between">
            <CardTitle className="text-2xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <StatusBadge status={patient.status} />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Documento</h3>
                <p className="text-base">{patient.documentNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                <p className="text-base">{formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-base">{patient.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                <p className="text-base">{patient.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contato de Emergência</h3>
                <p className="text-base">{patient.emergencyContact || "Não informado"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                <p className="text-base">{patient.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cidade/Estado</h3>
                <p className="text-base">{patient.city} - {patient.state}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CEP</h3>
                <p className="text-base">{patient.zipCode}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cadastrado em</h3>
                <p className="text-base">{formatDate(patient.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Última atualização</h3>
                <p className="text-base">{formatDate(patient.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium border-b pb-2">Histórico Médico</h3>
              <p className="mt-2 whitespace-pre-wrap">{patient.medicalHistory || "Nenhum histórico médico registrado"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium border-b pb-2">Alergias</h3>
              <p className="mt-2 whitespace-pre-wrap">{patient.allergies || "Nenhuma alergia registrada"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium border-b pb-2">Medicamentos</h3>
              <p className="mt-2 whitespace-pre-wrap">{patient.medications || "Nenhum medicamento registrado"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/patients')}
          >
            Voltar para Lista
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientView;
