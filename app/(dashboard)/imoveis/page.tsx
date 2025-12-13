// app/(dashboard)/imoveis/page.tsx
// Página de listagem de imóveis
"use client";

import { useState } from "react";
import { useMeusImoveis } from "@/lib/hooks/useFrontend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, MapPin, DollarSign, Users, FileText } from "lucide-react";
import Image from "next/image";

export default function ImoveisPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useMeusImoveis({ status: statusFilter });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando imóveis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600">Erro ao carregar imóveis</p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imoveis = data?.imoveis || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os imóveis ({data?.count || 0})
          </p>
        </div>
        <Link href="/imoveis/novo">
          <Button>
            <Building2 className="mr-2 h-4 w-4" />
            + Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filtrar por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(undefined)}
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === "disponivel" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("disponivel")}
            >
              Disponíveis
            </Button>
            <Button
              variant={statusFilter === "reservado" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("reservado")}
            >
              Reservados
            </Button>
            <Button
              variant={statusFilter === "vendido" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("vendido")}
            >
              Vendidos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Imóveis */}
      {imoveis.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhum imóvel encontrado</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter
                  ? `Não há imóveis com status "${statusFilter}"`
                  : "Cadastre um novo imóvel para começar"}
              </p>
              {!statusFilter && (
                <Link href="/imoveis/novo">
                  <Button className="mt-4">
                    <Building2 className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Imóvel
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <Card key={imovel.id} className="hover:shadow-lg transition-shadow">
              {imovel.imagens && imovel.imagens.length > 0 && (
                <div className="relative h-48 w-full">
                  <Image
                    src={imovel.imagens[0]}
                    alt={imovel.titulo}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold line-clamp-2">{imovel.titulo}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      imovel.status === "disponivel"
                        ? "bg-green-100 text-green-800"
                        : imovel.status === "reservado"
                        ? "bg-yellow-100 text-yellow-800"
                        : imovel.status === "vendido"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {imovel.status}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">
                    {imovel.endereco}, {imovel.cidade} - {imovel.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-primary font-bold text-xl">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(imovel.preco)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  {imovel.quartos && (
                    <div>
                      <span className="font-medium">{imovel.quartos}</span> quartos
                    </div>
                  )}
                  {imovel.banheiros && (
                    <div>
                      <span className="font-medium">{imovel.banheiros}</span> banheiros
                    </div>
                  )}
                  {imovel.area_total && (
                    <div>
                      <span className="font-medium">{imovel.area_total}m²</span> total
                    </div>
                  )}
                  {imovel.vagas_garagem && (
                    <div>
                      <span className="font-medium">{imovel.vagas_garagem}</span> vagas
                    </div>
                  )}
                </div>

                {imovel.proprietarios && imovel.proprietarios.length > 0 && (
                  <div className="mb-4 pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-medium">Proprietários:</span>
                    </div>
                    <div className="space-y-1">
                      {imovel.proprietarios.map((prop, idx) => (
                        <p key={idx} className="text-xs text-gray-500">
                          {prop.pessoa.nome} ({prop.percentual_propriedade}%)
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>
                      {imovel.propostas_ativas} proposta{imovel.propostas_ativas !== 1 ? "s" : ""}{" "}
                      ativa{imovel.propostas_ativas !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Link href={`/imoveis/${imovel.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}




