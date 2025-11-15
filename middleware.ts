// middleware.ts
// Middleware para autenticação e white-label
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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
          request.cookies.set(name, value);
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          request.cookies.set(name, "");
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Verificar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Detectar subdomínio/domínio para white-label
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // Se não for o domínio principal, buscar configuração da imobiliária
  if (subdomain && subdomain !== "www" && subdomain !== "app") {
    // TODO: Buscar configuração da imobiliária pelo subdomínio
    // Por enquanto, apenas adicionar header
    response.headers.set("x-imobiliaria-subdomain", subdomain);
  }

  // Proteção de rotas autenticadas
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/imoveis") || 
    path.startsWith("/propostas") || path.startsWith("/contratos") || 
    path.startsWith("/documentos") || path.startsWith("/mensagens");

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
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


