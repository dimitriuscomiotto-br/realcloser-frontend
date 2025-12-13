# 🧪 Guia de Teste - RealCloser Frontend

Este guia te ajudará a testar e visualizar todas as funcionalidades implementadas.

## 📋 Pré-requisitos

1. **Node.js** versão 20 ou superior instalado
2. **Backend da API** rodando (se disponível) ou mock do backend
3. **Supabase** configurado (para autenticação)

## 🚀 Passo 1: Instalação e Configuração

### 1.1 Instalar Dependências

```bash
cd /Users/Dimitrius/Documents/REALCLOSER/realcloser-frontend
npm install
```

### 1.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Nota:** Se você não tiver o backend rodando ainda, pode usar um mock ou deixar a URL vazia (algumas funcionalidades podem não funcionar sem o backend).

### 1.3 Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

## 🎯 Passo 2: Testar as Funcionalidades

### 2.1 Acessar a Aplicação

1. Abra seu navegador e acesse: `http://localhost:3000`
2. Faça login (se necessário) ou navegue pelas páginas

### 2.2 Testar Página de Propostas (`/propostas`)

**O que testar:**

1. **Visualizar Lista de Propostas**
   - Acesse `/propostas`
   - Verifique se a lista de propostas é exibida
   - Teste os filtros por status (Rascunho, Enviada, Aprovada, etc.)

2. **Botão "Nova Proposta"**
   - Clique no botão "+ Nova Proposta"
   - Deve redirecionar para criação de proposta

3. **Ações em Propostas:**
   - **Editar** (para propostas em rascunho)
   - **Enviar para Aprovação** (para propostas em rascunho)
   - **Aprovar como Comprador** (para propostas enviadas)
   - **Aprovar como Vendedor** (para propostas enviadas)
   - **Gerar Contrato** (para propostas aprovadas)

4. **Verificar Toasts:**
   - Ao clicar em qualquer ação, deve aparecer um toast de sucesso/erro
   - Toasts aparecem no canto superior direito

### 2.3 Testar Página de Contratos (`/contratos`)

**O que testar:**

1. **Visualizar Lista de Contratos**
   - Acesse `/contratos`
   - Verifique se a lista de contratos é exibida
   - Teste os filtros por status

2. **Botão "Templates"**
   - Clique no botão "Templates" no topo da página
   - Deve abrir um modal com:
     - Lista de templates existentes
     - Botão "Novo Template"
     - Para cada template: Ativar/Desativar, Editar, Deletar

3. **Gerenciar Templates:**
   - Clique em "Novo Template"
   - Preencha: Nome, Descrição, Conteúdo
   - Salve e verifique se aparece na lista
   - Teste ativar/desativar template
   - Teste editar template existente
   - Teste deletar template

4. **Ações em Contratos:**
   - **Ver Contrato** - Visualizar detalhes
   - **Chat** - Abrir chat do contrato
   - **Aprovar** - Para contratos pendentes
   - **Assinar** - Para contratos aprovados
   - **Download** - Para contratos assinados

### 2.4 Testar Chat (`/contratos/[id]/chat`)

**O que testar:**

1. **Acessar Chat:**
   - Na página de contratos, clique em "Chat" em qualquer contrato
   - Ou acesse diretamente: `/contratos/[id]/chat`

2. **Interface do Chat:**
   - Verifique se a interface do chat é exibida
   - Deve mostrar:
     - Header com ícone de bot e título "Chat - Agente de IA"
     - Área de mensagens (vazia se não houver mensagens)
     - Campo de input para digitar mensagem
     - Botão de enviar
     - Botão de anexar arquivo

3. **Enviar Mensagem:**
   - Digite uma mensagem no campo de input
   - Pressione Enter ou clique no botão de enviar
   - Verifique se a mensagem aparece na lista
   - Verifique se aparece um toast de sucesso/erro

4. **Visualização de Mensagens:**
   - Mensagens do usuário aparecem à direita (azul)
   - Mensagens do bot aparecem à esquerda (roxo)
   - Mensagens de outros usuários aparecem à esquerda (cinza)
   - Cada mensagem mostra hora de envio

5. **Scroll Automático:**
   - Ao enviar uma nova mensagem, o chat deve fazer scroll automático para a última mensagem

## 🔍 Passo 3: Verificar Componentes UI

### 3.1 Componentes Criados

Verifique se os seguintes componentes estão funcionando:

- ✅ **Dialog/Modal** - Usado no modal de templates
- ✅ **Toast** - Notificações de sucesso/erro
- ✅ **Button** - Com variantes (default, outline, destructive, secondary)
- ✅ **Card** - Cards de exibição
- ✅ **Input** - Campos de entrada

### 3.2 Testar Toasts

Os toasts devem aparecer quando:
- Criar/editar/deletar template
- Enviar proposta
- Aprovar proposta/contrato
- Assinar contrato
- Gerar contrato
- Enviar mensagem no chat

## 🐛 Passo 4: Verificar Erros

### 4.1 Console do Navegador

1. Abra o DevTools (F12 ou Cmd+Option+I)
2. Vá para a aba "Console"
3. Verifique se há erros em vermelho
4. Erros comuns podem ser:
   - Erro de conexão com API (se backend não estiver rodando)
   - Erro de autenticação (se Supabase não estiver configurado)

### 4.2 Terminal

Verifique o terminal onde o `npm run dev` está rodando:
- Deve mostrar compilação bem-sucedida
- Erros de TypeScript aparecerão aqui

## 📝 Passo 5: Checklist de Funcionalidades

Use este checklist para garantir que tudo está funcionando:

### Propostas
- [ ] Lista de propostas é exibida
- [ ] Filtros por status funcionam
- [ ] Botão "Nova Proposta" funciona
- [ ] Botão "Editar" aparece para rascunhos
- [ ] Botão "Enviar para Aprovação" funciona
- [ ] Botão "Aprovar como Comprador" funciona
- [ ] Botão "Aprovar como Vendedor" funciona
- [ ] Botão "Gerar Contrato" aparece para propostas aprovadas
- [ ] Toasts aparecem após ações

### Contratos
- [ ] Lista de contratos é exibida
- [ ] Filtros por status funcionam
- [ ] Botão "Templates" abre modal
- [ ] Modal de templates exibe lista
- [ ] Criar template funciona
- [ ] Editar template funciona
- [ ] Ativar/Desativar template funciona
- [ ] Deletar template funciona
- [ ] Botão "Chat" funciona
- [ ] Botão "Aprovar" funciona
- [ ] Botão "Assinar" aparece para contratos aprovados
- [ ] Botão "Download" aparece para contratos assinados

### Chat
- [ ] Página de chat carrega
- [ ] Interface do chat é exibida corretamente
- [ ] Enviar mensagem funciona
- [ ] Mensagens aparecem na lista
- [ ] Mensagens do usuário aparecem à direita
- [ ] Mensagens do bot aparecem à esquerda
- [ ] Scroll automático funciona
- [ ] Timestamp das mensagens é exibido

## 🎨 Passo 6: Testar UX/UI

### 6.1 Responsividade

Teste em diferentes tamanhos de tela:
- Desktop (1920x1080)
- Tablet (768px)
- Mobile (375px)

### 6.2 Estados de Loading

Verifique se os estados de loading aparecem:
- Ao carregar listas
- Ao enviar formulários
- Ao fazer requisições

### 6.3 Tratamento de Erros

Teste cenários de erro:
- Backend offline
- Requisição falhada
- Dados inválidos

## 🔧 Passo 7: Debugging

### 7.1 Verificar Hooks

Os hooks criados estão em:
- `lib/hooks/useMensagens.ts`
- `lib/hooks/useTemplates.ts`
- `lib/hooks/useContratos.ts` (atualizado)
- `lib/hooks/usePropostas.ts` (atualizado)

### 7.2 Verificar Endpoints

Os endpoints estão definidos em:
- `lib/api/endpoints.ts`

Verifique se as URLs estão corretas.

### 7.3 Verificar Tipos

Os tipos TypeScript estão em:
- `types/index.ts`

## 📚 Arquivos Criados/Modificados

### Novos Arquivos:
- `lib/hooks/useMensagens.ts`
- `lib/hooks/useTemplates.ts`
- `components/ui/dialog.tsx`
- `components/ui/toast.tsx`
- `components/ui/use-toast.ts`
- `components/ui/toaster.tsx`
- `components/features/chat/ChatContainer.tsx`
- `app/(dashboard)/contratos/[id]/chat/page.tsx`

### Arquivos Modificados:
- `app/(dashboard)/contratos/page.tsx`
- `app/(dashboard)/propostas/page.tsx`
- `lib/hooks/useContratos.ts`
- `lib/hooks/usePropostas.ts`
- `components/providers.tsx`

## 🚨 Problemas Comuns

### Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

### Erro: "API connection failed"
**Solução:** Verifique se o backend está rodando e a URL está correta no `.env.local`

### Erro: "Supabase auth error"
**Solução:** Verifique as credenciais do Supabase no `.env.local`

### Página em branco
**Solução:** 
1. Verifique o console do navegador
2. Verifique o terminal do servidor
3. Limpe o cache: `rm -rf .next` e reinicie o servidor

## ✅ Próximos Passos

Após testar, você pode:
1. Integrar com o backend real
2. Adicionar mais validações
3. Melhorar tratamento de erros
4. Adicionar testes automatizados
5. Implementar funcionalidades adicionais

---

**Dúvidas?** Verifique os arquivos de código ou consulte a documentação do Next.js e React Query.
