import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Save, Building2, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    hospital: {
      name: 'Hospital Exemplo',
      address: 'Rua Exemplo, 123',
      phone: '(11) 1234-5678',
      email: 'contato@hospital.com',
      cnpj: '12.345.678/0001-90',
      workingHours: '08:00 - 18:00'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      queueUpdates: true,
      systemAlerts: true
    },
    security: {
      sessionTimeout: 30,
      requirePasswordChange: true,
      passwordExpirationDays: 90,
      twoFactorAuth: false,
      loginAttempts: 3
    },
    appearance: {
      theme: 'light',
      primaryColor: '#2563eb',
      fontSize: 'medium',
      compactMode: false
    }
  });

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hospital-dark">Configurações</h1>
        <Button
          onClick={handleSave}
          className="bg-hospital-primary hover:bg-hospital-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="hospital" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hospital" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Hospital
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospital">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Hospital</CardTitle>
              <CardDescription>
                Configure as informações básicas do hospital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Nome do Hospital</Label>
                  <Input
                    id="hospitalName"
                    value={settings.hospital.name}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hospital: { ...settings.hospital, name: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalCNPJ">CNPJ</Label>
                  <Input
                    id="hospitalCNPJ"
                    value={settings.hospital.cnpj}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hospital: { ...settings.hospital, cnpj: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalAddress">Endereço</Label>
                <Input
                  id="hospitalAddress"
                  value={settings.hospital.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hospital: { ...settings.hospital, address: e.target.value }
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalPhone">Telefone</Label>
                  <Input
                    id="hospitalPhone"
                    value={settings.hospital.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hospital: { ...settings.hospital, phone: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalEmail">Email</Label>
                  <Input
                    id="hospitalEmail"
                    type="email"
                    value={settings.hospital.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hospital: { ...settings.hospital, email: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                <Input
                  id="workingHours"
                  value={settings.hospital.workingHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hospital: { ...settings.hospital, workingHours: e.target.value }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie as preferências de notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações importantes por email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailNotifications: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes e atualizações por SMS
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        smsNotifications: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Consulta</Label>
                  <p className="text-sm text-muted-foreground">
                    Envie lembretes automáticos de consultas
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.appointmentReminders}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        appointmentReminders: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Tempo de Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alteração de Senha Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir alteração de senha no primeiro acesso
                  </p>
                </div>
                <Switch
                  checked={settings.security.requirePasswordChange}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        requirePasswordChange: checked
                      }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiration">Expiração de Senha (dias)</Label>
                <Input
                  id="passwordExpiration"
                  type="number"
                  value={settings.security.passwordExpirationDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordExpirationDays: parseInt(e.target.value)
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <select
                  id="theme"
                  className="w-full p-2 border rounded-md"
                  value={settings.appearance.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        theme: e.target.value
                      }
                    })
                  }
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                <select
                  id="fontSize"
                  className="w-full p-2 border rounded-md"
                  value={settings.appearance.fontSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        fontSize: e.target.value
                      }
                    })
                  }
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Compacto</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduz o espaçamento entre elementos
                  </p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        compactMode: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 