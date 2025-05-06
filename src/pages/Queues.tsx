
import React, { useState, useEffect } from 'react';
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
import { Queue, QueueItem, Department } from '@/types';
import { toast } from 'sonner';

// Dados mockados para departamentos
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Pronto-Socorro',
    description: 'Atendimento de emergência',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Clínica Médica',
    description: 'Atendimento clínico geral',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Pediatria',
    description: 'Atendimento para crianças',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

// Dados mockados para filas
const mockQueues: Queue[] = [
  {
    id: '1',
    name: 'Triagem PS',
    description: 'Fila de triagem do Pronto-Socorro',
    departmentId: '1',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    department: mockDepartments[0],
  },
  {
    id: '2',
    name: 'Consultas PS',
    description: 'Fila de consultas do Pronto-Socorro',
    departmentId: '1',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    department: mockDepartments[0],
  },
  {
    id: '3',
    name: 'Triagem Clínica',
    description: 'Fila de triagem da Clínica Médica',
    departmentId: '2',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    department: mockDepartments[1],
  },
  {
    id: '4',
    name: 'Consultas Pediatria',
    description: 'Fila de consultas da Pediatria',
    departmentId: '3',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    department: mockDepartments[2],
  },
];

// Dados mockados para itens de fila
const mockQueueItems: QueueItem[] = [
  {
    id: '1',
    patientId: '1',
    queueId: '1',
    position: 1,
    status: 'WAITING',
    notes: 'Febre alta',
    metadata: { priority: 'alta', waitingSince: '09:15' },
    createdAt: '2023-10-10T09:15:00.000Z',
    updatedAt: '2023-10-10T09:15:00.000Z',
    patient: {
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
      createdAt: '2023-10-05T14:30:00.000Z',
      updatedAt: '2023-10-05T14:30:00.000Z',
    },
  },
  {
    id: '2',
    patientId: '2',
    queueId: '1',
    position: 2,
    status: 'WAITING',
    notes: 'Dor abdominal',
    metadata: { priority: 'média', waitingSince: '09:30' },
    createdAt: '2023-10-10T09:30:00.000Z',
    updatedAt: '2023-10-10T09:30:00.000Z',
    patient: {
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
      status: 'WAITING_TRIAGE',
      createdAt: '2023-10-05T15:45:00.000Z',
      updatedAt: '2023-10-05T15:45:00.000Z',
    },
  },
  {
    id: '3',
    patientId: '3',
    queueId: '2',
    position: 1,
    status: 'IN_PROGRESS',
    notes: 'Consulta em andamento',
    metadata: { priority: 'normal', waitingSince: '10:00' },
    createdAt: '2023-10-10T10:00:00.000Z',
    updatedAt: '2023-10-10T10:15:00.000Z',
    patient: {
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
      status: 'IN_CONSULTATION',
      createdAt: '2023-10-06T09:15:00.000Z',
      updatedAt: '2023-10-06T10:30:00.000Z',
    },
  },
];

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
  const [queues, setQueues] = useState<Queue[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQueueId, setCurrentQueueId] = useState<string>('');

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        // Simulando chamada de API
        setTimeout(() => {
          setQueues(mockQueues);
          setQueueItems(mockQueueItems);
          setCurrentQueueId(mockQueues[0].id);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar filas:', error);
        toast.error('Erro ao carregar filas');
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const handleViewPatient = (patientId: string) => {
    toast.info(`Visualizando paciente ${patientId}`);
  };

  const handleStartService = (itemId: string) => {
    toast.info(`Iniciando atendimento para o item ${itemId}`);
  };

  const handleCompleteService = (itemId: string) => {
    toast.success(`Atendimento concluído para o item ${itemId}`);
  };

  const handleCancelService = (itemId: string) => {
    toast.error(`Atendimento cancelado para o item ${itemId}`);
  };

  const filteredQueueItems = queueItems.filter(item => item.queueId === currentQueueId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hospital-dark">Filas</h1>
        <p className="text-muted-foreground">Gerenciamento de filas de atendimento</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Filas Ativas</CardTitle>
          <CardDescription>
            Selecione uma fila para visualizar os pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={currentQueueId} 
            onValueChange={setCurrentQueueId}
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
                    {filteredQueueItems.length}
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
                    onClick={() => toast.info(`Adicionar paciente à fila ${queue.name}`)}
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartService(item.id)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  Iniciar
                                </Button>
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
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
            As filas são atualizadas automaticamente a cada 30 segundos.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Queues;
