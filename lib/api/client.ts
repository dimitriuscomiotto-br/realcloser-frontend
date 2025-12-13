// lib/api/client.ts
// Cliente HTTP para comunicação com a RealCloser API
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Criar instância do Axios
const apiClient = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  async (config) => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;



