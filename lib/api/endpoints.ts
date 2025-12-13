// lib/api/endpoints.ts
// Endpoints tipados da API
import apiClient from "./client";

// Propostas
export const propostasApi = {
  listar: (filters?: any) => apiClient.get("/propostas", { params: filters }),
  buscar: (id: string) => apiClient.get(`/propostas/${id}`),
  criar: (data: any) => apiClient.post("/propostas", data),
  atualizar: (id: string, data: any) => apiClient.put(`/propostas/${id}`, data),
  enviar: (id: string) => apiClient.post(`/propostas/${id}/enviar`),
  aprovarComprador: (id: string) => apiClient.post(`/propostas/${id}/aprovar-comprador`),
  aprovarVendedor: (id: string) => apiClient.post(`/propostas/${id}/aprovar-vendedor`),
};

// Contratos
export const contratosApi = {
  listar: (filters?: any) => apiClient.get("/contratos", { params: filters }),
  buscar: (id: string) => apiClient.get(`/contratos/${id}`),
  gerar: (propostaId: string) => apiClient.post("/contratos/gerar", { proposta_id: propostaId }),
  aprovar: (id: string, parte: string) => apiClient.post(`/contratos/${id}/aprovar`, { parte }),
  assinar: (id: string, parte: string, arquivoUrl?: string) =>
    apiClient.post(`/contratos/${id}/assinar`, { parte, arquivo_url: arquivoUrl }),
  verificarPendencias: (propostaId: string) =>
    apiClient.get(`/contratos/proposta/${propostaId}/pendencias`),
};

// Templates de Contratos
export const templatesApi = {
  listar: (filters?: any) => apiClient.get("/contrato-templates", { params: filters }),
  listarPorImobiliaria: (imobiliariaId: string, apenasAtivos?: boolean) =>
    apiClient.get(`/contrato-templates/imobiliaria/${imobiliariaId}`, {
      params: { apenas_ativos: apenasAtivos },
    }),
  buscarAtivo: (imobiliariaId: string) =>
    apiClient.get(`/contrato-templates/imobiliaria/${imobiliariaId}/ativo`),
  buscar: (id: string) => apiClient.get(`/contrato-templates/${id}`),
  criar: (data: any) => apiClient.post("/contrato-templates", data),
  atualizar: (id: string, data: any) => apiClient.put(`/contrato-templates/${id}`, data),
  ativar: (id: string) => apiClient.post(`/contrato-templates/${id}/ativar`),
  desativar: (id: string) => apiClient.post(`/contrato-templates/${id}/desativar`),
  deletar: (id: string) => apiClient.delete(`/contrato-templates/${id}`),
};

// Imóveis
export const imoveisApi = {
  listar: (filters?: any) => apiClient.get("/properties", { params: filters }),
  buscar: (id: string) => apiClient.get(`/properties/${id}`),
  criar: (data: any) => apiClient.post("/properties", data),
  atualizar: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
  deletar: (id: string) => apiClient.delete(`/properties/${id}`),
};

// Documentos
export const documentosApi = {
  listarPorEntidade: (entidadeTipo: string, entidadeId: string) =>
    apiClient.get(`/documentos/${entidadeTipo}/${entidadeId}`),
  buscar: (id: string) => apiClient.get(`/documentos/${id}`),
  criar: (data: any) => apiClient.post("/documentos", data),
  atualizar: (id: string, data: any) => apiClient.put(`/documentos/${id}`, data),
  verificar: (id: string, status: string, observacoes?: string) =>
    apiClient.post(`/documentos/${id}/verificar`, { status, observacoes }),
};

// Mensagens
export const mensagensApi = {
  listarPorContrato: (contratoId: string, limit?: number, offset?: number) =>
    apiClient.get(`/mensagens/contrato/${contratoId}`, { params: { limit, offset } }),
  buscar: (id: string) => apiClient.get(`/mensagens/${id}`),
  criar: (data: any) => apiClient.post("/mensagens", data),
  atualizar: (id: string, data: any) => apiClient.put(`/mensagens/${id}`, data),
  adicionarAnexo: (id: string, anexoUrl: string) =>
    apiClient.post(`/mensagens/${id}/anexo`, { anexo_url: anexoUrl }),
  deletar: (id: string) => apiClient.delete(`/mensagens/${id}`),
  recentes: (limit?: number) => apiClient.get("/mensagens/recentes", { params: { limit } }),
};

// Frontend Endpoints - Dados completos e formatados
export const frontendApi = {
  // Minha Imobiliária
  minhaImobiliaria: () => apiClient.get("/frontend/minha-imobiliaria"),

  // Meus Imóveis
  meusImoveis: (filters?: { status?: string; imobiliaria_id?: string }) =>
    apiClient.get("/frontend/meus-imoveis", { params: filters }),

  // Minhas Propostas
  minhasPropostas: (filters?: { status?: string; imovel_id?: string; imobiliaria_id?: string }) =>
    apiClient.get("/frontend/minhas-propostas", { params: filters }),

  // Meus Contratos
  meusContratos: (filters?: { status?: string; proposta_id?: string; imovel_id?: string }) =>
    apiClient.get("/frontend/meus-contratos", { params: filters }),
};



