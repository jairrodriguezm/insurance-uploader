"use client";

import { ComparisonHistoryItem } from "@/types";
import { History, Download, Trash2, FileText } from "lucide-react";

interface JobHistoryProps {
  items: ComparisonHistoryItem[];
  onClear: () => void;
}

export function JobHistory({ items, onClear }: JobHistoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-corporate-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Comparativos Recientes ({items.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Borrar historial</span>
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-corporate-100 text-corporate-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.processId}
                  </span>
                  {item.tomador && (
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      • {item.tomador}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.createdAt} • {item.fileNames.length} cotizaciones
                </p>
              </div>
            </div>

            {item.downloadUrl && (
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-corporate-600 hover:bg-corporate-700 text-white text-xs font-semibold transition flex-shrink-0 ml-3 shadow-sm shadow-corporate-600/20"
                title="Descargar este archivo Word nuevamente"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
