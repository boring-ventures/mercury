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
} from "lucide-react";
import Link from "next/link";
import {
  useRequests,
  useRequestStatusConfig,
  type RequestFilters,
} from "@/hooks/use-requests";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "pending", label: "Cotización" },
  { value: "in_review", label: "En Revisión" },
  { value: "approved", label: "Aprobado" },
  { value: "completed", label: "Completado" },
  { value: "rejected", label: "Rechazado" },
  { value: "cancelled", label: "Cancelado" },
];

const COUNTRY_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "China", label: "China" },
  { value: "Colombia", label: "Colombia" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Perú", label: "Perú" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "USA", label: "Estados Unidos" },
  { value: "Germany", label: "Alemania" },
];

// Interface for admin request list items
interface AdminRequestItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  description?: string;
  rejectionCount?: number;
  company?: {
    name: string;
    email?: string;
  };
  provider?: {
    country: string;
  };
  quotations?: Array<{
    id: string;
    status: string;
    validUntil: string;
  }>;
}

function StatusBadge({ status }: { status: string }) {
  const { getStatusConfig } = useRequestStatusConfig();
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
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant="outline" className={config.color}>
      {getIcon()}
      {config.label}
    </Badge>
  );
}

// Utility function to check if a request has expired quotations
function hasExpiredQuotations(
  quotations?: Array<{ status: string; validUntil: string }>
): boolean {
  if (!quotations || quotations.length === 0) return false;

  const now = new Date();
  return quotations.some(
    (q) =>
      (q.status === "SENT" || q.status === "DRAFT") &&
      new Date(q.validUntil) < now
  );
}

// Utility function to get active (non-expired) quotations count
function getActiveQuotationsCount(
  quotations?: Array<{ status: string; validUntil: string }>
): number {
  if (!quotations || quotations.length === 0) return 0;

  const now = new Date();
  return quotations.filter(
    (q) =>
      (q.status === "SENT" || q.status === "DRAFT") &&
      new Date(q.validUntil) >= now
  ).length;
}

export default function AdminSolicitudes() {
  const [filters, setFilters] = useState<RequestFilters>({
    status: "todos",
    country: "todos",
    search: "",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useRequests(filters);

  const handleFilterChange = (key: keyof RequestFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filter state
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar las solicitudes
        </h3>
        <p className="text-gray-600 text-center">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        📋 GESTIÓN DE SOLICITUDES DE ENVÍO
      </h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, empresa..."
                  className="w-full md:w-60"
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select
                  value={filters.status || "todos"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTERS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select
                  value={filters.country || "todos"}
                  onValueChange={(value) =>
                    handleFilterChange("country", value)
                  }
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="País" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_FILTERS.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  type="date"
                  className="w-full md:w-40"
                  placeholder="Desde"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                />
                <span className="text-sm text-gray-500">a</span>
                <Input
                  type="date"
                  className="w-full md:w-40"
                  placeholder="Hasta"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LISTADO DE SOLICITUDES</CardTitle>
          {data?.pagination && (
            <p className="text-sm text-gray-600">
              Mostrando {data.requests.length} de {data.pagination.total}{" "}
              solicitudes
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">
                Cargando solicitudes...
              </span>
            </div>
          ) : !data?.requests || data.requests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron solicitudes
              </h3>
              <p className="text-gray-600">
                {filters.search ||
                filters.status !== "todos" ||
                filters.country !== "todos"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay solicitudes registradas aún"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">REF</th>
                    <th className="text-left py-3 px-4">EMPRESA</th>
                    <th className="text-left py-3 px-4">DESTINO</th>
                    <th className="text-left py-3 px-4">MONTO</th>
                    <th className="text-left py-3 px-4">RECHAZOS</th>
                    <th className="text-left py-3 px-4">COTIZACIONES</th>
                    <th className="text-left py-3 px-4">ESTADO</th>
                    <th className="text-left py-3 px-4">FECHA</th>
                    <th className="text-left py-3 px-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {data.requests.map((request: AdminRequestItem) => {
                    const hasExpired = hasExpiredQuotations(request.quotations);
                    const activeCount = getActiveQuotationsCount(
                      request.quotations
                    );
                    const totalQuotations = request.quotations?.length || 0;

                    return (
                      <tr
                        key={request.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {request.code}
                        </td>
                        <td className="py-3 px-4">
                          {request.company?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {request.provider?.country || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(request.amount, request.currency)}
                        </td>
                        <td className="py-3 px-4">
                          {request.rejectionCount ? (
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-medium ${
                                  request.rejectionCount >= 2
                                    ? "text-red-600"
                                    : request.rejectionCount >= 1
                                      ? "text-orange-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {request.rejectionCount}
                              </span>
                              <span className="text-gray-400">/3</span>
                              {request.rejectionCount >= 2 && (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">0/3</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {totalQuotations === 0 ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-medium ${
                                  hasExpired && activeCount === 0
                                    ? "text-red-600"
                                    : hasExpired
                                      ? "text-orange-600"
                                      : "text-green-600"
                                }`}
                              >
                                {activeCount}
                              </span>
                              <span className="text-gray-400">
                                /{totalQuotations}
                              </span>
                              {hasExpired && (
                                <AlertTriangle
                                  className={`h-4 w-4 ${
                                    activeCount === 0
                                      ? "text-red-500"
                                      : "text-orange-500"
                                  }`}
                                  aria-label={
                                    activeCount === 0
                                      ? "Todas las cotizaciones han expirado"
                                      : "Algunas cotizaciones han expirado"
                                  }
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="py-3 px-4">
                          {format(new Date(request.createdAt), "dd/MM/yy", {
                            locale: es,
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              asChild
                            >
                              <Link
                                href={`/admin/solicitudes/${request.code || request.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {data?.pagination && data.pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Página {data.pagination.page} de {data.pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.pagination.page <= 1}
                      onClick={() =>
                        handleFilterChange(
                          "page",
                          (data.pagination.page - 1).toString()
                        )
                      }
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.pagination.page >= data.pagination.pages}
                      onClick={() =>
                        handleFilterChange(
                          "page",
                          (data.pagination.page + 1).toString()
                        )
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
