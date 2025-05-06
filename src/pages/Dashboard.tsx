
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clipboard, 
  Heart, 
  MessageCircle,
  ChartBar,
  Clock,
  Bed,
  Check
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { DashboardOverview } from '@/types';
import { toast } from 'sonner';

const mockDashboardData: DashboardOverview = {
  totalPatients: 256,
  activePatients: 42,
  todayStats: {
    registered: 18,
    triaged: 15,
    consulted: 12,
    completed: 8,
  },
  departmentStats: {
    '1': {
      name: 'Pronto-Socorro',
      activePatients: 24,
      waiting: 15,
    },
    '2': {
      name: 'Clínica Médica',
      activePatients: 10,
      waiting: 5,
    },
    '3': {
      name: 'Pediatria',
      activePatients: 8,
      waiting: 4,
    }
  }
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulando API call
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => (prev + 1) % 60);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p>Não foi possível carregar os dados do dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hospital-dark">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema hospitalar</p>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Atualização automática em {60 - timeElapsed}s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pacientes</p>
                <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dashboardData.totalPatients}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-hospital-light flex items-center justify-center">
                <Users className="h-6 w-6 text-hospital-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pacientes Ativos</p>
                <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dashboardData.activePatients}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-hospital-light flex items-center justify-center">
                <Clipboard className="h-6 w-6 text-hospital-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Triagem</p>
                <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dashboardData.todayStats.triaged}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-hospital-light flex items-center justify-center">
                <Heart className="h-6 w-6 text-hospital-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Consulta</p>
                <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dashboardData.todayStats.consulted}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-hospital-light flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-hospital-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Estatísticas do Dia</CardTitle>
            <CardDescription>Visão geral das atividades de hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-hospital-primary mr-2"></div>
                    <span className="text-sm">Registrados</span>
                  </div>
                  <span className="font-medium">{dashboardData.todayStats.registered}</span>
                </div>
                <Progress value={(dashboardData.todayStats.registered / 30) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-hospital-secondary mr-2"></div>
                    <span className="text-sm">Triados</span>
                  </div>
                  <span className="font-medium">{dashboardData.todayStats.triaged}</span>
                </div>
                <Progress value={(dashboardData.todayStats.triaged / 30) * 100} className="h-2 bg-gray-200">
                  <div className="h-full bg-hospital-secondary rounded-full" />
                </Progress>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Consultados</span>
                  </div>
                  <span className="font-medium">{dashboardData.todayStats.consulted}</span>
                </div>
                <Progress value={(dashboardData.todayStats.consulted / 30) * 100} className="h-2 bg-gray-200">
                  <div className="h-full bg-amber-500 rounded-full" />
                </Progress>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Finalizados</span>
                  </div>
                  <span className="font-medium">{dashboardData.todayStats.completed}</span>
                </div>
                <Progress value={(dashboardData.todayStats.completed / 30) * 100} className="h-2 bg-gray-200">
                  <div className="h-full bg-green-500 rounded-full" />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas 5 atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Novo paciente registrado</span>
                  <span className="text-xs text-muted-foreground">Há 5 minutos</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Triagem concluída</span>
                  <span className="text-xs text-muted-foreground">Há 12 minutos</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded">
                  <Clipboard className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Paciente adicionado à fila</span>
                  <span className="text-xs text-muted-foreground">Há 18 minutos</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Consulta iniciada</span>
                  <span className="text-xs text-muted-foreground">Há 23 minutos</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded">
                  <Check className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Atendimento finalizado</span>
                  <span className="text-xs text-muted-foreground">Há 35 minutos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Departamentos</CardTitle>
            <CardDescription>Status de pacientes por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="mb-4">
                {Object.entries(dashboardData.departmentStats).map(([id, dept]) => (
                  <TabsTrigger key={id} value={id}>{dept.name}</TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(dashboardData.departmentStats).map(([id, dept]) => (
                <TabsContent key={id} value={id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pacientes Ativos</p>
                            <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dept.activePatients}</h3>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-hospital-light flex items-center justify-center">
                            <Users className="h-5 w-5 text-hospital-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Em Espera</p>
                            <h3 className="text-2xl font-bold text-hospital-primary mt-1">{dept.waiting}</h3>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-hospital-light flex items-center justify-center">
                            <Clock className="h-5 w-5 text-hospital-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Leitos</p>
                            <div className="flex items-center mt-1">
                              <h3 className="text-2xl font-bold text-hospital-primary">10/15</h3>
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">67%</Badge>
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-hospital-light flex items-center justify-center">
                            <Bed className="h-5 w-5 text-hospital-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Status de Atendimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tempo médio de espera</span>
                            <span className="font-medium">32 min</span>
                          </div>
                          <Progress value={53} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Eficiência de atendimento</span>
                            <span className="font-medium">76%</span>
                          </div>
                          <Progress value={76} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Taxa de ocupação</span>
                            <span className="font-medium">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
