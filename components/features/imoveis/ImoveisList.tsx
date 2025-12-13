// components/features/imoveis/ImoveisList.tsx
// Componente de listagem de imóveis com filtros

"use client";

import { useState, useEffect } from "react";
import { getImoveisDaImobiliariaClient } from "@/lib/supabase/queries/imoveis-client";
import { mapStatusToLabel, type ImovelComRelacoes } from "@/lib/utils/imoveis";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Building2 } from "lucide-react";

interface ImoveisListProps {
  imobiliariaId: string;
}

export function ImoveisList({ imobiliariaId }: ImoveisListProps) {
  const [imoveis, setImoveis] = useState<ImovelComRelacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroEndereco, setFiltroEndereco] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroProprietario, setFiltroProprietario] = useState("");

  // Debounce para filtros de texto
  const [debouncedCodigo, setDebouncedCodigo] = useState("");
  const [debouncedEndereco, setDebouncedEndereco] = useState("");
  const [debouncedProprietario, setDebouncedProprietario] = useState("");

  // Aplicar debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCodigo(filtroCodigo), 300);
    return () => clearTimeout(timer);
  }, [filtroCodigo]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEndereco(filtroEndereco), 300);
    return () => clearTimeout(timer);
  }, [filtroEndereco]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedProprietario(filtroProprietario),
      300
    );
    return () => clearTimeout(timer);
  }, [filtroProprietario]);

  // Buscar imóveis
  useEffect(() => {
    async function fetchImoveis() {
      setLoading(true);
      setError(null);

      try {
        const filters = {
          codigo: debouncedCodigo || undefined,
          endereco: debouncedEndereco || undefined,
          status: filtroStatus || undefined,
          proprietario: debouncedProprietario || undefined,
        };

        const data = await getImoveisDaImobiliariaClient(imobiliariaId, filters);
        setImoveis(data);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
        setError("Erro ao carregar imóveis. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchImoveis();
  }, [
    imobiliariaId,
    debouncedCodigo,
    debouncedEndereco,
    filtroStatus,
    debouncedProprietario,
  ]);

  const handleEnviarProposta = (imovelId: string) => {
    // TODO: Integrar fluxo de proposta
    console.log("Enviar proposta para imóvel:", imovelId);
    alert("Funcionalidade de envio de proposta será implementada em breve.");
  };

  const handleFalarComProprietario = (imovelId: string) => {
    // TODO: Integrar com WhatsApp / e-mail
    console.log("Falar com proprietário do imóvel:", imovelId);
    alert("Funcionalidade de contato com proprietário será implementada em breve.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por código */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Código do Imóvel
              </label>
              <Input
                placeholder="Buscar por código..."
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
              />
            </div>

            {/* Filtro por endereço */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Endereço / Cidade
              </label>
              <Input
                placeholder="Buscar por endereço ou cidade..."
                value={filtroEndereco}
                onChange={(e) => setFiltroEndereco(e.target.value)}
              />
            </div>

            {/* Filtro por status */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Liberado">Liberado</option>
                <option value="Negociação">Negociação</option>
                <option value="Confeccionando Contratos">
                  Confeccionando Contratos
                </option>
                <option value="Vendidos">Vendidos</option>
              </Select>
            </div>

            {/* Filtro por proprietário */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Proprietário
              </label>
              <Input
                placeholder="Buscar por proprietário..."
                value={filtroProprietario}
                onChange={(e) => setFiltroProprietario(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de imóveis */}
      {imoveis.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Nenhum imóvel encontrado
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {debouncedCodigo ||
                debouncedEndereco ||
                filtroStatus ||
                debouncedProprietario
                  ? "Tente ajustar os filtros"
                  : "Cadastre seu primeiro imóvel"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {imoveis.map((imovel) => (
            <Card key={imovel.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Informações principais */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {imovel.titulo}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Código: {imovel.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          imovel.status === "vendido"
                            ? "success"
                            : imovel.status === "reservado"
                            ? "warning"
                            : "default"
                        }
                      >
                        {mapStatusToLabel(imovel.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {/* Endereço */}
                      <div>
                        <span className="text-gray-500">Endereço: </span>
                        <span className="font-medium">
                          {imovel.endereco}, {imovel.cidade}
                        </span>
                      </div>

                      {/* Preço */}
                      <div>
                        <span className="text-gray-500">Preço: </span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(imovel.preco)}
                        </span>
                      </div>

                      {/* Proprietários */}
                      <div>
                        <span className="text-gray-500">Proprietário(s): </span>
                        <span className="font-medium">
                          {imovel.proprietarios &&
                          imovel.proprietarios.length > 0
                            ? imovel.proprietarios
                                .map((p) => p.nome)
                                .join(", ")
                            : "Não informado"}
                        </span>
                      </div>

                      {/* Documentos */}
                      <div>
                        <span className="text-gray-500">Documentos: </span>
                        <span className="font-medium">
                          {imovel.documentos_count || 0} documento(s)
                        </span>
                      </div>

                      {/* Due Diligence */}
                      <div>
                        <span className="text-gray-500">Due Diligence: </span>
                        {imovel.due_diligence_status === "ok" ? (
                          <Badge variant="success" className="ml-2">
                            OK
                          </Badge>
                        ) : imovel.due_diligence_status === "pendente" ? (
                          <Badge variant="warning" className="ml-2">
                            Com pendências
                          </Badge>
                        ) : (
                          <span className="text-gray-400 italic ml-2">
                            Em análise
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEnviarProposta(imovel.id)}
                      className="w-full"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar proposta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleFalarComProprietario(imovel.id)
                      }
                      className="w-full"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Falar com proprietário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

