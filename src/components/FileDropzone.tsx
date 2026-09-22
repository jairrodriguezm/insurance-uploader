"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";

interface FileDropzoneProps {
  onSubmit: (params: { files: File[]; processId: string; tomador: string }) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export function FileDropzone({
  onSubmit,
  disabled = false,
  isUploading = false,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generar ID de proceso sugerido
  const [processId, setProcessId] = useState<string>(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `COT-${new Date().getFullYear()}-${randomSuffix}`;
  });
  const [tomador, setTomador] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Formatear tamaño de archivo
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Validar y agregar archivos
  const handleFiles = (newFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
        setErrorMessage(
          `El archivo "${file.name}" no es válido. Solo se admiten archivos .PDF o .DOCX`
        );
        continue;
      }

      // Máximo 50 MB
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(
          `El archivo "${file.name}" supera el límite máximo permitido de 50 MB.`
        );
        continue;
      }

      // Evitar duplicados por nombre
      if (!files.some((f) => f.name === file.name)) {
        validFiles.push(file);
      }
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage("Por favor adjunta al menos una cotización para procesar.");
      return;
    }
    if (!processId.trim()) {
      setErrorMessage("Por favor ingresa un identificador de proceso.");
      return;
    }

    setErrorMessage(null);
    onSubmit({ files, processId: processId.trim(), tomador: tomador.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Zona Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-corporate-500 bg-corporate-50 scale-[1.01]"
            : "border-slate-300 hover:border-corporate-400 bg-white hover:bg-slate-50/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-corporate-100 flex items-center justify-center text-corporate-600 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Arrastra y suelta las cotizaciones aquí
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              o haz clic para explorar tus carpetas
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-400">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
              Formatos: PDF, Word (.docx)
            </span>
            <span>•</span>
            <span>Hasta 50 MB por archivo</span>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="flex items-center space-x-2 bg-rose-50 text-rose-700 p-3.5 rounded-xl border border-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Lista de archivos cargados */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cotizaciones seleccionadas ({files.length})
              </span>
              {files.length < 2 && (
                <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  Sugerencia: adjunta 2 o más para comparar
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-xs text-slate-400 hover:text-rose-600 transition"
              disabled={disabled}
            >
              Limpiar todo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {files.map((file, idx) => {
              const isPdf = file.name.toLowerCase().endsWith(".pdf");
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition text-left"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isPdf
                          ? "bg-rose-100 text-rose-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isPdf ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <FileSpreadsheet className="w-5 h-5" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    disabled={disabled}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition flex-shrink-0 ml-2"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campos de metadatos opcionales */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ID de Proceso / Radicado <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={processId}
            onChange={(e) => setProcessId(e.target.value)}
            disabled={disabled}
            placeholder="Ej: COT-2026-001 o ID de radicado"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500 outline-none transition"
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Identificador único para el archivo y trazabilidad.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nombre del Tomador <span className="text-slate-400 font-normal">(Opcional)</span>
          </label>
          <input
            type="text"
            value={tomador}
            onChange={(e) => setTomador(e.target.value)}
            disabled={disabled}
            placeholder="Dejar en blanco para diligenciar después"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500 outline-none transition"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Si se omite, la celda TOMADOR quedará vacía en el Word.
          </p>
        </div>
      </div>

      {/* Banner de subida activa */}
      {isUploading && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-corporate-50 border border-corporate-200 text-xs text-corporate-800 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-corporate-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">
                Enviando {files.length} cotizaciones al servidor...
              </p>
              <p className="text-[11px] text-slate-500">
                Por favor espera un momento mientras se transfieren los documentos.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-corporate-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-corporate-200 shadow-xs">
            Cargando...
          </span>
        </div>
      )}

      {/* Botón de acción */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || isUploading || files.length === 0}
          className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-semibold text-xs tracking-wide uppercase transition shadow-md ${
            isUploading
              ? "bg-corporate-600 text-white cursor-wait animate-pulse shadow-corporate-600/30"
              : disabled || files.length === 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-corporate-600 hover:bg-corporate-700 text-white shadow-corporate-600/20 hover:scale-[1.01]"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Enviando cotizaciones al servidor...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generar Comparativo Word</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
