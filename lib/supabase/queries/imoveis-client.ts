// lib/supabase/queries/imoveis-client.ts
// Queries do Supabase para imóveis (versão client-side)

import { createClient } from "@/lib/supabase/client";
import type { Imovel } from "@/types";
import type { ImovelFilters, ImovelComRelacoes } from "./imoveis";

/**
 * Busca imóveis da imobiliária com filtros opcionais (versão client-side)
 */
export async function getImoveisDaImobiliariaClient(
  imobiliariaId: string,
  filters?: ImovelFilters
): Promise<ImovelComRelacoes[]> {
  const supabase = createClient();

  // Query base
  // Nota: A tabela usa 'criado_em' em vez de 'created_at'
  let query = supabase
    .from("imoveis")
    .select("*")
    .eq("imobiliaria_id", imobiliariaId)
    .order("criado_em", { ascending: false });

  // Aplicar filtros
  if (filters?.codigo) {
    // Filtrar por código usando apenas o id (não existe coluna 'codigo' na tabela)
    const codigoLower = filters.codigo.toLowerCase();
    query = query.ilike("id", `%${codigoLower}%`);
  }

  if (filters?.endereco) {
    // Filtrar por endereço ou cidade (não existe coluna 'cep' na tabela)
    const enderecoLower = filters.endereco.toLowerCase();
    query = query.or(
      `endereco.ilike.%${enderecoLower}%,cidade.ilike.%${enderecoLower}%`
    );
  }

  if (filters?.status) {
    // Mapear status do filtro para o valor no banco
    const statusMap: Record<string, string> = {
      Liberado: "disponivel",
      Negociação: "reservado",
      "Confeccionando Contratos": "reservado", // Assumindo que está em negociação
      Vendidos: "vendido",
    };

    const statusBanco = statusMap[filters.status] || filters.status;
    query = query.eq("status", statusBanco);
  }

  const { data: imoveis, error } = await query;

  if (error) {
    console.error("Erro ao buscar imóveis:", error);
    throw error;
  }

  if (!imoveis || imoveis.length === 0) {
    return [];
  }

  // Enriquecer com dados relacionados
  const imoveisEnriquecidos = await Promise.all(
    imoveis.map(async (imovel) => {
      const imovelCompleto: ImovelComRelacoes = {
        ...imovel,
        proprietarios: [],
        documentos_count: 0,
        due_diligence_status: null,
      };

      // Buscar proprietários
      try {
        // TODO: Verificar se a tabela imovel_proprietarios existe no banco
        // Se existir, fazer join com a tabela de pessoas
        const { data: proprietariosRelacao } = await supabase
          .from("imovel_proprietarios")
          .select("pessoa_id")
          .eq("imovel_id", imovel.id);

        if (proprietariosRelacao && proprietariosRelacao.length > 0) {
          const pessoaIds = proprietariosRelacao.map((p) => p.pessoa_id);
          
          // Buscar dados das pessoas
          const { data: pessoas } = await supabase
            .from("pessoas")
            .select("id, nome")
            .in("id", pessoaIds);

          if (pessoas) {
            imovelCompleto.proprietarios = pessoas.map((p) => ({
              id: p.id,
              nome: p.nome,
            }));
          }
        }
      } catch (error) {
        // Se a tabela não existir, deixar vazio
        console.warn("Erro ao buscar proprietários (tabela pode não existir):", error);
      }

      // Buscar contagem de documentos
      try {
        const { count, error: docError } = await supabase
          .from("documentos")
          .select("*", { count: "exact", head: true })
          .eq("entidade_tipo", "imovel")
          .eq("entidade_id", imovel.id);

        if (!docError && count !== null) {
          imovelCompleto.documentos_count = count;
        }
      } catch (error) {
        console.warn("Erro ao buscar documentos:", error);
      }

      // Buscar status de due diligence
      // TODO: Verificar se existe tabela de due_diligence no banco
      // Por enquanto, placeholder
      try {
        // Tentar buscar de uma possível tabela due_diligence
        const { data: dueDiligence } = await supabase
          .from("due_diligence")
          .select("status")
          .eq("imovel_id", imovel.id)
          .single();

        if (dueDiligence) {
          imovelCompleto.due_diligence_status =
            dueDiligence.status === "ok" ? "ok" : "pendente";
        }
      } catch (error) {
        // Tabela não existe ainda, deixar como null
        imovelCompleto.due_diligence_status = null;
      }

      // Aplicar filtro de proprietário se fornecido
      if (filters?.proprietario) {
        const nomeProprietario = filters.proprietario.toLowerCase();
        const temProprietario = imovelCompleto.proprietarios?.some((p) =>
          p.nome.toLowerCase().includes(nomeProprietario)
        );

        if (!temProprietario) {
          return null; // Filtrar este imóvel
        }
      }

      return imovelCompleto;
    })
  );

  // Remover nulls (imóveis filtrados por proprietário)
  return imoveisEnriquecidos.filter(
    (imovel): imovel is ImovelComRelacoes => imovel !== null
  );
}

