import { StepProgress } from "@/components/StepProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProcessingState } from "@/pages/DashboardPage";
import {
  Download,
  FileDown,
  FileText,
  MessageSquare,
  SquareCheck,
  CircleStar,
  CircleStarIcon,
} from "lucide-react";

interface ProcessingStepsProps {
  currentStep: number;
  processingState: ProcessingState;
  openTranscription: () => void;
  openChat: () => void;
  downloadFile: () => void;
  downloadFileFull: () => void;
}

export function ProcessingSteps({
  currentStep,
  processingState,
  openChat,
  openTranscription,
  downloadFile,
  downloadFileFull,
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
            <div className="text-green-600 flex gap-1 items-center justify-center">
              <SquareCheck />
              <span>Processamento concluído!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <Button
                onClick={openTranscription}
                variant="outline"
                className="flex items-center space-x-2 w-full"
              >
                <FileText className="h-4 w-4" />
                <span>Ver Transcrição</span>
              </Button>
              <Button
                onClick={openChat}
                className="flex items-center space-x-2 w-full"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Iniciar Chat com IA</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
              <Button
                onClick={downloadFile}
                variant="secondary"
                className="flex items-center space-x-2 w-full"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Arquivo</span>
              </Button>
              <Button
                onClick={downloadFileFull}
                variant="secondary"
                className="flex items-center space-x-2 w-full relative"
              >
                <FileDown className="h-4 w-4" />
                <span>Exportar Relatório Completo</span>
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-primary-foreground text-xs px-1.5 py-1.5 rounded-full">
                  <CircleStar />
                </span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              O relatório completo inclui transcrição + conversas com IA
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
