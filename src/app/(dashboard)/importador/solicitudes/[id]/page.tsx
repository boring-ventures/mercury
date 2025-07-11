"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import ImportadorLayout from "@/components/importador-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  MapPin,
  User,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  ZoomIn,
  ArrowRight,
  DollarSign,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  useRequest,
  useRequestStatusConfig,
  useRequestWorkflow,
  useUpdateQuotation,
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
    icon: MessageSquare,
    description: "Admin realiza pago al proveedor",
  },
  {
    id: 5,
    name: "Factura Final",
    icon: MessageSquare,
    description: "Recibir factura de servicio",
  },
];

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

function getDocumentTypeLabel(type: string) {
  const types: { [key: string]: string } = {
    PROFORMA_INVOICE: "Proforma Invoice",
    COMMERCIAL_INVOICE: "Factura Comercial",
    FACTURA_COMERCIAL: "Factura Comercial",
    PACKING_LIST: "Lista de Empaque",
    CERTIFICATE: "Certificado",
    OTHER: "Otro",
  };
  return types[type] || type;
}

interface DocumentType {
  id: string;
  filename: string;
  mimeType: string;
  type: string;
  fileUrl: string;
  fileSize: number;
}

interface QuotationType {
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
  description?: string;
  rejectionReason?: string;
}

function DocumentViewerModal({
  document,
  isOpen,
  onClose,
}: {
  document: DocumentType;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isImage =
    document?.mimeType?.toLowerCase().includes("image") ||
    document?.filename?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  const isPDF =
    document?.mimeType?.toLowerCase().includes("pdf") ||
    document?.filename?.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    if (document?.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{document.filename}</DialogTitle>
              <DialogDescription>
                {getDocumentTypeLabel(document.type)} •{" "}
                {(document.fileSize / 1024 / 1024).toFixed(2)} MB
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {isImage ? (
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              {imageError ? (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      No se pudo cargar la imagen
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {document.filename}
                    </p>
                  </div>
                </div>
              ) : (
                <Image
                  src={document.fileUrl}
                  alt={document.filename}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[60vh] object-contain"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              {imageLoaded && !imageError && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Ver tamaño completo
                  </Button>
                </div>
              )}
            </div>
          ) : isPDF ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Documento PDF
              </h3>
              <p className="text-gray-600 mb-4">{document.filename}</p>
              <Button onClick={handleDownload}>
                <Eye className="h-4 w-4 mr-2" />
                Abrir PDF
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vista previa no disponible
              </h3>
              <p className="text-gray-600 mb-4">{document.filename}</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Descargar archivo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocumentCard({ document }: { document: DocumentType }) {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-600" />
          <div>
            <p className="font-medium text-sm">{document.filename}</p>
            <p className="text-xs text-gray-500">
              {getDocumentTypeLabel(document.type)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>
      </div>

      <DocumentViewerModal
        document={document}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

function QuotationCard({
  quotation,
  onUpdate,
}: {
  quotation: QuotationType;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const { updateQuotation, isLoading } = useUpdateQuotation();
  const [notes, setNotes] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const isExpired = new Date() > new Date(quotation.validUntil);
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
      onUpdate();
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast({
        title: "Nota requerida",
        description: "Debe proporcionar una razón para rechazar la cotización",
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
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-lg">Cotización {quotation.code}</h4>
          <Badge className={getStatusColor(quotation.status)}>
            {getStatusLabel(quotation.status)}
          </Badge>
          {isExpired && quotation.status === "SENT" && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Expirada
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">
          <Calendar className="h-4 w-4 inline mr-1" />
          {format(new Date(quotation.createdAt), "dd/MM/yyyy", { locale: es })}
        </div>
      </div>

      {/* Amount Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <Clock className="h-4 w-4 inline mr-1" />
          Válida hasta:{" "}
          {format(new Date(quotation.validUntil), "dd/MM/yyyy 'a las' HH:mm", {
            locale: es,
          })}
        </p>
      </div>

      {/* Terms and Notes */}
      {quotation.terms && (
        <div className="mb-4">
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
        <div className="mb-4">
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
            {/* Approve Dialog */}
            <Dialog
              open={showApproveDialog}
              onOpenChange={setShowApproveDialog}
            >
              <DialogTrigger asChild>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aprobar Cotización
                </Button>
              </DialogTrigger>
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

            {/* Reject Dialog */}
            <AlertDialog
              open={showRejectDialog}
              onOpenChange={setShowRejectDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar Cotización
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rechazar Cotización</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro que desea rechazar esta cotización? Debe
                    proporcionar una razón para el rechazo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="reject-notes">Motivo del rechazo *</Label>
                    <Textarea
                      id="reject-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Explique por qué está rechazando esta cotización..."
                      className="mt-2"
                      required
                    />
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
                    disabled={isLoading || !notes.trim()}
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
                        Confirmar Rechazo
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
        <div className="flex items-start gap-2 pt-4 border-t text-red-700">
          <XCircle className="h-4 w-4 mt-0.5" />
          <div>
            <span className="text-sm font-medium block">
              Cotización rechazada
            </span>
            {quotation.rejectionReason && (
              <div className="mt-2 bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-600 font-medium mb-1">
                  Motivo del rechazo:
                </p>
                <p className="text-sm text-red-800">
                  {quotation.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImportadorSolicitudDetail() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { data, isLoading, refetch } = useRequest(requestId);
  const { getStatusConfig } = useRequestStatusConfig();
  const { getWorkflowStep, getNextAction, getProgress } = useRequestWorkflow();

  const request = data?.request;

  // Only show published quotations to importador (filter out drafts)
  const visibleQuotations =
    request?.quotations?.filter(
      (quotation: QuotationType) => quotation.status === "SENT"
    ) || [];

  const handleQuotationUpdate = () => {
    refetch(); // Refresh the request data
  };

  if (isLoading) {
    return (
      <ImportadorLayout>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-600">Cargando solicitud...</span>
          </div>
        </div>
      </ImportadorLayout>
    );
  }

  if (!request) {
    return (
      <ImportadorLayout>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Solicitud no encontrada
            </h3>
            <p className="text-gray-600 text-center">
              La solicitud que buscas no existe o no tienes permisos para verla.
            </p>
            <Button className="mt-4" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </ImportadorLayout>
    );
  }

  // Now it's safe to call these functions since we know request exists
  const progress = getProgress(request);
  const statusConfig = getStatusConfig(request.status);
  const currentStep = getWorkflowStep(request);
  const nextAction = getNextAction(request);

  return (
    <ImportadorLayout>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Solicitud {request.code}</h1>
                <p className="text-gray-600">
                  Detalles de tu solicitud de importación
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <StatusBadge status={request.status} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Progreso:</span>
                <Progress value={progress} className="w-24 h-2" />
                <span className="text-sm font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <WorkflowSteps
            currentStep={currentStep}
            solicitudId={request.code || request.id}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Monto Total</p>
                        <p className="font-semibold text-lg">
                          ${request.amount?.toLocaleString()} {request.currency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Fecha de Creación
                        </p>
                        <p className="font-semibold">
                          {format(new Date(request.createdAt), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Descripción del Pedido
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900">{request.description}</p>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <p className="font-medium text-blue-900">Estado Actual</p>
                    </div>
                    <p className="text-sm text-blue-800">
                      {statusConfig.label} - Tu solicitud está siendo procesada
                      según el flujo de trabajo.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Proveedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Nombre del Proveedor
                        </p>
                        <p className="font-semibold">
                          {request.provider?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          País del Proveedor
                        </p>
                        <p className="font-semibold">
                          {request.provider?.country || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {request.provider?.bankingDetails && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Información Bancaria
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {request.provider.bankingDetails}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Quotations Section - Only show published quotations */}
              {visibleQuotations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cotizaciones Recibidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {visibleQuotations.map((quotation: QuotationType) => (
                      <QuotationCard
                        key={quotation.id}
                        quotation={quotation}
                        onUpdate={handleQuotationUpdate}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              {request.documents && request.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos Subidos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {request.documents.map((document: DocumentType) => (
                      <DocumentCard key={document.id} document={document} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {nextAction.text}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Este es el siguiente paso en tu proceso de importación.
                    </p>

                    {/* Conditional rendering: Only show button if there's a meaningful action */}
                    {/* Hide the button for step 1 (Esperar Cotización) as it doesn't do anything */}
                    {currentStep !== 1 && (
                      <>
                        {/* Conditional rendering: Modal for quotation review, Link for other actions */}
                        {currentStep === 2 && visibleQuotations.length > 0 ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                {nextAction.text}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <DollarSign className="h-5 w-5" />
                                  Revisar Cotización {visibleQuotations[0].code}
                                </DialogTitle>
                                <DialogDescription>
                                  Revise los detalles de la cotización y decida
                                  si aprobarla o rechazarla.
                                </DialogDescription>
                              </DialogHeader>

                              {/* Use the existing QuotationCard component */}
                              <div className="py-4">
                                <QuotationCard
                                  quotation={visibleQuotations[0]}
                                  onUpdate={handleQuotationUpdate}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button className="w-full" asChild>
                            <Link href={nextAction.href}>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              {nextAction.text}
                            </Link>
                          </Button>
                        )}
                      </>
                    )}

                    {/* Show waiting message when at step 1 */}
                    {currentStep === 1 && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Tu solicitud está siendo revisada
                        </p>
                        <p className="text-xs text-gray-500">
                          El administrador te enviará una cotización pronto
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Tu Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Empresa</p>
                      <p className="font-semibold">
                        {request.company?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">País</p>
                      <p className="font-semibold">
                        {request.company?.country || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Solicitado por</p>
                      <p className="font-semibold">
                        {request.createdBy
                          ? `${request.createdBy.firstName} ${request.createdBy.lastName}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              {request.reviewNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notas de Revisión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        {request.reviewNotes}
                      </p>
                    </div>
                    {request.reviewedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Revisado el{" "}
                        {format(
                          new Date(request.reviewedAt),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: es,
                          }
                        )}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/importador/solicitudes">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Ver Todas las Solicitudes
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/importador/solicitudes/nueva">
                      <FileText className="h-4 w-4 mr-2" />
                      Nueva Solicitud
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ImportadorLayout>
  );
}
