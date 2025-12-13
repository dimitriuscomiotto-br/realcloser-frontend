// app/(dashboard)/propostas/page.tsx
// Página de listagem de propostas

import { Card, CardContent } from "@/components/ui/card";

export default function PropostasPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Propostas</h1>
        <p className="text-gray-600 mt-1">
          Gerencie as propostas de compra e venda
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Página de propostas em desenvolvimento
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Esta funcionalidade será implementada em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

