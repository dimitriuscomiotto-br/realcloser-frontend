// lib/utils/imobiliaria.ts
// Funções utilitárias para trabalhar com imobiliária

import { createClient } from "@/lib/supabase/server";

/**
 * Busca o ID da imobiliária do usuário logado
 * 
 * @returns ID da imobiliária ou null se não encontrado
 * 
 * TODO: Integrar com a tabela de usuários/imobiliárias quando a autenticação estiver completa.
 * Por enquanto, busca na tabela `imobiliarias` usando o `usuario_id` da sessão.
 */
export async function getImobiliariaId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    
    // Buscar sessão do usuário
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    // Buscar imobiliária relacionada ao usuário
    const { data, error } = await supabase
      .from("imobiliarias")
      .select("id")
      .eq("usuario_id", session.user.id)
      .eq("ativo", true)
      .single();

    if (error || !data) {
      console.warn("Imobiliária não encontrada para o usuário:", error);
      // TODO: Integrar com autenticação completa para buscar imobiliária do usuário
      // Por enquanto, retorna null - a página mostrará mensagem de erro
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Erro ao buscar imobiliária:", error);
    return null;
  }
}

