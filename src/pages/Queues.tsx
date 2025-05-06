import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Queue, QueueItem, Patient } from '@/types';
import { toast } from 'sonner';

import { 
  getQueues,
  getQueueById,
  getQueueItemsByQueueId,
  updateQueueItemStatus,
  addPatientToQueue,
  deleteQueueItem
} from '@/services/queueService';

import { getAllPatients } from '@/services/patientService';

// Componente para renderizar o status do item na fila
const QueueItemStatusBadge = ({ status }: { status: QueueItem['status'] }) => {
  switch (status) {
    case 'WAITING':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Aguardando</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Em Atendimento</Badge>;
    case 'COMPLETED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
    case 'CANCELED':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

// Componente para renderizar a prioridade
const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'alta':
      return <Badge className="bg-red-500">Alta</Badge>;
    case 'média':
      return <Badge className="bg-orange-500">Média</Badge>;
    case 'baixa':
      return <Badge className="bg-green-500">Baixa</Badge>;
    default:
      return <Badge className="bg-blue-500">Normal</Badge>;
  }
};

const Queues = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQueueId = queryParams.get('id') || '';

  const [queues, setQueues] = useState<Queue[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQueueId, setCurrentQueueId] = useState<string>('');

  // Estado para o diálogo de adicionar paciente
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  const [addPatientForm, setAddPatientForm] = useState({
    patientId: '',
    priority: 'normal',
    notes: ''
  });

  useEffect(() => {
    fetchQueues();
  }, [initialQueueId]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const fetchedQueues = getQueues();
      
      if (fetchedQueues.length > 0) {
        let queueId = initialQueueId || fetchedQueues[0].id;
        setCurrentQueueId(queueId);
        
        // Buscar itens da fila atual
        const fetchedQueueItems = getQueueItemsByQueueId(queueId);
        setQueueItems(fetchedQueueItems);
        setQueues(fetchedQueues);
      }
    } catch (error) {
      console.error('Erro ao buscar filas:', error);
      toast.error('Erro ao carregar filas');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeQueue = (queueId: string) => {
    setCurrentQueueId(queueId);
    navigate(`/queues?id=${queueId}`);
    
    try {
      const fetchedQueueItems = getQueueItemsByQueueId(queueId);
      setQueueItems(fetchedQueueItems);
    } catch (error) {
      console.error('Erro ao buscar itens da fila:', error);
      toast.error('Erro ao carregar pacientes da fila');
    }
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleStartService = (itemId: string) => {
    try {
      updateQueueItemStatus(itemId, 'IN_PROGRESS');
      toast.info('Atendimento iniciado');
      
      // Atualizar a lista de itens
      const updatedQueueItems = getQueueItemsByQueueId(currentQueueId);
      setQueueItems(updatedQueueItems);
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      toast.error('Erro ao iniciar atendimento');
    }
  };

  const handleCompleteService = (itemId: string) => {
    try {
      updateQueueItemStatus(itemId, 'COMPLETED');
      toast.success('Atendimento concluído');
      
      // Atualizar a lista de itens
      const updatedQueueItems = getQueueItemsByQueueId(currentQueueId);
      setQueueItems(updatedQueueItems);
    } catch (error) {
      console.error('Erro ao concluir atendimento:', error);
      toast.error('Erro ao concluir atendimento');
    }
  };

  const handleCancelService = (itemId: string) => {
    try {
      updateQueueItemStatus(itemId, 'CANCELED');
      toast.error('Atendimento cancelado');
      
      // Atualizar a lista de itens
      const updatedQueueItems = getQueueItemsByQueueId(currentQueueId);
      setQueueItems(updatedQueueItems);
    } catch (error) {
      console.error('Erro ao cancelar atendimento:', error);
      toast.error('Erro ao cancelar atendimento');
    }
  };

  const handleRemoveFromQueue = (itemId: string) => {
    if (window.confirm('Tem certeza que deseja remover este paciente da fila?')) {
      try {
        deleteQueueItem(itemId);
        toast.success('Paciente removido da fila');
        
        // Atualizar a lista de itens
        const updatedQueueItems = getQueueItemsByQueueId(currentQueueId);
        setQueueItems(updatedQueueItems);
      } catch (error) {
        console.error('Erro ao remover paciente da fila:', error);
        toast.error('Erro ao remover paciente da fila');
      }
    }
  };

  const handleOpenAddDialog = () => {
    try {
      // Buscar pacientes disponíveis
      const allPatients = getAllPatients();
      
      // Filtrar pacientes que já estão na fila atual
      const patientsInQueue = new Set(queueItems.map(item => item.patientId));
      const availablePats = allPatients.filter(patient => !patientsInQueue.has(patient.id));
      
      setAvailablePatients(availablePats);
      setAddPatientForm({
        patientId: availablePats.length > 0 ? availablePats[0].id : '',
        priority: 'normal',
        notes: ''
      });
      
      setIsAddDialogOpen(true);
    } catch (error) {
      console.error('Erro ao preparar diálogo:', error);
      toast.error('Erro ao preparar adição de paciente');
    }
  };

  const handleAddPatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddPatientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatientSelectChange = (name: string, value: string) => {
    setAddPatientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { patientId, priority, notes } = addPatientForm;
      
      if (!patientId) {
        toast.error('Selecione um paciente');
        return;
      }
      
      addPatientToQueue(currentQueueId, patientId, priority, notes);
      
      toast.success('Paciente adicionado à fila');
      setIsAddDialogOpen(false);
      
      // Atualizar a lista de itens
      const updatedQueueItems = getQueueItemsByQueueId(currentQueueId);
      setQueueItems(updatedQueueItems);
    } catch (error) {
      console.error('Erro ao adicionar paciente à fila:', error);
      toast.error('Erro ao adicionar paciente à fila');
    }
  };

  const handleManageQueues = () => {
    navigate('/queue-management');
  };

  const filteredQueueItems = queueItems;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hospital-dark">Filas</h1>
          <p className="text-muted-foreground">Gerenciamento de filas de atendimento</p>
        </div>
        <Button onClick={handleManageQueues}>
          Gerenciar Filas
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Filas Ativas</CardTitle>
          <CardDescription>
            Selecione uma fila para visualizar os pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queues.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma fila encontrada.</p>
              <Button onClick={handleManageQueues}>
                Criar nova fila
              </Button>
            </div>
          ) : (
            <Tabs 
              value={currentQueueId} 
              onValueChange={handleChangeQueue}
              className="w-full"
            >
              <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap">
                {queues.map((queue) => (
                  <TabsTrigger 
                    key={queue.id} 
                    value={queue.id}
                    className="whitespace-nowrap"
                  >
                    {queue.name}
                    <Badge variant="outline" className="ml-2">
                      {queueItems.filter(item => item.queueId === queue.id).length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {queues.map((queue) => (
                <TabsContent key={queue.id} value={queue.id}>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{queue.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {queue.description} - {queue.department?.name}
                      </p>
                    </div>
                    <Button
                      onClick={handleOpenAddDialog}
                      variant="outline"
                      className="border-hospital-primary text-hospital-primary hover:bg-hospital-light"
                    >
                      Adicionar Paciente
                    </Button>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Posição</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Aguardando desde</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQueueItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Não há pacientes nesta fila.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredQueueItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-bold">{item.position}</TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {item.patient?.firstName} {item.patient?.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.patient?.documentNumber}
                                </div>
                              </TableCell>
                              <TableCell>
                                <PriorityBadge priority={item.metadata.priority} />
                              </TableCell>
                              <TableCell>{item.metadata.waitingSince}</TableCell>
                              <TableCell>
                                <QueueItemStatusBadge status={item.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewPatient(item.patientId)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  Visualizar
                                </Button>
                                {item.status === 'WAITING' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartService(item.id)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      Iniciar
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveFromQueue(item.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      Remover
                                    </Button>
                                  </>
                                )}
                                {item.status === 'IN_PROGRESS' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCompleteService(item.id)}
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      Concluir
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCancelService(item.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                )}
                                {(item.status === 'COMPLETED' || item.status === 'CANCELED') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFromQueue(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    Remover
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Total: <b>{filteredQueueItems.length}</b> paciente(s) 
                      | Aguardando: <b>{filteredQueueItems.filter(item => item.status === 'WAITING').length}</b>
                      | Em Atendimento: <b>{filteredQueueItems.filter(item => item.status === 'IN_PROGRESS').length}</b>
                      | Concluídos: <b>{filteredQueueItems.filter(item => item.status === 'COMPLETED').length}</b>
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center w-full justify-between bg-muted/50 p-3 rounded-md">
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500 h-2 w-2 p-2 flex items-center justify-center" />
              <span className="text-sm">Alta Prioridade</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-orange-500 h-2 w-2 p-2 flex items-center justify-center" />
              <span className="text-sm">Média Prioridade</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500 h-2 w-2 p-2 flex items-center justify-center" />
              <span className="text-sm">Prioridade Normal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500 h-2 w-2 p-2 flex items-center justify-center" />
              <span className="text-sm">Baixa Prioridade</span>
            </div>
          </div>
          
          <div className="self-start text-xs text-muted-foreground italic">
            As filas são atualizadas automaticamente ao realizar ações.
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Adicionar Paciente à Fila</DialogTitle>
            <DialogDescription>
              Selecione um paciente e defina a prioridade.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPatientSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">
                  Paciente
                </Label>
                {availablePatients.length > 0 ? (
                  <Select 
                    value={addPatientForm.patientId}
                    onValueChange={(value) => handleAddPatientSelectChange('patientId', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.documentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="col-span-3 text-muted-foreground">
                    Não há pacientes disponíveis para adicionar à fila.
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Prioridade
                </Label>
                <Select 
                  value={addPatientForm.priority}
                  onValueChange={(value) => handleAddPatientSelectChange('priority', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={addPatientForm.notes}
                  onChange={handleAddPatientInputChange}
                  placeholder="Observações sobre o paciente"
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={availablePatients.length === 0}>
                Adicionar à Fila
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Queues;
