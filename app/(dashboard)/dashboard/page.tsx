// app/(dashboard)/dashboard/page.tsx
// Dashboard principal
"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useDashboardStats } from "@/lib/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  Building2,
  Handshake,
  FileCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || statsLoading) {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
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

        {/* Pendências */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.pendencias.documentacao || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Documentação pendente
            </p>
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


