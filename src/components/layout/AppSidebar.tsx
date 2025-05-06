
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { 
  Hospital, 
  User, 
  Users, 
  Clipboard, 
  MessageCircle,
  ChartBar,
  Heart,
  Bed,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Menu itens filtrados baseado na role do usuário
  const getMenuItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Hospital,
        roles: ['ADMIN', 'RECEPTIONIST', 'NURSE', 'DOCTOR'],
      },
      {
        title: 'Pacientes',
        url: '/patients',
        icon: Users,
        roles: ['ADMIN', 'RECEPTIONIST', 'NURSE', 'DOCTOR'],
      },
      {
        title: 'Filas',
        url: '/queues',
        icon: Clipboard,
        roles: ['ADMIN', 'RECEPTIONIST', 'NURSE', 'DOCTOR'],
      },
      {
        title: 'Triagem',
        url: '/triage',
        icon: Heart,
        roles: ['ADMIN', 'NURSE'],
      },
      {
        title: 'Consultas',
        url: '/consultations',
        icon: MessageCircle,
        roles: ['ADMIN', 'DOCTOR'],
      },
      {
        title: 'Departamentos',
        url: '/departments',
        icon: Bed,
        roles: ['ADMIN'],
      },
      {
        title: 'Agendamento',
        url: '/scheduling',
        icon: Calendar,
        roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
      },
      {
        title: 'Relatórios',
        url: '/reports',
        icon: ChartBar,
        roles: ['ADMIN'],
      },
      {
        title: 'Usuários',
        url: '/users',
        icon: User,
        roles: ['ADMIN'],
      },
      {
        title: 'Configurações',
        url: '/settings',
        icon: Settings,
        roles: ['ADMIN'],
      },
    ];

    if (!user) return [];
    
    return baseItems.filter(item => item.roles.includes(user.role));
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <div className="flex items-center space-x-2 pl-2">
          <Hospital className="h-7 w-7 text-hospital-primary" />
          <div>
            <h1 className="text-lg font-bold text-hospital-primary">Hospital Flow</h1>
            <p className="text-xs text-muted-foreground">Gerenciamento Hospitalar</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-hospital-primary font-semibold">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.url) && "bg-hospital-light text-hospital-primary font-medium"
                  )}>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        {user && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-hospital-primary flex items-center justify-center text-white">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'ADMIN' ? 'Administrador' : 
                   user.role === 'NURSE' ? 'Enfermeiro(a)' : 
                   user.role === 'DOCTOR' ? 'Médico(a)' : 'Recepcionista'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="w-full border-hospital-primary text-hospital-primary hover:bg-hospital-light"
            >
              Sair
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
