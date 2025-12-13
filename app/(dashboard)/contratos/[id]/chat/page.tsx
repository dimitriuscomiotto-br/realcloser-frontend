// app/(dashboard)/contratos/[id]/chat/page.tsx
// Página de chat do contrato
"use client";

import { useParams } from "next/navigation";
import { ChatContainer } from "@/components/features/chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContratoChatPage() {
  const params = useParams();
  const contratoId = params.id as string;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/contratos/${contratoId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Contrato
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Chat do Contrato</h1>
          <p className="text-gray-600 mt-1">Converse com o agente de IA sobre este contrato</p>
        </div>
      </div>

      <ChatContainer contratoId={contratoId} />
    </div>
  );
}
