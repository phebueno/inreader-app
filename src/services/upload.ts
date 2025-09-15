import api from "@/services/api";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  status: "uploaded" | "processing" | "completed" | "error";
  createdAt: string;
}

export interface TranscriptionResponse {
  id: string;
  fileId: string;
  text: string;
  status: "pending" | "processing" | "completed" | "error";
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: ChatMessage;
  fileContext?: {
    fileName: string;
    transcription: string;
  };
}

export const uploadService = {
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            };
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  },
};
