import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllConsultations } from '@/services/consultationService';
import { getAllPatients } from '@/services/patientService';
import { getQueues } from '@/services/queueService';
import { Consultation, Patient, Queue, PatientStatus } from '@/types';
import { Download, BarChart2, PieChart, LineChart, Calendar, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [period, setPeriod] = useState('week');
  const [reportType, setReportType] = useState('consultations');

  useEffect(() => {
    const loadData = () => {
      try {
        const consultationsData = getAllConsultations();
        const patientsData = getAllPatients();
        const queuesData = getQueues();

        setConsultations(consultationsData);
        setPatients(patientsData);
        setQueues(queuesData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados para relatórios');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return {
      consultations: consultations.filter(c => new Date(c.date) >= startDate),
      patients: patients.filter(p => new Date(p.createdAt) >= startDate),
      queues: queues.filter(q => new Date(q.createdAt) >= startDate)
    };
  };

  const getConsultationStats = () => {
    const filteredData = getFilteredData();
    const stats = {
      total: filteredData.consultations.length,
      byStatus: [
        { name: 'Agendadas', value: filteredData.consultations.filter(c => c.status === 'SCHEDULED').length },
        { name: 'Em Andamento', value: filteredData.consultations.filter(c => c.status === 'IN_PROGRESS').length },
        { name: 'Concluídas', value: filteredData.consultations.filter(c => c.status === 'COMPLETED').length },
        { name: 'Canceladas', value: filteredData.consultations.filter(c => c.status === 'CANCELLED').length }
      ],
      byDay: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          count: filteredData.consultations.filter(c => 
            new Date(c.date).toLocaleDateString('pt-BR', { weekday: 'short' }) === 
            date.toLocaleDateString('pt-BR', { weekday: 'short' })
          ).length
        };
      }).reverse()
    };

    return stats;
  };

  const getPatientStats = () => {
    const filteredData = getFilteredData();
    const stats = {
      total: filteredData.patients.length,
      byStatus: [
        { name: 'Ativos', value: filteredData.patients.filter(p => p.status === 'ACTIVE' as PatientStatus).length },
        { name: 'Inativos', value: filteredData.patients.filter(p => p.status === 'INACTIVE' as PatientStatus).length }
      ],
      byMonth: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          count: filteredData.patients.filter(p => 
            new Date(p.createdAt).toLocaleDateString('pt-BR', { month: 'short' }) === 
            date.toLocaleDateString('pt-BR', { month: 'short' })
          ).length
        };
      }).reverse()
    };

    return stats;
  };

  const getQueueStats = () => {
    const filteredData = getFilteredData();
    const stats = {
      total: filteredData.queues.length,
      byStatus: [
        { name: 'Aguardando', value: filteredData.queues.filter(q => q.isActive).length },
        { name: 'Inativas', value: filteredData.queues.filter(q => !q.isActive).length }
      ],
      byHour: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        count: filteredData.queues.filter(q => new Date(q.createdAt).getHours() === i).length
      }))
    };

    return stats;
  };

  const handleExport = () => {
    const data = {
      period,
      reportType,
      data: getFilteredData()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${reportType}-${period}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Relatório exportado com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const consultationStats = getConsultationStats();
  const patientStats = getPatientStats();
  const queueStats = getQueueStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hospital-dark">Relatórios</h1>
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultations">Consultas</SelectItem>
              <SelectItem value="patients">Pacientes</SelectItem>
              <SelectItem value="queues">Filas</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExport}
            className="bg-hospital-primary hover:bg-hospital-primary/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultas */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-hospital-primary/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Total de Consultas</h3>
                  <p className="text-3xl font-bold text-hospital-primary">{consultationStats.total}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Por Status</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={consultationStats.byStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {consultationStats.byStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Consultas por Dia</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={consultationStats.byDay}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                        name="Consultas" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-hospital-primary/10 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total de Pacientes</h3>
                <p className="text-3xl font-bold text-hospital-primary">{patientStats.total}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição por Status</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={patientStats.byStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {patientStats.byStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Filas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-hospital-primary/10 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total de Filas</h3>
                <p className="text-3xl font-bold text-hospital-primary">{queueStats.total}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição por Hora</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={queueStats.byHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Filas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports; 