"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Info,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadDocument } from "@/lib/supabase/upload-documents";
import { useProviders } from "@/hooks/use-providers";

interface Company {
  id: string;
  name: string;
  nit: string;
  country: string;
  city: string;
}

interface DocumentFile {
  file: File;
  filename: string;
  fileSize: number;
  mimeType: string;
  type: string;
  fileUrl?: string;
  previewUrl?: string;
  documentInfo?: string;
}

export default function NewOnboardingFlow() {
  const router = useRouter();
  const { data: providersData, isLoading: providersLoading } = useProviders();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyId: "",
    amount: "",
    currency: "USD",
    description: "",
    providerName: "",
    providerCountry: "",
    providerBankName: "",
    providerAccountNumber: "",
    providerSwiftCode: "",
    providerBankAddress: "",
    providerBeneficiaryName: "",
    providerEmail: "",
    providerPhone: "",
    providerAdditionalInfo: "",
  });

  const [documents, setDocuments] = useState<{
    proforma?: DocumentFile;
    factura?: DocumentFile;
  }>({});

  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // Load companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/admin/companies");
        if (response.ok) {
          const data = await response.json();
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((doc) => {
        if (doc?.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });
    };
  }, [documents]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProviderSelect = (providerId: string) => {
    const selectedProvider = providersData?.providers.find(
      (p) => p.id === providerId
    );
    if (!selectedProvider) return;

    setFormData((prev) => ({
      ...prev,
      providerName: selectedProvider.name,
      providerCountry: selectedProvider.country,
      providerBankName: selectedProvider.bankingDetails?.bankName || "",
      providerAccountNumber:
        selectedProvider.bankingDetails?.accountNumber || "",
      providerSwiftCode: selectedProvider.bankingDetails?.swiftCode || "",
      providerBankAddress: selectedProvider.bankingDetails?.bankAddress || "",
      providerBeneficiaryName:
        selectedProvider.bankingDetails?.beneficiaryName || "",
      providerEmail: selectedProvider.email || "",
      providerPhone: selectedProvider.phone || "",
      providerAdditionalInfo: selectedProvider.additionalInfo || "",
    }));

    toast({
      title: "Proveedor cargado",
      description: `Se han cargado los datos de ${selectedProvider.name}`,
    });
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

    // Validate file size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no puede ser mayor a 30MB",
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

    // Clean up previous preview URL
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
        fileUrl: fileUrl || undefined,
        previewUrl,
        documentInfo: documents[type]?.documentInfo || "",
      };

      setDocuments((prev) => ({
        ...prev,
        [type]: documentFile,
      }));

      toast({
        title: "Archivo subido",
        description: `${file.name} se ha subido correctamente`,
      });
    } catch (error) {
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

  const handleDocumentTextChange = (
    type: "proforma" | "factura",
    text: string
  ) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: prev[type] ? { ...prev[type]!, documentInfo: text } : undefined,
    }));
  };

  const removeFile = (type: "proforma" | "factura") => {
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

    if (!formData.companyId) {
      toast({
        title: "Error",
        description: "Por favor selecciona una empresa",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare documents for submission
      const documentsForSubmission = Object.values(documents).map((doc) => ({
        filename: doc.filename,
        fileUrl: doc.fileUrl!,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        type: doc.type,
        documentInfo: doc.documentInfo || "",
      }));

      // Create request through admin API
      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: formData.companyId,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          currency: formData.currency,
          description: formData.description || undefined,
          providerName: formData.providerName || undefined,
          providerCountry: formData.providerCountry || undefined,
          providerBankName: formData.providerBankName || undefined,
          providerAccountNumber: formData.providerAccountNumber || undefined,
          providerSwiftCode: formData.providerSwiftCode || undefined,
          providerBankAddress: formData.providerBankAddress || undefined,
          providerBeneficiaryName:
            formData.providerBeneficiaryName || undefined,
          providerEmail: formData.providerEmail || undefined,
          providerPhone: formData.providerPhone || undefined,
          providerAdditionalInfo: formData.providerAdditionalInfo || undefined,
          documents: documentsForSubmission,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la solicitud");
      }

      const data = await response.json();

      toast({
        title: "Flujo creado",
        description: "El flujo de adaptación se ha creado correctamente",
      });

      // Redirect to the flow detail page
      router.push(`/admin/onboarding-flow/${data.request.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el flujo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadSection = ({
    file,
    onFileChange,
    title,
    inputId,
    isUploading = false,
  }: {
    file?: DocumentFile;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    inputId: string;
    isUploading?: boolean;
  }) => {
    const [localDocumentInfo, setLocalDocumentInfo] = useState(
      file?.documentInfo || ""
    );

    useEffect(() => {
      setLocalDocumentInfo(file?.documentInfo || "");
    }, [file?.documentInfo]);

    return (
      <div>
        <Label>{title}</Label>
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
                </div>
              ) : file.mimeType === "application/pdf" ? (
                <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-lg border">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Archivo PDF</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-4">
                <Label
                  htmlFor={`${inputId}-text`}
                  className="text-sm font-medium"
                >
                  Información adicional del documento
                </Label>
                <Textarea
                  id={`${inputId}-text`}
                  placeholder="Número del documento, productos, montos, fechas, términos, etc."
                  rows={3}
                  value={localDocumentInfo}
                  onChange={(e) => {
                    setLocalDocumentInfo(e.target.value);
                  }}
                  onBlur={() => {
                    handleDocumentTextChange(
                      inputId as "proforma" | "factura",
                      localDocumentInfo
                    );
                  }}
                  className="mt-1"
                />
              </div>
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
              />
              <p className="text-xs text-muted-foreground">
                Formatos: PDF, JPG, PNG • Máx: 30MB
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoadingCompanies || providersLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" /> Nuevo Flujo de Adaptación
        </h1>
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/admin/onboarding-flow">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </Button>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Flujo de Adaptación para Clientes
            </p>
            <p className="text-sm text-blue-700">
              Este módulo te permite simular todo el proceso de importación para
              clientes en fase de adaptación. Podrás gestionar cada paso desde la
              solicitud hasta la factura final, permitiéndote entrenar y validar
              el flujo antes de entregar acceso directo al cliente.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Empresa */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresa Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Seleccionar Empresa *</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => handleInputChange("companyId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa..." />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} - {company.nit} ({company.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Selecciona la empresa para la cual se creará esta solicitud
              </p>
            </div>
          </CardContent>
        </Card>

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
                <Label htmlFor="monto">Monto en USD</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="1000"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="moneda">Moneda de Origen</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="CNY">CNY - Yuan Chino</SelectItem>
                    <SelectItem value="JPY">JPY - Yen Japonés</SelectItem>
                    <SelectItem value="USDT">USDT - Tether</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción del Envío</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el propósito de la transacción y los productos a importar"
                rows={3}
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
            {providersData?.providers && providersData.providers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">
                  Cargar Proveedor Existente
                </h4>
                <Select onValueChange={handleProviderSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor existente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {providersData.providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name} - {provider.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proveedor-empresa">
                  Nombre de la Empresa Beneficiaria
                </Label>
                <Input
                  id="proveedor-empresa"
                  placeholder="Ej: Shanghai Trading Co., Ltd."
                  value={formData.providerName}
                  onChange={(e) =>
                    handleInputChange("providerName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="proveedor-pais">País del Proveedor</Label>
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
                    <SelectItem value="China">🇨🇳 China</SelectItem>
                    <SelectItem value="USA">🇺🇸 Estados Unidos</SelectItem>
                    <SelectItem value="Germany">🇩🇪 Alemania</SelectItem>
                    <SelectItem value="Japan">🇯🇵 Japón</SelectItem>
                    <SelectItem value="South Korea">
                      🇰🇷 Corea del Sur
                    </SelectItem>
                    <SelectItem value="Italy">🇮🇹 Italia</SelectItem>
                    <SelectItem value="France">🇫🇷 Francia</SelectItem>
                    <SelectItem value="Spain">🇪🇸 España</SelectItem>
                    <SelectItem value="Brazil">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="Mexico">🇲🇽 México</SelectItem>
                    <SelectItem value="Panama">🇵🇦 Panamá</SelectItem>
                    <SelectItem value="Other">🌍 Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-bank-name">
                  Nombre del Banco del Beneficiario
                </Label>
                <Input
                  id="provider-bank-name"
                  placeholder="Ej: Bank of China"
                  value={formData.providerBankName}
                  onChange={(e) =>
                    handleInputChange("providerBankName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="provider-account-number">
                  Número de Cuenta del Beneficiario
                </Label>
                <Input
                  id="provider-account-number"
                  placeholder="Ej: 1234567890"
                  value={formData.providerAccountNumber}
                  onChange={(e) =>
                    handleInputChange("providerAccountNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-swift-code">Código SWIFT/BIC</Label>
                <Input
                  id="provider-swift-code"
                  placeholder="Ej: BKCHCNBJ"
                  value={formData.providerSwiftCode}
                  onChange={(e) =>
                    handleInputChange("providerSwiftCode", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="provider-beneficiary-name">
                  Nombre del Beneficiario
                </Label>
                <Input
                  id="provider-beneficiary-name"
                  placeholder="Ej: Shanghai Trading Co., Ltd."
                  value={formData.providerBeneficiaryName}
                  onChange={(e) =>
                    handleInputChange("providerBeneficiaryName", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="provider-bank-address">Dirección del Banco</Label>
              <Textarea
                id="provider-bank-address"
                placeholder="Dirección completa del banco"
                rows={2}
                value={formData.providerBankAddress}
                onChange={(e) =>
                  handleInputChange("providerBankAddress", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-email">Email del Proveedor</Label>
                <Input
                  id="provider-email"
                  type="email"
                  placeholder="proveedor@ejemplo.com"
                  value={formData.providerEmail}
                  onChange={(e) =>
                    handleInputChange("providerEmail", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="provider-phone">Teléfono del Proveedor</Label>
                <Input
                  id="provider-phone"
                  type="tel"
                  placeholder="+86 123 4567 8900"
                  value={formData.providerPhone}
                  onChange={(e) =>
                    handleInputChange("providerPhone", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="provider-additional-info">
                Información Adicional del Proveedor
              </Label>
              <Textarea
                id="provider-additional-info"
                placeholder="Información adicional relevante..."
                rows={3}
                value={formData.providerAdditionalInfo}
                onChange={(e) =>
                  handleInputChange("providerAdditionalInfo", e.target.value)
                }
              />
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
            <Link href="/admin/onboarding-flow">
              <ArrowLeft className="h-4 w-4" /> Cancelar
            </Link>
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isSubmitting ? "Creando..." : "Crear Flujo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
