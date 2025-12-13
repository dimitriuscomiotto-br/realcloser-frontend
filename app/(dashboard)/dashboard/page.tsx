// app/(dashboard)/dashboard/page.tsx
// Dashboard principal
"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  useMinhaImobiliaria,
  useMeusImoveis,
  useMinhasPropostas,
  useMeusContratos,
} from "@/lib/hooks/useFrontend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  Building2,
  Handshake,
  FileCheck,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Usar os novos hooks do frontend
  const { data: imobiliaria, isLoading: loadingImobiliaria } = useMinhaImobiliaria();
  const { data: imoveisData, isLoading: loadingImoveis } = useMeusImoveis();
  const { data: propostasData, isLoading: loadingPropostas } = useMinhasPropostas();
  const { data: contratosData, isLoading: loadingContratos } = useMeusContratos();

  const isLoading =
    loading ||
    loadingImobiliaria ||
    loadingImoveis ||
    loadingPropostas ||
    loadingContratos;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calcular estatísticas dos dados
  const stats = {
    imoveis: {
      total: imoveisData?.count || 0,
      comProposta: imoveisData?.imoveis.filter((i) => i.total_propostas > 0).length || 0,
      vendidos: imoveisData?.imoveis.filter((i) => i.status === "vendido").length || 0,
    },
    contratos: {
      ativos:
        contratosData?.contratos.filter(
          (c) =>
            c.status === "pendente" ||
            c.status === "em_analise" ||
            c.status === "em_revisao" ||
            c.status === "aprovado"
        ).length || 0,
      aguardandoAssinatura:
        contratosData?.contratos.filter(
          (c) =>
            c.status === "aprovado" &&
            (!c.assinado_comprador || !c.assinado_vendedor)
        ).length || 0,
      concluidos:
        contratosData?.contratos.filter((c) => c.status === "concluido").length ||
        0,
    },
    propostas: {
      total: propostasData?.count || 0,
      emAndamento:
        propostasData?.propostas.filter(
          (p) =>
            p.status === "rascunho" ||
            p.status === "enviada" ||
            (p.status === "aprovada" && !p.aprovado_comprador && !p.aprovado_vendedor)
        ).length || 0,
      aprovadas:
        propostasData?.propostas.filter((p) => p.status === "aprovada").length ||
        0,
    },
    pendencias: {
      documentacao: 0, // Será calculado quando implementarmos documentos
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {imobiliaria?.nome_fantasia || imobiliaria?.razao_social || "Dashboard"}
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral dos seus contratos e atividades
          </p>
        </div>
        <Link href="/contratos/novo">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            + Novo Contrato
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Imóveis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.imoveis.total || 0}</div>
            <p className="text-xs text-muted-foreground">Total cadastrados</p>
            <div className="mt-2 flex gap-4 text-xs">
              <span className="text-blue-600">
                {stats?.imoveis.comProposta || 0} com proposta
              </span>
              <span className="text-green-600">
                {stats?.imoveis.vendidos || 0} vendidos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contratos.ativos || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.contratos.aguardandoAssinatura || 0} aguardando assinatura
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats?.contratos.concluidos || 0} concluídos
            </p>
          </CardContent>
        </Card>

        {/* Propostas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.propostas.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.propostas.emAndamento || 0} em andamento
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats?.propostas.aprovadas || 0} aprovadas
            </p>
          </CardContent>
        </Card>

        {/* Corretores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corretores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imobiliaria?.corretores?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de corretores
            </p>
            {imobiliaria?.estatisticas && (
              <div className="mt-2 text-xs text-gray-500">
                {imobiliaria.estatisticas.total_imoveis} imóveis cadastrados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Imóveis Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imóveis Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {imoveisData?.imoveis.slice(0, 5).map((imovel) => (
                <Link
                  key={imovel.id}
                  href={`/imoveis/${imovel.id}`}
                  className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <p className="font-semibold text-sm">{imovel.titulo}</p>
                  <p className="text-xs text-gray-600">{imovel.endereco}</p>
                  <p className="text-xs font-medium text-primary mt-1">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(imovel.preco)}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                    <span>{imovel.propostas_ativas} propostas ativas</span>
                  </div>
                </Link>
              ))}
              {(!imoveisData?.imoveis || imoveisData.imoveis.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum imóvel cadastrado
                </p>
              )}
            </div>
            {imoveisData && imoveisData.imoveis.length > 5 && (
              <Link href="/imoveis">
                <Button variant="outline" className="w-full mt-4">
                  Ver todos os imóveis
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Propostas Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Propostas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propostasData?.propostas
                .filter((p) => p.status === "enviada" || p.status === "rascunho")
                .slice(0, 5)
                .map((proposta) => (
                  <Link
                    key={proposta.id}
                    href={`/propostas/${proposta.id}`}
                    className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <p className="font-semibold text-sm">
                      {proposta.imovel.titulo}
                    </p>
                    <p className="text-xs text-gray-600">
                      {proposta.comprador.nome} → {proposta.vendedor.nome}
                    </p>
                    <p className="text-xs font-medium text-primary mt-1">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(proposta.valor)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                        proposta.status === "enviada"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {proposta.status}
                    </span>
                  </Link>
                ))}
              {(!propostasData?.propostas ||
                propostasData.propostas.filter(
                  (p) => p.status === "enviada" || p.status === "rascunho"
                ).length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma proposta pendente
                </p>
              )}
            </div>
            {propostasData && propostasData.propostas.length > 5 && (
              <Link href="/propostas">
                <Button variant="outline" className="w-full mt-4">
                  Ver todas as propostas
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Contratos em Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contratos em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contratosData?.contratos
                .filter(
                  (c) =>
                    c.status === "em_analise" ||
                    c.status === "pendente" ||
                    c.status === "em_revisao"
                )
                .slice(0, 5)
                .map((contrato) => (
                  <Link
                    key={contrato.id}
                    href={`/contratos/${contrato.id}`}
                    className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <p className="font-semibold text-sm">
                      {contrato.imovel.titulo}
                    </p>
                    <p className="text-xs text-gray-600">
                      {contrato.comprador.nome} ↔ {contrato.vendedor.nome}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          contrato.status === "em_analise"
                            ? "bg-yellow-100 text-yellow-800"
                            : contrato.status === "pendente"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {contrato.status}
                      </span>
                      {contrato.total_mensagens > 0 && (
                        <span className="text-xs text-gray-500">
                          💬 {contrato.total_mensagens}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              {(!contratosData?.contratos ||
                contratosData.contratos.filter(
                  (c) =>
                    c.status === "em_analise" ||
                    c.status === "pendente" ||
                    c.status === "em_revisao"
                ).length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum contrato em análise
                </p>
              )}
            </div>
            {contratosData && contratosData.contratos.length > 5 && (
              <Link href="/contratos">
                <Button variant="outline" className="w-full mt-4">
                  Ver todos os contratos
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/contratos/novo/ia">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Criar Contrato com IA
            </Button>
          </Link>
          <Link href="/documentos/validar">
            <Button variant="outline" className="w-full justify-start">
              <FileCheck className="mr-2 h-4 w-4" />
              Validar Documentos
            </Button>
          </Link>
          <Link href="/certidoes">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Emitir Certidões
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}



