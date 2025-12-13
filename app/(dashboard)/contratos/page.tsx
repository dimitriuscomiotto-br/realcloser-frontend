// app/(dashboard)/contratos/page.tsx
// Página de listagem de contratos
"use client";

import { useState } from "react";
import { useMeusContratos, useMinhaImobiliaria } from "@/lib/hooks/useFrontend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Download,
  CheckCircle2,
  PenTool,
  Loader2,
} from "lucide-react";
import {
  useAprovarContrato,
  useGerarContrato,
  useAssinarContrato,
  useVerificarPendencias,
} from "@/lib/hooks/useContratos";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useTemplatesPorImobiliaria,
  useCriarTemplate,
  useAtualizarTemplate,
  useAtivarTemplate,
  useDesativarTemplate,
  useDeletarTemplate,
} from "@/lib/hooks/useTemplates";

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-gray-100 text-gray-800", icon: Clock },
  em_analise: { label: "Em Análise", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  em_revisao: { label: "Em Revisão", color: "bg-blue-100 text-blue-800", icon: Clock },
  aprovado: { label: "Aprovado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  assinado: { label: "Assinado", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  concluido: { label: "Concluído", color: "bg-green-100 text-green-800", icon: CheckCircle },
};

// Componente para modal de templates
function TemplatesModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Templates de Contratos</DialogTitle>
          <DialogDescription>
            Gerencie os templates de contratos da sua imobiliária
          </DialogDescription>
        </DialogHeader>
        <TemplatesContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Componente de conteúdo dos templates
function TemplatesContent({ onClose }: { onClose: () => void }) {
  const { data: imobiliaria } = useMinhaImobiliaria();
  const { data: templates, isLoading } = useTemplatesPorImobiliaria(
    imobiliaria?.id || "",
    false
  );
  const criarTemplate = useCriarTemplate();
  const atualizarTemplate = useAtualizarTemplate();
  const ativarTemplate = useAtivarTemplate();
  const desativarTemplate = useDesativarTemplate();
  const deletarTemplate = useDeletarTemplate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {isCreating && (
        <TemplateForm
          onSave={async (data) => {
            try {
              await criarTemplate.mutateAsync({
                imobiliaria_id: imobiliaria?.id || "",
                ...data,
              });
              toast({
                title: "Template criado",
                description: "Template criado com sucesso",
                variant: "success",
              });
              setIsCreating(false);
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error?.response?.data?.message || "Erro ao criar template",
                variant: "destructive",
              });
            }
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {templates && templates.length > 0 ? (
        <div className="space-y-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{template.nome}</h3>
                      {template.ativo && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          Ativo
                        </span>
                      )}
                    </div>
                    {template.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{template.descricao}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(template.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!template.ativo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await ativarTemplate.mutateAsync(template.id);
                            toast({
                              title: "Template ativado",
                              description: "Template ativado com sucesso",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao ativar",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Ativar
                      </Button>
                    )}
                    {template.ativo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await desativarTemplate.mutateAsync(template.id);
                            toast({
                              title: "Template desativado",
                              description: "Template desativado com sucesso",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao desativar",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Desativar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(template.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (confirm("Tem certeza que deseja deletar este template?")) {
                          try {
                            await deletarTemplate.mutateAsync(template.id);
                            toast({
                              title: "Template deletado",
                              description: "Template deletado com sucesso",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao deletar",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
                {editingId === template.id && (
                  <TemplateForm
                    template={template}
                    onSave={async (data) => {
                      try {
                        await atualizarTemplate.mutateAsync({ id: template.id, data });
                        toast({
                          title: "Template atualizado",
                          description: "Template atualizado com sucesso",
                          variant: "success",
                        });
                        setEditingId(null);
                      } catch (error: any) {
                        toast({
                          title: "Erro",
                          description: error?.response?.data?.message || "Erro ao atualizar",
                          variant: "destructive",
                        });
                      }
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Nenhum template cadastrado</p>
        </div>
      )}
    </div>
  );
}

// Componente de formulário de template
function TemplateForm({
  template,
  onSave,
  onCancel,
}: {
  template?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(template?.nome || "");
  const [descricao, setDescricao] = useState(template?.descricao || "");
  const [conteudo, setConteudo] = useState(template?.conteudo_template || "");

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome do Template</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descrição</label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Conteúdo do Template</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="w-full min-h-[200px] p-2 border rounded-md"
              placeholder="Digite o conteúdo do template..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => onSave({ nome, descricao, conteudo_template: conteudo })}
              disabled={!nome || !conteudo}
            >
              Salvar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContratosPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useMeusContratos({ status: statusFilter });
  const aprovarContrato = useAprovarContrato();
  const gerarContrato = useGerarContrato();
  const assinarContrato = useAssinarContrato();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando contratos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600">Erro ao carregar contratos</p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contratos = data?.contratos || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contratos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os contratos de compra e venda ({data?.count || 0})
          </p>
        </div>
        <div className="flex gap-2">
          <TemplatesModal />
          <Link href="/contratos/novo">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              + Novo Contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filtrar por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(undefined)}
            >
              Todos
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contratos */}
      {contratos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhum contrato encontrado</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter
                  ? `Não há contratos com status "${statusConfig[statusFilter as keyof typeof statusConfig]?.label}"`
                  : "Crie um novo contrato para começar"}
              </p>
              {!statusFilter && (
                <Link href="/contratos/novo">
                  <Button className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Criar Primeiro Contrato
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contratos.map((contrato) => {
            const StatusIcon =
              statusConfig[contrato.status as keyof typeof statusConfig]?.icon || Clock;
            const statusInfo = statusConfig[contrato.status as keyof typeof statusConfig];

            return (
              <Card key={contrato.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{contrato.imovel.titulo}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo?.label || contrato.status}
                        </span>
                        {contrato.gerado_por_ia && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            🤖 IA
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{contrato.imovel.endereco}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Comprador</p>
                          <p className="text-sm">{contrato.comprador.nome}</p>
                          <p className="text-xs text-gray-500">{contrato.comprador.cpf}</p>
                          <div className="mt-2 space-y-1">
                            {contrato.aprovado_comprador ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Aprovado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                Aguardando aprovação
                              </span>
                            )}
                            {contrato.assinado_comprador && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 ml-2">
                                <CheckCircle className="h-3 w-3" />
                                Assinado
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Vendedor</p>
                          <p className="text-sm">{contrato.vendedor.nome}</p>
                          <p className="text-xs text-gray-500">{contrato.vendedor.cpf}</p>
                          <div className="mt-2 space-y-1">
                            {contrato.aprovado_vendedor ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Aprovado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                Aguardando aprovação
                              </span>
                            )}
                            {contrato.assinado_vendedor && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 ml-2">
                                <CheckCircle className="h-3 w-3" />
                                Assinado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(contrato.proposta.valor)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Proposta: {contrato.proposta.status}
                            </p>
                          </div>
                          {contrato.total_mensagens > 0 && (
                            <div className="text-right">
                              <Link href={`/contratos/${contrato.id}/chat`}>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  {contrato.total_mensagens} mensagens
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                    <Link href={`/contratos/${contrato.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Contrato
                      </Button>
                    </Link>
                    <Link href={`/contratos/${contrato.id}/chat`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </Link>
                    {contrato.status === "pendente" && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await aprovarContrato.mutateAsync({
                              id: contrato.id,
                              parte: "comprador",
                            });
                          } catch (error) {
                            console.error("Erro ao aprovar contrato:", error);
                          }
                        }}
                        disabled={aprovarContrato.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    )}
                    {contrato.status === "aprovado" && !contrato.assinado_comprador && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          try {
                            await assinarContrato.mutateAsync({
                              id: contrato.id,
                              parte: "comprador",
                            });
                          } catch (error) {
                            console.error("Erro ao assinar contrato:", error);
                          }
                        }}
                        disabled={assinarContrato.isPending}
                      >
                        <PenTool className="h-4 w-4 mr-2" />
                        Assinar
                      </Button>
                    )}
                    {contrato.arquivo_assinado_url && (
                      <a
                        href={contrato.arquivo_assinado_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}



