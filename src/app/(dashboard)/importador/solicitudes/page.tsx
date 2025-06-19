"use client";

import Link from "next/link";
import ImportadorLayout from "@/components/importador-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Search,
  Send,
  Eye,
  Building2,
  Receipt,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import {
  useRequests,
  useRequestStatusConfig,
  useRequestWorkflow,
  type RequestFilters,
} from "@/hooks/use-requests";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Updated workflow steps (removed Pago Inicial)
const WORKFLOW_STEPS = [
  {
    id: 1,
    name: "Nueva Solicitud",
    icon: FileText,
    description: "Crear solicitud de importación",
  },
  {
    id: 2,
    name: "Cotización",
    icon: DollarSign,
    description: "Revisar cotización del admin",
  },
  {
    id: 3,
    name: "Contrato",
    icon: Building2,
    description: "Firmar contrato de servicio",
  },
  {
    id: 4,
    name: "Pago a Proveedor",
    icon: Send,
    description: "Admin realiza pago al proveedor",
  },
  {
    id: 5,
    name: "Factura Final",
    icon: Receipt,
    description: "Recibir factura de servicio",
  },
];

const STATUS_FILTERS = [
  { value: "todos", label: "Todos los estados" },
  { value: "pending", label: "Cotización" },
  { value: "in_review", label: "En Revisión" },
  { value: "approved", label: "Contrato" },
  { value: "completed", label: "Completado" },
];

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "monto-alto", label: "Monto mayor" },
  { value: "monto-bajo", label: "Monto menor" },
];

// Interface for importador solicitud items
interface ImportadorSolicitudItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  description: string;
  quotations?: Array<{
    status: string;
  }>;
  contracts?: Array<{
    status: string;
  }>;
  payments?: Array<{
    type: string;
    status: string;
  }>;
}

function WorkflowSteps({
  currentStep,
  solicitudId,
}: {
  currentStep: number;
  solicitudId: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border">
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        // Determine if step is clickable
        const isClickable =
          (step.id === 4 && currentStep >= 4) ||
          (step.id === 5 && currentStep >= 5);
        const stepHref = isClickable
          ? step.id === 4
            ? `/importador/solicitudes/${solicitudId}/pago-proveedor`
            : `/importador/solicitudes/${solicitudId}/factura-final`
          : null;

        const StepContent = (
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : isCurrent
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
              } ${isClickable ? "cursor-pointer hover:scale-105" : ""}`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <div className="mt-2 text-center">
              <p
                className={`text-xs font-medium ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"} ${isClickable ? "hover:text-blue-600" : ""}`}
              >
                {step.name}
              </p>
              <p className="text-xs text-gray-500 max-w-20">
                {step.description}
              </p>
            </div>
          </div>
        );

        return (
          <div key={step.id} className="flex items-center">
            {isClickable && stepHref ? (
              <Link href={stepHref}>{StepContent}</Link>
            ) : (
              StepContent
            )}
            {index < WORKFLOW_STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SolicitudCard({ solicitud }: { solicitud: ImportadorSolicitudItem }) {
  const { getStatusConfig } = useRequestStatusConfig();
  const { getWorkflowStep, getNextAction, getProgress } = useRequestWorkflow();

  const currentStep = getWorkflowStep(solicitud);
  const nextAction = getNextAction(solicitud);
  const progress = getProgress(solicitud);
  const statusConfig = getStatusConfig(solicitud.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{solicitud.code}</h3>
            <Badge
              className={`${statusConfig.color} hover:${statusConfig.color}`}
            >
              {statusConfig.label}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline mr-1" />
            {format(new Date(solicitud.createdAt), "dd/MM/yyyy", {
              locale: es,
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount and Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <span className="font-medium">
              ${solicitud.amount?.toLocaleString()} {solicitud.currency}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Progreso:</span>
            <Progress value={progress} className="w-24 h-2" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Status Description */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {solicitud.description}
          </p>
        </div>

        {/* Workflow Steps */}
        <WorkflowSteps
          currentStep={currentStep}
          solicitudId={solicitud.code || solicitud.id}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link
              href={`/importador/solicitudes/${solicitud.code || solicitud.id}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href={nextAction.href}>
              <ArrowRight className="h-4 w-4 mr-2" />
              {nextAction.text}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ImportadorSolicitudes() {
  const [filters, setFilters] = useState<RequestFilters>({
    search: "",
    status: "todos",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useRequests(filters);

  const handleFilterChange = (key: keyof RequestFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
      page: 1, // Reset to first page when filters change
    }));
  };

  if (error) {
    return (
      <ImportadorLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar las solicitudes
          </h3>
          <p className="text-gray-600 text-center">{error.message}</p>
        </div>
      </ImportadorLayout>
    );
  }

  return (
    <ImportadorLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              MIS SOLICITUDES
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus solicitudes de importación paso a paso
            </p>
          </div>

          <Button className="flex items-center gap-2" asChild>
            <Link href="/importador/solicitudes/nueva">
              <Plus className="h-4 w-4" />
              NUEVA SOLICITUD
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por ID o monto..."
                    className="pl-10"
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.status || "todos"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-40">
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
                <Select defaultValue="recientes">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-600">Cargando solicitudes...</span>
          </div>
        )}

        {/* Solicitudes List */}
        {!isLoading && data?.requests && data.requests.length > 0 && (
          <div className="space-y-4">
            {data.requests.map((solicitud: ImportadorSolicitudItem) => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.requests || data.requests.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes solicitudes aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primera solicitud de importación para comenzar
              </p>
              <Button asChild>
                <Link href="/importador/solicitudes/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  CREAR PRIMERA SOLICITUD
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Workflow Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Proceso de Importación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-700">
                      {step.id}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{step.name}</p>
                    <p className="text-blue-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ImportadorLayout>
  );
}
