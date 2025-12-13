// lib/hooks/useAuth.ts
// Hook de autenticação
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { getImobiliariaDoUsuario } from "@/lib/supabase/queries/imobiliaria-client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const { user, usuario, imobiliaria, loading, setUser, setUsuario, setImobiliaria, setLoading, signOut } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Função para buscar imobiliária do usuário
    const fetchImobiliaria = async (userId: string) => {
      try {
        const imobiliariaData = await getImobiliariaDoUsuario();
        setImobiliaria(imobiliariaData);
      } catch (error) {
        console.error("Erro ao buscar imobiliária:", error);
        setImobiliaria(null);
      }
    };

    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Se houver usuário, buscar imobiliária
      if (session?.user) {
        fetchImobiliaria(session.user.id);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Se houver usuário, buscar dados completos
      if (session?.user) {
        // TODO: Buscar dados do usuário da API
        // fetchUsuario(session.user.id);
        // Buscar imobiliária
        fetchImobiliaria(session.user.id);
      } else {
        setUsuario(null);
        setImobiliaria(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setUsuario, setImobiliaria, setLoading]);

  return {
    user,
    usuario,
    imobiliaria,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}



