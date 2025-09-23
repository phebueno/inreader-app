import { Card } from "@/components/ui/card";
import { MessageSquare, Upload } from "lucide-react";

export function ProcessingGuide() {
  return (
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
                Arraste ou selecione um arquivo de imagem ou pdf
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
  );
}
