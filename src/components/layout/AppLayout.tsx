
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';

export function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <div className="h-14 border-b flex items-center px-6 bg-white">
            <SidebarTrigger className="mr-4" />
          </div>
          <main className="flex-1 p-6 bg-hospital-accent overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
