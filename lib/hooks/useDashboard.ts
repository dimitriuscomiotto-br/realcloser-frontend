// lib/hooks/useDashboard.ts
// Hook para buscar estatísticas do dashboard
"use client";

import { useQuery } from "@tanstack/react-query";
import { imoveisApi, contratosApi, propostasApi, documentosApi } from "@/lib/api/endpoints";
import type { Imovel, Contrato, Proposta, Documento } from "@/types";

export interface DashboardStats {
  imoveis: {
    total: number;
    comProposta: number;
    vendidos: number;
  };
  contratos: {
    ativos: number;
    aguardandoAssinatura: number;
    concluidos: number;
  };
  propostas: {
    total: number;
    emAndamento: number;
    aprovadas: number;
  };
  pendencias: {
    documentacao: number;
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Buscar todos os dados em paralelo
      const [imoveisRes, contratosRes, propostasRes] = await Promise.all([
        imoveisApi.listar(),
        contratosApi.listar(),
        propostasApi.listar(),
      ]);

      const imoveis = imoveisRes.data.data as Imovel[];
      const contratos = contratosRes.data.data as Contrato[];
      const propostas = propostasRes.data.data as Proposta[];

      // Calcular estatísticas de imóveis
      const imoveisComProposta = new Set(
        propostas.map((p) => p.imovel_id)
      ).size;
      const imoveisVendidos = imoveis.filter(
        (i) => i.status === "vendido"
      ).length;

      // Calcular estatísticas de contratos
      const contratosAtivos = contratos.filter(
        (c) =>
          c.status === "pendente" ||
          c.status === "em_analise" ||
          c.status === "em_revisao" ||
          c.status === "aprovado"
      ).length;
      const aguardandoAssinatura = contratos.filter(
        (c) =>
          c.status === "aprovado" &&
          (!c.assinado_comprador || !c.assinado_vendedor)
      ).length;
      const contratosConcluidos = contratos.filter(
        (c) => c.status === "concluido"
      ).length;

      // Calcular estatísticas de propostas
      const propostasEmAndamento = propostas.filter(
        (p) =>
          p.status === "rascunho" ||
          p.status === "enviada" ||
          (p.status === "aprovada" && !p.aprovado_comprador && !p.aprovado_vendedor)
      ).length;
      const propostasAprovadas = propostas.filter(
        (p) => p.status === "aprovada"
      ).length;

      // Buscar pendências de documentação
      let pendenciasDocumentacao = 0;
      try {
        // Buscar documentos pendentes de todas as entidades relacionadas
        const documentosPromises = contratos.map((contrato) =>
          documentosApi.listarPorEntidade("imovel", contrato.imovel_id).catch(() => ({ data: { data: [] } }))
        );
        const documentosResults = await Promise.all(documentosPromises);
        const todosDocumentos = documentosResults.flatMap(
          (res) => res.data.data as Documento[]
        );
        pendenciasDocumentacao = todosDocumentos.filter(
          (d) => d.status === "pendente" || d.status === "enviado"
        ).length;
      } catch (error) {
        console.error("Erro ao buscar pendências:", error);
      }

      return {
        imoveis: {
          total: imoveis.length,
          comProposta: imoveisComProposta,
          vendidos: imoveisVendidos,
        },
        contratos: {
          ativos: contratosAtivos,
          aguardandoAssinatura,
          concluidos: contratosConcluidos,
        },
        propostas: {
          total: propostas.length,
          emAndamento: propostasEmAndamento,
          aprovadas: propostasAprovadas,
        },
        pendencias: {
          documentacao: pendenciasDocumentacao,
        },
      };
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });
}


