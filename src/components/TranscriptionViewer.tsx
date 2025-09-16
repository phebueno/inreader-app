import { useState, useEffect } from "react";
import { X, Copy, Download, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  transcriptionText: string;
}

export function TranscriptionViewer({
  isOpen,
  onClose,
  fileName,
  transcriptionText,
}: TranscriptionViewerProps) {
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  useEffect(() => {
    if (transcriptionText) {
      const words = transcriptionText.trim().split(/\s+/).length;
      setWordCount(words);
      setEstimatedReadTime(Math.ceil(words / 200));
    } else {
      setWordCount(0);
      setEstimatedReadTime(0);
    }
  }, [transcriptionText]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(transcriptionText);
      toast.success("Transcrição copiada para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar texto");
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([transcriptionText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcricao-${fileName || "arquivo"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcrição baixada!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-medium">
                Transcrição do Arquivo
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {fileName || "arquivo processado"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 bg-muted/30 border-b shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                Transcrição Completa
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary">{wordCount} palavras</Badge>
            <Badge variant="outline">~{estimatedReadTime} min de leitura</Badge>
          </div>
        </div>

        <div className="p-4 border-b shrink-0">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              disabled={!transcriptionText}
              className="flex items-center space-x-2"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Copiar Texto</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadText}
              disabled={!transcriptionText}
              className="flex items-center space-x-2"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Baixar TXT</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {transcriptionText ? (
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {transcriptionText}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Nenhuma transcrição disponível
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
