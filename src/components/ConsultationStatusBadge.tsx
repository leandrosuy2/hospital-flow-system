import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ConsultationStatus } from '@/types';

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus;
}

export const ConsultationStatusBadge: React.FC<ConsultationStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'SCHEDULED':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agendada</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Em Andamento</Badge>;
    case 'COMPLETED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
    case 'CANCELLED':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
}; 