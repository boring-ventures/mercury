"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  Eye,
  Search,
  XCircle,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Calendar,
  Building,
  User,
  FileSignature,
  Play,
  Pause,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useAdminContracts,
  useContractStatusConfig,
  type ContractFilters,
} from "@/hooks/use-admin-contracts";
import { formatCurrency } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "DRAFT", label: "Borrador" },
  { value: "ACTIVE", label: "Activo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "EXPIRED", label: "Expirado" },
];

const CURRENCY_FILTERS = [
  { value: "todos", label: "Todas" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "CNY", label: "CNY" },
  { value: "JPY", label: "JPY" },
  { value: "BOB", label: "BOB" },
  { value: "PEN", label: "PEN" },
  { value: "COP", label: "COP" },
  { value: "USDT", label: "USDT" },
];

function StatusBadge({ status }: { status: string }) {
  const { getStatusConfig } = useContractStatusConfig();
  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (config.icon) {
      case "Clock":
        return <Clock className="h-3 w-3 mr-1" />;
      case "DollarSign":
        return <DollarSign className="h-3 w-3 mr-1" />;
      case "Eye":
        return <Eye className="h-3 w-3 mr-1" />;
      case "CheckCircle":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "XCircle":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "FileText":
        return <FileText className="h-3 w-3 mr-1" />;
      case "AlertCircle":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "AlertTriangle":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "Play":
        return <Play className="h-3 w-3 mr-1" />;
      case "CheckSquare":
        return <CheckSquare className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant={config.variant} className="flex items-center">
      {getIcon()}
      {config.label}
    </Badge>
  );
}

function isExpired(endDate: string): boolean {
  return new Date(endDate) < new Date();
}

export default function AdminContracts() {
  const [filters, setFilters] = useState<ContractFilters>({
    status: "todos",
    currency: "todos",
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useAdminContracts(filters);

  const handleFilterChange = (key: keyof ContractFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los contratos del sistema
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los contratos del sistema
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Error al cargar contratos
            </h3>
            <p className="text-muted-foreground">
              No se pudieron cargar los contratos. Inténtalo de nuevo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const contracts = data?.contracts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los contratos del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Moneda</label>
              <Select
                value={filters.currency}
                onValueChange={(value) => handleFilterChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  placeholder="Código, título, empresa, usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    status: "todos",
                    currency: "todos",
                    search: "",
                  });
                  setSearchTerm("");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Contratos ({contracts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{contract.code}</span>
                      <StatusBadge status={contract.status} />
                      {isExpired(contract.endDate) && (
                        <Badge variant="destructive" className="text-xs">
                          Expirado
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {contract.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contract.request &&
                        `Solicitud: ${contract.request.code}`}
                      {contract.quotation &&
                        ` • Cotización: ${contract.quotation.code}`}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {contract.company.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {contract.createdBy.firstName}{" "}
                        {contract.createdBy.lastName}
                      </span>
                      {contract.signedAt && (
                        <span className="flex items-center gap-1">
                          <FileSignature className="h-3 w-3" />
                          Firmado:{" "}
                          {format(new Date(contract.signedAt), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(contract.amount, contract.currency)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Período
                    </div>
                    <div className="text-sm">
                      {format(new Date(contract.startDate), "dd/MM/yyyy", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(new Date(contract.endDate), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </div>
                  </div>

                  <Link href={`/admin/contracts/${contract.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {contracts.length === 0 && (
              <div className="text-center py-8">
                <FileSignature className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No se encontraron contratos
                </h3>
                <p className="text-muted-foreground">
                  No hay contratos que coincidan con los filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
