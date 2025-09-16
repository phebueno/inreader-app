import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import {
  aiCompletionService,
  type AiCompletionResponse,
} from "@/services/aiCompletion";
import type { User as UserType } from "@/services/auth";
import { getUserInitials } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  user: UserType;
  transcriptionId: string | null;
}

export function ChatInterface({
  isOpen,
  onClose,
  fileName,
  user,
  transcriptionId,
}: ChatInterfaceProps) {
  const { execute: executePrompt } = useApi<
    AiCompletionResponse,
    { prompt: string }
  >();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Olá! Acabei de processar o arquivo "${
        fileName || "seu arquivo"
      }". Agora você pode fazer perguntas sobre o conteúdo, solicitar resumos, análises ou qualquer outra coisa relacionada ao material. Como posso ajudá-lo?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen || !transcriptionId) return null;

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const aiCompletion = await executePrompt(
      ({ prompt }) =>
        aiCompletionService.createAiCompletion(transcriptionId, prompt),
      { prompt: inputValue },
      { errorMessage: "Erro na IA! Tente novamente daqui a alguns minutos." }
    );

    const missingResponse =
      "Desculpe, não pude processar sua requisição, tente novamente em alguns minutos.";

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiCompletion?.response || missingResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-medium">Chat com IA</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Conversando sobre: {fileName || "arquivo processado"}
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

        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full">
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <>{getUserInitials(user.name)}</>
                      ) : (
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-2.5 sm:p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm sm:text-base break-words">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%] sm:max-w-[80%]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-2.5 sm:p-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="p-3 sm:p-4 border-t shrink-0 bg-background rounded-b-full">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre o arquivo..."
              disabled={isTyping}
              className="text-sm sm:text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className="shrink-0"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
