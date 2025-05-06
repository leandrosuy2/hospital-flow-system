import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientCreate from "./pages/PatientCreate";
import PatientEdit from "./pages/PatientEdit";
import PatientView from "./pages/PatientView";
import Queues from "./pages/Queues";
import QueueManagement from "./pages/QueueManagement";
import Triage from "./pages/Triage";
import Departments from "./pages/Departments";
import NotFound from "./pages/NotFound";
import Consultations from "./pages/Consultations";
import ConsultationView from "@/pages/ConsultationView";
import ConsultationEdit from "@/pages/ConsultationEdit";
import ConsultationNew from "@/pages/ConsultationNew";
import Scheduling from './pages/Scheduling';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import CallPanel from './pages/CallPanel';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rota do painel de chamadas (sem layout padrão) */}
            <Route path="/painel" element={<CallPanel />} />
            
            {/* Rotas protegidas dentro do layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/new" element={<PatientCreate />} />
              <Route path="/patients/:id" element={<PatientView />} />
              <Route path="/patients/:id/edit" element={<PatientEdit />} />
              <Route path="/queues" element={<Queues />} />
              <Route path="/queue-management" element={<QueueManagement />} />
              <Route path="/triage" element={<Triage />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/consultations/new" element={<ConsultationNew />} />
              <Route path="/consultations/:id" element={<ConsultationView />} />
              <Route path="/consultations/:id/edit" element={<ConsultationEdit />} />
              <Route path="/scheduling" element={<Scheduling />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Rota de fallback para qualquer outra URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
