import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Consultation } from '@/types';
import { getAllConsultations } from '@/services/consultationService';
import { ConsultationStatusBadge } from '@/components/ConsultationStatusBadge';
import { Plus, ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';
import { toast } from 'sonner';

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

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Scheduling = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    const loadConsultations = () => {
      const consultationsData = getAllConsultations();
      setConsultations(consultationsData);
      setLoading(false);
    };

    loadConsultations();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getConsultationsForDay = (date: Date) => {
    return consultations.filter(consultation => {
      const consultationDate = new Date(consultation.date);
      return consultationDate.getDate() === date.getDate() &&
             consultationDate.getMonth() === date.getMonth() &&
             consultationDate.getFullYear() === date.getFullYear();
    });
  };

  const getConsultationsForWeek = (date: Date) => {
    const weekDays = getWeekDays(date);
    return weekDays.map(day => ({
      date: day,
      consultations: getConsultationsForDay(day)
    }));
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hospital-dark">Agendamento</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleToday}
            className="hover:bg-muted"
          >
            Hoje
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              onClick={() => setViewMode('month')}
              className="hover:bg-muted"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Mês
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              onClick={() => setViewMode('week')}
              className="hover:bg-muted"
            >
              <List className="h-4 w-4 mr-2" />
              Semana
            </Button>
          </div>
          <Button
            onClick={() => navigate('/consultations/new')}
            className="bg-hospital-primary hover:bg-hospital-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {viewMode === 'month' 
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `${formatDate(weekDays[0].toISOString())} - ${formatDate(weekDays[6].toISOString())}`
              }
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPeriod}
                className="hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPeriod}
                className="hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'month' ? (
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-32" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayConsultations = getConsultationsForDay(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div
                    key={day}
                    className={`min-h-32 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                      isToday ? 'bg-hospital-primary/5' : ''
                    }`}
                    onClick={() => {
                      navigate('/consultations/new', { state: { date: date.toISOString() } });
                    }}
                  >
                    <div className={`font-medium mb-1 ${isToday ? 'text-hospital-primary' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="text-xs p-1 rounded bg-hospital-primary/10 hover:bg-hospital-primary/20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/consultations/${consultation.id}`);
                          }}
                        >
                          <div className="font-medium truncate">{consultation.patientName}</div>
                          <div className="text-muted-foreground truncate">
                            {formatTime(consultation.date)}
                          </div>
                          <ConsultationStatusBadge status={consultation.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date) => {
                const dayConsultations = getConsultationsForDay(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`min-h-[600px] p-2 border rounded-lg ${
                      isToday ? 'bg-hospital-primary/5' : ''
                    }`}
                  >
                    <div className={`font-medium mb-2 ${isToday ? 'text-hospital-primary' : ''}`}>
                      {date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div className="space-y-1">
                      {dayConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="text-xs p-2 rounded bg-hospital-primary/10 hover:bg-hospital-primary/20 cursor-pointer"
                          onClick={() => navigate(`/consultations/${consultation.id}`)}
                        >
                          <div className="font-medium truncate">{consultation.patientName}</div>
                          <div className="text-muted-foreground truncate">
                            {formatTime(consultation.date)}
                          </div>
                          <ConsultationStatusBadge status={consultation.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduling; 