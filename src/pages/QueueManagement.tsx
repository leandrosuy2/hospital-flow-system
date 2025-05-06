
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Queue, Department } from '@/types';
import {
  getQueues,
  createQueue,
  updateQueue,
  deleteQueue,
  getDepartments,
} from '@/services/queueService';
import { toast } from 'sonner';

const QueueManagement = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const fetchedQueues = getQueues();
      const fetchedDepartments = getDepartments();
      
      setQueues(fetchedQueues);
      setDepartments(fetchedDepartments);
    } catch (error) {
      console.error('Erro ao buscar filas:', error);
      toast.error('Erro ao carregar filas');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      departmentId: '',
      isActive: true,
    });
    setEditingQueue(null);
  };

  const handleOpenDialog = (queue?: Queue) => {
    if (queue) {
      setEditingQueue(queue);
      setFormData({
        name: queue.name,
        description: queue.description,
        departmentId: queue.departmentId,
        isActive: queue.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingQueue) {
        updateQueue(editingQueue.id, formData);
        toast.success('Fila atualizada com sucesso!');
      } else {
        createQueue(formData);
        toast.success('Fila criada com sucesso!');
      }
      
      handleCloseDialog();
      fetchQueues();
    } catch (error) {
      console.error('Erro ao salvar fila:', error);
      toast.error('Erro ao salvar fila');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fila?')) {
      try {
        deleteQueue(id);
        toast.success('Fila excluída com sucesso!');
        fetchQueues();
      } catch (error) {
        console.error('Erro ao excluir fila:', error);
        toast.error('Erro ao excluir fila');
      }
    }
  };

  const handleViewItems = (queueId: string) => {
    navigate(`/queues?id=${queueId}`);
  };
  
  const filteredQueues = queues.filter(queue => {
    const searchLower = searchTerm.toLowerCase();
    return (
      queue.name.toLowerCase().includes(searchLower) ||
      queue.description.toLowerCase().includes(searchLower) ||
      queue.department?.name.toLowerCase().includes(searchLower)
    );
  });

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
        <h1 className="text-3xl font-bold text-hospital-dark">Gerenciamento de Filas</h1>
        <p className="text-muted-foreground">
          Crie, edite e gerencie filas de atendimento por departamento
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Filas</CardTitle>
            <CardDescription>
              Total de filas: {queues.length}
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>Nova Fila</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Pesquisar filas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhuma fila encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueues.map((queue) => (
                    <TableRow key={queue.id}>
                      <TableCell>
                        <div className="font-medium">{queue.name}</div>
                        <div className="text-sm text-muted-foreground">{queue.description}</div>
                      </TableCell>
                      <TableCell>{queue.department?.name}</TableCell>
                      <TableCell>
                        {queue.isActive ? (
                          <Badge className="bg-green-500">Ativa</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inativa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500"
                          onClick={() => handleViewItems(queue.id)}
                        >
                          Ver Pacientes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-500"
                          onClick={() => handleOpenDialog(queue)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDelete(queue.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Você pode criar novas filas, editar existentes ou excluí-las. Para gerenciar os pacientes em uma fila, clique em "Ver Pacientes".
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingQueue ? 'Editar Fila' : 'Nova Fila'}</DialogTitle>
            <DialogDescription>
              Preencha os campos para {editingQueue ? 'atualizar a' : 'criar uma nova'} fila.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Departamento
                </Label>
                <Select 
                  value={formData.departmentId}
                  onValueChange={(value) => handleSelectChange('departmentId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value) => handleSelectChange('isActive', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativa</SelectItem>
                    <SelectItem value="false">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueManagement;
