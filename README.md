# RealCloser Frontend

Frontend da plataforma RealCloser - Sistema white-label para imobiliárias.

## 🛠️ Tecnologias

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn/ui**
- **Supabase** (Auth + Storage + Realtime)
- **TanStack Query** (React Query)
- **Zustand** (State Management)
- **React Hook Form** + **Zod**

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd realcloser-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
realcloser-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas públicas
│   ├── (dashboard)/       # Rotas protegidas
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Componentes Shadcn/ui
│   ├── features/          # Componentes por feature
│   └── layouts/           # Layouts específicos
├── lib/
│   ├── supabase/          # Cliente Supabase
│   ├── api/               # Cliente API
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utilitários
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── styles/                # Estilos globais
```

## 🔗 Integração com Backend

O frontend se comunica com a API RealCloser através do cliente HTTP em `lib/api/client.ts`.

As requisições são interceptadas automaticamente para adicionar o token JWT do Supabase.

## 🎨 White-Label

O sistema suporta customização por imobiliária através de:
- Middleware de detecção de subdomínio
- Theme store (Zustand)
- CSS variables dinâmicas

## 📝 Próximos Passos

1. Instalar dependências: `npm install`
2. Configurar variáveis de ambiente
3. Iniciar desenvolvimento: `npm run dev`
4. Implementar componentes UI base
5. Implementar páginas por role


