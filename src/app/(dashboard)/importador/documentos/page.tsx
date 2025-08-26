"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Eye,
  Maximize2,
  X,
  Filter,
  Search,
  Calendar,
  Building2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Document status badge
function DocumentStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" };
      case "APPROVED":
        return { label: "Aprobado", color: "bg-green-100 text-green-800" };
      case "REJECTED":
        return { label: "Rechazado", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const config = getStatusConfig(status);
  return <Badge className={config.color}>{config.label}</Badge>;
}

// Document type badge
function DocumentTypeBadge({ type }: { type: string }) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "COMPROBANTE_PAGO":
        return {
          label: "Comprobante de Pago",
          color: "bg-blue-100 text-blue-800",
        };
      case "COMPROBANTE_PAGO_PROVEEDOR":
        return {
          label: "Comprobante Pago Proveedor",
          color: "bg-purple-100 text-purple-800",
        };
      case "CONTRATO":
        return { label: "Contrato", color: "bg-green-100 text-green-800" };
      case "COTIZACION":
        return { label: "Cotización", color: "bg-orange-100 text-orange-800" };
      default:
        return { label: type, color: "bg-gray-100 text-gray-800" };
    }
  };

  const config = getTypeConfig(type);
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

export default function ImporterDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { toast } = useToast();

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/importador/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        throw new Error("Failed to load documents");
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentInfo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    const matchesType = !typeFilter || doc.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mis Documentos
        </h1>
        <p className="text-gray-600">
          Gestiona y revisa todos los documentos relacionados con tus contratos
          y pagos
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobado</option>
              <option value="REJECTED">Rechazado</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="COMPROBANTE_PAGO">Comprobante de Pago</option>
              <option value="COMPROBANTE_PAGO_PROVEEDOR">
                Comprobante Pago Proveedor
              </option>
              <option value="CONTRATO">Contrato</option>
              <option value="COTIZACION">Cotización</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setTypeFilter("");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {documents.length === 0
                ? "No tienes documentos aún"
                : "No se encontraron documentos"}
            </h3>
            <p className="text-gray-500 text-center">
              {documents.length === 0
                ? "Los documentos aparecerán aquí una vez que subas archivos o se generen contratos."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {document.filename}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <DocumentTypeBadge type={document.type} />
                      <DocumentStatusBadge status={document.status} />
                      <span className="text-sm text-gray-600">
                        {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(document);
                        setShowDocumentPreview(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Document Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Detalles del Documento
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Archivo:</span>
                        <span className="font-medium">{document.filename}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <DocumentTypeBadge type={document.type} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <DocumentStatusBadge status={document.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamaño:</span>
                        <span className="font-medium">
                          {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo MIME:</span>
                        <span className="font-medium">{document.mimeType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Información Relacionada
                    </h4>
                    <div className="space-y-2 text-sm">
                      {document.contract && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contrato:</span>
                            <span className="font-medium">
                              {document.contract.code}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Estado Contrato:
                            </span>
                            <span className="font-medium">
                              {document.contract.status}
                            </span>
                          </div>
                        </>
                      )}
                      {document.payment && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pago:</span>
                            <span className="font-medium">
                              {document.payment.code}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estado Pago:</span>
                            <span className="font-medium">
                              {document.payment.status}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subido:</span>
                        <span className="font-medium">
                          {new Date(document.createdAt).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Información Adicional
                    </h4>
                    <div className="space-y-2 text-sm">
                      {document.documentInfo && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">
                            {document.documentInfo}
                          </p>
                        </div>
                      )}
                      {!document.documentInfo && (
                        <p className="text-gray-500 italic">
                          Sin información adicional
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    </div>
  );
}
