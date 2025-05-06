import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Consultation, ConsultationStatus } from '@/types';
import { ConsultationStatusBadge } from '@/components/ConsultationStatusBadge';
import {
  getAllConsultations,
  deleteConsultation
} from '@/services/consultationService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const Consultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'ALL'>('ALL');
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadConsultations = () => {
    try {
      const consultationData = getAllConsultations();
      setConsultations(consultationData);
      setFilteredConsultations(consultationData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    let result = consultations;
    
    if (statusFilter !== 'ALL') {
      result = result.filter(consultation => consultation.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        consultation => 
          consultation.patientName.toLowerCase().includes(term) || 
          consultation.doctorName.toLowerCase().includes(term)
      );
    }
    
    setFilteredConsultations(result);
  }, [searchTerm, statusFilter, consultations]);

  const handleAddConsultation = () => {
    navigate('/consultations/new');
  };

  const handleViewConsultation = (id: string) => {
    navigate(`/consultations/${id}`);
  };

  const handleEditConsultation = (id: string) => {
    navigate(`/consultations/${id}/edit`);
  };

  const handleDeleteConsultation = (id: string) => {
    if (deleteConsultation(id)) {
      loadConsultations();
      setConsultationToDelete(null);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-hospital-dark">Consultas</h1>
          <p className="text-muted-foreground">Gerencie as consultas médicas</p>
        </div>
        <Button
          onClick={handleAddConsultation}
          className="bg-hospital-primary hover:bg-hospital-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Lista de Consultas</CardTitle>
          <CardDescription>
            {filteredConsultations.length} consulta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar consulta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ConsultationStatus | 'ALL')}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hospital-primary focus:border-transparent"
            >
              <option value="ALL">Todos os status</option>
              <option value="SCHEDULED">Agendada</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluída</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-semibold">Paciente</TableHead>
                  <TableHead className="font-semibold">Médico</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Não há consultas agendadas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{consultation.patientName}</TableCell>
                      <TableCell>{consultation.doctorName}</TableCell>
                      <TableCell>{formatDate(consultation.date)}</TableCell>
                      <TableCell>
                        <ConsultationStatusBadge status={consultation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => handleViewConsultation(consultation.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleEditConsultation(consultation.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-amber-50"
                          >
                            <Edit className="h-4 w-4 text-amber-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Consulta</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteConsultation(String(consultation.id))}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consultations; 