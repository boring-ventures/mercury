"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImportadorLayout from "@/components/importador-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  Plus,
  Upload,
  Building2,
  CreditCard,
  Loader2,
  Eye,
  X,
} from "lucide-react";
import { useCreateRequest } from "@/hooks/use-requests";
import { toast } from "@/components/ui/use-toast";
import { uploadDocument } from "@/lib/supabase/upload-documents";

interface DocumentFile {
  file: File;
  filename: string;
  fileSize: number;
  mimeType: string;
  type: string;
  fileUrl?: string;
  previewUrl?: string;
}

export default function NuevaSolicitud() {
  const router = useRouter();
  const { createRequest, isLoading } = useCreateRequest();

  const [formData, setFormData] = useState({
    amount: "",
    currency: "USDT",
    description: "",
    providerName: "",
    providerCountry: "",
    providerBankingDetails: "",
    terms: false,
  });

  const [documents, setDocuments] = useState<{
    proforma?: DocumentFile;
    factura?: DocumentFile;
  }>({});

  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // Cleanup preview URLs on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((doc) => {
        if (doc?.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });
    };
  }, [documents]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadFile = async (
    file: File,
    folderPath: string = "requests"
  ): Promise<string | null> => {
    try {
      const result = await uploadDocument(file, folderPath);
      return result.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "proforma" | "factura"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no puede ser mayor a 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Solo se permiten archivos PDF, JPG o PNG",
        variant: "destructive",
      });
      return;
    }

    // Clean up previous preview URL to prevent memory leaks
    const previousFile = documents[type];
    if (previousFile?.previewUrl) {
      URL.revokeObjectURL(previousFile.previewUrl);
    }

    // Create preview URL for images
    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith("image/")) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (error) {
        console.error("Error creating preview URL:", error);
      }
    }

    setUploadingFiles((prev) => new Set(prev).add(type));

    try {
      const fileUrl = await uploadFile(file);

      const documentFile: DocumentFile = {
        file,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        type: type === "proforma" ? "PROFORMA_INVOICE" : "FACTURA_COMERCIAL",
        fileUrl,
        previewUrl,
      };

      setDocuments((prev) => ({
        ...prev,
        [type]: documentFile,
      }));

      toast({
        title: "Archivo subido",
        description: `${file.name} se ha subido correctamente`,
        variant: "default",
      });
    } catch (error) {
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo subir el archivo. Inténtalo de nuevo.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    }
  };

  const removeFile = (type: "proforma" | "factura") => {
    // Clean up preview URL
    const fileToRemove = documents[type];
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    setDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[type];
      return newDocs;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.amount ||
      !formData.description ||
      !formData.providerName ||
      !formData.providerCountry ||
      !formData.providerBankingDetails
    ) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.terms) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    if (!documents.proforma) {
      toast({
        title: "Documento requerido",
        description: "La Proforma Invoice es obligatoria",
        variant: "destructive",
      });
      return;
    }

    // Prepare documents for submission
    const documentsForSubmission = Object.values(documents).map((doc) => ({
      filename: doc.filename,
      fileUrl: doc.fileUrl!,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      type: doc.type,
    }));

    try {
      createRequest({
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
        providerName: formData.providerName,
        providerCountry: formData.providerCountry,
        providerBankingDetails: formData.providerBankingDetails,
        documents: documentsForSubmission,
      });

      // Navigate back to requests list on success
      router.push("/importador/solicitudes");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const FileUploadSection = ({
    file,
    onFileChange,
    title,
    inputId,
    required = false,
    isUploading = false,
  }: {
    file?: DocumentFile;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    inputId: string;
    required?: boolean;
    isUploading?: boolean;
  }) => (
    <div>
      <Label>
        {title} {required && "*"}
      </Label>
      <div className="mt-2 border-2 border-dashed rounded-md p-4 text-center">
        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">Subiendo archivo...</p>
          </div>
        ) : file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{file.filename}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(inputId as "proforma" | "factura")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {(file.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>

            {/* File Preview */}
            {file.previewUrl && file.mimeType.startsWith("image/") ? (
              <div className="relative w-full max-w-xs mx-auto">
                <Image
                  src={file.previewUrl}
                  alt={`Vista previa de ${file.filename}`}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg border"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : file.mimeType === "application/pdf" ? (
              <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-lg border">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Archivo PDF</p>
                </div>
              </div>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFile(inputId as "proforma" | "factura")}
            >
              Cambiar archivo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Arrastra tu archivo aquí</p>
              <p className="text-xs text-muted-foreground">o</p>
            </div>
            <Button type="button" variant="outline" size="sm" asChild>
              <Label htmlFor={inputId} className="cursor-pointer">
                SELECCIONAR ARCHIVO
              </Label>
            </Button>
            <Input
              id={inputId}
              type="file"
              className="hidden"
              onChange={onFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required={required}
            />
            <p className="text-xs text-muted-foreground">
              Formatos: PDF, JPG, PNG • Máx: 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ImportadorLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" /> NUEVA SOLICITUD
        </h1>
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/importador/solicitudes">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monto">Monto en USDT *</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="1000"
                  required
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="moneda">Moneda de Origen</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="CNY">CNY - Yuan Chino</SelectItem>
                    <SelectItem value="JPY">JPY - Yen Japonés</SelectItem>
                    <SelectItem value="USDT">USDT - Tether</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción del Envío *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el propósito de la transacción y los productos a importar"
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del Proveedor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Proveedor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proveedor-pais">País del Proveedor *</Label>
                <Select
                  value={formData.providerCountry}
                  onValueChange={(value) =>
                    handleInputChange("providerCountry", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="china">🇨🇳 China</SelectItem>
                    <SelectItem value="usa">🇺🇸 Estados Unidos</SelectItem>
                    <SelectItem value="germany">🇩🇪 Alemania</SelectItem>
                    <SelectItem value="japan">🇯🇵 Japón</SelectItem>
                    <SelectItem value="south-korea">
                      🇰🇷 Corea del Sur
                    </SelectItem>
                    <SelectItem value="italy">🇮🇹 Italia</SelectItem>
                    <SelectItem value="france">🇫🇷 Francia</SelectItem>
                    <SelectItem value="spain">🇪🇸 España</SelectItem>
                    <SelectItem value="brazil">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="mexico">🇲🇽 México</SelectItem>
                    <SelectItem value="other">🌍 Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="proveedor-empresa">
                  Nombre de la Empresa *
                </Label>
                <Input
                  id="proveedor-empresa"
                  placeholder="Ej: Shanghai Trading Co., Ltd."
                  required
                  value={formData.providerName}
                  onChange={(e) =>
                    handleInputChange("providerName", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="datos-bancarios">
                Datos Bancarios del Proveedor *
              </Label>
              <Textarea
                id="datos-bancarios"
                placeholder="Incluye: Nombre del banco, número de cuenta, código SWIFT/BIC, dirección del banco, nombre del beneficiario, etc."
                rows={4}
                required
                value={formData.providerBankingDetails}
                onChange={(e) =>
                  handleInputChange("providerBankingDetails", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Proporciona toda la información bancaria necesaria para realizar
                la transferencia
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Documentos Comerciales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadSection
                file={documents.proforma}
                onFileChange={(e) => handleFileChange(e, "proforma")}
                title="Proforma Invoice"
                inputId="proforma"
                required={true}
                isUploading={uploadingFiles.has("proforma")}
              />

              <FileUploadSection
                file={documents.factura}
                onFileChange={(e) => handleFileChange(e, "factura")}
                title="Factura Comercial"
                inputId="factura"
                isUploading={uploadingFiles.has("factura")}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                📋 Información sobre documentos:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Proforma Invoice:</strong> Documento obligatorio que
                  detalla los productos y precios
                </li>
                <li>
                  • <strong>Factura Comercial:</strong> Documento oficial de
                  venta (opcional si solo tienes proforma)
                </li>
                <li>• Ambos documentos deben estar en inglés o español</li>
                <li>
                  • Asegúrate de que los montos coincidan con el valor declarado
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Términos y Condiciones */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                required
                checked={formData.terms}
                onCheckedChange={(checked) =>
                  handleInputChange("terms", !!checked)
                }
              />
              <Label htmlFor="terms" className="text-sm">
                He leído y acepto los términos del servicio y confirmo que toda
                la información proporcionada es veraz
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/importador/solicitudes">
              <ArrowLeft className="h-4 w-4" /> CANCELAR
            </Link>
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isLoading ? "CREANDO..." : "CREAR SOLICITUD"}
          </Button>
        </div>
      </form>
    </ImportadorLayout>
  );
}
