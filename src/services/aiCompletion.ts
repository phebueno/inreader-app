import api from "@/services/api";

export interface AiCompletionResponse {
  id: string;
  transcriptionId: string;
  prompt: string;
  response: string;
  tokensUsed: null;
  createdAt: string;
}

export const aiCompletionService = {
  async createAiCompletion(
    documentId: string,
    prompt: string
  ): Promise<AiCompletionResponse> {
    const response = await api.post<AiCompletionResponse>(
      `/ai-completions/transcription/${documentId}`,
      { prompt }
    );

    return response.data;
  },
};
