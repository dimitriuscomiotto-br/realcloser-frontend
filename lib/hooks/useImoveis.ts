// lib/hooks/useImoveis.ts
// Hook para gerenciar imóveis
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imoveisApi } from "@/lib/api/endpoints";
import type { Imovel } from "@/types";

export function useImoveis(filters?: any) {
  return useQuery({
    queryKey: ["imoveis", filters],
    queryFn: async () => {
      const { data } = await imoveisApi.listar(filters);
      return data.data as Imovel[];
    },
  });
}

export function useImovel(id: string) {
  return useQuery({
    queryKey: ["imoveis", id],
    queryFn: async () => {
      const { data } = await imoveisApi.buscar(id);
      return data.data as Imovel;
    },
    enabled: !!id,
  });
}

export function useCreateImovel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imovelData: any) => imoveisApi.criar(imovelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
      // Invalida também os imóveis do frontend
      queryClient.invalidateQueries({ queryKey: ["frontend", "meus-imoveis"] });
    },
  });
}

export function useUpdateImovel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      imoveisApi.atualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
      queryClient.invalidateQueries({ queryKey: ["imoveis", variables.id] });
      // Invalida também os imóveis do frontend
      queryClient.invalidateQueries({ queryKey: ["frontend", "meus-imoveis"] });
    },
  });
}

export function useDeleteImovel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => imoveisApi.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
      // Invalida também os imóveis do frontend
      queryClient.invalidateQueries({ queryKey: ["frontend", "meus-imoveis"] });
    },
  });
}



