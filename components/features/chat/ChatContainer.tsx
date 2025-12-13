// components/features/chat/ChatContainer.tsx
// Componente de Chat para interação com o agente de IA
"use client";

import { useState, useRef, useEffect } from "react";
import { useMensagensPorContrato, useEnviarMensagem } from "@/lib/hooks/useMensagens";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Paperclip, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

interface ChatContainerProps {
  contratoId: string;
}

export function ChatContainer({ contratoId }: ChatContainerProps) {
  const [mensagem, setMensagem] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const { data: mensagens, isLoading, refetch } = useMensagensPorContrato(contratoId);
  const enviarMensagem = useEnviarMensagem();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviar = async () => {
    if (!mensagem.trim() || isEnviando) return;

    setIsEnviando(true);
    try {
      await enviarMensagem.mutateAsync({
        contrato_id: contratoId,
        texto: mensagem.trim(),
      });
      setMensagem("");
      await refetch();
      scrollToBottom();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error?.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsEnviando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Chat - Agente de IA
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : mensagens && mensagens.length > 0 ? (
            mensagens.map((msg) => {
              const isUsuario = msg.usuario_id === user?.id;
              const isBot = msg.usuario?.role === "admin" || msg.texto.includes("🤖");

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUsuario ? "justify-end" : "justify-start"}`}
                >
                  {!isUsuario && (
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isBot ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isUsuario
                        ? "bg-primary text-primary-foreground"
                        : isBot
                        ? "bg-purple-50 border border-purple-200"
                        : "bg-gray-100"
                    }`}
                  >
                    {!isUsuario && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {isBot ? "Agente de IA" : msg.usuario?.nome || "Usuário"}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                    {msg.anexos && msg.anexos.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.anexos.map((anexo, idx) => (
                          <a
                            key={idx}
                            href={anexo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline opacity-80 hover:opacity-100"
                          >
                            Anexo {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.criado_em).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isUsuario && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma mensagem ainda</p>
                <p className="text-sm mt-1">Comece uma conversa com o agente de IA</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              disabled={isEnviando}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={isEnviando}
              title="Anexar arquivo"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button onClick={handleEnviar} disabled={isEnviando || !mensagem.trim()}>
              {isEnviando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            O agente de IA pode ajudar com dúvidas sobre o contrato, documentos e processo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
