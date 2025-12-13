// lib/hooks/useMensagens.ts
// Hook para gerenciar mensagens/chat
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mensagensApi } from "@/lib/api/endpoints";
import type { Mensagem } from "@/types";

export function useMensagensPorContrato(contratoId: string, limit?: number, offset?: number) {
  return useQuery({
    queryKey: ["mensagens", "contrato", contratoId, limit, offset],
    queryFn: async () => {
      const { data } = await mensagensApi.listarPorContrato(contratoId, limit, offset);
      return data.data as Mensagem[];
    },
    enabled: !!contratoId,
  });
}

export function useMensagem(id: string) {
  return useQuery({
    queryKey: ["mensagens", id],
    queryFn: async () => {
      const { data } = await mensagensApi.buscar(id);
      return data.data as Mensagem;
    },
    enabled: !!id,
  });
}

export function useMensagensRecentes(limit?: number) {
  return useQuery({
    queryKey: ["mensagens", "recentes", limit],
    queryFn: async () => {
      const { data } = await mensagensApi.recentes(limit);
      return data.data as Mensagem[];
    },
  });
}

export function useEnviarMensagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mensagemData: { contrato_id: string; texto: string; anexos?: string[] }) =>
      mensagensApi.criar(mensagemData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mensagens", "contrato", variables.contrato_id] });
      queryClient.invalidateQueries({ queryKey: ["mensagens", "recentes"] });
    },
  });
}

export function useAtualizarMensagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Mensagem> }) =>
      mensagensApi.atualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mensagens", variables.id] });
    },
  });
}

export function useAdicionarAnexoMensagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, anexoUrl }: { id: string; anexoUrl: string }) =>
      mensagensApi.adicionarAnexo(id, anexoUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mensagens"] });
    },
  });
}

export function useDeletarMensagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mensagensApi.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensagens"] });
    },
  });
}
