"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  X,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

// Quotation status badge
function QuotationStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return { label: "Borrador", color: "bg-gray-100 text-gray-800" };
      case "SENT":
        return { label: "Enviada", color: "bg-blue-100 text-blue-800" };
      case "ACCEPTED":
        return { label: "Aceptada", color: "bg-green-100 text-green-800" };
      case "REJECTED":
        return { label: "Rechazada", color: "bg-red-100 text-red-800" };
      case "EXPIRED":
        return { label: "Expirada", color: "bg-orange-100 text-orange-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const config = getStatusConfig(status);
  return <Badge className={config.color}>{config.label}</Badge>;
}

// Quotation action modal
function QuotationActionModal({
  quotation,
  onClose,
  onAction,
}: {
  quotation: any;
  onClose: () => void;
  onAction: (action: string, notes?: string) => void;
}) {
  const [action, setAction] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!action) return;

    setIsSubmitting(true);
    try {
      await onAction(action, notes);
      onClose();
    } catch (error) {
      console.error("Error updating quotation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpired = new Date() > new Date(quotation.validUntil);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Responder a Cotización - {quotation.code}
        </h3>

        {/* Quotation Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Cotización:</span>
              <span className="font-medium ml-2">{quotation.code}</span>
            </div>
            <div>
              <span className="text-gray-600">Proveedor:</span>
              <span className="font-medium ml-2">
                {quotation.createdBy?.firstName} {quotation.createdBy?.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium ml-2">
                {formatCurrency(quotation.amount, quotation.currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Válida hasta:</span>
              <span className="font-medium ml-2">
                {new Date(quotation.validUntil).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Esta cotización ha expirado y no puede ser respondida.
              </span>
            </div>
          </div>
        )}

        {!isExpired && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acción
              </label>
              <div className="space-y-2">
                <Button
                  variant={action === "ACCEPTED" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setAction("ACCEPTED")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceptar Cotización
                </Button>
                <Button
                  variant={action === "REJECTED" ? "destructive" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setAction("REJECTED")}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar Cotización
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar comentarios sobre la cotización..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex gap-2 mt-6">
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
          </>
        )}

        {isExpired && (
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImporterQuotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const { toast } = useToast();

  const loadQuotations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/importador/quotations");
      if (response.ok) {
        const data = await response.json();
        setQuotations(data.quotations || []);
      } else {
        throw new Error("Failed to load quotations");
      }
    } catch (error) {
      console.error("Error loading quotations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cotizaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load quotations on component mount
  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const handleQuotationAction = async (action: string, notes?: string) => {
    if (!selectedQuotation) return;

    try {
      const response = await fetch(`/api/quotations/${selectedQuotation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          notes,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Éxito",
          description: result.message || "Cotización actualizada exitosamente",
        });
        loadQuotations(); // Refresh the list
      } else {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar la cotización");
      }
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar la cotización",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mis Cotizaciones
        </h1>
        <p className="text-gray-600">
          Revisa y gestiona las cotizaciones recibidas para tus solicitudes
        </p>
      </div>

      {quotations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes cotizaciones aún
            </h3>
            <p className="text-gray-500 text-center">
              Las cotizaciones aparecerán aquí una vez que los proveedores
              respondan a tus solicitudes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {quotations.map((quotation) => {
            const isExpired = new Date() > new Date(quotation.validUntil);
            const canRespond = quotation.status === "SENT" && !isExpired;

            return (
              <Card key={quotation.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Cotización {quotation.code}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <QuotationStatusBadge status={quotation.status} />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(quotation.amount, quotation.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canRespond && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowActionModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Download quotation logic here
                          toast({
                            title: "Descarga iniciada",
                            description: "La cotización se está descargando...",
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quotation Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Detalles de la Cotización
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Código:</span>
                          <span className="font-medium">{quotation.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-medium">
                            {formatCurrency(
                              quotation.amount,
                              quotation.currency
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <QuotationStatusBadge status={quotation.status} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Válida hasta:</span>
                          <span className="font-medium">
                            {new Date(quotation.validUntil).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Descripción:</span>
                          <span className="font-medium">
                            {quotation.description || "Sin descripción"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Información del Proveedor
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Proveedor:</span>
                          <span className="font-medium">
                            {quotation.createdBy?.firstName}{" "}
                            {quotation.createdBy?.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-blue-600">
                            {quotation.createdBy?.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Empresa:</span>
                          <span className="font-medium">
                            {quotation.createdBy?.company?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha de envío:</span>
                          <span className="font-medium">
                            {new Date(quotation.createdAt).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Solicitud Relacionada
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Solicitud:</span>
                          <span className="font-medium">
                            {quotation.request?.code}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-medium">
                            {formatCurrency(
                              quotation.request?.amount || 0,
                              quotation.request?.currency || "USDT"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <span className="font-medium">
                            {quotation.request?.status || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Descripción:</span>
                          <span className="font-medium">
                            {quotation.request?.description ||
                              "Sin descripción"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Fecha solicitud:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              quotation.request?.createdAt
                            ).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex gap-2">
                      {canRespond && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowActionModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Responder a Cotización
                        </Button>
                      )}
                      {quotation.status === "ACCEPTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Navigate to contract creation
                            window.location.href = `/importador/contratos/nuevo?quotationId=${quotation.id}`;
                          }}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Crear Contrato
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedQuotation && (
        <QuotationActionModal
          quotation={selectedQuotation}
          onClose={() => {
            setShowActionModal(false);
            setSelectedQuotation(null);
          }}
          onAction={handleQuotationAction}
        />
      )}
    </div>
  );
}
