"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  XCircle,
  Building2,
  DollarSign,
  FileCheck,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  filename: string;
  fileUrl: string;
  type: string;
  status: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
}

interface Payment {
  id: string;
  code: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  reviewNotes?: string;
  paidAt?: string;
  createdAt: string;
  documents: Document[];
}

interface Contract {
  id: string;
  code: string;
  title: string;
  status: string;
  amount: number;
  currency: string;
  documents: Document[];
}

interface Request {
  id: string;
  code: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  company: {
    id: string;
    name: string;
    nit: string;
  };
  contracts: Contract[];
  payments: Payment[];
}

function getDocumentTypeLabel(type: string) {
  const types: { [key: string]: string } = {
    COMPROBANTE_PAGO: "Comprobante de Pago",
    COMPROBANTE_PAGO_PROVEEDOR: "Comprobante de Pago al Proveedor",
    FACTURA_COMERCIAL: "Factura Comercial",
    CONTRACT: "Contrato",
    OTHER: "Otro",
  };
  return types[type] || type;
}

function DocumentViewer({
  document,
  isOpen,
  onClose,
}: {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [imageError, setImageError] = useState(false);

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
                {getDocumentTypeLabel(document.type)}
                {document.fileSize &&
                  ` • ${(document.fileSize / 1024 / 1024).toFixed(2)} MB`}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </Button>
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
                  </div>
                </div>
              ) : (
                <Image
                  src={document.fileUrl}
                  alt={document.filename}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          ) : isPDF ? (
            <div className="w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden">
              <iframe
                src={`${document.fileUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title={document.filename}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Vista previa no disponible
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="mt-3"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar archivo
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PagoProveedorPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [requestData, setRequestData] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/requests/${requestId}`);

      if (!response.ok) {
        throw new Error("Error al cargar la solicitud");
      }

      const data = await response.json();
      setRequestData(data.request);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no permitido",
          description: "Solo se permiten archivos PDF e imágenes",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Archivo demasiado grande",
          description: "El tamaño máximo permitido es 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !contract) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("contractId", contract.id);
      if (notes) {
        formData.append("notes", notes);
      }

      const response = await fetch("/api/importador/contracts/upload-payment-proof", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir el comprobante");
      }

      toast({
        title: "Comprobante subido exitosamente",
        description: "El administrador revisará el comprobante de pago",
      });

      setSelectedFile(null);
      setNotes("");
      await fetchRequest();
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo subir el comprobante de pago",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg font-medium">No se encontró la solicitud</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  const contract = requestData.contracts?.[0];
  const payment = requestData.payments?.[0];
  const paymentProofDoc = payment?.documents?.find(
    (doc) => doc.type === "COMPROBANTE_PAGO"
  );

  const canUploadProof = contract?.status === "COMPLETED" && !payment;
  const isPending = payment?.status === "PENDING" || contract?.status === "PAYMENT_PENDING";
  const isReviewed = payment?.status === "REVIEWED" || contract?.status === "PAYMENT_REVIEWED";
  const isCompleted =
    payment?.status === "COMPLETED" ||
    contract?.status === "PROVIDER_PAID" ||
    contract?.status === "PAYMENT_COMPLETED";

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/importador/solicitudes/${requestId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la solicitud
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pago al Proveedor
            </h1>
            <p className="text-gray-500 mt-1">
              Solicitud: {requestData.code}
            </p>
          </div>
          {payment && (
            <Badge
              className={
                isCompleted
                  ? "bg-green-500"
                  : isReviewed
                    ? "bg-blue-500"
                    : isPending
                      ? "bg-yellow-500"
                      : "bg-gray-500"
              }
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completado
                </>
              ) : isReviewed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Revisado
                </>
              ) : isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-1" />
                  Pendiente de Revisión
                </>
              ) : (
                "Desconocido"
              )}
            </Badge>
          )}
        </div>
      </div>

      {/* Request Info Card */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Empresa</p>
              <p className="text-base font-semibold text-gray-900">
                {requestData.company.name}
              </p>
              <p className="text-sm text-gray-600">
                NIT: {requestData.company.nit}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Monto a Pagar
              </p>
              <p className="text-base font-semibold text-gray-900">
                {contract?.currency || requestData.currency}{" "}
                {(contract?.amount || requestData.amount).toLocaleString()}
              </p>
            </div>
          </div>

          {contract && (
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Contrato</p>
                <p className="text-base font-semibold text-gray-900">
                  {contract.code}
                </p>
                <p className="text-sm text-gray-600">{contract.title}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Upload Section - Show when contract is completed but no payment exists */}
      {canUploadProof && (
        <Card className="p-6 mb-6 border-l-4 border-l-blue-500 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subir Comprobante de Pago al Proveedor
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            El contrato ha sido completado. Por favor, suba el comprobante de
            pago que realizó al proveedor.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo del Comprobante
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar archivo
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formatos permitidos: PDF, JPG, PNG, GIF (máx. 5MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregue cualquier información adicional sobre el pago..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Comprobante
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Payment Status - Pending Review */}
      {isPending && paymentProofDoc && (
        <Card className="p-6 mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comprobante en Revisión
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                El comprobante de pago ha sido enviado y está siendo revisado
                por el administrador.
              </p>

              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {paymentProofDoc.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getDocumentTypeLabel(paymentProofDoc.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocument(paymentProofDoc)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(paymentProofDoc.fileUrl, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Status - Reviewed/Approved */}
      {isReviewed && (
        <Card className="p-6 mb-6 border-l-4 border-l-green-500 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comprobante Aprobado
              </h3>
              <p className="text-sm text-gray-600">
                El comprobante de pago ha sido revisado y aprobado por el
                administrador. El pago al proveedor está siendo procesado.
              </p>
              {payment?.reviewNotes && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-gray-700">
                    Notas del administrador:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.reviewNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Payment Status - Completed */}
      {isCompleted && (
        <Card className="p-6 border-l-4 border-l-green-500 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pago Completado
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                El pago al proveedor ha sido completado exitosamente.
              </p>
              <Button
                onClick={() =>
                  router.push(`/importador/solicitudes/${requestId}/factura-final`)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Ver Factura Final
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}
