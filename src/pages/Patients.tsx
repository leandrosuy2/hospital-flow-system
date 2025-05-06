
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Patient, PatientStatus } from '@/types';
import { toast } from 'sonner';

// Dados mockados dos pacientes
const mockPatients: Patient[] = [
  {
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
  {
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
    status: 'IN_TRIAGE',
    createdAt: '2023-10-05T15:45:00.000Z',
    updatedAt: '2023-10-05T16:30:00.000Z',
  },
  {
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
    status: 'WAITING_CONSULTATION',
    createdAt: '2023-10-06T09:15:00.000Z',
    updatedAt: '2023-10-06T10:30:00.000Z',
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Pereira',
    documentNumber: '444.555.666-77',
    phone: '+5511933333333',
    email: 'ana.pereira@email.com',
    birthDate: '1985-11-25',
    address: 'Rua Oscar Freire, 300',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01426-000',
    emergencyContact: 'Paulo Pereira, +5511922222222',
    medicalHistory: 'Enxaqueca crônica',
    allergies: 'Nenhuma conhecida',
    medications: 'Sumatriptano',
    status: 'IN_CONSULTATION',
    createdAt: '2023-10-06T11:00:00.000Z',
    updatedAt: '2023-10-06T11:45:00.000Z',
  },
  {
    id: '5',
    firstName: 'Paulo',
    lastName: 'Ferreira',
    documentNumber: '777.888.999-00',
    phone: '+5511911111111',
    email: 'paulo.ferreira@email.com',
    birthDate: '1970-07-03',
    address: 'Alameda Santos, 700',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01418-100',
    emergencyContact: 'Mariana Ferreira, +5511900000000',
    medicalHistory: 'Arritmia cardíaca',
    allergies: 'Frutos do mar',
    medications: 'Propranolol',
    status: 'COMPLETED',
    createdAt: '2023-10-06T14:20:00.000Z',
    updatedAt: '2023-10-06T16:00:00.000Z',
  }
];

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

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Simulando chamada de API
        setTimeout(() => {
          setPatients(mockPatients);
          setFilteredPatients(mockPatients);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        toast.error('Erro ao carregar lista de pacientes');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    let result = patients;
    
    // Filtrar por status se não for "ALL"
    if (statusFilter !== 'ALL') {
      result = result.filter(patient => patient.status === statusFilter);
    }
    
    // Filtrar pelo termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        patient => 
          patient.firstName.toLowerCase().includes(term) || 
          patient.lastName.toLowerCase().includes(term) || 
          patient.documentNumber.toLowerCase().includes(term) ||
          patient.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredPatients(result);
  }, [searchTerm, statusFilter, patients]);

  const handleAddPatient = () => {
    toast.info('Função para adicionar novo paciente');
    // navigate('/patients/new');
  };

  const handleViewPatient = (id: string) => {
    toast.info(`Visualizando paciente ${id}`);
    // navigate(`/patients/${id}`);
  };

  const handleEditPatient = (id: string) => {
    toast.info(`Editando paciente ${id}`);
    // navigate(`/patients/${id}/edit`);
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
          <h1 className="text-3xl font-bold text-hospital-dark">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie os pacientes do sistema</p>
        </div>
        <Button 
          onClick={handleAddPatient}
          className="bg-hospital-primary hover:bg-hospital-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} paciente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PatientStatus | 'ALL')}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hospital-primary focus:border-transparent"
            >
              <option value="ALL">Todos os status</option>
              <option value="REGISTERED">Registrado</option>
              <option value="WAITING_TRIAGE">Aguardando Triagem</option>
              <option value="IN_TRIAGE">Em Triagem</option>
              <option value="WAITING_CONSULTATION">Aguardando Consulta</option>
              <option value="IN_CONSULTATION">Em Consulta</option>
              <option value="COMPLETED">Finalizado</option>
            </select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Nascimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Cadastrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum paciente encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.documentNumber}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={patient.status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(patient.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPatient(patient.id)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPatient(patient.id)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando <b>{filteredPatients.length}</b> de <b>{patients.length}</b> pacientes
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próxima
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Patients;
