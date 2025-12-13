// middleware.ts
// Middleware para autenticação e white-label
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Criar cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Atualizar cookies na requisição
          request.cookies.set(name, value);
          // Criar nova resposta com os cookies atualizados
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          // Remover cookie da requisição
          request.cookies.set(name, "");
          // Criar nova resposta sem o cookie
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Verificar sessão (isso pode atualizar cookies)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Detectar subdomínio/domínio para white-label
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // Proteção de rotas autenticadas
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/imoveis") || 
    path.startsWith("/propostas") || path.startsWith("/contratos") || 
    path.startsWith("/documentos") || path.startsWith("/mensagens");

  // Se for rota protegida e não tiver sessão, redirecionar
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Se for rota de auth e tiver sessão, redirecionar para dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Adicionar header de subdomínio se necessário
  if (subdomain && subdomain !== "www" && subdomain !== "app") {
    supabaseResponse.headers.set("x-imobiliaria-subdomain", subdomain);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};



