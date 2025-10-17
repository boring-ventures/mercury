"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  DollarSign,
  Calendar,
  Building2,
  MapPin,
  User,
  Eye,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestStepViewProps {
  request: any;
  onUpdate: () => void;
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

function DocumentCard({ document }: { document: any }) {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isImage =
    document?.mimeType?.toLowerCase().includes("image") ||
    document?.filename?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  const isPDF =
    document?.mimeType?.toLowerCase().includes("pdf") ||
    document?.filename?.toLowerCase().endsWith(".pdf");

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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{document.filename}</DialogTitle>
                <DialogDescription>
                  {getDocumentTypeLabel(document.type)}
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
                    className="w-full h-auto max-h-[60vh] object-contain"
                    onError={() => setImageError(true)}
                  />
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
    </>
  );
}

export default function RequestStepView({
  request,
  onUpdate,
}: RequestStepViewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Código de Solicitud</p>
              <p className="font-semibold text-lg">{request.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto</p>
              <p className="font-semibold text-lg">
                {formatCurrency(request.amount, request.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha de Creación</p>
              <p className="font-semibold">
                {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {request.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Descripción del Pedido</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900">{request.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nombre de la Empresa</p>
              <p className="font-semibold">{request.company?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">NIT</p>
              <p className="font-semibold">{request.company?.nit || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">País</p>
              <p className="font-semibold">
                {request.company?.country || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Ciudad</p>
              <p className="font-semibold">{request.company?.city || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Persona de Contacto</p>
              <p className="font-semibold">
                {request.company?.contactName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold">{request.company?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="font-semibold">{request.company?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Cargo</p>
              <p className="font-semibold">
                {request.company?.contactPosition || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Información del Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nombre del Proveedor</p>
              <p className="font-semibold">{request.provider?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">País del Proveedor</p>
              <p className="font-semibold">
                {request.provider?.country || "N/A"}
              </p>
            </div>
          </div>
          {request.provider?.bankingDetails && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Información Bancaria
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm space-y-2">
                  {typeof request.provider.bankingDetails === "string" ? (
                    <pre className="whitespace-pre-wrap">
                      {request.provider.bankingDetails}
                    </pre>
                  ) : (
                    <div className="space-y-2">
                      {request.provider.bankingDetails.bankName && (
                        <div>
                          <span className="font-medium">Banco:</span>{" "}
                          {request.provider.bankingDetails.bankName}
                        </div>
                      )}
                      {request.provider.bankingDetails.swiftCode && (
                        <div>
                          <span className="font-medium">Código SWIFT:</span>{" "}
                          {request.provider.bankingDetails.swiftCode}
                        </div>
                      )}
                      {request.provider.bankingDetails.accountNumber && (
                        <div>
                          <span className="font-medium">Número de Cuenta:</span>{" "}
                          {request.provider.bankingDetails.accountNumber}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      {request.documents && request.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos Adjuntos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {request.documents.map((document: any) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Created By */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Creado Por
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">
                {request.createdBy
                  ? `${request.createdBy.firstName} ${request.createdBy.lastName}`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {request.createdBy?.email || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
