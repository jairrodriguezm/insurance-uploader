import { HealthResponse, JobResponse, JobStatusResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://comparativo-seguros-api-972862829792.us-central1.run.app";

/**
 * Obtener la URL base configurada de la API.
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Comprobar el estado de salud del backend (Health Check).
 */
export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: El microservicio no responde`);
  }

  return response.json();
}

/**
 * Iniciar un nuevo trabajo de comparativo enviando cotizaciones.
 */
export async function createComparativeJob(params: {
  files: File[];
  processId: string;
  tomador?: string;
  callbackUrl?: string;
}): Promise<JobResponse> {
  const formData = new FormData();
  formData.append("process_id", params.processId);
  formData.append("callback_url", params.callbackUrl || "");
  formData.append("tomador", params.tomador || "");

  for (const file of params.files) {
    formData.append("files", file, file.name);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/comparatives/jobs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const detail = errorData?.detail || `Error ${response.status} al crear el trabajo`;
    throw new Error(detail);
  }

  return response.json();
}

/**
 * Consultar el estado actual de un trabajo.
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/comparatives/jobs/${jobId}/status`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar el estado del trabajo`);
  }

  return response.json();
}
