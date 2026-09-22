"use client";

import { CheckCircle2, Download, FileText, RotateCcw } from "lucide-react";

interface JobSuccessProps {
  jobId: string;
  processId: string;
  downloadUrl: string;
  filesCount: number;
  onReset: () => void;
}

export function JobSuccess({
  jobId,
  processId,
  downloadUrl,
  filesCount,
  onReset,
}: JobSuccessProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-300">
      {/* Icono de éxito */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Titulares */}
      <div className="space-y-2">
        <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
          Comparativo Generado con Éxito
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Documento Fase 2 Listo para Descarga
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Se han analizado las coberturas y deducibles de{" "}
          <strong className="text-slate-700">{filesCount} cotizaciones</strong> y se han
          consolidado en el documento comparativo Word.
        </p>
      </div>

      {/* Ficha técnica del trabajo */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left grid grid-cols-2 gap-3 text-slate-600">
        <div>
          <span className="text-slate-400 block text-[11px]">Proceso / Radicado</span>
          <span className="font-semibold text-slate-800">{processId}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Identificador de Job</span>
          <span className="font-mono text-slate-800">{jobId.slice(0, 12)}...</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Formato Generado</span>
          <span className="font-semibold text-slate-800 flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-blue-600 inline" />
            <span>Microsoft Word (.docx)</span>
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Almacenamiento</span>
          <span className="font-semibold text-slate-800">Supabase Storage</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-2 space-y-3">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center justify-center space-x-2.5 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 hover:scale-[1.01]"
        >
          <Download className="w-5 h-5" />
          <span>Descargar Comparativo Word (.docx)</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center space-x-2 w-full py-3 px-5 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Realizar otro comparativo</span>
        </button>
      </div>
    </div>
  );
}
