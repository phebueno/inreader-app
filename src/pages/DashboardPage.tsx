import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import { uploadService, type UploadResponse } from "@/services/upload";
import {
  useTranscriptionSocket,
  type Transcription,
  type TranscriptionUpdatePayload,
} from "@/hooks/useTranscriptionSocket";
import { ChatInterface } from "@/components/ChatInterface";
import { TranscriptionViewer } from "@/components/TranscriptionViewer";
import { ProcessingGuide } from "@/components/ProcessingGuide";
import { ProcessingSteps } from "@/components/ProcessingSteps";

export type ProcessingState =
  | "idle"
  | "uploading"
  | "transcribing"
  | "preparing"
  | "ready";

export function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");
  const [currentStep, setCurrentStep] = useState(0);

  const { user, logout } = useAuth();
  const { execute: executeUpload } = useApi<UploadResponse, File>();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isTranscriptionOpen, setIsTranscriptionOpen] =
    useState<boolean>(false);

  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );

  const resetProcess = () => {
    setSelectedFile(null);
    setProcessingState("idle");
    setCurrentStep(0);
    setTranscription(null);
  };

  const handleChatReady = useCallback((data: TranscriptionUpdatePayload) => {
    if (data.status === "DONE") {
      setTranscription(data.transcription);
      setCurrentStep(3);
      setProcessingState("ready");
    } else {
      console.log("Erro de transcrição:", data.error);
      resetProcess();
    }
  }, []);
  const { connect, disconnect } = useTranscriptionSocket({
    userId: user?.id,
    onUpdate: handleChatReady,
  });

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setProcessingState("uploading");
    setCurrentStep(1);

    connect();
    const uploaded = await executeUpload(
      (file) =>
        uploadService.uploadFile(file, (progress) => {
          console.log(`Upload: ${progress.percentage}%`);
        }),
      file,
      { successMessage: "Arquivo enviado com sucesso!" }
    );

    if (uploaded) {
      setProcessingState("transcribing");
      setCurrentStep(2);
    } else {
      disconnect();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <DashboardHeader user={user} onLogout={logout} />
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Faça upload de arquivos para transcrição e análise por IA
          </p>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl">Upload de Arquivo</h2>
              {selectedFile && processingState !== "idle" && (
                <Button variant="default" onClick={resetProcess}>
                  Novo Upload
                </Button>
              )}
            </div>

            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onRemove={resetProcess}
              disabled={processingState !== "idle"}
            />
          </div>
        </Card>
        {currentStep > 0 && (
          <ProcessingSteps
            currentStep={currentStep}
            processingState={processingState}
            openChat={() => setIsChatOpen(true)}
            openTranscription={() => setIsTranscriptionOpen(true)}
          />
        )}
        {processingState === "idle" && <ProcessingGuide />}
        {transcription && (
          <>
            <ChatInterface
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              user={user}
              transcriptionId={transcription.id}
              fileName={selectedFile?.name}
            />

            <TranscriptionViewer
              isOpen={isTranscriptionOpen}
              onClose={() => setIsTranscriptionOpen(false)}
              fileName={selectedFile?.name}
              transcriptionText={transcription.text}
            />
          </>
        )}
      </div>
    </div>
  );
}
