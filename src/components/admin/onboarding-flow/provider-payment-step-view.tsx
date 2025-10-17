"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Banknote,
  CheckCircle,
  Loader2,
  ArrowRight,
  Upload,
  X,
  FileText,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProviderPaymentStepViewProps {
  request: any;
  onUpdate: () => void;
  onNext: () => void;
}

export default function ProviderPaymentStepView({
  request,
  onUpdate,
  onNext,
}: ProviderPaymentStepViewProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Get existing contracts
  const contracts = request.contracts || [];

  // Debug logs
  console.log("Provider Payment Debug:", {
    contracts: contracts.map((c: any) => ({
      id: c.id,
      code: c.code,
      status: c.status,
      documentsCount: c.documents?.length || 0,
      documents: c.documents?.map((d: any) => ({ type: d.type, filename: d.filename }))
    }))
  });

  // Check if provider payment is completed (contract reached PROVIDER_PAID or PAYMENT_COMPLETED status)
  const hasProviderPayment = contracts.some(
    (c: any) =>
      c.status === "PROVIDER_PAID" || c.status === "PAYMENT_COMPLETED"
  );

  // Get the active contract for this step (PAYMENT_REVIEWED means ready to pay provider)
  const activeContract = contracts.find(
    (c: any) =>
      c.status === "PAYMENT_REVIEWED" ||
      c.status === "PROVIDER_PAID" ||
      c.status === "PAYMENT_COMPLETED"
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Por favor seleccione al menos un documento",
        variant: "destructive",
      });
      return;
    }

    if (!activeContract) {
      toast({
        title: "Error",
        description: "Se necesita un contrato activo para subir documentos",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // First, create payment record
      const paymentResponse = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: activeContract.id,
          type: "PARTIAL",
          status: "PENDING",
          notes: notes || "Pago al proveedor - Flujo de adaptación",
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(
          errorData.error || "Error al crear el registro de pago"
        );
      }

      const paymentData = await paymentResponse.json();
      const paymentId = paymentData.payment.id;

      // Upload each file to the payment
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("paymentId", paymentId);
        formData.append("notes", notes || "");

        const uploadResponse = await fetch(
          "/api/admin/payments/upload-provider-proof",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `Error al subir ${file.name}`);
        }
      }

      toast({
        title: "Documentos subidos",
        description: "Los documentos de pago se han subido correctamente",
      });

      setSelectedFiles([]);
      setNotes("");
      onUpdate();
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron subir los documentos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (hasProviderPayment) {
    // Get the contract with PROVIDER_PAID or PAYMENT_COMPLETED status
    const completedContract = contracts.find(
      (c: any) =>
        c.status === "PROVIDER_PAID" || c.status === "PAYMENT_COMPLETED"
    );

    // Get documents of type COMPROBANTE_PAGO_PROVEEDOR from the contract
    const paymentDocuments = completedContract?.documents?.filter(
      (d: any) => d.type === "COMPROBANTE_PAGO_PROVEEDOR"
    ) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Pago al Proveedor Completado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-900">
                  El pago al proveedor ha sido registrado
                </p>
              </div>
              {completedContract && (
                <div className="text-sm text-green-700 space-y-1">
                  <p>
                    <span className="font-medium">Contrato:</span> {completedContract.code}
                  </p>
                  <p>
                    <span className="font-medium">Estado:</span> {completedContract.status}
                  </p>
                  {completedContract.updatedAt && (
                    <p>
                      Actualizado el:{" "}
                      {format(
                        new Date(completedContract.updatedAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: es }
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Documents Section */}
            {paymentDocuments.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos Subidos ({paymentDocuments.length})
                </h3>
                <div className="space-y-2">
                  {paymentDocuments.map((doc: any) => (
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

            <Button onClick={onNext} className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continuar a Factura Final
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeContract) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pago al Proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Banknote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Contrato Requerido
              </h3>
              <p className="text-gray-600">
                Se necesita un contrato completado antes de registrar el pago
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
            <Banknote className="h-5 w-5" />
            Registrar Pago al Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Flujo de Adaptación
                </p>
                <p className="text-sm text-blue-700">
                  Sube uno o más documentos que comprueben el pago realizado al
                  proveedor. Puedes incluir comprobantes, transferencias, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Contrato Asociado</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Código:</span>{" "}
                <span className="font-medium">{activeContract.code}</span>
              </p>
              {activeContract.paymentDate && (
                <p>
                  <span className="text-gray-600">Fecha de Pago:</span>{" "}
                  <span className="font-medium">
                    {format(
                      new Date(activeContract.paymentDate),
                      "dd/MM/yyyy",
                      { locale: es }
                    )}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <Label>Documentos de Pago *</Label>
              <p className="text-sm text-gray-500 mb-2">
                Sube comprobantes, transferencias u otros documentos que
                verifiquen el pago
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
              placeholder="Información adicional sobre el pago"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleUploadDocuments}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo documentos...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registrar Pago al Proveedor
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
