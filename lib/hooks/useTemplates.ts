// lib/hooks/useTemplates.ts
// Hook para gerenciar templates de contratos
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "@/lib/api/endpoints";
import type { ContratoTemplate } from "@/types";

export function useTemplates(filters?: any) {
  return useQuery({
    queryKey: ["contrato-templates", filters],
    queryFn: async () => {
      const { data } = await templatesApi.listar(filters);
      return data.data as ContratoTemplate[];
    },
  });
}

export function useTemplatesPorImobiliaria(imobiliariaId: string, apenasAtivos?: boolean) {
  return useQuery({
    queryKey: ["contrato-templates", "imobiliaria", imobiliariaId, apenasAtivos],
    queryFn: async () => {
      const { data } = await templatesApi.listarPorImobiliaria(imobiliariaId, apenasAtivos);
      return data.data as ContratoTemplate[];
    },
    enabled: !!imobiliariaId,
  });
}

export function useTemplateAtivo(imobiliariaId: string) {
  return useQuery({
    queryKey: ["contrato-templates", "imobiliaria", imobiliariaId, "ativo"],
    queryFn: async () => {
      const { data } = await templatesApi.buscarAtivo(imobiliariaId);
      return data.data as ContratoTemplate | null;
    },
    enabled: !!imobiliariaId,
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["contrato-templates", id],
    queryFn: async () => {
      const { data } = await templatesApi.buscar(id);
      return data.data as ContratoTemplate;
    },
    enabled: !!id,
  });
}

export function useCriarTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateData: {
      imobiliaria_id: string;
      nome: string;
      descricao?: string;
      conteudo_template: string;
    }) => templatesApi.criar(templateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contrato-templates"] });
      queryClient.invalidateQueries({
        queryKey: ["contrato-templates", "imobiliaria", variables.imobiliaria_id],
      });
    },
  });
}

export function useAtualizarTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContratoTemplate> }) =>
      templatesApi.atualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contrato-templates", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["contrato-templates"] });
    },
  });
}

export function useAtivarTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesApi.ativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-templates"] });
    },
  });
}

export function useDesativarTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesApi.desativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-templates"] });
    },
  });
}

export function useDeletarTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesApi.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-templates"] });
    },
  });
}
