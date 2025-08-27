"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Maximize2,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useImporterContracts } from "@/hooks/use-importer-contracts";
import { PaymentProofUpload } from "@/components/importador/payment-proof-upload";
import { formatCurrency } from "@/lib/utils";

// Payment status component with clear messaging
function PaymentStatusDisplay({ contract }: { contract: any }) {
  const paymentInfo = contract.additionalData?.payment;

  if (!paymentInfo) {
    return null;
  }

  const getStatusConfig = (contractStatus: string) => {
    switch (contractStatus) {
      case "PAYMENT_PENDING":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          message:
            "Tu comprobante de pago está siendo revisado por el administrador. Te notificaremos cuando sea aprobado o rechazado.",
          nextStep: "Esperando revisión administrativa",
        };
      case "PAYMENT_REVIEWED":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-800 border-green-200",
          message:
            "¡Excelente! Tu pago ha sido aprobado. El administrador procederá a pagar al proveedor.",
          nextStep: "El administrador pagará al proveedor",
        };
      case "PROVIDER_PAID":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          message:
            "¡Excelente! El administrador ha completado el pago al proveedor. Pronto subirá el comprobante de pago al proveedor para tu revisión.",
          nextStep: "Esperando comprobante de pago al proveedor",
        };
      case "PAYMENT_COMPLETED":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-purple-100 text-purple-800 border-purple-200",
          message:
            "¡Proceso completado! El pago al proveedor ha sido finalizado y el comprobante está disponible.",
          nextStep: "Proceso de pago completado",
        };
      default:
        return {
          icon: <FileText className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          message: "Estado de pago desconocido.",
          nextStep: "Contacta al administrador",
        };
    }
  };

  const statusConfig = getStatusConfig(contract.status);

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-900">
          {statusConfig.icon}
          Estado del Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={statusConfig.color}>
            {contract.status === "PAYMENT_PENDING" && "En Revisión"}
            {contract.status === "PAYMENT_REVIEWED" && "Aprobado"}
            {contract.status === "PROVIDER_PAID" && "Proveedor Pagado"}
            {contract.status === "PAYMENT_COMPLETED" && "Completado"}
          </Badge>
          <span className="text-xs text-gray-600">
            Subido el{" "}
            {new Date(paymentInfo.uploadedAt).toLocaleDateString("es-ES")}
          </span>
        </div>

        <p className="text-sm text-blue-800">{statusConfig.message}</p>

        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Próximo paso:
          </p>
          <p className="text-sm text-gray-900">{statusConfig.nextStep}</p>
        </div>

        {paymentInfo.reviewNotes && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs font-medium text-gray-700 mb-1">
              Comentarios del administrador:
            </p>
            <p className="text-sm text-gray-900">{paymentInfo.reviewNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Provider payment proof display component
function ProviderPaymentProofDisplay({
  contract,
  onPreviewDocument,
  onDownloadDocument,
}: {
  contract: any;
  onPreviewDocument: (document: any) => void;
  onDownloadDocument: (document: any) => void;
}) {
  // Find the provider payment proof document
  const providerProofDoc = contract.documents?.find(
    (doc: any) => doc.type === "COMPROBANTE_PAGO_PROVEEDOR"
  );

  if (!providerProofDoc) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-green-500 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-900">
          <CheckCircle className="h-4 w-4" />
          Comprobante de Pago al Proveedor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white p-3 rounded-lg border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Archivo:</span>
              <span className="font-medium ml-2 text-blue-600">
                {providerProofDoc.filename}
              </span>
            </div>
            <div>
              <span className="text-green-700">Tamaño:</span>
              <span className="font-medium ml-2">
                {(providerProofDoc.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div>
              <span className="text-green-700">Tipo:</span>
              <span className="font-medium ml-2">
                {providerProofDoc.mimeType}
              </span>
            </div>
            <div>
              <span className="text-green-700">Subido:</span>
              <span className="font-medium ml-2">
                {new Date(providerProofDoc.createdAt).toLocaleDateString(
                  "es-ES"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreviewDocument(providerProofDoc)}
            className="flex-1"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadDocument(providerProofDoc)}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        {providerProofDoc.documentInfo && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs font-medium text-gray-700 mb-1">
              Información del documento:
            </p>
            <p className="text-sm text-gray-900">
              {providerProofDoc.documentInfo}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Document preview modal
function DocumentPreviewModal({
  document,
  onClose,
}: {
  document: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            Vista Previa: {document.filename}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {document.mimeType.startsWith("image/") ? (
            <div className="text-center">
              <img
                src={document.fileUrl}
                alt={document.filename}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          ) : document.mimeType === "application/pdf" ? (
            <div className="w-full h-[70vh]">
              <iframe
                src={document.fileUrl}
                className="w-full h-full border rounded"
                title={document.filename}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Vista previa no disponible
              </h4>
              <p className="text-gray-500 mb-4">
                Este tipo de archivo no puede ser previsualizado.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Archivo:</strong> {document.filename}
                </p>
                <p>
                  <strong>Tipo:</strong> {document.mimeType}
                </p>
                <p>
                  <strong>Tamaño:</strong>{" "}
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = document.fileUrl;
                  link.download = document.filename;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Archivo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Contract status badge
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return { label: "Borrador", color: "bg-gray-100 text-gray-800" };
      case "COMPLETED":
        return { label: "Completado", color: "bg-green-100 text-green-800" };
      case "PAYMENT_PENDING":
        return {
          label: "Pago Pendiente",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "PAYMENT_REVIEWED":
        return { label: "Pago Revisado", color: "bg-blue-100 text-blue-800" };
      case "PROVIDER_PAID":
        return {
          label: "Proveedor Pagado",
          color: "bg-purple-100 text-purple-800",
        };
      case "PAYMENT_COMPLETED":
        return {
          label: "Pago Completado",
          color: "bg-green-100 text-green-800",
        };
      case "CANCELLED":
        return { label: "Cancelado", color: "bg-red-100 text-red-800" };
      case "EXPIRED":
        return { label: "Expirado", color: "bg-orange-100 text-orange-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const config = getStatusConfig(status);
  return <Badge className={config.color}>{config.label}</Badge>;
}

export default function ImporterContracts() {
  const { contracts, isLoading, error, refetch } = useImporterContracts();
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const handlePreviewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentPreview(true);
  };

  const handleDownloadDocument = (document: any) => {
    const link = document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Descarga iniciada",
      description: "El documento se está descargando...",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contratos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error al cargar los contratos</p>
          <Button onClick={() => refetch()} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No tienes contratos aún</p>
          <p className="text-sm text-gray-500">
            Los contratos aparecerán aquí una vez que sean creados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Contratos</h1>
        <p className="text-gray-600">
          Gestiona tus contratos y sube los comprobantes de pago
        </p>
      </div>

      <div className="grid gap-6">
        {contracts.map((contract) => {
          const hasPaymentProof = contract.additionalData?.payment;
          const canUploadProof =
            contract.status === "COMPLETED" && !hasPaymentProof;

          return (
            <Card key={contract.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Contrato {contract.code}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={contract.status} />
                      <span className="text-sm text-gray-600">
                        {formatCurrency(contract.amount, contract.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Download contract logic here
                        toast({
                          title: "Descarga iniciada",
                          description: "El contrato se está descargando...",
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid gap-4">
                  {/* Contract Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Detalles del Contrato
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Título:</span>
                          <span className="font-medium">{contract.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Fecha de inicio:
                          </span>
                          <span className="font-medium">
                            {new Date(contract.startDate).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha de fin:</span>
                          <span className="font-medium">
                            {new Date(contract.endDate).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <StatusBadge status={contract.status} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Información de Pago
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-medium">
                            {formatCurrency(contract.amount, contract.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Moneda:</span>
                          <span className="font-medium">
                            {contract.currency}
                          </span>
                        </div>
                        {hasPaymentProof && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Documento:</span>
                            <span className="font-medium text-blue-600">
                              {contract.additionalData.payment.filename}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Display */}
                  {hasPaymentProof && (
                    <PaymentStatusDisplay contract={contract} />
                  )}

                  {/* Provider Payment Proof Display */}
                  {contract.status === "PAYMENT_COMPLETED" && (
                    <ProviderPaymentProofDisplay
                      contract={contract}
                      onPreviewDocument={handlePreviewDocument}
                      onDownloadDocument={handleDownloadDocument}
                    />
                  )}

                  {/* Payment Proof Upload */}
                  {canUploadProof && (
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-medium text-blue-900 mb-2">
                          Subir Comprobante de Pago
                        </h4>
                        <p className="text-sm text-blue-700 mb-4">
                          Sube tu comprobante de pago para continuar con el
                          proceso del contrato
                        </p>
                        <PaymentProofUpload
                          contractId={contract.id}
                          onSuccess={() => {
                            toast({
                              title: "Comprobante subido",
                              description:
                                "Tu comprobante de pago ha sido subido exitosamente. El administrador lo revisará.",
                            });
                            refetch();
                          }}
                          onError={(error: string) => {
                            toast({
                              title: "Error al subir",
                              description:
                                error || "Hubo un error al subir el archivo",
                              variant: "destructive",
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Already has payment proof message */}
                  {hasPaymentProof && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">
                          Ya has subido un comprobante de pago para este
                          contrato. No puedes subir documentos adicionales.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {showDocumentPreview && selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => {
            setShowDocumentPreview(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}
