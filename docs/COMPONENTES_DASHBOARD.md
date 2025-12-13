# 🎨 Componentes do Dashboard - Documentação

## 📋 Visão Geral

Os componentes do dashboard foram atualizados para usar os hooks do TanStack Query que integram com os endpoints do frontend. Todos os componentes são client-side e utilizam os hooks customizados criados.

---

## 🏠 Dashboard Principal

**Arquivo:** `app/(dashboard)/dashboard/page.tsx`

### Funcionalidades

- ✅ Exibe estatísticas em cards
- ✅ Lista imóveis recentes
- ✅ Lista propostas pendentes
- ✅ Lista contratos em análise
- ✅ Usa hooks do frontend para buscar dados completos

### Hooks Utilizados

```tsx
import {
  useMinhaImobiliaria,
  useMeusImoveis,
  useMinhasPropostas,
  useMeusContratos,
} from "@/lib/hooks/useFrontend";
```

### Estatísticas Exibidas

- **Imóveis**: Total, com proposta, vendidos
- **Contratos**: Ativos, aguardando assinatura, concluídos
- **Propostas**: Total, em andamento, aprovadas
- **Corretores**: Total de corretores da imobiliária

---

## 🏘️ Página de Imóveis

**Arquivo:** `app/(dashboard)/imoveis/page.tsx`

### Funcionalidades

- ✅ Lista todos os imóveis do usuário
- ✅ Filtros por status (disponível, reservado, vendido)
- ✅ Cards com informações completas
- ✅ Exibe proprietários de cada imóvel
- ✅ Mostra estatísticas de propostas por imóvel
- ✅ Suporte a imagens

### Hook Utilizado

```tsx
const { data, isLoading, error } = useMeusImoveis({ status: statusFilter });
```

### Informações Exibidas

- Título e descrição
- Endereço completo
- Preço formatado
- Características (quartos, banheiros, área, vagas)
- Proprietários com percentual
- Número de propostas ativas

---

## 📝 Página de Propostas

**Arquivo:** `app/(dashboard)/propostas/page.tsx`

### Funcionalidades

- ✅ Lista todas as propostas do usuário
- ✅ Filtros por status (rascunho, enviada, aprovada, rejeitada, cancelada)
- ✅ Exibe dados completos de comprador e vendedor
- ✅ Mostra status de aprovação de cada parte
- ✅ Botões de ação para aprovar proposta
- ✅ Indicação se já existe contrato relacionado

### Hooks Utilizados

```tsx
const { data, isLoading, error } = useMinhasPropostas({ status: statusFilter });
const aprovarComprador = useAprovarPropostaComprador();
const aprovarVendedor = useAprovarPropostaVendedor();
```

### Informações Exibidas

- Dados do imóvel (título, endereço)
- Dados do comprador (nome, CPF, email, status de aprovação)
- Dados do vendedor (nome, CPF, email, status de aprovação)
- Valor da proposta formatado
- Forma de pagamento
- Status da proposta
- Link para contrato (se existir)

---

## 📄 Página de Contratos

**Arquivo:** `app/(dashboard)/contratos/page.tsx`

### Funcionalidades

- ✅ Lista todos os contratos do usuário
- ✅ Filtros por status (pendente, em análise, em revisão, aprovado, assinado, concluído)
- ✅ Exibe dados completos de proposta, imóvel, comprador e vendedor
- ✅ Mostra status de aprovação e assinatura de cada parte
- ✅ Contagem de mensagens por contrato
- ✅ Botões de ação para aprovar contrato
- ✅ Link para download do contrato assinado

### Hooks Utilizados

```tsx
const { data, isLoading, error } = useMeusContratos({ status: statusFilter });
const aprovarContrato = useAprovarContrato();
```

### Informações Exibidas

- Dados do imóvel (título, endereço)
- Dados do comprador (nome, CPF, status de aprovação/assinatura)
- Dados do vendedor (nome, CPF, status de aprovação/assinatura)
- Valor da proposta
- Status do contrato
- Contagem de mensagens
- Indicação se foi gerado por IA

---

## 🎨 Layout do Dashboard

**Arquivo:** `components/layouts/DashboardLayout.tsx`

### Funcionalidades

- ✅ Header com navegação
- ✅ Logo da imobiliária (se disponível)
- ✅ Informações do usuário
- ✅ Botão de logout
- ✅ Integração com hook `useMinhaImobiliaria`

### Hook Utilizado

```tsx
const { data: imobiliariaData } = useMinhaImobiliaria();
```

---

## 🔄 Fluxo de Dados

```
Componente
    ↓
Hook (useFrontend)
    ↓
API Client (lib/api/client.ts)
    ↓
Backend API (/api/frontend/*)
    ↓
Supabase Database
```

### Cache e Invalidação

- **Cache**: Dados são cacheados automaticamente pelo TanStack Query
- **StaleTime**: Configurado por hook (1-5 minutos)
- **Invalidação**: Automática após mutações (criar, atualizar, deletar)

---

## 🎯 Exemplos de Uso

### Dashboard com Estatísticas

```tsx
const { data: imobiliaria } = useMinhaImobiliaria();
const { data: imoveisData } = useMeusImoveis();
const { data: propostasData } = useMinhasPropostas();
const { data: contratosData } = useMeusContratos();

// Calcular estatísticas
const stats = {
  imoveis: { total: imoveisData?.count || 0 },
  propostas: { total: propostasData?.count || 0 },
  contratos: { total: contratosData?.count || 0 },
};
```

### Lista com Filtros

```tsx
const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
const { data } = useMinhasPropostas({ status: statusFilter });

// Filtrar propostas
const propostasFiltradas = data?.propostas.filter(
  (p) => p.status === statusFilter
);
```

### Ações com Mutations

```tsx
const aprovarContrato = useAprovarContrato();

const handleAprovar = async () => {
  try {
    await aprovarContrato.mutateAsync({
      id: contratoId,
      parte: "comprador",
    });
    // Cache será invalidado automaticamente
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

---

## 📝 Notas Importantes

1. **Loading States**: Todos os componentes exibem estados de carregamento
2. **Error Handling**: Tratamento de erros em todos os componentes
3. **Empty States**: Mensagens quando não há dados
4. **Responsive**: Layouts responsivos para mobile e desktop
5. **TypeScript**: Totalmente tipado
6. **Performance**: Cache automático e invalidação inteligente

---

## 🔗 Referências

- [Hooks do Frontend](./HOOKS_FRONTEND.md)
- [Endpoints da API](../../realcloser-api/docs/ENDPOINTS_FRONTEND.md)
- [TanStack Query Documentation](https://tanstack.com/query/latest)



