// stores/authStore.ts
// Store de autenticação com Zustand
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Usuario, Imobiliaria } from "@/types";

interface AuthState {
  user: User | null;
  usuario: Usuario | null;
  imobiliaria: Imobiliaria | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUsuario: (usuario: Usuario | null) => void;
  setImobiliaria: (imobiliaria: Imobiliaria | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  usuario: null,
  imobiliaria: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUsuario: (usuario) => set({ usuario }),
  setImobiliaria: (imobiliaria) => set({ imobiliaria }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, usuario: null, imobiliaria: null });
  },
  refreshSession: async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null });
  },
}));



