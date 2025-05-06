
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Search } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Department } from '@/types';
import { toast } from 'sonner';

// Dados mockados de departamentos
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Pronto-Socorro',
    description: 'Atendimento de emergência para casos urgentes e críticos',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Clínica Médica',
    description: 'Atendimento ambulatorial e consultas de clínica geral',
    isActive: true,
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Pediatria',
    description: 'Atendimento especializado para crianças e adolescentes',
    isActive: true,
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Cardiologia',
    description: 'Diagnóstico e tratamento de doenças cardiovasculares',
    isActive: true,
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Ortopedia',
    description: 'Tratamento de problemas musculoesqueléticos e fraturas',
    isActive: true,
    createdAt: '2023-01-05T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z',
  },
  {
    id: '6',
    name: 'Neurologia',
    description: 'Diagnóstico e tratamento de doenças do sistema nervoso',
    isActive: false,
    createdAt: '2023-01-06T00:00:00.000Z',
    updatedAt: '2023-01-06T00:00:00.000Z',
  },
];

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Simulando chamada de API
        setTimeout(() => {
          setDepartments(mockDepartments);
          setFilteredDepartments(mockDepartments);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar departamentos:', error);
        toast.error('Erro ao carregar departamentos');
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    let result = [...departments];
    
    // Filtrar por status
    if (statusFilter === 'active') {
      result = result.filter(dept => dept.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter(dept => !dept.isActive);
    }
    
    // Filtrar pelo termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        dept =>
          dept.name.toLowerCase().includes(term) ||
          dept.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredDepartments(result);
  }, [searchTerm, statusFilter, departments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('O nome do departamento é obrigatório');
      return;
    }
    
    // Se estiver editando, atualiza o departamento existente
    if (editingDepartment) {
      const updatedDepartments = departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, ...formData, updatedAt: new Date().toISOString() }
          : dept
      );
      
      setDepartments(updatedDepartments);
      toast.success('Departamento atualizado com sucesso!');
    }
    // Senão, cria um novo departamento
    else {
      const newDepartment: Department = {
        id: `${Date.now()}`, // Usando timestamp como ID temporário
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setDepartments([...departments, newDepartment]);
      toast.success('Departamento criado com sucesso!');
    }
    
    // Limpar formulário e fechar diálogo
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      isActive: department.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingDepartment(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
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
          <h1 className="text-3xl font-bold text-hospital-dark">Departamentos</h1>
          <p className="text-muted-foreground">Gerencie os departamentos do hospital</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              className="bg-hospital-primary hover:bg-hospital-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? 'Atualize as informações do departamento abaixo.'
                  : 'Preencha os detalhes para criar um novo departamento.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="hospital-form-label">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do departamento"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="hospital-form-label">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do departamento"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive" className="hospital-form-label">
                    Departamento Ativo
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-hospital-primary hover:bg-hospital-primary/90">
                  {editingDepartment ? 'Salvar Alterações' : 'Criar Departamento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Lista de Departamentos</CardTitle>
          <CardDescription>
            {filteredDepartments.length} departamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hospital-primary focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum departamento encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">
                        {department.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {department.description}
                      </TableCell>
                      <TableCell>
                        {department.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(department.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          className="text-hospital-primary hover:text-hospital-primary/70 hover:bg-hospital-light"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
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

export default Departments;
