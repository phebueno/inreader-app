import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";

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
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Upload de Arquivo</h2>
            {selectedFile && processingState !== "idle" && (
              <Button variant="outline" onClick={resetProcess}>
                Novo Upload
              </Button>
            )}
          </div>

          <FileUpload onFileSelect={handleFileSelect} disabled={false} />
        </div>
      </Card>
    </>
  );
}

export default App;
