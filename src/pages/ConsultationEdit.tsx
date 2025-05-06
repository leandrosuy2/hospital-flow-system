import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Consultation, ConsultationStatus } from '@/types';
import { getConsultationById, saveConsultation } from '@/services/consultationService';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ConsultationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Consultation>>({
    patientName: '',
    doctorName: '',
    date: '',
    notes: '',
    status: 'SCHEDULED'
  });

  useEffect(() => {
    const loadConsultation = () => {
      if (!id) return;
      
      const consultationData = getConsultationById(id);
      if (consultationData) {
        setFormData({
          ...consultationData,
          date: new Date(consultationData.date).toISOString().slice(0, 16)
        });
      } else {
        toast.error('Consulta não encontrada');
        navigate('/consultations');
      }
      setLoading(false);
    };

    loadConsultation();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.patientName || !formData.doctorName || !formData.date) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const consultationData: Consultation = {
        id: id || Date.now().toString(),
        patientId: formData.patientId || '',
        patientName: formData.patientName,
        doctorId: formData.doctorId || '',
        doctorName: formData.doctorName,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes,
        status: formData.status as ConsultationStatus,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (saveConsultation(consultationData)) {
        toast.success('Consulta atualizada com sucesso!');
        navigate(`/consultations/${id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      toast.error('Erro ao salvar consulta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/consultations')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-hospital-dark">Editar Consulta</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Paciente *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorName">Médico *</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data e Hora *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ConsultationStatus })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="SCHEDULED">Agendada</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="COMPLETED">Concluída</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/consultations')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-hospital-primary hover:bg-hospital-primary/90"
                disabled={saving}
              >
                {saving ? <Spinner className="mr-2" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ConsultationEdit; 