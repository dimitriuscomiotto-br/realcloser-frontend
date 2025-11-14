// stores/themeStore.ts
// Store de tema white-label
import { create } from "zustand";
import type { Imobiliaria } from "@/types";

interface ThemeState {
  imobiliaria: Imobiliaria | null;
  theme: {
    primary: string;
    secondary: string;
    logo?: string;
    fonts?: {
      heading?: string;
      body?: string;
    };
  } | null;
  setImobiliaria: (imobiliaria: Imobiliaria | null) => void;
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  imobiliaria: null,
  theme: null,
  setImobiliaria: (imobiliaria) => set({ imobiliaria }),
  setTheme: (theme) => set({ theme }),
}));

