// types/index.ts
// Tipos principais da aplicação

export type Role = "admin" | "imobiliaria" | "corretor" | "comprador" | "vendedor" | "advogado";

export type PropostaStatus = "rascunho" | "enviada" | "aprovada" | "rejeitada" | "cancelada";

export type ContratoStatus =
  | "pendente"
  | "em_analise"
  | "em_revisao"
  | "aprovado"
  | "assinado"
  | "concluido";

export type EntidadeTipo = "imovel" | "proprietario" | "comprador" | "corretor" | "imobiliaria";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  cpf?: string;
  telefone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Imobiliaria {
  id: string;
  usuario_id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  creci?: string;
  logo_url?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pessoa {
  id: string;
  usuario_id?: string;
  nome: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  estado_civil?: string;
  nome_conjuge?: string;
  cpf_conjuge?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  tipo: "proprietario" | "comprador" | "ambos";
  created_at: string;
  updated_at: string;
}

export interface Imovel {
  id: string;
  imobiliaria_id: string;
  titulo: string;
  descricao?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  preco: number;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  banheiros?: number;
  vagas_garagem?: number;
  matricula_numero?: string;
  cartorio?: string;
  comarca?: string;
  status: "disponivel" | "reservado" | "vendido" | "retirado";
  imagens?: string[];
  caracteristicas?: string[];
  created_at: string;
  updated_at: string;
}

export interface Proposta {
  id: string;
  imovel_id: string;
  comprador_id: string;
  vendedor_id: string;
  corretor_id?: string;
  imobiliaria_id: string;
  valor: number;
  forma_pagamento: string;
  relato_negociacao?: string;
  bens_que_ficam?: string;
  data_posse?: string;
  status: PropostaStatus;
  aprovado_comprador: boolean;
  aprovado_vendedor: boolean;
  data_aprovacao_comprador?: string;
  data_aprovacao_vendedor?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contrato {
  id: string;
  proposta_id: string;
  imovel_id: string;
  conteudo: string;
  status: ContratoStatus;
  gerado_por_ia: boolean;
  modelo_imobiliaria_id?: string;
  aprovado_comprador: boolean;
  aprovado_vendedor: boolean;
  aprovado_imobiliaria: boolean;
  data_aprovacao_comprador?: string;
  data_aprovacao_vendedor?: string;
  data_aprovacao_imobiliaria?: string;
  assinado_comprador: boolean;
  assinado_vendedor: boolean;
  data_assinatura_comprador?: string;
  data_assinatura_vendedor?: string;
  arquivo_assinado_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContratoTemplate {
  id: string;
  imobiliaria_id: string;
  nome: string;
  descricao?: string;
  conteudo_template: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Documento {
  id: string;
  entidade_tipo: EntidadeTipo;
  entidade_id: string;
  tipo_documento: string;
  nome: string;
  descricao?: string;
  url: string;
  nome_arquivo?: string;
  tamanho_arquivo?: number;
  mime_type?: string;
  data_emissao?: string;
  data_validade?: string;
  status: "pendente" | "enviado" | "verificado" | "aprovado" | "rejeitado";
  enviado_por?: string;
  verificado_por?: string;
  data_verificacao?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Mensagem {
  id: string;
  contrato_id: string;
  usuario_id: string;
  texto: string;
  anexos?: string[];
  criado_em: string;
  usuario?: Usuario;
}

