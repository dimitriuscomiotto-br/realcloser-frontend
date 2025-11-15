// lib/hooks/useAuth.ts
// Hook de autenticação
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const { user, usuario, loading, setUser, setUsuario, setLoading, signOut } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
      } else {
        setUsuario(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setUsuario, setLoading]);

  return {
    user,
    usuario,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}


