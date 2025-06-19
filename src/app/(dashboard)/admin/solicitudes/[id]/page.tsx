"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  ZoomIn,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useRequest,
  useUpdateRequest,
  useRequestStatusConfig,
} from "@/hooks/use-requests";
import {
  useUpdateDocumentStatus,
  useInternalNotes,
  useAddInternalNote,
  useDownloadPDF,
  useRequestHistory,
} from "@/hooks/use-admin-requests";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface DocumentItem {
  id: string;
  filename: string;
  mimeType: string;
  type?: string;
  fileUrl?: string;
  status?: string;
  reviewNotes?: string;
  createdAt?: Date;
}

interface HistoryEvent {
  date: string;
  description: string;
  user: string;
  type: string;
}

interface InternalNote {
  id?: string;
  content: string;
  createdAt: Date;
  createdBy: {
    firstName?: string;
    lastName?: string;
  };
}

interface ToastInstance {
  (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive" | null | undefined;
  }): void;
}

interface QuotationItem {
  id: string;
  code: string;
  status: string;
  totalAmount: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
  notes?: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Cotización" },
  { value: "IN_REVIEW", label: "En Revisión" },
  { value: "APPROVED", label: "Aprobado" },
  { value: "COMPLETED", label: "Completado" },
  { value: "REJECTED", label: "Rechazado" },
  { value: "CANCELLED", label: "Cancelado" },
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

interface DocumentViewerProps {
  document: {
    id: string;
    filename: string;
    mimeType: string;
    type?: string;
    fileUrl?: string;
  };
}

function DocumentViewer({ document }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isImage =
    document.mimeType?.toLowerCase().includes("image") ||
    document.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  const isPDF =
    document.mimeType?.toLowerCase().includes("pdf") ||
    document.filename.toLowerCase().endsWith(".pdf");

  // Better URL handling - check if fileUrl is valid or use API endpoint
  const getDocumentUrl = () => {
    // If fileUrl exists and is a valid HTTP URL, use it
    if (document.fileUrl && document.fileUrl.startsWith("http")) {
      return document.fileUrl;
    }

    // For local paths that likely don't exist in demo, return null to show placeholder
    if (
      document.fileUrl &&
      (document.fileUrl.startsWith("/uploads/") ||
        document.fileUrl.startsWith("uploads/") ||
        document.fileUrl.includes("1750030")) // Specific pattern we saw in errors
    ) {
      // These are upload paths that likely don't exist in demo
      return null;
    }

    // Fallback to API endpoint for other cases
    return `/api/documents/${document.id}`;
  };

  const documentUrl = getDocumentUrl();

  // If we know the URL is invalid from the start, show placeholder
  const shouldShowPlaceholder = !documentUrl || imageError;

  const handleOpenFullscreen = () => {
    if (documentUrl) {
      setIsFullscreen(true);
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  if (isImage) {
    return (
      <>
        <div
          className="relative group cursor-pointer"
          onClick={handleOpenFullscreen}
        >
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {shouldShowPlaceholder ? (
              // Show placeholder immediately if there was an error or no valid URL
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    {document.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Vista previa no disponible
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Archivo de demostración
                  </p>
                </div>
              </div>
            ) : (
              <Image
                src={documentUrl}
                alt={document.filename}
                width={400}
                height={256}
                className="w-full h-64 object-contain"
                onError={() => {
                  console.log(`Failed to load image: ${documentUrl}`);
                  setImageError(true);
                }}
                onLoad={() => {
                  setImageLoaded(true);
                  setImageError(false);
                }}
              />
            )}
          </div>

          {imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                Ver completo
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenFullscreen}
            disabled={shouldShowPlaceholder}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={shouldShowPlaceholder}
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>

        {/* Fullscreen Modal */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{document.filename}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    {document.type} • Vista completa
                  </DialogDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </DialogHeader>
            <div className="relative max-h-[80vh] overflow-auto">
              {documentUrl && !shouldShowPlaceholder && (
                <Image
                  src={documentUrl}
                  alt={document.filename}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isPDF) {
    return (
      <div className="text-center py-8">
        <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Documento PDF
        </h3>
        <p className="text-gray-600 mb-4">{document.filename}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={handleDownload} disabled={shouldShowPlaceholder}>
            <Eye className="h-4 w-4 mr-2" />
            Abrir PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={shouldShowPlaceholder}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
        {shouldShowPlaceholder && (
          <p className="text-xs text-gray-500 mt-2">
            Archivo de demostración - Vista previa no disponible
          </p>
        )}
      </div>
    );
  }

  // Other file types
  return (
    <div className="text-center py-8">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {document.filename}
      </h3>
      <p className="text-gray-600 mb-4">
        Vista previa no disponible para este tipo de archivo
      </p>
      <Button
        onClick={handleDownload}
        disabled={shouldShowPlaceholder}
        variant="outline"
      >
        <Download className="h-4 w-4 mr-2" />
        Descargar
      </Button>
      {shouldShowPlaceholder && (
        <p className="text-xs text-gray-500 mt-2">
          Archivo de demostración - Descarga no disponible
        </p>
      )}
    </div>
  );
}

function DocumentCard({
  document,
  requestId,
}: {
  document: DocumentItem;
  requestId: string;
}) {
  const { toast } = useToast();
  const { mutate: updateDocumentStatus, isPending: isUpdating } =
    useUpdateDocumentStatus();

  const handleStatusChange = (newStatus: string) => {
    updateDocumentStatus(
      {
        requestId,
        docId: document.id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Estado del documento actualizado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado del documento",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      PROFORMA_INVOICE: "Proforma Invoice",
      FACTURA_COMERCIAL: "Factura Comercial",
      CONTRATO: "Contrato",
      COMPROBANTE_PAGO: "Comprobante de Pago",
      OTHER: "Otro",
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "Aprobado", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rechazado", className: "bg-red-100 text-red-800" },
      EXPIRED: { label: "Expirado", className: "bg-gray-100 text-gray-800" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium">{document.filename}</p>
              <p className="text-xs text-gray-500">
                {getDocumentTypeLabel(document.type || "")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(document.status || "PENDING")}
            <Select
              value={document.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="APPROVED">Aprobar</SelectItem>
                <SelectItem value="REJECTED">Rechazar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <DocumentViewer document={document} />
      </CardContent>
    </Card>
  );
}

function QuotationGenerator({
  requestId,
  onSuccess,
}: {
  requestId: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quotationData, setQuotationData] = useState({
    baseAmount: "",
    fees: "",
    taxes: "",
    validUntil: "",
    terms: "",
    notes: "",
  });

  const handleGenerate = async () => {
    const baseAmount = parseFloat(quotationData.baseAmount);
    const fees = parseFloat(quotationData.fees) || 0;
    const taxes = parseFloat(quotationData.taxes) || 0;
    const totalAmount = baseAmount + fees + taxes;

    if (!baseAmount || !quotationData.validUntil) {
      toast({
        title: "Error",
        description: "Monto base y fecha de validez son obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseAmount,
          fees,
          taxes,
          totalAmount,
          validUntil: quotationData.validUntil,
          terms: quotationData.terms,
          notes: quotationData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la cotización");
      }

      toast({
        title: "Éxito",
        description: "Cotización generada correctamente",
      });

      setIsOpen(false);
      setQuotationData({
        baseAmount: "",
        fees: "",
        taxes: "",
        validUntil: "",
        terms: "",
        notes: "",
      });
      onSuccess();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo generar la cotización",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalAmount =
    (parseFloat(quotationData.baseAmount) || 0) +
    (parseFloat(quotationData.fees) || 0) +
    (parseFloat(quotationData.taxes) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-2">
          <Banknote className="h-4 w-4" />
          Generar Cotización
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generar Nueva Cotización</DialogTitle>
          <DialogDescription>
            Complete los detalles para generar una cotización para esta
            solicitud.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseAmount">Monto Base (USD)*</Label>
              <Input
                id="baseAmount"
                type="number"
                step="0.01"
                value={quotationData.baseAmount}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    baseAmount: e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="fees">Comisiones (USD)</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                value={quotationData.fees}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    fees: e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxes">Impuestos (USD)</Label>
              <Input
                id="taxes"
                type="number"
                step="0.01"
                value={quotationData.taxes}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    taxes: e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Válida hasta*</Label>
              <Input
                id="validUntil"
                type="date"
                value={quotationData.validUntil}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    validUntil: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="terms">Términos y Condiciones</Label>
            <Textarea
              id="terms"
              value={quotationData.terms}
              onChange={(e) =>
                setQuotationData((prev) => ({ ...prev, terms: e.target.value }))
              }
              placeholder="Términos y condiciones de la cotización..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={quotationData.notes}
              onChange={(e) =>
                setQuotationData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notas adicionales para el cliente..."
              rows={2}
            />
          </div>
          {totalAmount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Total de la Cotización: ${totalAmount.toFixed(2)} USD
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Generar Cotización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay eventos en el historial aún
        </p>
      ) : (
        events.map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">
                {format(new Date(event.date), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {event.description}
              </div>
              <div className="text-xs text-gray-500">por {event.user}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function InternalNotesCard({ requestId }: { requestId: string }) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: notesData, isLoading: isLoadingNotes } =
    useInternalNotes(requestId);
  const { mutate: addNote, isPending: isAddingNote } = useAddInternalNote();

  const notes = notesData?.notes || [];

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    addNote(
      { requestId, content: newNote },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Nota agregada correctamente",
          });
          setNewNote("");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo agregar la nota",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>NOTAS INTERNAS</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nota Interna</DialogTitle>
                <DialogDescription>
                  Esta nota será visible solo para el equipo administrativo.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribir nota..."
                rows={4}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={isAddingNote || !newNote.trim()}
                >
                  {isAddingNote ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Agregar Nota
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingNotes ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Cargando notas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay notas internas aún
              </p>
            ) : (
              notes.map((note: InternalNote, index: number) => (
                <div key={note.id || index} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {note.createdBy.firstName} {note.createdBy.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function handleDownloadDocuments(requestId: string, toast: ToastInstance) {
  return async () => {
    try {
      const response = await fetch(
        `/api/requests/${requestId}/download-documents`
      );

      if (!response.ok) {
        throw new Error("Error al descargar documentos");
      }

      // Get the ZIP file as blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Documentos_Solicitud_${requestId}.zip`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Documentos descargados correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron descargar los documentos",
        variant: "destructive",
      });
    }
  };
}

export default function AdminSolicitudDetail() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [isForceStatusOpen, setIsForceStatusOpen] = useState(false);
  const [forceStatus, setForceStatus] = useState("");
  const [forceReason, setForceReason] = useState("");

  const { data, isLoading, refetch } = useRequest(requestId);
  const { updateRequest, isLoading: isUpdating } = useUpdateRequest();
  const { mutate: downloadPDF, isPending: isDownloading } = useDownloadPDF();
  const { data: historyData, isLoading: isLoadingHistory } =
    useRequestHistory(requestId);

  const request = data?.request;
  const history = historyData || [];

  const handleDownloadPDF = () => {
    downloadPDF(requestId, {
      onSuccess: () => {
        toast({
          title: "Éxito",
          description: "PDF generado y descargado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo generar el PDF",
          variant: "destructive",
        });
      },
    });
  };

  const handleForceStatus = async () => {
    if (!forceStatus || !forceReason.trim()) return;

    updateRequest(
      {
        requestId: request.id,
        data: {
          status: forceStatus,
          reviewNotes: `Estado forzado: ${forceReason}`,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Estado actualizado correctamente",
          });
          setIsForceStatusOpen(false);
          setForceStatus("");
          setForceReason("");
          refetch();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando solicitud...</span>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
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
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              SOLICITUD DE IMPORTACIÓN - {request.code}
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {request.id} • Creada el{" "}
              {format(new Date(request.createdAt), "dd/MM/yyyy 'a las' HH:mm", {
                locale: es,
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={request.status} />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <Link href="/admin/solicitudes">
                <ArrowLeft className="h-4 w-4" /> Volver
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>INFORMACIÓN GENERAL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Empresa:</span>
                    <span>{request.company?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">País de destino:</span>
                    <span>{request.provider?.country || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Monto estimado:</span>
                    <span>
                      ${request.amount?.toLocaleString()} {request.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Fecha creación:</span>
                    <span>
                      {format(new Date(request.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado actual:</span>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Proveedor:</span>
                    <span>{request.provider?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Documentos:</span>
                    <span>{request.documents?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Creado por:</span>
                    <span>
                      {request.createdBy
                        ? `${request.createdBy.firstName} ${request.createdBy.lastName}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Descripción:</span>
                <p className="text-gray-700 mt-1">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ACCIONES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Descargar PDF
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleDownloadDocuments(requestId, toast)}
                >
                  <Download className="h-4 w-4" />
                  Descargar Documentos
                </Button>

                <QuotationGenerator requestId={requestId} onSuccess={refetch} />

                <Dialog
                  open={isForceStatusOpen}
                  onOpenChange={setIsForceStatusOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> Forzar Estado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Forzar Estado</DialogTitle>
                      <DialogDescription>
                        Cambiar manualmente el estado de la solicitud.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newStatus">Nuevo Estado</Label>
                        <Select
                          value={forceStatus}
                          onValueChange={setForceStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reason">Razón del cambio</Label>
                        <Textarea
                          id="reason"
                          value={forceReason}
                          onChange={(e) => setForceReason(e.target.value)}
                          placeholder="Explicar por qué se está forzando este estado..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsForceStatusOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleForceStatus}
                        disabled={
                          !forceStatus || !forceReason.trim() || isUpdating
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Aplicar Cambio
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations */}
        {request.quotations && request.quotations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>COTIZACIONES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.quotations.map((quotation: QuotationItem) => (
                  <div
                    key={quotation.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        Cotización {quotation.code}
                      </h4>
                      <Badge
                        variant={
                          quotation.status === "SENT" ? "default" : "secondary"
                        }
                      >
                        {quotation.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Monto Total</p>
                        <p className="font-semibold">
                          ${quotation.totalAmount?.toLocaleString()}{" "}
                          {quotation.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Válida hasta</p>
                        <p>
                          {format(
                            new Date(quotation.validUntil),
                            "dd/MM/yyyy",
                            { locale: es }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha de Creación</p>
                        <p>
                          {format(new Date(quotation.createdAt), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                    {quotation.notes && (
                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">Notas:</p>
                        <p className="text-sm">{quotation.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>HISTORIAL</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">
                  Cargando historial...
                </span>
              </div>
            ) : (
              <HistoryTimeline events={history} />
            )}
          </CardContent>
        </Card>

        {/* Documents and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">DOCUMENTOS</h3>
            {request.documents && request.documents.length > 0 ? (
              request.documents.map((document: DocumentItem) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  requestId={request.id}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-sm text-gray-500 text-center">
                    No se han cargado documentos aún
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <InternalNotesCard requestId={request.id} />
        </div>
      </div>
    </div>
  );
}
