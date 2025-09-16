import { StepProgress } from "@/components/StepProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProcessingState } from "@/pages/DashboardPage";
import { FileText, MessageSquare } from "lucide-react";

interface ProcessingStepsProps {
  currentStep: number;
  processingState: ProcessingState;
  openTranscription: () => void;
  openChat: () => void;
}

export function ProcessingSteps({
  currentStep,
  processingState,
  openChat,
  openTranscription,
}: ProcessingStepsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-xl">Progresso do Processamento</h2>
        <StepProgress currentStep={currentStep} />

        {processingState === "uploading" && (
          <div className="text-center">
            <p className="text-primary">Fazendo upload do arquivo...</p>
          </div>
        )}

        {processingState === "transcribing" && (
          <div className="text-center">
            <p className="text-primary">Transcrevendo conteúdo...</p>
          </div>
        )}

        {processingState === "preparing" && (
          <div className="text-center">
            <p className="text-primary">Preparando para análise por IA...</p>
          </div>
        )}

        {processingState === "ready" && (
          <div className="text-center space-y-4">
            <p className="text-green-600">Processamento concluído!</p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Button
                onClick={openTranscription}
                variant="outline"
                className="flex items-center space-x-2 w-full sm:w-auto"
              >
                <FileText className="h-4 w-4" />
                <span>Ver Transcrição</span>
              </Button>
              <Button
                onClick={openChat}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Iniciar Chat com IA</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
