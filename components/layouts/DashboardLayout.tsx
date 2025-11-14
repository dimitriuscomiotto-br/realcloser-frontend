// components/layouts/DashboardLayout.tsx
// Layout do dashboard com sidebar e header
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
            <span className="text-sm text-gray-600">{user?.email}</span>
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

