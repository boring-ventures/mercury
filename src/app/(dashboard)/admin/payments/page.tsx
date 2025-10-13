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
  AlertCircle,
  Eye,
  Download,
  DollarSign,
  FileText,
  X,
  Maximize2,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Payment status badge
function PaymentStatusBadge({ contract }: { contract: any }) {
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

        <div className="space-y-4">
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

// Payment detail view component
function PaymentDetailView({
  payment,
  onBack,
  onAction,
  onProviderProofUpload,
}: {
  payment: any;
  onBack: () => void;
  onAction: (action: string, reviewNotes?: string) => void;
  onProviderProofUpload: (file: File, notes: string) => void;
}) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProviderProofModal, setShowProviderProofModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Pago {payment.code}</h2>
            <div className="flex items-center gap-2 mt-1">
              <PaymentStatusBadge contract={payment.contract} />
              <span className="text-sm text-gray-600">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {payment.contract?.status === "PAYMENT_PENDING" && (
              <Button
                variant="default"
                onClick={() => setShowReviewModal(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Revisar Pago
              </Button>
            )}
            {payment.contract?.status === "PAYMENT_REVIEWED" && (
              <Button
                variant="default"
                onClick={() => setShowReviewModal(true)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Marcar Proveedor Pagado
              </Button>
            )}
            {payment.contract?.status === "PROVIDER_PAID" && (
              <Button
                variant="default"
                onClick={() => setShowProviderProofModal(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Comprobante
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalles del Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
                  {format(new Date(payment.dueDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">Descripción:</span>
                <span className="font-medium">{payment.description}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contrato y Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contrato:</span>
                <span className="font-medium">{payment.contract?.code}</span>
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
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">Email:</span>
                <span className="font-medium text-blue-600 text-xs">
                  {payment.contract?.createdBy?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado Contrato:</span>
                <Badge className="text-xs">{payment.contract?.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Cotización y Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cotización:</span>
                <span className="font-medium">
                  {payment.contract?.quotation?.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Proveedor:</span>
                <span className="font-medium">
                  {payment.contract?.quotation?.request?.provider?.name}
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
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">Producto:</span>
                <span className="font-medium">
                  {payment.contract?.quotation?.request?.productName}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documentos Subidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payment.documents?.map((doc: any) => (
                <div key={doc.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Archivo:</span>
                      <span className="font-medium text-blue-600 text-xs">
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
                        {format(new Date(doc.createdAt), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                          description: "El documento se está descargando...",
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
          </CardContent>
        </Card>
      </div>

      {showReviewModal && (
        <PaymentReviewModal
          payment={payment}
          onClose={() => setShowReviewModal(false)}
          onAction={onAction}
        />
      )}

      {showDocumentPreview && selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => {
            setShowDocumentPreview(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {showProviderProofModal && (
        <ProviderProofUploadModal
          payment={payment}
          onClose={() => setShowProviderProofModal(false)}
          onUpload={onProviderProofUpload}
        />
      )}
    </>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
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
        await loadPayments();
        setSelectedPayment(null);
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
        await loadPayments();
        setSelectedPayment(null);
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

  const handleRowClick = (payment: any) => {
    setSelectedPayment(payment);
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

  if (selectedPayment) {
    return (
      <PaymentDetailView
        payment={selectedPayment}
        onBack={() => setSelectedPayment(null)}
        onAction={handlePaymentAction}
        onProviderProofUpload={handleProviderProofUpload}
      />
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
        <Card>
          <CardHeader>
            <CardTitle>Listado de Pagos</CardTitle>
            <p className="text-sm text-gray-600">
              Mostrando {payments.length} pago(s)
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">CÓDIGO</th>
                    <th className="text-left py-3 px-4">EMPRESA</th>
                    <th className="text-left py-3 px-4">CONTRATO</th>
                    <th className="text-left py-3 px-4">PROVEEDOR</th>
                    <th className="text-left py-3 px-4">MONTO</th>
                    <th className="text-left py-3 px-4">VENCIMIENTO</th>
                    <th className="text-left py-3 px-4">ESTADO</th>
                    <th className="text-left py-3 px-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(payment)}
                    >
                      <td className="py-3 px-4 font-medium">{payment.code}</td>
                      <td className="py-3 px-4">
                        {payment.contract?.company?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {payment.contract?.code || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {payment.contract?.quotation?.request?.provider?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(payment.dueDate), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <PaymentStatusBadge contract={payment.contract} />
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(payment);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
