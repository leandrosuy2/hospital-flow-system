
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hospital-accent">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto bg-hospital-primary rounded-full w-16 h-16 flex items-center justify-center mb-6">
          <Hospital className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-hospital-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            A página <span className="font-mono text-hospital-primary">{location.pathname}</span> não existe ou foi movida.
          </p>
        </div>
        
        <Button asChild className="bg-hospital-primary hover:bg-hospital-primary/90">
          <Link to="/dashboard">
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
