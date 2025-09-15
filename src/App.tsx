import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { StepProgress } from "@/components/StepProgress";
import { MessageSquare, Upload } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";

const userMock = {name: 'fernando', email: 'fcbgomes@gmail.com'}

type ProcessingState =
  | "idle"
  | "uploading"
  | "transcribing"
  | "preparing"
  | "ready";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");
  const [currentStep, setCurrentStep] = useState(0);

  const resetProcess = () => {
    setSelectedFile(null);
    setProcessingState("idle");
    setCurrentStep(0);
  };

  //TODO: ABAIXO, simulação da transcrição. Implementar API/websockets de acordo!!!!!

  const handleFileSelect = (file: File) => {
    //TODO: fake file handling (trocar para imagem, ver possibilidade de PDF)
    setSelectedFile(file);
    setProcessingState("uploading");
    setCurrentStep(1);
  };

  useEffect(() => {
    if (processingState === "uploading") {
      // fake upload
      const timer = setTimeout(() => {
        setProcessingState("transcribing");
        setCurrentStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [processingState]);

  useEffect(() => {
    if (processingState === "transcribing") {
      // fake transcription
      const timer = setTimeout(() => {
        setProcessingState("preparing");
        setCurrentStep(3);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [processingState]);

  useEffect(() => {
    if (processingState === "preparing") {
      // fake preparação final (faz sentido?)
      const timer = setTimeout(() => {
        setProcessingState("ready");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [processingState]);

  return (
    <div className="min-h-screen bg-background w-full">
      <DashboardHeader user={userMock} onLogout={()=>{}}/>
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

            <FileUpload onFileSelect={handleFileSelect} disabled={false} />
          </div>
        </Card>
        {currentStep > 0 && (
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
                  <p className="text-primary">
                    Preparando para análise por IA...
                  </p>
                </div>
              )}

              {processingState === "ready" && (
                <div className="text-center space-y-4">
                  <p className="text-green-600">Processamento concluído!</p>
                  <Button
                    onClick={() => {}}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Iniciar Chat com IA</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
        {processingState === 'idle' && (
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl">Como usar</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">1. Upload</h3>
                      <p className="text-sm text-muted-foreground">
                        Arraste ou selecione um arquivo de áudio, vídeo ou documento
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Processamento</h3>
                      <p className="text-sm text-muted-foreground">
                        Aguarde enquanto transcrevemos e preparamos o conteúdo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">3. Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Converse com a IA sobre o conteúdo do seu arquivo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
      </div>
    </div>
  );
}

export default App;
