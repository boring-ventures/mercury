"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, FileText, TrendingUp, FileEdit } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-admin-dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { DraftQuotationModal } from "@/components/draft-quotation/draft-quotation-modal";

export default function AdminDashboard() {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [isDraftQuotationOpen, setIsDraftQuotationOpen] = useState(false);

  // Fetch dashboard metrics with date filters
  const { data: metrics, isLoading } = useDashboardMetrics({
    dateFrom,
    dateTo,
  });

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: currency === "BS" ? "BOB" : "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
      },
      IN_REVIEW: {
        label: "En Revisión",
        className: "bg-blue-100 text-blue-800",
      },
      APPROVED: {
        label: "Aprobado",
        className: "bg-green-100 text-green-800",
      },
      COMPLETED: {
        label: "Completado",
        className: "bg-green-100 text-green-800",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métricas del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtros de Fecha</CardTitle>
              <CardDescription>
                Selecciona un rango de fechas para filtrar las métricas
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsDraftQuotationOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Cotización Borrador
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Approved in USD */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Aprobado (USD)
                </span>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics?.totalApprovedUSD || 0, "USD")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Approved in BS */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Aprobado (Bs)
                </span>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics?.totalApprovedBS || 0, "BS")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Commissions in BS */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Comisiones (Bs)
                </span>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics?.totalCommissionsBS || 0, "BS")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Number of Approved Requests */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Solicitudes Aprobadas
                </span>
                <div className="text-2xl font-bold">
                  {metrics?.approvedRequestsCount || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>
            Solicitudes que requieren atención inmediata
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.pendingRequests && metrics.pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {metrics.pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{request.code}</p>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.companyName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(request.amount, request.currency)} •{" "}
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/admin/solicitudes/${request.id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay solicitudes pendientes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Clientes</CardTitle>
          <CardDescription>
            Información sobre solicitudes y montos por cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.clientStats && metrics.clientStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">
                    Nº Solicitudes
                  </TableHead>
                  <TableHead className="text-right">Monto Total</TableHead>
                  <TableHead className="text-right">Monto Aprobado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.clientStats.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.requestCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(client.totalAmount, "USD")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(client.approvedAmount, "USD")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay datos de clientes para mostrar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft Quotation Modal */}
      <DraftQuotationModal
        open={isDraftQuotationOpen}
        onOpenChange={setIsDraftQuotationOpen}
      />
    </div>
  );
}
