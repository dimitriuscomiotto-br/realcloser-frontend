# 🎣 Hooks do Frontend - TanStack Query

## 📋 Visão Geral

Este documento descreve os hooks customizados criados para integrar os endpoints do frontend usando TanStack Query. Os hooks fornecem uma interface reativa e tipada para acessar dados da API.

---

## 🚀 Hooks Disponíveis

### 1. `useMinhaImobiliaria()`

Hook para obter a imobiliária vinculada ao usuário logado.

**Retorna:**
- Dados completos da imobiliária
- Lista de corretores
- Estatísticas (total de imóveis, propostas, contratos)

**Exemplo de uso:**
```tsx
import { useMinhaImobiliaria } from "@/lib/hooks/useFrontend";

function DashboardImobiliaria() {
  const { data: imobiliaria, isLoading, error } = useMinhaImobiliaria();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;
  if (!imobiliaria) return <div>Nenhuma imobiliária encontrada</div>;

  return (
    <div>
      <h1>{imobiliaria.razao_social}</h1>
      <p>Total de imóveis: {imobiliaria.estatisticas?.total_imoveis}</p>
      <p>Total de propostas: {imobiliaria.estatisticas?.total_propostas}</p>
      <p>Total de contratos: {imobiliaria.estatisticas?.total_contratos}</p>
      
      <h2>Corretores</h2>
      <ul>
        {imobiliaria.corretores?.map((corretor) => (
          <li key={corretor.id}>{corretor.nome}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 2. `useMeusImoveis(filters?)`

Hook para obter os imóveis do usuário logado.

**Parâmetros:**
- `filters` (opcional): `{ status?: string; imobiliaria_id?: string }`

**Retorna:**
- Lista de imóveis com dados completos
- Proprietários de cada imóvel
- Estatísticas de propostas por imóvel

**Exemplo de uso:**
```tsx
import { useMeusImoveis } from "@/lib/hooks/useFrontend";

function ListaImoveis() {
  const { data, isLoading, error } = useMeusImoveis({ status: "disponivel" });

  if (isLoading) return <div>Carregando imóveis...</div>;
  if (error) return <div>Erro ao carregar imóveis</div>;

  return (
    <div>
      <h1>Meus Imóveis ({data?.count})</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.imoveis.map((imovel) => (
          <div key={imovel.id} className="border p-4 rounded">
            <h2>{imovel.titulo}</h2>
            <p>{imovel.endereco}, {imovel.cidade}</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(imovel.preco)}
            </p>
            <p>Propostas ativas: {imovel.propostas_ativas}</p>
            <p>Total de propostas: {imovel.total_propostas}</p>
            
            <div className="mt-2">
              <h3>Proprietários:</h3>
              <ul>
                {imovel.proprietarios?.map((prop, idx) => (
                  <li key={idx}>
                    {prop.pessoa.nome} ({prop.percentual_propriedade}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 3. `useMinhasPropostas(filters?)`

Hook para obter as propostas do usuário logado.

**Parâmetros:**
- `filters` (opcional): `{ status?: string; imovel_id?: string; imobiliaria_id?: string }`

**Retorna:**
- Lista de propostas com dados completos
- Dados do imóvel, comprador e vendedor
- Indicação se já existe contrato relacionado

**Exemplo de uso:**
```tsx
import { useMinhasPropostas } from "@/lib/hooks/useFrontend";
import { useAprovarPropostaComprador } from "@/lib/hooks/usePropostas";

function ListaPropostas() {
  const { data, isLoading, error } = useMinhasPropostas({ status: "enviada" });
  const aprovarComprador = useAprovarPropostaComprador();

  if (isLoading) return <div>Carregando propostas...</div>;
  if (error) return <div>Erro ao carregar propostas</div>;

  const handleAprovar = async (propostaId: string) => {
    try {
      await aprovarComprador.mutateAsync(propostaId);
      alert("Proposta aprovada com sucesso!");
    } catch (error) {
      alert("Erro ao aprovar proposta");
    }
  };

  return (
    <div>
      <h1>Minhas Propostas ({data?.count})</h1>
      <div className="space-y-4">
        {data?.propostas.map((proposta) => (
          <div key={proposta.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">
                  {proposta.imovel.titulo}
                </h2>
                <p className="text-gray-600">{proposta.imovel.endereco}</p>
                <p className="text-lg font-semibold mt-2">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(proposta.valor)}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${
                  proposta.status === "aprovada" ? "bg-green-100 text-green-800" :
                  proposta.status === "enviada" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {proposta.status}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Comprador</h3>
                <p>{proposta.comprador.nome}</p>
                <p className="text-sm text-gray-600">{proposta.comprador.cpf}</p>
                <p className="text-sm text-gray-600">{proposta.comprador.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Vendedor</h3>
                <p>{proposta.vendedor.nome}</p>
                <p className="text-sm text-gray-600">{proposta.vendedor.cpf}</p>
                <p className="text-sm text-gray-600">{proposta.vendedor.email}</p>
              </div>
            </div>

            {proposta.tem_contrato && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-sm">
                  ✅ Contrato gerado - Status: {proposta.contrato_status}
                </p>
              </div>
            )}

            {proposta.status === "enviada" && (
              <button
                onClick={() => handleAprovar(proposta.id)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Aprovar Proposta
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. `useMeusContratos(filters?)`

Hook para obter os contratos do usuário logado.

**Parâmetros:**
- `filters` (opcional): `{ status?: string; proposta_id?: string; imovel_id?: string }`

**Retorna:**
- Lista de contratos com dados completos
- Dados da proposta, imóvel, comprador e vendedor
- Contagem de mensagens por contrato

**Exemplo de uso:**
```tsx
import { useMeusContratos } from "@/lib/hooks/useFrontend";
import { useAprovarContrato } from "@/lib/hooks/useContratos";
import Link from "next/link";

function ListaContratos() {
  const { data, isLoading, error } = useMeusContratos({ status: "pendente" });
  const aprovarContrato = useAprovarContrato();

  if (isLoading) return <div>Carregando contratos...</div>;
  if (error) return <div>Erro ao carregar contratos</div>;

  const handleAprovar = async (contratoId: string, parte: string) => {
    try {
      await aprovarContrato.mutateAsync({ id: contratoId, parte });
      alert("Contrato aprovado com sucesso!");
    } catch (error) {
      alert("Erro ao aprovar contrato");
    }
  };

  return (
    <div>
      <h1>Meus Contratos ({data?.count})</h1>
      <div className="space-y-4">
        {data?.contratos.map((contrato) => (
          <div key={contrato.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">
                  {contrato.imovel.titulo}
                </h2>
                <p className="text-gray-600">{contrato.imovel.endereco}</p>
                <p className="text-lg font-semibold mt-2">
                  Valor: {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contrato.proposta.valor)}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${
                  contrato.status === "aprovado" ? "bg-green-100 text-green-800" :
                  contrato.status === "assinado" ? "bg-blue-100 text-blue-800" :
                  contrato.status === "concluido" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {contrato.status}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Comprador</h3>
                <p>{contrato.comprador.nome}</p>
                <p className="text-sm text-gray-600">
                  Aprovado: {contrato.aprovado_comprador ? "✅" : "❌"}
                </p>
                <p className="text-sm text-gray-600">
                  Assinado: {contrato.assinado_comprador ? "✅" : "❌"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Vendedor</h3>
                <p>{contrato.vendedor.nome}</p>
                <p className="text-sm text-gray-600">
                  Aprovado: {contrato.aprovado_vendedor ? "✅" : "❌"}
                </p>
                <p className="text-sm text-gray-600">
                  Assinado: {contrato.assinado_vendedor ? "✅" : "❌"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/contratos/${contrato.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ver Contrato
              </Link>
              <Link
                href={`/contratos/${contrato.id}/chat`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Chat ({contrato.total_mensagens})
              </Link>
              {contrato.status === "pendente" && (
                <button
                  onClick={() => handleAprovar(contrato.id, "comprador")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Aprovar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Hooks de Invalidação

Para atualizar o cache após mutações, use os hooks de invalidação:

```tsx
import {
  useInvalidateMinhaImobiliaria,
  useInvalidateMeusImoveis,
  useInvalidateMinhasPropostas,
  useInvalidateMeusContratos,
  useInvalidateAllFrontend,
} from "@/lib/hooks/useFrontend";

function MeuComponente() {
  const invalidateImobiliaria = useInvalidateMinhaImobiliaria();
  const invalidateImoveis = useInvalidateMeusImoveis();
  const invalidatePropostas = useInvalidateMinhasPropostas();
  const invalidateContratos = useInvalidateMeusContratos();
  const invalidateAll = useInvalidateAllFrontend();

  const handleAtualizar = () => {
    // Invalida apenas a imobiliária
    invalidateImobiliaria();
    
    // Ou invalida tudo
    invalidateAll();
  };

  return <button onClick={handleAtualizar}>Atualizar</button>;
}
```

---

## 🎯 Exemplo Completo: Dashboard

```tsx
"use client";

import { useMinhaImobiliaria } from "@/lib/hooks/useFrontend";
import { useMeusImoveis } from "@/lib/hooks/useFrontend";
import { useMinhasPropostas } from "@/lib/hooks/useFrontend";
import { useMeusContratos } from "@/lib/hooks/useFrontend";

export default function Dashboard() {
  const { data: imobiliaria, isLoading: loadingImobiliaria } = useMinhaImobiliaria();
  const { data: imoveisData, isLoading: loadingImoveis } = useMeusImoveis();
  const { data: propostasData, isLoading: loadingPropostas } = useMinhasPropostas();
  const { data: contratosData, isLoading: loadingContratos } = useMeusContratos();

  if (loadingImobiliaria || loadingImoveis || loadingPropostas || loadingContratos) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {imobiliaria?.razao_social || "Dashboard"}
      </h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Imóveis</h3>
          <p className="text-2xl font-bold">{imoveisData?.count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Propostas</h3>
          <p className="text-2xl font-bold">{propostasData?.count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Contratos</h3>
          <p className="text-2xl font-bold">{contratosData?.count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Corretores</h3>
          <p className="text-2xl font-bold">{imobiliaria?.corretores?.length || 0}</p>
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Imóveis Recentes</h2>
          <div className="space-y-2">
            {imoveisData?.imoveis.slice(0, 5).map((imovel) => (
              <div key={imovel.id} className="p-2 bg-gray-50 rounded">
                <p className="font-semibold">{imovel.titulo}</p>
                <p className="text-sm text-gray-600">{imovel.endereco}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Propostas Pendentes</h2>
          <div className="space-y-2">
            {propostasData?.propostas
              .filter((p) => p.status === "enviada")
              .slice(0, 5)
              .map((proposta) => (
                <div key={proposta.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{proposta.imovel.titulo}</p>
                  <p className="text-sm text-gray-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(proposta.valor)}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Contratos em Análise</h2>
          <div className="space-y-2">
            {contratosData?.contratos
              .filter((c) => c.status === "em_analise")
              .slice(0, 5)
              .map((contrato) => (
                <div key={contrato.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{contrato.imovel.titulo}</p>
                  <p className="text-sm text-gray-600">
                    {contrato.total_mensagens} mensagens
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Notas Importantes

1. **Cache**: Os hooks usam `staleTime` para cachear dados:
   - Imobiliária: 5 minutos
   - Imóveis: 2 minutos
   - Propostas: 1 minuto
   - Contratos: 1 minuto

2. **Invalidação**: Use os hooks de invalidação após mutações para atualizar o cache automaticamente.

3. **Tipos**: Todos os hooks são totalmente tipados com TypeScript.

4. **Loading States**: Todos os hooks retornam `isLoading` para gerenciar estados de carregamento.

5. **Error Handling**: Todos os hooks retornam `error` para tratamento de erros.

---

## 🔗 Referências

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Documentação dos Endpoints](./ENDPOINTS_FRONTEND.md)
- [API Endpoints Documentation](../../realcloser-api/docs/ENDPOINTS_FRONTEND.md)



