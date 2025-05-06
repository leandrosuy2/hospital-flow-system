
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, AuthResponse } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se já existe um usuário na sessão
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simular autenticação com a API
      // Em produção, isso seria uma chamada real à API
      if (email === 'admin@hospital.com' && password === 'admin123') {
        const mockResponse: AuthResponse = {
          access_token: 'mock_token_123',
          user: {
            id: '1',
            email: 'admin@hospital.com',
            firstName: 'Admin',
            lastName: 'Sistema',
            role: 'ADMIN'
          }
        };
        
        localStorage.setItem('token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        setUser(mockResponse.user);
        toast.success('Login realizado com sucesso!');
        return true;
      } else if (email === 'enfermeiro@hospital.com' && password === 'enf123') {
        const mockResponse: AuthResponse = {
          access_token: 'mock_token_456',
          user: {
            id: '2',
            email: 'enfermeiro@hospital.com',
            firstName: 'Carlos',
            lastName: 'Enfermeiro',
            role: 'NURSE'
          }
        };
        
        localStorage.setItem('token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        setUser(mockResponse.user);
        toast.success('Login realizado com sucesso!');
        return true;
      } else if (email === 'recepcao@hospital.com' && password === 'rec123') {
        const mockResponse: AuthResponse = {
          access_token: 'mock_token_789',
          user: {
            id: '3',
            email: 'recepcao@hospital.com',
            firstName: 'Maria',
            lastName: 'Recepcionista',
            role: 'RECEPTIONIST'
          }
        };
        
        localStorage.setItem('token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        setUser(mockResponse.user);
        toast.success('Login realizado com sucesso!');
        return true;
      } else if (email === 'medico@hospital.com' && password === 'med123') {
        const mockResponse: AuthResponse = {
          access_token: 'mock_token_012',
          user: {
            id: '4',
            email: 'medico@hospital.com',
            firstName: 'João',
            lastName: 'Médico',
            role: 'DOCTOR'
          }
        };
        
        localStorage.setItem('token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        setUser(mockResponse.user);
        toast.success('Login realizado com sucesso!');
        return true;
      }
      
      toast.error('Credenciais inválidas');
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao realizar login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Você saiu do sistema');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
