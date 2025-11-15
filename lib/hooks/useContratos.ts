// lib/hooks/useContratos.ts
// Hook para gerenciar contratos
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contratosApi } from "@/lib/api/endpoints";
import type { Contrato } from "@/types";

export function useContratos(filters?: any) {
  return useQuery({
    queryKey: ["contratos", filters],
    queryFn: async () => {
      const { data } = await contratosApi.listar(filters);
      return data.data as Contrato[];
    },
  });
}

export function useContrato(id: string) {
  return useQuery({
    queryKey: ["contratos", id],
    queryFn: async () => {
      const { data } = await contratosApi.buscar(id);
      return data.data as Contrato;
    },
    enabled: !!id,
  });
}

export function useGerarContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propostaId: string) => contratosApi.gerar(propostaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
  });
}

export function useAprovarContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parte }: { id: string; parte: string }) =>
      contratosApi.aprovar(id, parte),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
  });
}

export function useAssinarContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parte, arquivoUrl }: { id: string; parte: string; arquivoUrl?: string }) =>
      contratosApi.assinar(id, parte, arquivoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
  });
}


