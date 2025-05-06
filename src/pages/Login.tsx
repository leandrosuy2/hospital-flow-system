
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hospital-accent">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto bg-hospital-primary rounded-full w-16 h-16 flex items-center justify-center">
              <Hospital className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-hospital-primary">Sistema Hospitalar</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="hospital-form-label">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="hospital-form-label">Senha</label>
                  <a href="#" className="text-xs text-hospital-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-hospital-primary hover:bg-hospital-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="sm" color="white" /> : 'Entrar'}
              </Button>
            </CardFooter>
          </form>
          <div className="p-4 bg-muted rounded-b-lg text-center text-sm border-t">
            <div className="text-gray-500 mb-2">Contas de demonstração:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-medium">Admin</div>
                <div>admin@hospital.com</div>
                <div>admin123</div>
              </div>
              <div>
                <div className="font-medium">Enfermeiro</div>
                <div>enfermeiro@hospital.com</div>
                <div>enf123</div>
              </div>
              <div className="mt-2">
                <div className="font-medium">Recepção</div>
                <div>recepcao@hospital.com</div>
                <div>rec123</div>
              </div>
              <div className="mt-2">
                <div className="font-medium">Médico</div>
                <div>medico@hospital.com</div>
                <div>med123</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
