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
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useAdminQuotations,
  useQuotationStatusConfig,
  type QuotationFilters,
} from "@/hooks/use-admin-quotations";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "DRAFT", label: "Borrador" },
  { value: "SENT", label: "Enviado" },
  { value: "ACCEPTED", label: "Aceptado" },
  { value: "REJECTED", label: "Rechazado" },
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
  const { getStatusConfig } = useQuotationStatusConfig();
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

function isExpired(validUntil: string): boolean {
  return new Date(validUntil) < new Date();
}

export default function AdminQuotations() {
  const router = useRouter();
  const [filters, setFilters] = useState<QuotationFilters>({
    status: "todos",
    currency: "todos",
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useAdminQuotations(filters);

  const handleFilterChange = (key: keyof QuotationFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleRowClick = (quotationId: string) => {
    router.push(`/admin/quotations/${quotationId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
            <p className="text-muted-foreground">
              Gestiona todas las cotizaciones del sistema
            </p>
          </div>
          <Link href="/admin/cashier-reports">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Reportes de Cajeros
            </Button>
          </Link>
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
            <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
            <p className="text-muted-foreground">
              Gestiona todas las cotizaciones del sistema
            </p>
          </div>
          <Link href="/admin/cashier-reports">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Reportes de Cajeros
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Error al cargar cotizaciones
            </h3>
            <p className="text-muted-foreground">
              No se pudieron cargar las cotizaciones. Inténtalo de nuevo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const quotations = data?.quotations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona todas las cotizaciones del sistema
          </p>
        </div>
        <Link href="/admin/cashier-reports">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Reportes de Cajeros
          </Button>
        </Link>
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
                  placeholder="Código, empresa, usuario..."
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones ({quotations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron cotizaciones
              </h3>
              <p className="text-muted-foreground">
                No hay cotizaciones que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">CÓDIGO</th>
                    <th className="text-left py-3 px-4">SOLICITUD</th>
                    <th className="text-left py-3 px-4">EMPRESA</th>
                    <th className="text-left py-3 px-4">MONTO</th>
                    <th className="text-left py-3 px-4">TOTAL BS</th>
                    <th className="text-left py-3 px-4">VÁLIDO HASTA</th>
                    <th className="text-left py-3 px-4">ESTADO</th>
                    <th className="text-left py-3 px-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quotation) => (
                    <tr
                      key={quotation.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(quotation.id)}
                    >
                      <td className="py-3 px-4 font-medium">{quotation.code}</td>
                      <td className="py-3 px-4">{quotation.request.code}</td>
                      <td className="py-3 px-4">{quotation.company.name}</td>
                      <td className="py-3 px-4">
                        {formatCurrency(quotation.amount, quotation.currency)}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(quotation.totalInBs, "Bs")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>
                            {format(new Date(quotation.validUntil), "dd/MM/yyyy", {
                              locale: es,
                            })}
                          </span>
                          {isExpired(quotation.validUntil) && (
                            <Badge variant="destructive" className="text-xs">
                              Expirado
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={quotation.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/cashier-reports?quotationId=${quotation.code}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(quotation.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
