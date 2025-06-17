"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  FileText,
  Building2,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRequests } from "@/hooks/use-requests";

export default function AdminDashboard() {
  const { data: requestsData, isLoading } = useRequests({ limit: 5 });

  // Mock data for other metrics (would come from actual APIs)
  const metrics = {
    totalRequests: requestsData?.pagination?.total || 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0,
    activeCompanies: 0,
    pendingQuotations: 0,
  };

  if (requestsData?.requests) {
    metrics.pendingRequests = requestsData.requests.filter(
      (r: any) => r.status === "PENDING"
    ).length;
    metrics.completedRequests = requestsData.requests.filter(
      (r: any) => r.status === "COMPLETED"
    ).length;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Vista general de la plataforma Mercury
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Solicitudes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Cargando..." : "Todas las solicitudes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.completedRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              Procesos finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas Activas
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.activeCompanies}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Solicitudes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Cargando...</span>
              </div>
            ) : requestsData?.requests && requestsData.requests.length > 0 ? (
              <>
                {requestsData.requests.slice(0, 3).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.code}</p>
                      <p className="text-sm text-gray-600">
                        {request.company?.name || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          request.status === "PENDING"
                            ? "secondary"
                            : request.status === "COMPLETED"
                              ? "default"
                              : "outline"
                        }
                      >
                        {request.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        ${request.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/solicitudes">
                    Ver todas las solicitudes
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay solicitudes recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/solicitudes">
                <Package className="h-4 w-4 mr-2" />
                Gestionar Solicitudes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/cotizaciones">
                <FileText className="h-4 w-4 mr-2" />
                Crear Cotización
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/empresas">
                <Building2 className="h-4 w-4 mr-2" />
                Gestionar Empresas
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/reportes">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Reportes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
