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
  Trash2,
  Building2,
  Upload,
  Ban,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  useRequests,
  useRequestStatusConfig,
  useDeleteRequest,
  type RequestFilters,
} from "@/hooks/use-requests";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequestProgressTracker } from "@/components/admin/solicitudes/request-progress-tracker";

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
  contracts?: Array<{
    id: string;
    status: string;
  }>;
  payments?: Array<{
    id: string;
    status: string;
    type: string;
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

// Function to determine workflow action button based on request state
function getWorkflowActionButton(
  request: AdminRequestItem,
  creatingContract: string | null,
  handleCreateContract: (request: AdminRequestItem, e: React.MouseEvent) => void,
  router: any
) {
  // Check if there's an accepted quotation
  const acceptedQuotation = request.quotations?.find(q => q.status === "ACCEPTED");

  // Get the most recent contract if exists
  const contract = request.contracts?.[0];

  // If no accepted quotation, no workflow action available
  if (!acceptedQuotation) {
    return null;
  }

  // If accepted quotation exists but no contract, show "Create Contract"
  if (!contract) {
    return (
      <Button
        variant="default"
        size="sm"
        className="h-8 px-3 whitespace-nowrap"
        onClick={(e) => handleCreateContract(request, e)}
        disabled={creatingContract === request.id}
      >
        {creatingContract === request.id ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creando...
          </>
        ) : (
          <>
            <Building2 className="h-4 w-4 mr-2" />
            Crear Contrato
          </>
        )}
      </Button>
    );
  }

  // Contract exists, show action based on contract status
  switch (contract.status) {
    case "DRAFT":
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          Ver Contrato
        </Button>
      );

    case "ACTIVE":
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Contrato
        </Button>
      );

    case "PAYMENT_PENDING":
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 whitespace-nowrap bg-yellow-600 hover:bg-yellow-700"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/payments`);
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Revisar Pago
        </Button>
      );

    case "PAYMENT_REVIEWED":
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 whitespace-nowrap bg-blue-600 hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/payments`);
          }}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Pagar Proveedor
        </Button>
      );

    case "PROVIDER_PAID":
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 whitespace-nowrap bg-purple-600 hover:bg-purple-700"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/payments`);
          }}
        >
          <Upload className="h-4 w-4 mr-2" />
          Subir Factura
        </Button>
      );

    case "PAYMENT_COMPLETED":
    case "COMPLETED":
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Completado
        </Button>
      );

    case "CANCELLED":
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <Ban className="h-4 w-4 mr-2 text-red-600" />
          Cancelado
        </Button>
      );

    case "EXPIRED":
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
          Expirado
        </Button>
      );

    default:
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/contracts/${contract.id}`);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver
        </Button>
      );
  }
}

export default function AdminSolicitudes() {
  const router = useRouter();
  const [filters, setFilters] = useState<RequestFilters>({
    status: "todos",
    country: "todos",
    search: "",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 20,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [creatingContract, setCreatingContract] = useState<string | null>(null);

  const { data, isLoading, error } = useRequests(filters);
  const { deleteRequest, isLoading: isDeleting } = useDeleteRequest();

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

  const handleDeleteClick = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setRequestToDelete(requestId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const handleRowClick = (requestCode: string, requestId: string) => {
    router.push(`/admin/solicitudes/${requestCode || requestId}`);
  };

  const handleCreateContract = async (request: AdminRequestItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find the accepted quotation
    const acceptedQuotation = request.quotations?.find(q => q.status === "ACCEPTED");
    if (!acceptedQuotation) {
      alert("No hay una cotización aceptada para crear el contrato");
      return;
    }

    setCreatingContract(request.id);
    try {
      const response = await fetch("/api/admin/contracts/auto-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quotationId: acceptedQuotation.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el contrato");
      }

      const result = await response.json();
      router.push(`/admin/contracts/${result.contract.id}`);
    } catch (error) {
      console.error("Error creating contract:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setCreatingContract(null);
    }
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
                    <th className="text-left py-3 px-4">FECHA</th>
                    <th className="text-left py-3 px-4">REF</th>
                    <th className="text-left py-3 px-4">EMPRESA</th>
                    <th className="text-left py-3 px-4">DESTINO</th>
                    <th className="text-left py-3 px-4">MONTO</th>
                    <th className="text-left py-3 px-4">PROGRESO</th>
                    <th className="text-left py-3 px-4">ESTADO</th>
                    <th className="text-left py-3 px-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {data.requests.map((request: AdminRequestItem) => {
                    return (
                      <tr
                        key={request.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(request.code, request.id)}
                      >
                        <td className="py-3 px-4">
                          {format(new Date(request.createdAt), "dd/MM/yy", {
                            locale: es,
                          })}
                        </td>
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
                          <RequestProgressTracker
                            status={request.status}
                            quotations={request.quotations}
                            contracts={request.contracts}
                            payments={request.payments}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getWorkflowActionButton(
                              request,
                              creatingContract,
                              handleCreateContract,
                              router
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/solicitudes/${request.code || request.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => handleDeleteClick(request.id, e)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              solicitud y todos sus datos relacionados (cotizaciones, contratos,
              pagos, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
