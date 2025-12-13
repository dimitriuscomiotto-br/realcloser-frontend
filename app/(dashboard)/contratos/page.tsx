// app/(dashboard)/contratos/page.tsx
// Página de listagem de contratos

import { Card, CardContent } from "@/components/ui/card";

export default function ContratosPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contratos</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os contratos de compra e venda
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Página de contratos em desenvolvimento
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

