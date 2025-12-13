// lib/hooks/useFrontend.ts
// Hooks para endpoints específicos do frontend com dados completos
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { frontendApi } from "@/lib/api/endpoints";

// ============================================
// Tipos para as respostas dos endpoints
// ============================================

export interface ImobiliariaCompleta {
  id: string;
  usuario_id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  creci: string;
  logo_url?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
  corretores?: Array<{
    id: string;
    nome: string;
    cpf: string;
    creci: string;
    usuario?: {
      id: string;
      nome: string;
      email: string;
      telefone?: string;
    };
  }>;
  estatisticas?: {
    total_imoveis: number;
    total_propostas: number;
    total_contratos: number;
  };
}

export interface ImovelCompleto {
  id: string;
  imobiliaria_id: string;
  titulo: string;
  descricao?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  preco: number;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  banheiros?: number;
  vagas_garagem?: number;
  matricula_numero?: string;
  status: string;
  imagens?: string[];
  caracteristicas?: string[];
  imobiliaria?: {
    id: string;
    razao_social: string;
    nome_fantasia?: string;
  };
  proprietarios?: Array<{
    id: string;
    pessoa: {
      id: string;
      nome: string;
      cpf: string;
      email?: string;
      telefone?: string;
    };
    percentual_propriedade: number;
  }>;
  total_propostas: number;
  propostas_ativas: number;
}

export interface PropostaCompleta {
  id: string;
  imovel_id: string;
  comprador_id: string;
  vendedor_id: string;
  corretor_id?: string;
  imobiliaria_id?: string;
  valor: number;
  forma_pagamento?: string;
  relato_negociacao?: string;
  bens_que_ficam?: string;
  data_posse?: string;
  status: string;
  aprovado_comprador: boolean;
  aprovado_vendedor: boolean;
  data_aprovacao_comprador?: string;
  data_aprovacao_vendedor?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  imovel: {
    id: string;
    titulo: string;
    endereco: string;
    cidade: string;
    preco: number;
    imagens?: string[];
  };
  comprador: {
    id: string;
    nome: string;
    cpf: string;
    email?: string;
    telefone?: string;
  };
  vendedor: {
    id: string;
    nome: string;
    cpf: string;
    email?: string;
    telefone?: string;
  };
  tem_contrato: boolean;
  contrato_id?: string;
  contrato_status?: string;
}

export interface ContratoCompleto {
  id: string;
  proposta_id: string;
  imovel_id: string;
  conteudo: string;
  status: string;
  gerado_por_ia: boolean;
  modelo_imobiliaria_id?: string;
  aprovado_comprador: boolean;
  aprovado_vendedor: boolean;
  aprovado_imobiliaria: boolean;
  data_aprovacao_comprador?: string;
  data_aprovacao_vendedor?: string;
  data_aprovacao_imobiliaria?: string;
  assinado_comprador: boolean;
  assinado_vendedor: boolean;
  data_assinatura_comprador?: string;
  data_assinatura_vendedor?: string;
  arquivo_assinado_url?: string;
  created_at: string;
  updated_at: string;
  proposta: {
    id: string;
    valor: number;
    status: string;
  };
  imovel: {
    id: string;
    titulo: string;
    endereco: string;
    cidade?: string;
    preco: number;
  };
  comprador: {
    id: string;
    nome: string;
    cpf: string;
    email?: string;
  };
  vendedor: {
    id: string;
    nome: string;
    cpf: string;
    email?: string;
  };
  total_mensagens: number;
}

// ============================================
// Hooks
// ============================================

/**
 * Hook para obter a imobiliária vinculada ao usuário logado
 * Retorna dados completos incluindo corretores e estatísticas
 */
export function useMinhaImobiliaria() {
  return useQuery({
    queryKey: ["frontend", "minha-imobiliaria"],
    queryFn: async () => {
      const { data } = await frontendApi.minhaImobiliaria();
      return data.data as ImobiliariaCompleta | null;
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}

/**
 * Hook para obter os imóveis do usuário logado
 * Retorna dados completos incluindo proprietários e estatísticas de propostas
 */
export function useMeusImoveis(filters?: { status?: string; imobiliaria_id?: string }) {
  return useQuery({
    queryKey: ["frontend", "meus-imoveis", filters],
    queryFn: async () => {
      const { data } = await frontendApi.meusImoveis(filters);
      return {
        imoveis: data.data as ImovelCompleto[],
        count: data.count as number,
      };
    },
    staleTime: 2 * 60 * 1000, // Cache por 2 minutos
  });
}

/**
 * Hook para obter as propostas do usuário logado
 * Retorna dados completos incluindo imóvel, comprador e vendedor
 */
export function useMinhasPropostas(filters?: {
  status?: string;
  imovel_id?: string;
  imobiliaria_id?: string;
}) {
  return useQuery({
    queryKey: ["frontend", "minhas-propostas", filters],
    queryFn: async () => {
      const { data } = await frontendApi.minhasPropostas(filters);
      return {
        propostas: data.data as PropostaCompleta[],
        count: data.count as number,
      };
    },
    staleTime: 1 * 60 * 1000, // Cache por 1 minuto
  });
}

/**
 * Hook para obter os contratos do usuário logado
 * Retorna dados completos incluindo proposta, imóvel, comprador, vendedor e contagem de mensagens
 */
export function useMeusContratos(filters?: {
  status?: string;
  proposta_id?: string;
  imovel_id?: string;
}) {
  return useQuery({
    queryKey: ["frontend", "meus-contratos", filters],
    queryFn: async () => {
      const { data } = await frontendApi.meusContratos(filters);
      return {
        contratos: data.data as ContratoCompleto[],
        count: data.count as number,
      };
    },
    staleTime: 1 * 60 * 1000, // Cache por 1 minuto
  });
}

// ============================================
// Hooks de invalidação para atualizar cache
// ============================================

/**
 * Hook para invalidar o cache da imobiliária
 * Útil após atualizações de dados da imobiliária
 */
export function useInvalidateMinhaImobiliaria() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["frontend", "minha-imobiliaria"] });
  };
}

/**
 * Hook para invalidar o cache dos imóveis
 * Útil após criar, atualizar ou deletar imóveis
 */
export function useInvalidateMeusImoveis() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["frontend", "meus-imoveis"] });
  };
}

/**
 * Hook para invalidar o cache das propostas
 * Útil após criar, atualizar, aprovar ou enviar propostas
 */
export function useInvalidateMinhasPropostas() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["frontend", "minhas-propostas"] });
    // Também invalida a lista geral de propostas
    queryClient.invalidateQueries({ queryKey: ["propostas"] });
  };
}

/**
 * Hook para invalidar o cache dos contratos
 * Útil após gerar, atualizar, aprovar ou assinar contratos
 */
export function useInvalidateMeusContratos() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["frontend", "meus-contratos"] });
    // Também invalida a lista geral de contratos
    queryClient.invalidateQueries({ queryKey: ["contratos"] });
  };
}

/**
 * Hook para invalidar todos os caches do frontend
 * Útil após operações que afetam múltiplos recursos
 */
export function useInvalidateAllFrontend() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["frontend"] });
  };
}



