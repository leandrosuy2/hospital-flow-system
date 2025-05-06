import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Consultation } from '@/types';
import { getConsultationById } from '@/services/consultationService';
import { ConsultationStatusBadge } from '@/components/ConsultationStatusBadge';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const ConsultationView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsultation = () => {
      if (!id) return;
      
      const consultationData = getConsultationById(id);
      if (consultationData) {
        setConsultation(consultationData);
      } else {
        toast.error('Consulta não encontrada');
        navigate('/consultations');
      }
      setLoading(false);
    };

    loadConsultation();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/consultations')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-hospital-dark">Detalhes da Consulta</h1>
        </div>
        <Button
          onClick={() => navigate(`/consultations/${id}/edit`)}
          className="bg-hospital-primary hover:bg-hospital-primary/90"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Consulta
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Paciente</h3>
                <p className="text-lg">{consultation.patientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Médico</h3>
                <p className="text-lg">{consultation.doctorName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
                <p className="text-lg">{formatDate(consultation.date)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="mt-1">
                  <ConsultationStatusBadge status={consultation.status} />
                </div>
              </div>
            </div>

            {consultation.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
                <p className="mt-1 text-lg whitespace-pre-wrap">{consultation.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Criação</h3>
                <p className="text-sm">{formatDate(consultation.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Última Atualização</h3>
                <p className="text-sm">{formatDate(consultation.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationView; 