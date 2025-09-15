import { baseURL } from "@/config/env";
import { useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseTranscriptionSocketProps {
  userId?: string | null;
  onUpdate: (data: any) => void;
}

export interface TranscriptionSuccessPayload {
  documentId: string;
  status: "DONE";
  transcription: {
    id: string;
    documentId: string;
    text: string;
    createdAt: string;
  };
}

export interface TranscriptionFailedPayload {
  documentId: string;
  status: "FAILED";
  error: string;
}

export type TranscriptionUpdatePayload =
  | TranscriptionSuccessPayload
  | TranscriptionFailedPayload;

export function useTranscriptionSocket({
  userId,
  onUpdate,
}: UseTranscriptionSocketProps) {
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (!userId) {
      console.warn("❌ Não foi possível conectar: userId inválido");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(baseURL, {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket conectado:", socketRef.current?.id);
        socketRef.current?.emit("join", { userId });
      });

      socketRef.current.on(
        "transcriptionUpdate",
        (payload: TranscriptionUpdatePayload) => {
          if (payload.status === "DONE") {
            console.log("Transcrição completa:", payload.transcription.text);
            onUpdate(payload);
          } else if (payload.status === "FAILED") {
            console.error("Transcrição falhou:", payload.error);
          }
        }
      );
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return { connect, disconnect };
}
