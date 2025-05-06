import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Bell, Clock, Stethoscope } from 'lucide-react';

interface Call {
  id: string;
  patientName: string;
  room: string;
  professional: string;
  timestamp: string;
  status: 'current' | 'previous';
}

const CallPanel = () => {
  const [loading, setLoading] = useState(true);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [previousCalls, setPreviousCalls] = useState<Call[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualizar o relógio a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockCurrentCall: Call = {
        id: '1',
        patientName: 'Maria Silva',
        room: 'Consultório 3',
        professional: 'Dr. João Santos - Cardiologia',
        timestamp: new Date().toISOString(),
        status: 'current'
      };

      const mockPreviousCalls: Call[] = [
        {
          id: '2',
          patientName: 'José Oliveira',
          room: 'Consultório 1',
          professional: 'Dra. Ana Costa - Clínica Geral',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          status: 'previous'
        },
        {
          id: '3',
          patientName: 'Carlos Pereira',
          room: 'Consultório 2',
          professional: 'Dr. Pedro Lima - Ortopedia',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: 'previous'
        }
      ];

      setCurrentCall(mockCurrentCall);
      setPreviousCalls(mockPreviousCalls);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentCall) {
      // Tocar som de chamada
      const audio = new Audio('/notification.mp3');
      audio.play();
      setIsPlaying(true);

      // Parar o som após 5 segundos
      const timeout = setTimeout(() => {
        setIsPlaying(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [currentCall]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-hospital-primary/5 to-hospital-primary/10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-hospital-primary/5 to-hospital-primary/10 flex flex-col overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-hospital-primary to-hospital-primary/90 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Stethoscope className="h-10 w-10" />
            <h1 className="text-5xl font-bold tracking-tight">Painel de Chamadas</h1>
            <Badge variant="secondary" className="text-xl px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-white/20">
              Atendimento Médico
            </Badge>
          </div>
          <div className="flex items-center space-x-3 text-3xl bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
            <Clock className="h-8 w-8" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex-1 grid grid-cols-3 gap-8">
          {/* Chamada Atual */}
          <div className="col-span-2">
            {currentCall && (
              <Card className="h-full border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-hospital-primary/10 to-hospital-primary/5 p-8 border-b">
                  <CardTitle className="text-4xl text-center text-hospital-primary font-bold">
                    Paciente Chamado
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] flex flex-col justify-center items-center space-y-10 p-8">
                  <div className="text-8xl font-bold text-hospital-dark animate-fade-in tracking-tight">
                    {currentCall.patientName}
                  </div>
                  <div className="flex items-center space-x-4 text-5xl text-hospital-dark">
                    <span className="text-hospital-primary font-medium">Consultório:</span>
                    <span className="font-bold">{currentCall.room}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-4xl text-hospital-dark">
                    <span className="text-hospital-primary font-medium">Profissional:</span>
                    <span className="font-bold">{currentCall.professional}</span>
                  </div>
                  {isPlaying && (
                    <div className="flex items-center justify-center text-hospital-primary animate-pulse mt-8">
                      <Bell className="h-16 w-16 animate-bounce mr-4" />
                      <span className="text-4xl font-medium">Chamando...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chamadas Anteriores */}
          <div className="col-span-1">
            <Card className="h-full border-none shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-hospital-primary/10 to-hospital-primary/5 p-8 border-b">
                <CardTitle className="text-3xl text-hospital-primary font-bold">Chamados Anteriores</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] overflow-y-auto p-6">
                <div className="space-y-6">
                  {previousCalls.map((call) => (
                    <div
                      key={call.id}
                      className="bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300 shadow-sm"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl font-bold text-hospital-dark">
                            {call.patientName}
                          </div>
                          <Badge variant="secondary" className="text-xl px-4 py-2 bg-hospital-primary/10 text-hospital-primary font-medium">
                            {call.room}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl text-hospital-primary/80">
                            {call.professional}
                          </div>
                          <div className="text-lg text-hospital-primary/60 font-medium">
                            {formatTime(new Date(call.timestamp))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mensagem Final */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
          <p className="text-2xl text-hospital-primary font-medium">
            Por favor, dirija-se ao consultório indicado quando seu nome for exibido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallPanel; 