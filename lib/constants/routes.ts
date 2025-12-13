// lib/constants/routes.ts
// Constantes de rotas da aplicação

export const ROUTES = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Imóveis
  IMOVEIS: "/imoveis",
  IMOVEL_NOVO: "/imoveis/novo",
  IMOVEL_DETAIL: (id: string) => `/imoveis/${id}`,
  IMOVEL_EDIT: (id: string) => `/imoveis/${id}/editar`,
  IMOVEL_IMOBILIARIAS: (id: string) => `/imoveis/${id}/imobiliarias`,

  // Propostas
  PROPOSTAS: "/propostas",
  PROPOSTA_NOVA: "/propostas/nova",
  PROPOSTA_DETAIL: (id: string) => `/propostas/${id}`,
  PROPOSTA_EDIT: (id: string) => `/propostas/${id}/editar`,

  // Contratos
  CONTRATOS: "/contratos",
  CONTRATO_DETAIL: (id: string) => `/contratos/${id}`,
  CONTRATO_APROVAR: (id: string) => `/contratos/${id}/aprovar`,
  CONTRATO_SUGERIR: (id: string) => `/contratos/${id}/sugerir`,
  CONTRATO_ADVOGADOS: (id: string) => `/contratos/${id}/advogados`,
  CONTRATO_ASSINATURA: (id: string) => `/contratos/${id}/assinatura`,

  // Templates
  TEMPLATES: "/templates",
  TEMPLATE_NOVO: "/templates/novo",
  TEMPLATE_DETAIL: (id: string) => `/templates/${id}`,
  TEMPLATE_EDIT: (id: string) => `/templates/${id}/editar`,

  // Documentos
  DOCUMENTOS: "/documentos",
  DOCUMENTOS_UPLOAD: "/documentos/upload",

  // Mensagens
  MENSAGENS: "/mensagens",
  MENSAGENS_CONTRATO: (contratoId: string) => `/mensagens/contrato/${contratoId}`,

  // Advogados
  ADVOGADOS: "/advogados",
  ADVOGADO_DETAIL: (id: string) => `/advogados/${id}`,

  // Corretores
  CORRETORES: "/corretores",
  CORRETOR_NOVO: "/corretores/novo",
  CORRETOR_DETAIL: (id: string) => `/corretores/${id}`,

  // Configurações
  CONFIGURACAO: "/configuracao",
  CONFIGURACAO_PERFIL: "/configuracao/perfil",
  CONFIGURACAO_WHITE_LABEL: "/configuracao/white-label",
  CONFIGURACAO_INTEGRACOES: "/configuracao/integracoes",
} as const;



