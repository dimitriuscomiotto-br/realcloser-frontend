# ⚡ Comandos Rápidos - Testar o Frontend

## 🚀 Início Rápido

```bash
# 1. Ir para o diretório do projeto
cd /Users/Dimitrius/Documents/REALCLOSER/realcloser-frontend

# 2. Instalar dependências (se ainda não instalou)
npm install

# 3. Criar arquivo .env.local (se não existir)
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Depois acesse: **http://localhost:3000**

## 📋 Rotas para Testar

### Páginas Principais:
- `/login` - Página de login
- `/dashboard` - Dashboard principal
- `/propostas` - Lista de propostas ⭐
- `/contratos` - Lista de contratos ⭐
- `/contratos/[id]/chat` - Chat do contrato ⭐

### Funcionalidades Implementadas:

#### ✅ Propostas (`/propostas`)
- Criar proposta (rascunho)
- Editar proposta
- Enviar para aprovação
- Aprovar como comprador/vendedor
- Gerar contrato (quando aprovada)

#### ✅ Contratos (`/contratos`)
- Listar contratos
- Gerenciar templates (botão "Templates")
- Aprovar contrato
- Assinar contrato
- Acessar chat

#### ✅ Chat (`/contratos/[id]/chat`)
- Enviar mensagens
- Visualizar histórico
- Interface preparada para IA

#### ✅ Templates (Modal em `/contratos`)
- Criar template
- Editar template
- Ativar/Desativar template
- Deletar template

## 🔍 Verificar se está funcionando

```bash
# Verificar se há erros de TypeScript
npm run type-check

# Verificar lint
npm run lint

# Build de produção (testar se compila)
npm run build
```

## 🐛 Debug

```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📱 Testar em diferentes dispositivos

O Next.js permite testar em outros dispositivos na mesma rede:

```bash
# Iniciar com IP da rede local
npm run dev -- -H 0.0.0.0
```

Depois acesse pelo IP da sua máquina: `http://[seu-ip]:3000`

## 🎯 Checklist Rápido

- [ ] `npm install` executado
- [ ] `.env.local` criado
- [ ] `npm run dev` iniciado
- [ ] Acessou http://localhost:3000
- [ ] Testou página `/propostas`
- [ ] Testou página `/contratos`
- [ ] Testou modal de templates
- [ ] Testou chat de contrato

---

**Dica:** Abra o DevTools (F12) para ver logs e erros no console!
