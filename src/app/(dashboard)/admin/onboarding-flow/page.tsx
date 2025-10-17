"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Workflow,
  CheckCircle,
  Clock,
  FileText,
  Package,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RequestProgressTracker } from "@/components/admin/solicitudes/request-progress-tracker";
import { useRequests } from "@/hooks/use-requests";
import { formatCurrency } from "@/lib/utils";

interface OnboardingRequest {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
  provider?: {
    name?: string;
  };
  quotations?: Array<{
    id: string;
    status: string;
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
  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    PENDING: {
      label: "Cotización",
      color: "bg-amber-100 text-amber-800",
      icon: Clock,
    },
    IN_REVIEW: {
      label: "En Revisión",
      color: "bg-blue-100 text-blue-800",
      icon: FileText,
    },
    APPROVED: {
      label: "Aprobado",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    COMPLETED: {
      label: "Completado",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    REJECTED: {
      label: "Rechazado",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
    CANCELLED: {
      label: "Cancelado",
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export default function OnboardingFlowPage() {
  const router = useRouter();
  const { data, isLoading } = useRequests();

  // Filter only onboarding requests (you can add a specific flag in the future)
  // For now, we show all requests since they can all be managed through this flow
  const requests = data?.requests || [];

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando flujos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Workflow className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Flujo de Adaptación</h1>
              <p className="text-gray-600">
                Gestiona el proceso completo de onboarding de clientes
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/onboarding-flow/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Flujo
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-sm text-gray-600">Total Flujos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      requests.filter(
                        (r: OnboardingRequest) =>
                          r.status === "PENDING" || r.status === "IN_REVIEW"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">En Proceso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      requests.filter(
                        (r: OnboardingRequest) => r.status === "COMPLETED"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const totalAmount = requests.reduce(
                        (sum: number, r: OnboardingRequest) => {
                          const amount =
                            typeof r.amount === "string"
                              ? parseFloat(r.amount)
                              : r.amount || 0;
                          return sum + amount;
                        },
                        0
                      );
                      return formatCurrency(totalAmount, "USD");
                    })()}
                  </p>
                  <p className="text-sm text-gray-600">Monto Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Flujos de Adaptación</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay flujos de adaptación
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea un nuevo flujo para comenzar el proceso de onboarding
                </p>
                <Button asChild>
                  <Link href="/admin/onboarding-flow/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Flujo
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request: OnboardingRequest) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/onboarding-flow/${request.id}`)
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {request.code}
                          </h3>
                          <StatusBadge status={request.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Empresa</p>
                            <p className="font-medium">
                              {request.company?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Monto</p>
                            <p className="font-medium">
                              {formatCurrency(
                                typeof request.amount === "string"
                                  ? parseFloat(request.amount)
                                  : request.amount || 0,
                                request.currency || "USD"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Creado</p>
                            <p className="font-medium">
                              {format(
                                new Date(request.createdAt),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Progreso</p>
                          <RequestProgressTracker
                            status={request.status}
                            quotations={request.quotations}
                            contracts={request.contracts}
                            payments={request.payments}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/onboarding-flow/${request.id}`);
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
