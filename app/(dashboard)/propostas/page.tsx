// app/(dashboard)/propostas/page.tsx
// Página de listagem de propostas
"use client";

import { useState } from "react";
import { useMinhasPropostas } from "@/lib/hooks/useFrontend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Handshake, CheckCircle, XCircle, Clock, FileText, Send, Edit } from "lucide-react";
import {
  useAprovarPropostaComprador,
  useAprovarPropostaVendedor,
  useEnviarProposta,
  useUpdateProposta,
} from "@/lib/hooks/usePropostas";
import { useToast } from "@/components/ui/use-toast";
import { useGerarContrato } from "@/lib/hooks/useContratos";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-gray-100 text-gray-800", icon: FileText },
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-800", icon: Clock },
  aprovada: { label: "Aprovada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejeitada: { label: "Rejeitada", color: "bg-red-100 text-red-800", icon: XCircle },
  cancelada: { label: "Cancelada", color: "bg-gray-100 text-gray-800", icon: XCircle },
};

export default function PropostasPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useMinhasPropostas({ status: statusFilter });
  const aprovarComprador = useAprovarPropostaComprador();
  const aprovarVendedor = useAprovarPropostaVendedor();
  const enviarProposta = useEnviarProposta();
  const gerarContrato = useGerarContrato();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando propostas...</p>
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
              <p className="text-red-600">Erro ao carregar propostas</p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const propostas = data?.propostas || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Propostas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as propostas de compra e venda ({data?.count || 0})
          </p>
        </div>
        <Link href="/propostas/nova">
          <Button>
            <Handshake className="mr-2 h-4 w-4" />
            + Nova Proposta
          </Button>
        </Link>
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
              Todas
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

      {/* Lista de Propostas */}
      {propostas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhuma proposta encontrada</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter
                  ? `Não há propostas com status "${statusConfig[statusFilter as keyof typeof statusConfig]?.label}"`
                  : "Crie uma nova proposta para começar"}
              </p>
              {!statusFilter && (
                <Link href="/propostas/nova">
                  <Button className="mt-4">
                    <Handshake className="mr-2 h-4 w-4" />
                    Criar Primeira Proposta
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {propostas.map((proposta) => {
            const StatusIcon = statusConfig[proposta.status as keyof typeof statusConfig]?.icon || Clock;
            const statusInfo = statusConfig[proposta.status as keyof typeof statusConfig];

            return (
              <Card key={proposta.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{proposta.imovel.titulo}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo?.label || proposta.status}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{proposta.imovel.endereco}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Comprador</p>
                          <p className="text-sm">{proposta.comprador.nome}</p>
                          <p className="text-xs text-gray-500">{proposta.comprador.cpf}</p>
                          {proposta.comprador.email && (
                            <p className="text-xs text-gray-500">{proposta.comprador.email}</p>
                          )}
                          <div className="mt-2">
                            {proposta.aprovado_comprador ? (
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
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Vendedor</p>
                          <p className="text-sm">{proposta.vendedor.nome}</p>
                          <p className="text-xs text-gray-500">{proposta.vendedor.cpf}</p>
                          {proposta.vendedor.email && (
                            <p className="text-xs text-gray-500">{proposta.vendedor.email}</p>
                          )}
                          <div className="mt-2">
                            {proposta.aprovado_vendedor ? (
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
                              }).format(proposta.valor)}
                            </p>
                            {proposta.forma_pagamento && (
                              <p className="text-sm text-gray-600 mt-1">
                                {proposta.forma_pagamento}
                              </p>
                            )}
                          </div>
                          {proposta.tem_contrato && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Contrato gerado</p>
                              <Link href={`/contratos/${proposta.contrato_id}`}>
                                <Button variant="outline" size="sm" className="mt-1">
                                  Ver Contrato
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                    <Link href={`/propostas/${proposta.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    {proposta.status === "rascunho" && (
                      <Link href={`/propostas/${proposta.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                    )}
                    {proposta.status === "rascunho" && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await enviarProposta.mutateAsync(proposta.id);
                            toast({
                              title: "Proposta enviada",
                              description: "Proposta enviada para aprovação das partes",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao enviar proposta",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={enviarProposta.isPending}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar para Aprovação
                      </Button>
                    )}
                    {proposta.status === "enviada" && !proposta.aprovado_comprador && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await aprovarComprador.mutateAsync(proposta.id);
                            toast({
                              title: "Proposta aprovada",
                              description: "Você aprovou a proposta como comprador",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao aprovar",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={aprovarComprador.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar como Comprador
                      </Button>
                    )}
                    {proposta.status === "enviada" && !proposta.aprovado_vendedor && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          try {
                            await aprovarVendedor.mutateAsync(proposta.id);
                            toast({
                              title: "Proposta aprovada",
                              description: "Você aprovou a proposta como vendedor",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description: error?.response?.data?.message || "Erro ao aprovar",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={aprovarVendedor.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar como Vendedor
                      </Button>
                    )}
                    {proposta.status === "aprovada" && !proposta.tem_contrato && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={async () => {
                          try {
                            await gerarContrato.mutateAsync(proposta.id);
                            toast({
                              title: "Contrato gerado",
                              description: "Contrato gerado com sucesso usando IA",
                              variant: "success",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Erro",
                              description:
                                error?.response?.data?.message || "Erro ao gerar contrato",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={gerarContrato.isPending}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar Contrato
                      </Button>
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



