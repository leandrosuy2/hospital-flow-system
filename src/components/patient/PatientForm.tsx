
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PatientStatus, Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

// Schema de validação para o formulário
const patientSchema = z.object({
  firstName: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres.',
  }),
  lastName: z.string().min(2, {
    message: 'Sobrenome deve ter pelo menos 2 caracteres.',
  }),
  documentNumber: z.string().min(5, {
    message: 'Documento inválido.',
  }),
  phone: z.string().min(8, {
    message: 'Telefone inválido.',
  }),
  email: z.string().email({
    message: 'Email inválido.',
  }),
  birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida.',
  }),
  address: z.string().min(5, {
    message: 'Endereço deve ter pelo menos 5 caracteres.',
  }),
  city: z.string().min(2, {
    message: 'Cidade deve ter pelo menos 2 caracteres.',
  }),
  state: z.string().min(2, {
    message: 'Estado deve ter pelo menos 2 caracteres.',
  }),
  zipCode: z.string().min(5, {
    message: 'CEP inválido.',
  }),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  status: z.enum(['REGISTERED', 'WAITING_TRIAGE', 'IN_TRIAGE', 'WAITING_CONSULTATION', 'IN_CONSULTATION', 'COMPLETED']),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormValues) => void;
  isLoading?: boolean;
}

export const PatientForm = ({ patient, onSubmit, isLoading = false }: PatientFormProps) => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<'create' | 'edit'>(patient ? 'edit' : 'create');

  // Configurar o formulário com os valores padrão
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      ...patient,
      birthDate: patient.birthDate.substring(0, 10) // Formatar para YYYY-MM-DD
    } : {
      firstName: '',
      lastName: '',
      documentNumber: '',
      phone: '',
      email: '',
      birthDate: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      medications: '',
      status: 'REGISTERED' as PatientStatus,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/patients')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-hospital-dark">
          {formType === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF*</FormLabel>
                  <FormControl>
                    <Input placeholder="123.456.789-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone*</FormLabel>
                  <FormControl>
                    <Input placeholder="+5511999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço*</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade*</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado*</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP*</FormLabel>
                  <FormControl>
                    <Input placeholder="01234-567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato de Emergência</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome, Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REGISTERED">Registrado</SelectItem>
                      <SelectItem value="WAITING_TRIAGE">Aguardando Triagem</SelectItem>
                      <SelectItem value="IN_TRIAGE">Em Triagem</SelectItem>
                      <SelectItem value="WAITING_CONSULTATION">Aguardando Consulta</SelectItem>
                      <SelectItem value="IN_CONSULTATION">Em Consulta</SelectItem>
                      <SelectItem value="COMPLETED">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Histórico Médico</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o histórico médico do paciente"
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste alergias conhecidas"
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste medicamentos em uso"
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/patients')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-hospital-primary hover:bg-hospital-primary/90"
            >
              {isLoading ? 'Salvando...' : formType === 'create' ? 'Cadastrar' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
