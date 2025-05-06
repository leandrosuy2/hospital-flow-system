
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Patient, Queue, QueueItem } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Dados mockados para pacientes em fila de triagem
const mockTriageQueue: QueueItem[] = [
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
];

// Filas destino após triagem
const mockDestinationQueues: Queue[] = [
  {
    id: '2',
    name: 'Consultas PS',
    description: 'Fila de consultas do Pronto-Socorro',
    departmentId: '1',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Triagem Clínica',
    description: 'Fila de triagem da Clínica Médica',
    departmentId: '2',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

// Componente para prioridade
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

const Triage = () => {
  const [triageQueue, setTriageQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [destinationQueues, setDestinationQueues] = useState<Queue[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  
  // Dados da triagem
  const [triageData, setTriageData] = useState({
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    painLevel: '',
    weight: '',
    height: '',
    chiefComplaint: '',
    notes: '',
  });

  useEffect(() => {
    const fetchTriageQueue = async () => {
      try {
        // Simulando chamada de API
        setTimeout(() => {
          setTriageQueue(mockTriageQueue);
          setDestinationQueues(mockDestinationQueues);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar fila de triagem:', error);
        toast.error('Erro ao carregar fila de triagem');
        setLoading(false);
      }
    };

    fetchTriageQueue();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTriageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSaveTriage = () => {
    // Validar campos obrigatórios
    if (
      !triageData.temperature ||
      !triageData.bloodPressureSystolic ||
      !triageData.bloodPressureDiastolic ||
      !triageData.heartRate ||
      !triageData.chiefComplaint
    ) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!selectedQueue) {
      toast.error('Selecione uma fila de destino');
      return;
    }

    toast.success('Triagem salva com sucesso!');
    
    // Resetar formulário
    setSelectedPatient(null);
    setTriageData({
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      painLevel: '',
      weight: '',
      height: '',
      chiefComplaint: '',
      notes: '',
    });
    setSelectedQueue('');
  };

  const handleCancelTriage = () => {
    setSelectedPatient(null);
    setTriageData({
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      painLevel: '',
      weight: '',
      height: '',
      chiefComplaint: '',
      notes: '',
    });
    setSelectedQueue('');
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
      <div>
        <h1 className="text-3xl font-bold text-hospital-dark">Triagem</h1>
        <p className="text-muted-foreground">Avaliação inicial de pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pacientes Aguardando</CardTitle>
            <CardDescription>
              {triageQueue.length} paciente(s) na fila de triagem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {triageQueue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Não há pacientes aguardando triagem.
              </div>
            ) : (
              triageQueue.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {item.patient?.firstName} {item.patient?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.patient?.documentNumber}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <PriorityBadge priority={item.metadata.priority} />
                          <span className="text-xs text-muted-foreground">
                            Desde {item.metadata.waitingSince}
                          </span>
                        </div>
                        <p className="text-sm mt-2 font-medium">Motivo:</p>
                        <p className="text-sm">{item.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="bg-muted p-2 flex justify-end">
                    <Button 
                      onClick={() => item.patient && handleSelectPatient(item.patient)}
                      variant="outline"
                      size="sm"
                      className="w-full border-hospital-primary text-hospital-primary hover:bg-hospital-light"
                    >
                      Realizar Triagem
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedPatient
                ? `Triagem de ${selectedPatient.firstName} ${selectedPatient.lastName}`
                : 'Formulário de Triagem'}
            </CardTitle>
            <CardDescription>
              {selectedPatient
                ? `Documento: ${selectedPatient.documentNumber}`
                : 'Selecione um paciente da fila'}
            </CardDescription>
          </CardHeader>
          
          {selectedPatient ? (
            <>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Informações do Paciente</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Data de Nascimento:</p>
                      <p>{new Date(selectedPatient.birthDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telefone:</p>
                      <p>{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Histórico Médico:</p>
                      <p>{selectedPatient.medicalHistory || 'Nenhum'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alergias:</p>
                      <p>{selectedPatient.allergies || 'Nenhuma'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Medicamentos:</p>
                      <p>{selectedPatient.medications || 'Nenhum'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contato de Emergência:</p>
                      <p>{selectedPatient.emergencyContact || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="vitals" className="w-full">
                  <TabsList>
                    <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
                    <TabsTrigger value="assessment">Avaliação</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="vitals">
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="temperature" className="hospital-form-label">
                            Temperatura (°C) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="temperature"
                            name="temperature"
                            value={triageData.temperature}
                            onChange={handleInputChange}
                            placeholder="36.5"
                            type="number"
                            step="0.1"
                            min="30"
                            max="45"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="hospital-form-label">
                            Pressão Arterial (mmHg) <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              name="bloodPressureSystolic"
                              value={triageData.bloodPressureSystolic}
                              onChange={handleInputChange}
                              placeholder="120"
                              type="number"
                              min="50"
                              max="250"
                              required
                            />
                            <span className="flex items-center">/</span>
                            <Input
                              name="bloodPressureDiastolic"
                              value={triageData.bloodPressureDiastolic}
                              onChange={handleInputChange}
                              placeholder="80"
                              type="number"
                              min="30"
                              max="150"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="heartRate" className="hospital-form-label">
                            Frequência Cardíaca (bpm) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="heartRate"
                            name="heartRate"
                            value={triageData.heartRate}
                            onChange={handleInputChange}
                            placeholder="80"
                            type="number"
                            min="30"
                            max="220"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="respiratoryRate" className="hospital-form-label">
                            Frequência Respiratória (/min)
                          </Label>
                          <Input
                            id="respiratoryRate"
                            name="respiratoryRate"
                            value={triageData.respiratoryRate}
                            onChange={handleInputChange}
                            placeholder="16"
                            type="number"
                            min="8"
                            max="60"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="oxygenSaturation" className="hospital-form-label">
                            Saturação O² (%)
                          </Label>
                          <Input
                            id="oxygenSaturation"
                            name="oxygenSaturation"
                            value={triageData.oxygenSaturation}
                            onChange={handleInputChange}
                            placeholder="98"
                            type="number"
                            min="50"
                            max="100"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="painLevel" className="hospital-form-label">
                            Nível de Dor (0-10)
                          </Label>
                          <Input
                            id="painLevel"
                            name="painLevel"
                            value={triageData.painLevel}
                            onChange={handleInputChange}
                            placeholder="5"
                            type="number"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weight" className="hospital-form-label">
                            Peso (kg)
                          </Label>
                          <Input
                            id="weight"
                            name="weight"
                            value={triageData.weight}
                            onChange={handleInputChange}
                            placeholder="70"
                            type="number"
                            step="0.1"
                            min="0"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="height" className="hospital-form-label">
                            Altura (cm)
                          </Label>
                          <Input
                            id="height"
                            name="height"
                            value={triageData.height}
                            onChange={handleInputChange}
                            placeholder="170"
                            type="number"
                            min="0"
                            max="250"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assessment">
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="chiefComplaint" className="hospital-form-label">
                          Queixa Principal <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="chiefComplaint"
                          name="chiefComplaint"
                          value={triageData.chiefComplaint}
                          onChange={handleInputChange}
                          placeholder="Descreva a queixa principal do paciente"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="hospital-form-label">
                          Observações Adicionais
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={triageData.notes}
                          onChange={handleInputChange}
                          placeholder="Observações adicionais sobre a condição do paciente"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Encaminhar para</h3>
                  <Select 
                    value={selectedQueue} 
                    onValueChange={setSelectedQueue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fila" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationQueues.map(queue => (
                        <SelectItem key={queue.id} value={queue.id}>
                          {queue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between space-x-2 border-t pt-5">
                <Button 
                  variant="outline" 
                  onClick={handleCancelTriage}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveTriage}
                  className="bg-hospital-primary hover:bg-hospital-primary/90"
                >
                  Salvar e Encaminhar
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground">
                    <path d="M16 2H8a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z"></path>
                    <path d="M9 11h6"></path>
                    <path d="M12 8v6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Nenhum paciente selecionado</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Selecione um paciente da lista de espera para realizar a triagem
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Triage;
