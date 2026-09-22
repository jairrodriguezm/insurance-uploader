export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface JobResponse {
  status: "queued";
  job_id: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  download_url?: string | null;
  error?: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ComparisonHistoryItem {
  id: string;
  processId: string;
  tomador?: string;
  createdAt: string;
  fileNames: string[];
  downloadUrl?: string | null;
  status: JobStatus;
}
