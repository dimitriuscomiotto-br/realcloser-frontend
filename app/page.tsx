// app/page.tsx
// Página inicial (Landing Page)
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          RealCloser
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma completa de negociação imobiliária com suporte jurídico
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

