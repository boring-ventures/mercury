"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  DollarSign,
  FileText,
  Building,
  User,
  X,
  Maximize2,
  Upload,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

// Payment status badge
function PaymentStatusBadge({
  payment,
  contract,
}: {
  payment: any;
  contract: any;
}) {
  const getStatusConfig = (contractStatus: string) => {
    switch (contractStatus) {
      case "PAYMENT_PENDING":
        return {
          label: "Pendiente de Revisión",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "PAYMENT_REVIEWED":
        return {
          label: "Pago Aprobado",
          color: "bg-green-100 text-green-800",
        };
      case "PROVIDER_PAID":
        return {
          label: "Proveedor Pagado",
          color: "bg-blue-100 text-blue-800",
        };
      case "PAYMENT_COMPLETED":
        return {
          label: "Pago Completado",
          color: "bg-purple-100 text-purple-800",
        };
      default:
        return {
          label: contractStatus || "Desconocido",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(contract?.status);
  return <Badge className={config.color}>{config.label}</Badge>;
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
              <Image
                src={document.fileUrl}
                alt={document.filename}
                width={800}
                height={600}
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

// Payment review modal
function PaymentReviewModal({
  payment,
  onClose,
  onAction,
}: {
  payment: any;
  onClose: () => void;
  onAction: (action: string, reviewNotes?: string) => void;
}) {
  const [action, setAction] = useState<string>("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!action) return;

    setIsSubmitting(true);
    try {
      await onAction(action, reviewNotes);
      onClose();
    } catch (error) {
      console.error("Error updating payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Revisar Pago - {payment.code}
        </h3>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Contrato:</span>
              <span className="font-medium ml-2">{payment.contract?.code}</span>
            </div>
            <div>
              <span className="text-gray-600">Empresa:</span>
              <span className="font-medium ml-2">
                {payment.contract?.company?.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium ml-2">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Proveedor:</span>
              <span className="font-medium ml-2">
                {payment.contract?.quotation?.provider?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Quotation Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Información de Cotización
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Cotización:</span>
                <span className="font-medium ml-2">
                  {payment.contract?.quotation?.code}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Monto Cotización:</span>
                <span className="font-medium ml-2">
                  {payment.contract?.quotation?.amount &&
                    formatCurrency(
                      payment.contract.quotation.amount,
                      payment.contract.quotation.currency
                    )}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Producto:</span>
                <span className="font-medium ml-2">
                  {payment.contract?.quotation?.request?.productName}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Solicitud:</span>
                <span className="font-medium ml-2">
                  {payment.contract?.quotation?.request?.code}
                </span>
              </div>
            </div>
          </div>

          {/* Document Display */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">
              Documento Subido por el Importador
            </h4>
            {payment.documents?.map((doc: any) => (
              <div key={doc.id} className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Archivo:</span>
                    <span className="font-medium ml-2 text-blue-600">
                      {doc.filename}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Tamaño:</span>
                    <span className="font-medium ml-2">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Tipo:</span>
                    <span className="font-medium ml-2">{doc.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Subido:</span>
                    <span className="font-medium ml-2">
                      {new Date(doc.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-green-800 mb-2">
                    Vista Previa del Documento:
                  </h5>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    {doc.mimeType.startsWith("image/") ? (
                      <Image
                        src={doc.fileUrl}
                        alt={doc.filename}
                        width={400}
                        height={256}
                        className="w-full h-64 object-contain"
                      />
                    ) : doc.mimeType === "application/pdf" ? (
                      <iframe
                        src={doc.fileUrl}
                        className="w-full h-64"
                        title={doc.filename}
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>
                          Vista previa no disponible para este tipo de archivo
                        </p>
                        <p className="text-sm">{doc.filename}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Label>Acción</Label>
            <div className="space-y-2 mt-2">
              <Button
                variant={action === "APPROVE" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setAction("APPROVE")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar Pago
              </Button>
              <Button
                variant={action === "REJECT" ? "destructive" : "outline"}
                className="w-full justify-start"
                onClick={() => setAction("REJECT")}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Rechazar Pago
              </Button>
              {payment.contract?.status === "PAYMENT_REVIEWED" && (
                <Button
                  variant={
                    action === "MARK_PROVIDER_PAID" ? "default" : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => setAction("MARK_PROVIDER_PAID")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Marcar Proveedor Pagado
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="reviewNotes">Comentarios (opcional)</Label>
            <Textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Agregar comentarios sobre la revisión..."
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!action || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Provider proof upload modal
function ProviderProofUploadModal({
  payment,
  onClose,
  onUpload,
}: {
  payment: any;
  onClose: () => void;
  onUpload: (file: File, notes: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsSubmitting(true);
    try {
      await onUpload(file, notes);
      onClose();
    } catch (error) {
      console.error("Error uploading provider proof:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Subir Comprobante de Pago al Proveedor - {payment.code}
        </h3>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Contrato:</span>
              <span className="font-medium ml-2">{payment.contract?.code}</span>
            </div>
            <div>
              <span className="text-gray-600">Empresa:</span>
              <span className="font-medium ml-2">
                {payment.contract?.company?.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium ml-2">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Proveedor:</span>
              <span className="font-medium ml-2">
                {payment.contract?.quotation?.provider?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="providerProofFile">
              Comprobante de Pago al Proveedor
            </Label>
            <div className="mt-2">
              <input
                type="file"
                id="providerProofFile"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatos permitidos: PDF, JPG, JPEG, PNG, GIF. Máximo 5MB.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="providerProofNotes">Notas (opcional)</Label>
            <Textarea
              id="providerProofNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre el pago al proveedor..."
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Subiendo..." : "Subir Comprobante"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProviderProofModal, setShowProviderProofModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const { toast } = useToast();

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pagos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load payments on component mount
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handlePaymentAction = async (action: string, reviewNotes?: string) => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(
        `/api/admin/payments/${selectedPayment.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            reviewNotes,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Éxito",
          description: result.message,
        });
        loadPayments(); // Refresh the list
      } else {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el pago");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el pago",
        variant: "destructive",
      });
    }
  };

  const handleProviderProofUpload = async (file: File, notes: string) => {
    if (!selectedPayment) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", notes);

      const response = await fetch(
        `/api/admin/payments/${selectedPayment.id}/upload-provider-proof`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Éxito",
          description: result.message,
        });
        loadPayments(); // Refresh the list
      } else {
        const error = await response.json();
        throw new Error(error.error || "Error al subir el comprobante");
      }
    } catch (error) {
      console.error("Error uploading provider proof:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al subir el comprobante",
        variant: "destructive",
      });
    }
  };

  const openReviewModal = (payment: any) => {
    setSelectedPayment(payment);
    setShowReviewModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Pagos
        </h1>
        <p className="text-gray-600">
          Revisa y gestiona los comprobantes de pago subidos por los
          importadores
        </p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay pagos pendientes
            </h3>
            <p className="text-gray-500 text-center">
              No hay comprobantes de pago que requieran revisión en este
              momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {payments.map((payment) => (
            <Card key={payment.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Pago {payment.code}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <PaymentStatusBadge
                        payment={payment}
                        contract={payment.contract}
                      />
                      <span className="text-sm text-gray-600">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewModal(payment)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Revisar
                    </Button>
                    {payment.contract?.status === "PROVIDER_PAID" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowProviderProofModal(true);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Comprobante
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Payment Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Detalles del Pago
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Código:</span>
                        <span className="font-medium">{payment.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto:</span>
                        <span className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{payment.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vencimiento:</span>
                        <span className="font-medium">
                          {new Date(payment.dueDate).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descripción:</span>
                        <span className="font-medium">
                          {payment.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contract & Company Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Contrato y Empresa
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contrato:</span>
                        <span className="font-medium">
                          {payment.contract?.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Empresa:</span>
                        <span className="font-medium">
                          {payment.contract?.company?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Importador:</span>
                        <span className="font-medium">
                          {payment.contract?.createdBy?.firstName}{" "}
                          {payment.contract?.createdBy?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-blue-600">
                          {payment.contract?.createdBy?.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado Contrato:</span>
                        <Badge className="text-xs">
                          {payment.contract?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quotation & Provider Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Cotización y Proveedor
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cotización:</span>
                        <span className="font-medium">
                          {payment.contract?.quotation?.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proveedor:</span>
                        <span className="font-medium">
                          {payment.contract?.quotation?.provider?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto Cotización:</span>
                        <span className="font-medium">
                          {payment.contract?.quotation?.amount &&
                            formatCurrency(
                              payment.contract.quotation.amount,
                              payment.contract.quotation.currency
                            )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Solicitud:</span>
                        <span className="font-medium">
                          {payment.contract?.quotation?.request?.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Producto:</span>
                        <span className="font-medium">
                          {payment.contract?.quotation?.request?.productName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Info */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Documento Subido
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {payment.documents?.map((doc: any) => (
                      <div key={doc.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Archivo:</span>
                            <span className="font-medium text-blue-600">
                              {doc.filename}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tamaño:</span>
                            <span className="font-medium">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium">{doc.mimeType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subido:</span>
                            <span className="font-medium">
                              {new Date(doc.createdAt).toLocaleDateString(
                                "es-ES"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentPreview(true);
                            }}
                            className="flex-1"
                          >
                            <Maximize2 className="h-4 w-4 mr-2" />
                            Vista Previa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = doc.fileUrl;
                              link.download = doc.filename;
                              link.target = "_blank";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast({
                                title: "Descarga iniciada",
                                description:
                                  "El documento se está descargando...",
                              });
                            }}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewModal(payment)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedPayment && (
        <PaymentReviewModal
          payment={selectedPayment}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedPayment(null);
          }}
          onAction={handlePaymentAction}
        />
      )}

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

      {/* Provider Proof Upload Modal */}
      {showProviderProofModal && selectedPayment && (
        <ProviderProofUploadModal
          payment={selectedPayment}
          onClose={() => {
            setShowProviderProofModal(false);
            setSelectedPayment(null);
          }}
          onUpload={handleProviderProofUpload}
        />
      )}
    </div>
  );
}
