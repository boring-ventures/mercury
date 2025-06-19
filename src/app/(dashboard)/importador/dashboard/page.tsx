"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  FileText,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRequests, useRequestWorkflow } from "@/hooks/use-requests";

interface DashboardMetrics {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalRevenue: number;
  activeCompanies: number;
  pendingQuotations: number;
}

interface RequestItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency?: string;
  company?: {
    name: string;
  };
}

export default function ImportadorDashboard() {
  const { data: requestsData, isLoading } = useRequests({ limit: 5 });

  // Mock data for other metrics (would come from actual APIs)
  const metrics: DashboardMetrics = {
    totalRequests: requestsData?.pagination?.total || 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0,
    activeCompanies: 0,
    pendingQuotations: 0,
  };

  if (requestsData?.requests) {
    const requests = requestsData.requests as RequestItem[];
    metrics.pendingRequests = requests.filter(
      (r: RequestItem) => r.status === "PENDING"
    ).length;
    metrics.completedRequests = requests.filter(
      (r: RequestItem) => r.status === "COMPLETED"
    ).length;
  }

  const { getWorkflowStep, getProgress } = useRequestWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus importaciones de manera eficiente
            </p>
          </div>
          <Button className="flex items-center gap-2" asChild>
            <Link href="/importador/solicitudes/nueva">
              <Plus className="h-4 w-4" />
              NUEVA SOLICITUD
            </Link>
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mis Solicitudes
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Cargando..." : "Total creadas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                Actualmente activas
              </p>
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
                Importaciones exitosas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${metrics.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                En todas las solicitudes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Solicitudes Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Cargando...
                  </span>
                </div>
              ) : requestsData?.requests && requestsData.requests.length > 0 ? (
                <>
                  {requestsData.requests
                    .filter((r: RequestItem) => r.status !== "COMPLETED")
                    .slice(0, 3)
                    .map((request: RequestItem) => {
                      const currentStep = getWorkflowStep(request);
                      const progress = getProgress(request);

                      return (
                        <div
                          key={request.id}
                          className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">{request.code}</p>
                              <p className="text-sm text-gray-600">
                                ${request.amount?.toLocaleString()}
                                {request.currency && ` ${request.currency}`}
                              </p>
                            </div>
                            <Badge
                              variant={
                                request.status === "PENDING"
                                  ? "secondary"
                                  : request.status === "APPROVED"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              Paso {currentStep}/5
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progreso:</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/importador/solicitudes">
                      Ver todas mis solicitudes
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="mb-4">No tienes solicitudes activas</p>
                  <Button asChild>
                    <Link href="/importador/solicitudes/nueva">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera solicitud
                    </Link>
                  </Button>
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
                <Link href="/importador/solicitudes/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/importador/solicitudes">
                  <Package className="h-4 w-4 mr-2" />
                  Mis Solicitudes
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/importador/cotizaciones">
                  <FileText className="h-4 w-4 mr-2" />
                  Mis Cotizaciones
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/importador/documentos">
                  <FileText className="h-4 w-4 mr-2" />
                  Mis Documentos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Process Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cómo funciona el proceso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              {[
                {
                  step: 1,
                  title: "Crear Solicitud",
                  desc: "Sube documentos y datos del proveedor",
                },
                {
                  step: 2,
                  title: "Recibir Cotización",
                  desc: "Nuestro equipo evalúa y cotiza",
                },
                {
                  step: 3,
                  title: "Firmar Contrato",
                  desc: "Acepta términos y condiciones",
                },
                {
                  step: 4,
                  title: "Pago a Proveedor",
                  desc: "Realizamos el pago internacional",
                },
                {
                  step: 5,
                  title: "Factura Final",
                  desc: "Recibe factura del servicio",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-medium text-blue-700">
                      {item.step}
                    </span>
                  </div>
                  <p className="font-medium text-blue-900">{item.title}</p>
                  <p className="text-blue-700 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
