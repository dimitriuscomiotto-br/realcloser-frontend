// lib/utils/imoveis.ts
// Funções utilitárias para trabalhar com imóveis (sem dependências de server/client)

import type { Imovel } from "@/types";

export interface ImovelFilters {
  codigo?: string;
  endereco?: string;
  status?: string;
  proprietario?: string;
}

export interface ImovelComRelacoes extends Imovel {
  proprietarios?: Array<{ id: string; nome: string }>;
  documentos_count?: number;
  due_diligence_status?: "ok" | "pendente" | null;
}

/**
 * Mapeia o status do banco para o rótulo em português
 */
export function mapStatusToLabel(status: string): string {
  const statusMap: Record<string, string> = {
    disponivel: "Liberado",
    reservado: "Negociação",
    vendido: "Vendidos",
    retirado: "Retirado",
  };

  return statusMap[status] || status;
}

