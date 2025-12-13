// components/layouts/DashboardLayout.tsx
// Layout do dashboard com sidebar e header
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useMinhaImobiliaria } from "@/lib/hooks/useFrontend";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { useState } from "react";

function ImobiliariaLogo({ 
  logoUrl, 
  nomeFantasia, 
  razaoSocial 
}: { 
  logoUrl?: string | null; 
  nomeFantasia?: string | null;
  razaoSocial: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!logoUrl || imageError) {
    return (
      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
        <Building2 className="w-5 h-5 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <Image
        src={logoUrl}
        alt={nomeFantasia || razaoSocial}
        fill
        className="object-contain rounded"
        sizes="32px"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { data: imobiliariaData } = useMinhaImobiliaria();
  const router = useRouter();

  // Usar dados do hook do frontend ou fallback para dados do auth
  const imobiliaria = imobiliariaData || null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              RealCloser
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-primary transition"
              >
                Dashboard
              </Link>
              <Link
                href="/imoveis"
                className="text-gray-700 hover:text-primary transition"
              >
                Imóveis
              </Link>
              <Link
                href="/propostas"
                className="text-gray-700 hover:text-primary transition"
              >
                Propostas
              </Link>
              <Link
                href="/contratos"
                className="text-gray-700 hover:text-primary transition"
              >
                Contratos
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Logo da Imobiliária */}
              {imobiliaria && (
                <div className="flex items-center space-x-2">
                  <ImobiliariaLogo
                    logoUrl={imobiliaria.logo_url}
                    nomeFantasia={imobiliaria.nome_fantasia}
                    razaoSocial={imobiliaria.razao_social}
                  />
                  {(imobiliaria.nome_fantasia || imobiliaria.razao_social) && (
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                      {imobiliaria.nome_fantasia || imobiliaria.razao_social}
                    </span>
                  )}
                </div>
              )}
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}



