// app/(dashboard)/imoveis/page.tsx
// Página de listagem de imóveis da imobiliária

import { Suspense } from "react";
import { getImobiliariaId } from "@/lib/utils/imobiliaria";
import { ImoveisList } from "@/components/features/imoveis/ImoveisList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function ImoveisContent() {
  const imobiliariaId = await getImobiliariaId();

  if (!imobiliariaId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Não foi possível identificar a imobiliária. Por favor, entre em
              contato com o suporte.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              TODO: Integrar com autenticação completa para buscar imobiliária
              do usuário logado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ImoveisList imobiliariaId={imobiliariaId} />;
}

export default function ImoveisPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Imóveis</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os imóveis da sua imobiliária
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando imóveis...</p>
            </div>
          </div>
        }
      >
        <ImoveisContent />
      </Suspense>
    </div>
  );
}

