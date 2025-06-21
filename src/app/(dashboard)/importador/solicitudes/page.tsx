"use client";

import Link from "next/link";
import ImportadorLayout from "@/components/importador-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import {
  useRequests,
  useRequestStatusConfig,
  useRequestWorkflow,
  useUpdateQuotation,
  type RequestFilters,
} from "@/hooks/use-requests";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

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
  rejectionCount?: number;
  quotations?: Array<{
    id: string;
    code: string;
    status: string;
    totalAmount: number;
    baseAmount: number;
    fees: number;
    taxes: number;
    currency: string;
    validUntil: string;
    createdAt: string;
    notes?: string;
    terms?: string;
    rejectionReason?: string;
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

// QuotationReviewModal component
function QuotationReviewModal({
  solicitud,
  onUpdate,
}: {
  solicitud: ImportadorSolicitudItem;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const { updateQuotation, isLoading } = useUpdateQuotation();
  const [notes, setNotes] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get the first quotation (assuming one quotation per request for now)
  const quotation = solicitud.quotations?.[0];

  if (!quotation) {
    return null;
  }

  const isExpired = new Date() > new Date(quotation.validUntil || Date.now());
  const canRespond =
    (quotation.status === "SENT" || quotation.status === "DRAFT") && !isExpired;

  const handleApprove = async () => {
    try {
      await updateQuotation({
        quotationId: quotation.id,
        action: "ACCEPTED",
        notes: notes || undefined,
      });
      setShowApproveDialog(false);
      setNotes("");
      setIsOpen(false);
      onUpdate();
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleReject = async () => {
    if (!notes.trim() || notes.trim().length < 10) {
      toast({
        title: "Motivo requerido",
        description:
          "Debe proporcionar una razón detallada de al menos 10 caracteres para rechazar la cotización",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateQuotation({
        quotationId: quotation.id,
        action: "REJECTED",
        notes,
      });
      setShowRejectDialog(false);
      setNotes("");
      setIsOpen(false);
      onUpdate();
    } catch {
      // Error handling is done in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-orange-100 text-orange-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Borrador";
      case "SENT":
        return "Pendiente";
      case "ACCEPTED":
        return "Aprobada";
      case "REJECTED":
        return "Rechazada";
      case "EXPIRED":
        return "Expirada";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex-1"
          style={{
            backgroundColor: "#f97316", // Orange for quotation review
          }}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Revisar Cotización
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revisar Cotización {quotation.code}
          </DialogTitle>
          <DialogDescription>
            Revise los detalles de la cotización y decida si aprobarla o
            rechazarla.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rejection Count Warning */}
          {solicitud.rejectionCount !== undefined &&
            solicitud.rejectionCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">
                      Advertencia de Propuestas
                    </h4>
                    <p className="text-sm text-amber-800 mt-1">
                      Esta solicitud ha rechazado{" "}
                      <strong>{solicitud.rejectionCount}</strong> de 3
                      propuestas permitidas.
                      {solicitud.rejectionCount >= 2 && (
                        <span className="block mt-1 font-medium">
                          ⚠️ Si rechaza esta propuesta, la solicitud será
                          cancelada automáticamente.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Status and Date */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(quotation.status)}>
              {getStatusLabel(quotation.status)}
            </Badge>
            <div className="text-sm text-gray-600">
              <Calendar className="h-4 w-4 inline mr-1" />
              {format(new Date(quotation.createdAt), "dd/MM/yyyy", {
                locale: es,
              })}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Monto Base</p>
              <p className="font-semibold">
                ${quotation.baseAmount?.toLocaleString()} {quotation.currency}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Comisiones</p>
              <p className="font-semibold">
                ${quotation.fees?.toLocaleString()} {quotation.currency}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Impuestos</p>
              <p className="font-semibold">
                ${quotation.taxes?.toLocaleString()} {quotation.currency}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">Total</p>
              <p className="font-bold text-lg text-blue-900">
                ${quotation.totalAmount?.toLocaleString()} {quotation.currency}
              </p>
            </div>
          </div>

          {/* Valid Until */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm text-yellow-800 flex items-center gap-2">
              <Clock className="h-4 w-4 inline" />
              <span>
                Válida hasta:{" "}
                {format(
                  new Date(quotation.validUntil),
                  "dd/MM/yyyy 'a las' HH:mm",
                  { locale: es }
                )}
              </span>
              {isExpired && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expirada
                </Badge>
              )}
            </div>
          </div>

          {/* Terms and Notes */}
          {quotation.terms && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Términos y Condiciones:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {quotation.terms}
                </p>
              </div>
            </div>
          )}

          {quotation.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Notas:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {quotation.notes}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canRespond && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <div className="flex-1 flex gap-3">
                {/* Approve Button */}
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aprobar Cotización
                </Button>

                {/* Reject Button */}
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar Cotización
                </Button>
              </div>
            </div>
          )}

          {quotation.status === "ACCEPTED" && (
            <div className="flex items-center gap-2 pt-4 border-t text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Cotización aprobada - Procediendo al siguiente paso
              </span>
            </div>
          )}

          {quotation.status === "REJECTED" && (
            <div className="flex items-center gap-2 pt-4 border-t text-red-700">
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">Cotización rechazada</span>
            </div>
          )}
        </div>

        {/* Nested Dialogs for Approve/Reject */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprobar Cotización</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea aprobar esta cotización? Esta acción
                moverá la solicitud al siguiente paso del proceso.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="approve-notes">
                  Notas adicionales (opcional)
                </Label>
                <Textarea
                  id="approve-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comentarios adicionales sobre la aprobación..."
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveDialog(false);
                  setNotes("");
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Aprobando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Aprobación
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-600" />
                Rechazar Cotización
              </AlertDialogTitle>
              <AlertDialogDescription>
                {solicitud.rejectionCount !== undefined &&
                solicitud.rejectionCount >= 2 ? (
                  <div className="space-y-2">
                    <p className="text-red-600 font-medium">
                      ⚠️ ADVERTENCIA: Esta es la última oportunidad.
                    </p>
                    <p>
                      Si rechaza esta cotización, la solicitud será{" "}
                      <strong>cancelada automáticamente</strong>
                      ya que habrá alcanzado el límite de 3 propuestas
                      rechazadas.
                    </p>
                    <p className="text-sm">
                      Asegúrese de proporcionar una explicación detallada del
                      rechazo.
                    </p>
                  </div>
                ) : (
                  <p>
                    ¿Está seguro que desea rechazar esta cotización? Debe
                    proporcionar una razón detallada para el rechazo.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              {solicitud.rejectionCount !== undefined &&
                solicitud.rejectionCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Rechazos anteriores:</strong>{" "}
                      {solicitud.rejectionCount} de 3 permitidos
                    </p>
                  </div>
                )}
              <div>
                <Label htmlFor="reject-notes" className="font-medium">
                  Motivo del rechazo *
                  {solicitud.rejectionCount !== undefined &&
                    solicitud.rejectionCount >= 2 && (
                      <span className="text-red-600 text-xs ml-2">
                        (OBLIGATORIO - Último rechazo)
                      </span>
                    )}
                </Label>
                <Textarea
                  id="reject-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    solicitud.rejectionCount !== undefined &&
                    solicitud.rejectionCount >= 2
                      ? "Explique detalladamente por qué está rechazando esta cotización (esto cancelará la solicitud)..."
                      : "Explique por qué está rechazando esta cotización..."
                  }
                  className="mt-2"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 10 caracteres requeridos
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowRejectDialog(false);
                  setNotes("");
                }}
                disabled={isLoading}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                disabled={
                  isLoading || !notes.trim() || notes.trim().length < 10
                }
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rechazando...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    {solicitud.rejectionCount !== undefined &&
                    solicitud.rejectionCount >= 2
                      ? "Rechazar y Cancelar Solicitud"
                      : "Confirmar Rechazo"}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

function SolicitudCard({ solicitud }: { solicitud: ImportadorSolicitudItem }) {
  const { getStatusConfig } = useRequestStatusConfig();
  const { getWorkflowStep, getNextAction, getProgress } = useRequestWorkflow();

  const currentStep = getWorkflowStep(solicitud);
  const nextAction = getNextAction(solicitud);
  const progress = getProgress(solicitud);
  const statusConfig = getStatusConfig(solicitud.status);

  // Check if this is a quotation review step
  const isQuotationReviewStep =
    currentStep === 2 &&
    solicitud.quotations &&
    solicitud.quotations.length > 0;

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

          {/* Conditional rendering for second button */}
          {isQuotationReviewStep ? (
            <QuotationReviewModal
              solicitud={solicitud}
              onUpdate={() => {
                // This will trigger a refetch when quotation is updated
                window.location.reload(); // Simple approach for now
              }}
            />
          ) : (
            /* Only show action button if it's not step 1 (Esperar Cotización doesn't do anything) */
            currentStep !== 1 && (
              <Button
                className="flex-1"
                asChild
                style={{
                  backgroundColor: currentStep === 2 ? "#f97316" : undefined,
                }}
              >
                <Link href={nextAction.href}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {nextAction.text}
                </Link>
              </Button>
            )
          )}
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
