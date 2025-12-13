// lib/supabase/queries/imobiliaria-client.ts
// Queries do Supabase para imobiliária (versão client-side)

import { createClient } from "@/lib/supabase/client";
import type { Imobiliaria } from "@/types";

/**
 * Busca a imobiliária vinculada ao usuário logado
 * @returns Imobiliária ou null se não encontrada
 */
export async function getImobiliariaDoUsuario(): Promise<Imobiliaria | null> {
  try {
    const supabase = createClient();
    
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
      .select("*")
      .eq("usuario_id", session.user.id)
      .eq("ativo", true)
      .single();

    if (error || !data) {
      console.warn("Imobiliária não encontrada para o usuário:", error);
      return null;
    }

    return data as Imobiliaria;
  } catch (error) {
    console.error("Erro ao buscar imobiliária:", error);
    return null;
  }
}



