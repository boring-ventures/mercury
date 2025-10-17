"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt,
  CheckCircle,
  Loader2,
  Upload,
  X,
  FileText,
  Info,
  PartyPopper,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FinalInvoiceStepViewProps {
  request: any;
  onUpdate: () => void;
}

export default function FinalInvoiceStepView({
  request,
  onUpdate,
}: FinalInvoiceStepViewProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Get existing contracts
  const contracts = request.contracts || [];

  // Check if final invoice is completed (contract reached PAYMENT_COMPLETED status)
  const hasFinalInvoice = contracts.some(
    (c: any) => c.status === "PAYMENT_COMPLETED"
  );

  // Debug: log contract statuses
  console.log("Final Invoice Debug:", {
    contracts: contracts.map((c: any) => ({
      id: c.id,
      code: c.code,
      status: c.status,
      documentsCount: c.documents?.length || 0,
      documents: c.documents?.map((d: any) => ({ type: d.type, filename: d.filename }))
    })),
    hasFinalInvoice
  });

  // Get the active contract for this step (PROVIDER_PAID means ready to upload final invoice)
  const activeContract = contracts.find(
    (c: any) =>
      c.status === "PROVIDER_PAID" || c.status === "PAYMENT_COMPLETED"
  );

  // Check if provider payment step is completed
  const hasProviderPayment = contracts.some(
    (c: any) =>
      c.status === "PROVIDER_PAID" || c.status === "PAYMENT_COMPLETED"
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadInvoice = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Por favor seleccione al menos un documento de factura",
        variant: "destructive",
      });
      return;
    }

    if (!activeContract) {
      toast({
        title: "Error",
        description:
          "Se necesita un contrato con pago al proveedor registrado",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // First, create final invoice payment record
      const paymentResponse = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: activeContract.id,
          type: "FINAL",
          status: "COMPLETED",
          notes: notes || "Factura final - Flujo de adaptación",
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("Payment creation error:", errorData);
        throw new Error(errorData.error || errorData.details || "Error al crear el registro de factura");
      }

      const paymentData = await paymentResponse.json();
      const paymentId = paymentData.payment.id;

      // Upload each file as a document
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("contractId", activeContract.id);
        formData.append("paymentId", paymentId);
        formData.append("type", "FACTURA_COMERCIAL");
        formData.append("notes", notes || "");

        const uploadResponse = await fetch("/api/admin/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.warn(`Error al subir ${file.name}:`, errorData);
          // Continue with other files even if one fails
        }
      }

      // Note: Request status is automatically managed by the system
      // based on payment records, so we don't need to update it manually

      toast({
        title: "Flujo Completado",
        description:
          "La factura final se ha registrado y el flujo de adaptación está completo",
      });

      setSelectedFiles([]);
      setNotes("");

      // Wait a bit for database to update before refreshing
      setTimeout(() => {
        onUpdate();
      }, 500);
    } catch (error: any) {
      console.error("Error uploading invoice:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la factura",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (hasFinalInvoice) {
    // Get the contract with PAYMENT_COMPLETED status
    const completedContract = contracts.find(
      (c: any) => c.status === "PAYMENT_COMPLETED"
    );

    // Get documents of type FACTURA_COMERCIAL from the contract
    const invoiceDocuments = completedContract?.documents?.filter(
      (d: any) => d.type === "FACTURA_COMERCIAL"
    ) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-green-600" />
              Flujo de Adaptación Completado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg text-green-900">
                    Flujo Completado Exitosamente
                  </p>
                  <p className="text-sm text-green-700">
                    Todos los pasos se han completado correctamente
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Solicitud creada</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Cotización aceptada</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Contrato completado</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Pago al proveedor registrado</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Factura final emitida</span>
                </div>
              </div>

              {completedContract && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="text-sm text-green-700 space-y-1">
                    <p>
                      <span className="font-medium">Contrato:</span> {completedContract.code}
                    </p>
                    {completedContract.updatedAt && (
                      <p>
                        Completado el:{" "}
                        {format(
                          new Date(completedContract.updatedAt),
                          "dd/MM/yyyy HH:mm",
                          { locale: es }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            {invoiceDocuments.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos de Factura Final ({invoiceDocuments.length})
                </h3>
                <div className="space-y-2">
                  {invoiceDocuments.map((doc: any) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <span className="text-sm font-medium">{doc.filename}</span>
                          {doc.createdAt && (
                            <p className="text-xs text-gray-500">
                              Subido el {format(new Date(doc.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Próximos Pasos
                  </p>
                  <p className="text-sm text-blue-700">
                    El importador podrá ver toda la información en su dashboard.
                    El flujo de adaptación se ha completado exitosamente y
                    puedes continuar con otros flujos según sea necesario.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasProviderPayment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Factura Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pago al Proveedor Requerido
              </h3>
              <p className="text-gray-600">
                Se necesita registrar el pago al proveedor antes de emitir la
                factura final
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Registrar Factura Final
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Último Paso del Flujo
                </p>
                <p className="text-sm text-blue-700">
                  Sube la factura final del servicio. Al completar este paso, el
                  flujo de adaptación se marcará como completado y la solicitud
                  pasará a estado COMPLETED.
                </p>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          {activeContract && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Contrato Asociado</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600">Código:</span>{" "}
                  <span className="font-medium">{activeContract.code}</span>
                </p>
                <p>
                  <span className="text-gray-600">Estado:</span>{" "}
                  <span className="font-medium">{activeContract.status}</span>
                </p>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <Label>Factura Final *</Label>
              <p className="text-sm text-gray-500 mb-2">
                Sube la factura final del servicio de importación
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar Archivos
              </Button>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Archivos Seleccionados ({selectedFiles.length})</Label>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas Adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Información adicional sobre la factura"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleUploadInvoice}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo factura...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completar Flujo de Adaptación
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
