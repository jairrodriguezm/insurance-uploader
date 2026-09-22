"use client";

import { useEffect, useState } from "react";
import { checkApiHealth, getApiBaseUrl } from "@/lib/api";
import { Shield, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function Header() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const apiUrl = getApiBaseUrl();

  const verifyHealth = async () => {
    setChecking(true);
    try {
      await checkApiHealth();
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    verifyHealth();
    // Re-verificar cada 45 segundos
    const interval = setInterval(verifyHealth, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-corporate-600 text-white border-b border-corporate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo y Nombre */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  COTIZADOR DE SEGUROS
                </span>
              </div>
              <p className="text-xs text-corporate-200 font-medium">
                Comparativo y Consolidación Automatizada de Pólizas
              </p>
            </div>
          </div>

          {/* Enlaces y Estado de la API */}
          <div className="flex items-center space-x-4">
            {/* Estado API */}
            <div className="hidden sm:flex items-center space-x-2 bg-corporate-700/60 px-3 py-1.5 rounded-lg border border-corporate-500/40 text-xs">
              <span className="text-corporate-200">Servicio Nube:</span>
              {checking ? (
                <span className="flex items-center text-corporate-300">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Verificando...
                </span>
              ) : isOnline ? (
                <span className="flex items-center text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> En Línea
                </span>
              ) : (
                <span className="flex items-center text-amber-300 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Desconectado
                </span>
              )}
            </div>

            {/* Link a Documentación Swagger */}
            <a
              href={`${apiUrl}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-corporate-200 hover:text-white flex items-center space-x-1 px-2.5 py-1.5 rounded-md hover:bg-corporate-700 transition"
              title="Abrir Swagger API Docs"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
