# 🎣 Hooks do Frontend - Guia Rápido

## 📦 Instalação

Os hooks já estão criados e prontos para uso. Certifique-se de que o TanStack Query está configurado no seu projeto.

## 🚀 Uso Básico

### 1. Importar os hooks

```tsx
import {
  useMinhaImobiliaria,
  useMeusImoveis,
  useMinhasPropostas,
  useMeusContratos,
} from "@/lib/hooks/useFrontend";
```

### 2. Usar nos componentes

```tsx
"use client";

import { useMinhaImobiliaria } from "@/lib/hooks/useFrontend";

export default function Dashboard() {
  const { data, isLoading, error } = useMinhaImobiliaria();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!data) return <div>Nenhuma imobiliária encontrada</div>;

  return (
    <div>
      <h1>{data.razao_social}</h1>
      <p>Total de imóveis: {data.estatisticas?.total_imoveis}</p>
    </div>
  );
}
```

## 📚 Hooks Disponíveis

### `useMinhaImobiliaria()`
Retorna a imobiliária vinculada ao usuário logado.

### `useMeusImoveis(filters?)`
Retorna os imóveis do usuário com dados completos.

### `useMinhasPropostas(filters?)`
Retorna as propostas do usuário com dados completos.

### `useMeusContratos(filters?)`
Retorna os contratos do usuário com dados completos.

## 📖 Documentação Completa

Veja a [documentação completa](./docs/HOOKS_FRONTEND.md) para:
- Exemplos detalhados de uso
- Hooks de invalidação
- Tratamento de erros
- Exemplos de componentes completos



