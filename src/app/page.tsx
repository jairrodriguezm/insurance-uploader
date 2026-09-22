"use client";

import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import { JobProgress } from "@/components/JobProgress";
import { JobSuccess } from "@/components/JobSuccess";
import { JobHistory } from "@/components/JobHistory";
import { createComparativeJob } from "@/lib/api";
import { ComparisonHistoryItem } from "@/types";
import { AlertCircle, RotateCcw, ShieldCheck, Zap } from "lucide-react";

type ViewState = "idle" | "uploading" | "processing" | "success" | "error";

const STORAGE_KEY = "mrc_comparative_history";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string>("");
  const [tomador, setTomador] = useState<string>("");
  const [filesCount, setFilesCount] = useState<number>(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);

  // Cargar historial de localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error al cargar historial:", e);
    }
  }, []);

  // Guardar en historial
  const saveToHistory = (url: string) => {
    const newItem: ComparisonHistoryItem = {
      id: jobId || Date.now().toString(),
      processId,
      tomador: tomador || undefined,
      createdAt: new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      fileNames,
      downloadUrl: url,
      status: "completed",
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((item) => item.id !== newItem.id)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error al guardar historial:", e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error("Error al limpiar historial:", e);
    }
  };

  // Disparar creación de trabajo
  const handleSubmitFiles = async (params: {
    files: File[];
    processId: string;
    tomador: string;
  }) => {
    setViewState("uploading");
    setErrorMessage(null);
    setProcessId(params.processId);
    setTomador(params.tomador);
    setFilesCount(params.files.length);
    setFileNames(params.files.map((f) => f.name));

    try {
      const response = await createComparativeJob({
        files: params.files,
        processId: params.processId,
        tomador: params.tomador,
      });

      setJobId(response.job_id);
      setViewState("processing");
    } catch (err: unknown) {
      setViewState("error");
      const msg = err instanceof Error ? err.message : "No se pudo comunicar con el microservicio de comparativos.";
      setErrorMessage(msg);
    }
  };

  // Éxito del job
  const handleJobSuccess = (url: string) => {
    setDownloadUrl(url);
    setViewState("success");
    saveToHistory(url);
  };

  // Error durante el procesamiento
  const handleJobError = (error: string) => {
    setErrorMessage(error);
    setViewState("error");
  };

  // Reiniciar estado
  const handleReset = () => {
    setViewState("idle");
    setJobId(null);
    setProcessId("");
    setTomador("");
    setFilesCount(0);
    setFileNames([]);
    setDownloadUrl(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Banner compacto */}
      {(viewState === "idle" || viewState === "uploading") && (
        <div className="bg-gradient-to-r from-corporate-700 via-corporate-600 to-corporate-500 text-white rounded-2xl py-4 px-6 sm:px-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-semibold text-corporate-100">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Automatizado con IA</span>
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                Consolidación de Cotizaciones de Seguros
              </h1>
              <p className="text-xs text-corporate-100/90 leading-tight">
                Carga las cotizaciones en PDF o Word para generar el comparativo consolidado en documento Word.
              </p>
            </div>
          </div>

          {/* Decoración sutil de fondo */}
          <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none">
            <ShieldCheck className="w-24 h-24 text-white" />
          </div>
        </div>
      )}

      {/* Estados del flujo */}
      {viewState === "idle" && (
        <FileDropzone onSubmit={handleSubmitFiles} disabled={false} isUploading={false} />
      )}

      {viewState === "uploading" && (
        <FileDropzone onSubmit={handleSubmitFiles} disabled={true} isUploading={true} />
      )}

      {viewState === "processing" && jobId && (
        <JobProgress
          jobId={jobId}
          processId={processId}
          filesCount={filesCount}
          onSuccess={handleJobSuccess}
          onError={handleJobError}
          onCancel={handleReset}
        />
      )}

      {viewState === "success" && jobId && downloadUrl && (
        <JobSuccess
          jobId={jobId}
          processId={processId}
          downloadUrl={downloadUrl}
          filesCount={filesCount}
          onReset={handleReset}
        />
      )}

      {viewState === "error" && (
        <div className="bg-white rounded-3xl border border-rose-200 shadow-xl p-8 sm:p-10 max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Ocurrió un problema en el procesamiento
            </h3>
            <p className="text-xs text-rose-700 bg-rose-50 p-4 rounded-xl border border-rose-200 text-left font-mono break-words">
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Volver a intentar</span>
          </button>
        </div>
      )}

      {/* Historial de comparativos recientes */}
      <JobHistory items={history} onClear={handleClearHistory} />
    </div>
  );
}
