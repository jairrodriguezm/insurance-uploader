"use client";

import { useEffect, useState, useRef } from "react";
import { getJobStatus } from "@/lib/api";
import {
  Loader2,
  BrainCircuit,
  FileCheck2,
  TableProperties,
  UploadCloud,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

interface JobProgressProps {
  jobId: string;
  processId: string;
  filesCount: number;
  onSuccess: (downloadUrl: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function JobProgress({
  jobId,
  processId,
  filesCount,
  onSuccess,
  onError,
  onCancel,
}: JobProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const isPollingRef = useRef<boolean>(true);

  // Pasos secuenciales del pipeline
  const steps = [
    {
      id: 1,
      title: "Archivos recibidos",
      desc: `${filesCount} cotizaciones cargadas exitosamente`,
      icon: UploadCloud,
    },
    {
      id: 2,
      title: "Extracción automatizada con IA",
      desc: "Analizando coberturas, deducibles y primas",
      icon: BrainCircuit,
    },
    {
      id: 3,
      title: "Consolidación de catálogo",
      desc: "Mapeando matriz técnica y calculando recomendaciones",
      icon: TableProperties,
    },
    {
      id: 4,
      title: "Generación de documento Word",
      desc: "Renderizando plantilla institucional con membrete y logos",
      icon: FileText,
    },
    {
      id: 5,
      title: "Almacenamiento en nube",
      desc: "Publicando archivo en Supabase Storage",
      icon: FileCheck2,
    },
  ];

  // Contador de tiempo transcurrido
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Avanzar estéticamente el paso visual según el tiempo esperado
        if (next >= 4 && next < 14) setCurrentStep(2);
        else if (next >= 14 && next < 22) setCurrentStep(3);
        else if (next >= 22 && next < 30) setCurrentStep(4);
        else if (next >= 30) setCurrentStep(5);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Polling de estado contra la API
  useEffect(() => {
    isPollingRef.current = true;

    const poll = async () => {
      if (!isPollingRef.current) return;

      try {
        const statusData = await getJobStatus(jobId);

        if (statusData.status === "completed" && statusData.download_url) {
          isPollingRef.current = false;
          setCurrentStep(5);
          onSuccess(statusData.download_url);
        } else if (statusData.status === "failed") {
          isPollingRef.current = false;
          onError(statusData.error || "El trabajo falló durante la ejecución en el backend");
        }
      } catch (err: unknown) {
        // En caso de error de red momentáneo, seguir intentando salvo que sea recurrente
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Error en polling:", msg);
      }
    };

    // Consultar cada 2.5 segundos
    const interval = setInterval(poll, 2500);

    return () => {
      isPollingRef.current = false;
      clearInterval(interval);
    };
  }, [jobId, onSuccess, onError]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ""}${s}s`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Encabezado del progreso */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-corporate-50 border border-corporate-200/60 px-3 py-1 rounded-full text-xs font-semibold text-corporate-700">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-corporate-600" />
          <span>Procesando Comparativo en Segundo Plano</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Analizando y comparando ofertas
        </h2>
        <p className="text-xs text-slate-500">
          Proceso: <span className="font-semibold text-slate-700">{processId}</span> • ID Job:{" "}
          <span className="font-mono text-slate-600">{jobId.slice(0, 8)}</span>
        </p>
      </div>

      {/* Stepper visual */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-3.5 rounded-2xl transition-all ${
                isCurrent
                  ? "bg-corporate-50 border border-corporate-200/80 shadow-sm"
                  : isDone
                  ? "bg-slate-50/60 opacity-80"
                  : "opacity-40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  isDone
                    ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                    : isCurrent
                    ? "bg-corporate-600 text-white shadow-md shadow-corporate-600/30"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-corporate-900"
                      : isDone
                      ? "text-slate-700"
                      : "text-slate-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de pie con tiempo y botón para abortar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Tiempo transcurrido: {formatTime(elapsedSeconds)}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            isPollingRef.current = false;
            onCancel();
          }}
          className="text-slate-400 hover:text-slate-600 font-medium transition"
        >
          Cancelar vista
        </button>
      </div>
    </div>
  );
}
