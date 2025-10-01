"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Building2,
  CreditCard,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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
  signedAt?: string;
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

export default function FacturaFinalPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [requestData, setRequestData] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
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

    fetchRequest();
  }, [requestId]);

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

  // Find provider payment proof document
  const providerProofDoc =
    payment?.documents?.find(
      (doc) => doc.type === "COMPROBANTE_PAGO_PROVEEDOR"
    ) ||
    contract?.documents?.find(
      (doc) => doc.type === "COMPROBANTE_PAGO_PROVEEDOR"
    );

  const hasProviderProof = !!providerProofDoc;
  const isPaymentCompleted =
    contract?.status === "PAYMENT_COMPLETED" ||
    payment?.status === "COMPLETED" ||
    contract?.status === "PROVIDER_PAID";

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
              Factura Final - Pago al Proveedor
            </h1>
            <p className="text-gray-500 mt-1">
              Solicitud: {requestData.code}
            </p>
          </div>
          {isPaymentCompleted && (
            <Badge className="bg-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completado
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
                Monto Total
              </p>
              <p className="text-base font-semibold text-gray-900">
                {requestData.currency} {requestData.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {contract && (
            <>
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

              {contract.signedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Fecha de Firma
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(contract.signedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {payment && (
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Código de Pago
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {payment.code}
                </p>
                {payment.paidAt && (
                  <p className="text-sm text-gray-600">
                    Pagado:{" "}
                    {new Date(payment.paidAt).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Provider Payment Proof Section */}
      {hasProviderProof ? (
        <Card className="p-6 border-l-4 border-l-green-500 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comprobante de Pago al Proveedor
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                El administrador ha completado el pago al proveedor y ha
                subido el comprobante correspondiente.
              </p>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {providerProofDoc.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getDocumentTypeLabel(providerProofDoc.type)}
                        {providerProofDoc.fileSize &&
                          ` • ${(providerProofDoc.fileSize / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                      {providerProofDoc.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Subido:{" "}
                          {new Date(
                            providerProofDoc.createdAt
                          ).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocument(providerProofDoc)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(providerProofDoc.fileUrl, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Proceso completado exitosamente
                  </p>
                </div>
                <p className="text-xs text-green-700 mt-1 ml-7">
                  El pago al proveedor ha sido realizado y verificado. El
                  proceso de la solicitud ha concluido.
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : isPaymentCompleted ? (
        <Card className="p-6 border-l-4 border-l-blue-500 bg-blue-50">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pago al Proveedor Completado
              </h3>
              <p className="text-sm text-gray-600">
                El administrador ha marcado el pago al proveedor como
                completado, pero no se ha adjuntado un comprobante de pago.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                El proceso ha sido finalizado exitosamente.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pago al Proveedor Pendiente
              </h3>
              <p className="text-sm text-gray-600">
                El proceso de pago al proveedor aún no ha sido completado por
                el administrador.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Una vez que el administrador complete el pago y suba el
                comprobante, podrá visualizarlo aquí.
              </p>
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
