// lib/hooks/usePropostas.ts
// Hook para gerenciar propostas
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propostasApi } from "@/lib/api/endpoints";
import type { Proposta } from "@/types";

export function usePropostas(filters?: any) {
  return useQuery({
    queryKey: ["propostas", filters],
    queryFn: async () => {
      const { data } = await propostasApi.listar(filters);
      return data.data as Proposta[];
    },
  });
}

export function useProposta(id: string) {
  return useQuery({
    queryKey: ["propostas", id],
    queryFn: async () => {
      const { data } = await propostasApi.buscar(id);
      return data.data as Proposta;
    },
    enabled: !!id,
  });
}

export function useCreateProposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propostaData: any) => propostasApi.criar(propostaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}

export function useEnviarProposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propostasApi.enviar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}

export function useAprovarPropostaComprador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propostasApi.aprovarComprador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}

export function useAprovarPropostaVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propostasApi.aprovarVendedor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}

export function useUpdateProposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Proposta> }) =>
      propostasApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}



