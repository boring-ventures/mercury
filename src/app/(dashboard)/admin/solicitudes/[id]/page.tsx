"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  ZoomIn,
  Banknote,
  AlertTriangle,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useRequest,
  useUpdateRequest,
  useRequestStatusConfig,
} from "@/hooks/use-requests";
import {
  useUpdateDocumentStatus,
  useInternalNotes,
  useAddInternalNote,
  useDownloadPDF,
  useRequestHistory,
} from "@/hooks/use-admin-requests";
import { useUserDocuments } from "@/hooks/use-user-documents";
import {
  useQuotationExpiry,
  isQuotationExpired,
  getQuotationStatusWithExpiry,
  getQuotationStatusColor,
  getQuotationStatusLabel,
} from "@/hooks/use-quotation-expiry";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface DocumentItem {
  id: string;
  filename: string;
  mimeType: string;
  type?: string;
  fileUrl?: string;
  status?: string;
  reviewNotes?: string;
  createdAt?: Date;
  documentInfo?: string;
}

interface HistoryEvent {
  date: string;
  description: string;
  user: string;
  type: string;
}

interface InternalNote {
  id?: string;
  content: string;
  createdAt: Date;
  author: string;
}

interface ToastInstance {
  (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive" | null | undefined;
  }): void;
}

interface QuotationItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  amountInBs: number;
  swiftBankUSD: number;
  correspondentBankUSD: number;
  swiftBankBs: number;
  correspondentBankBs: number;
  managementServiceBs: number;
  managementServicePercentage: number;
  totalInBs: number;
  validUntil: Date;
  createdAt: Date;
  terms?: string;
  notes?: string;
  rejectionReason?: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Cotización" },
  { value: "IN_REVIEW", label: "En Revisión" },
  { value: "APPROVED", label: "Aprobado" },
  { value: "COMPLETED", label: "Completado" },
  { value: "REJECTED", label: "Rechazado" },
  { value: "CANCELLED", label: "Cancelado" },
];

function StatusBadge({ status }: { status: string }) {
  const { getStatusConfig } = useRequestStatusConfig();
  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (config.icon) {
      case "Clock":
        return <Clock className="h-3 w-3 mr-1" />;
      case "DollarSign":
        return <DollarSign className="h-3 w-3 mr-1" />;
      case "Eye":
        return <Eye className="h-3 w-3 mr-1" />;
      case "CheckCircle":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "XCircle":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "FileText":
        return <FileText className="h-3 w-3 mr-1" />;
      case "AlertCircle":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant="outline" className={config.color}>
      {getIcon()}
      {config.label}
    </Badge>
  );
}

interface DocumentViewerProps {
  document: {
    id: string;
    filename: string;
    mimeType: string;
    type?: string;
    fileUrl?: string;
  };
}

function DocumentViewer({ document }: DocumentViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isImage =
    document.mimeType?.toLowerCase().includes("image") ||
    document.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  const isPDF =
    document.mimeType?.toLowerCase().includes("pdf") ||
    document.filename.toLowerCase().endsWith(".pdf");

  // Better URL handling - check if fileUrl is valid or use API endpoint
  const getDocumentUrl = () => {
    // If fileUrl exists and is a valid HTTP URL, use it
    if (document.fileUrl && document.fileUrl.startsWith("http")) {
      return document.fileUrl;
    }

    // For local paths that likely don't exist in demo, return null to show placeholder
    if (
      document.fileUrl &&
      (document.fileUrl.startsWith("/uploads/") ||
        document.fileUrl.startsWith("uploads/") ||
        document.fileUrl.includes("1750030")) // Specific pattern we saw in errors
    ) {
      // These are upload paths that likely don't exist in demo
      return null;
    }

    // Fallback to API endpoint for other cases
    return `/api/documents/${document.id}`;
  };

  const documentUrl = getDocumentUrl();

  // If we know the URL is invalid from the start, show placeholder
  const shouldShowPlaceholder = !documentUrl || imageError;

  if (isImage) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        {shouldShowPlaceholder ? (
          // Show placeholder immediately if there was an error or no valid URL
          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {document.filename}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Vista previa no disponible
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Archivo de demostración
              </p>
            </div>
          </div>
        ) : (
          <Image
            src={documentUrl}
            alt={document.filename}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            onError={() => {
              console.log(`Failed to load image: ${documentUrl}`);
              setImageError(true);
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
          />
        )}
      </div>
    );
  }

  if (isPDF) {
    return (
      <div className="text-center py-8">
        <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Documento PDF
        </h3>
        <p className="text-gray-600 mb-4">{document.filename}</p>
        {shouldShowPlaceholder && (
          <p className="text-xs text-gray-500 mt-2">
            Archivo de demostración - Vista previa no disponible
          </p>
        )}
      </div>
    );
  }

  // Other file types
  return (
    <div className="text-center py-8">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {document.filename}
      </h3>
      <p className="text-gray-600 mb-4">
        Vista previa no disponible para este tipo de archivo
      </p>
      {shouldShowPlaceholder && (
        <p className="text-xs text-gray-500 mt-2">
          Archivo de demostración - Descarga no disponible
        </p>
      )}
    </div>
  );
}

function DocumentCard({
  document,
  requestId,
  compact = false,
}: {
  document: DocumentItem;
  requestId: string;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const { mutate: updateDocumentStatus, isPending: isUpdating } =
    useUpdateDocumentStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    updateDocumentStatus(
      {
        requestId,
        docId: document.id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Estado del documento actualizado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado del documento",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      PROFORMA_INVOICE: "Proforma Invoice",
      FACTURA_COMERCIAL: "Factura Comercial",
      CONTRATO: "Contrato",
      COMPROBANTE_PAGO: "Comprobante de Pago",
      CARNET_IDENTIDAD: "Carnet de Identidad",
      PASAPORTE: "Pasaporte",
      OTHER: "Otro",
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "Aprobado", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rechazado", className: "bg-red-100 text-red-800" },
      EXPIRED: { label: "Expirado", className: "bg-gray-100 text-gray-800" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleViewDocument = () => {
    setIsModalOpen(true);
  };

  const handleDownload = () => {
    const url = `/api/documents/${document.id}`;
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.filename;
    link.click();
  };

  return (
    <>
      <Card className="mb-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900">
                {getDocumentTypeLabel(document.type || "Documento")}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {document.filename}
              </p>
              {document.documentInfo && (
                <p className="text-xs text-blue-600 mt-1 line-clamp-2">
                  {document.documentInfo}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!compact && (
              <div className="flex items-center gap-2 mr-2">
                {getStatusBadge(document.status || "PENDING")}
                <Select
                  value={document.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="APPROVED">Aprobar</SelectItem>
                    <SelectItem value="REJECTED">Rechazar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleViewDocument}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Document View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg">
                  {getDocumentTypeLabel(document.type || "Documento")}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {document.filename}
                </DialogDescription>
                {document.documentInfo && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Información del Documento:
                    </p>
                    <p className="text-sm text-blue-800 whitespace-pre-wrap">
                      {document.documentInfo}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!compact && (
                  <div className="flex items-center gap-2">
                    {getStatusBadge(document.status || "PENDING")}
                    <Select
                      value={document.status}
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="APPROVED">Aprobar</SelectItem>
                        <SelectItem value="REJECTED">Rechazar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="relative max-h-[80vh] overflow-auto">
            <DocumentViewer document={document} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuotationGenerator({
  requestId,
  requestAmount,
  onSuccess,
  variant = "default",
  disabled = false,
  disabledReason = "",
}: {
  requestId: string;
  requestAmount?: number;
  onSuccess: () => void;
  variant?: "default" | "compact";
  disabled?: boolean;
  disabledReason?: string;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get tomorrow's date as minimum (to ensure it's always future)
  const getMinimumDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Set time to 00:00 (start of day)
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  // Get default valid until date (same as minimum date)
  const getDefaultValidUntil = () => {
    return getMinimumDate();
  };

  const [quotationData, setQuotationData] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const defaultValidUntil = tomorrow.toISOString().slice(0, 16);

    return {
      amount: requestAmount?.toString() || "",
      currency: "USD", // Fixed to USD
      exchangeRate: "",
      amountInBs: "",
      swiftBankUSD: "",
      correspondentBankUSD: "",
      swiftBankBs: "",
      correspondentBankBs: "",
      managementServiceBs: "",
      managementServicePercentage: "1.5",
      totalInBs: "",
      validUntil: defaultValidUntil,
      terms: "",
      notes: "",
      status: "DRAFT",
    };
  });

  const [binancePrice, setBinancePrice] = useState<{
    price: number;
    available: number;
    coverage: number;
    offers: number;
    offers_used?: any[];
  } | null>(null);
  const [isBinanceCollapsed, setIsBinanceCollapsed] = useState(true);
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false);

  // Preload amount when modal opens
  useEffect(() => {
    if (requestAmount && requestAmount > 0 && isOpen) {
      setQuotationData((prev) => ({
        ...prev,
        amount: requestAmount.toString(),
      }));
    }
  }, [requestAmount, isOpen]);

  // Validate if the selected date is valid (at least tomorrow)
  const isValidDate = (dateString: string) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return selectedDate >= tomorrow;
  };

  const isDateValid = isValidDate(quotationData.validUntil);

  // Auto-calculation functions
  const calculateAmountInBs = useCallback(() => {
    const amount = parseFloat(quotationData.amount) || 0;
    const exchangeRate = parseFloat(quotationData.exchangeRate) || 0;

    if (amount > 0 && exchangeRate > 0) {
      const calculatedValue = amount * exchangeRate;
      setQuotationData((prev) => ({
        ...prev,
        amountInBs: calculatedValue.toFixed(2),
      }));
    }
  }, [quotationData.amount, quotationData.exchangeRate]);

  const calculateExpensesInBs = useCallback(() => {
    const swiftBankUSD = parseFloat(quotationData.swiftBankUSD) || 0;
    const correspondentBankUSD =
      parseFloat(quotationData.correspondentBankUSD) || 0;
    const exchangeRate = parseFloat(quotationData.exchangeRate) || 0;

    if (exchangeRate > 0) {
      const swiftBankBs = swiftBankUSD * exchangeRate;
      const correspondentBankBs = correspondentBankUSD * exchangeRate;

      setQuotationData((prev) => ({
        ...prev,
        swiftBankBs: swiftBankBs.toFixed(2),
        correspondentBankBs: correspondentBankBs.toFixed(2),
      }));
    }
  }, [
    quotationData.swiftBankUSD,
    quotationData.correspondentBankUSD,
    quotationData.exchangeRate,
  ]);

  const calculateManagementServiceBs = useCallback(() => {
    const amountInBs = parseFloat(quotationData.amountInBs) || 0;
    const managementServicePercentage =
      parseFloat(quotationData.managementServicePercentage) || 0;

    if (amountInBs > 0 && managementServicePercentage > 0) {
      const calculatedService =
        (amountInBs * managementServicePercentage) / 100;
      setQuotationData((prev) => ({
        ...prev,
        managementServiceBs: calculatedService.toFixed(2),
      }));
    }
  }, [quotationData.amountInBs, quotationData.managementServicePercentage]);

  const calculateTotalInBs = useCallback(() => {
    const amountInBs = parseFloat(quotationData.amountInBs) || 0;
    const swiftBankBs = parseFloat(quotationData.swiftBankBs) || 0;
    const correspondentBankBs =
      parseFloat(quotationData.correspondentBankBs) || 0;
    const managementServiceBs =
      parseFloat(quotationData.managementServiceBs) || 0;

    const total =
      amountInBs + swiftBankBs + correspondentBankBs + managementServiceBs;
    setQuotationData((prev) => ({
      ...prev,
      totalInBs: total.toFixed(2),
    }));
  }, [
    quotationData.amountInBs,
    quotationData.swiftBankBs,
    quotationData.correspondentBankBs,
    quotationData.managementServiceBs,
  ]);

  // Debounced calculation for exchange rate and value changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAmountInBs();
      calculateExpensesInBs();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    quotationData.exchangeRate,
    quotationData.amount,
    quotationData.swiftBankUSD,
    quotationData.correspondentBankUSD,
    calculateAmountInBs,
    calculateExpensesInBs,
  ]);

  // Auto-calculate management service when amount changes
  useEffect(() => {
    calculateManagementServiceBs();
  }, [calculateManagementServiceBs]);

  // Auto-calculate total when any component changes
  useEffect(() => {
    calculateTotalInBs();
  }, [calculateTotalInBs]);

  // Fetch Binance price when amount changes (but not when it's being set from prop)
  useEffect(() => {
    const amount = parseFloat(quotationData.amount);
    if (amount > 0 && amount !== requestAmount) {
      const timeoutId = setTimeout(() => {
        fetchBinancePrice(amount);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    } else if (amount === 0) {
      setBinancePrice(null);
    }
  }, [quotationData.amount, requestAmount]);

  // Function to fetch exchange rate from Binance P2P API
  const fetchExchangeRate = async () => {
    setIsLoadingExchangeRate(true);
    try {
      const response = await fetch("/api/binance/exchange-rate");
      const data = await response.json();

      if (data.success && data.data && data.data.usdt_bob) {
        setQuotationData((prev) => ({
          ...prev,
          exchangeRate: data.data.usdt_bob.toString(),
        }));
        toast({
          title: "Tipo de cambio actualizado",
          description: `Precio promedio: ${data.data.usdt_bob.toFixed(2)} BOB/USDT (${data.data.valid_offers_count} ofertas válidas)`,
        });
      } else {
        throw new Error(data.error || "Error al obtener el tipo de cambio");
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      toast({
        title: "Error al obtener tipo de cambio",
        description:
          "No se pudo obtener el precio desde Binance P2P. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExchangeRate(false);
    }
  };

  // Function to fetch Binance price for specific amount
  const fetchBinancePrice = async (amount: number) => {
    if (!amount || amount <= 0) {
      setBinancePrice(null);
      return;
    }

    setIsLoadingExchangeRate(true);
    try {
      const response = await fetch(
        `/api/binance/exchange-rate?amount=${amount}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setBinancePrice({
          price: data.data.usdt_bob,
          available: data.data.available_amount,
          coverage: data.data.coverage_percentage,
          offers: data.data.offers_count,
          offers_used: data.data.offers_used || [],
        });

        // Update exchange rate with the fetched price
        setQuotationData((prev: any) => ({
          ...prev,
          exchangeRate: data.data.usdt_bob.toString(),
        }));

        // Ensure collapsible stays closed when data is fetched
        setIsBinanceCollapsed(false);

        toast({
          title: "Precio actualizado",
          description: `Precio promedio: ${data.data.usdt_bob.toFixed(2)} BOB/USDT (${data.data.offers_count} ofertas)`,
        });
      } else {
        setBinancePrice(null);
        toast({
          title: "Error",
          description: data.error || "No se pudo obtener el precio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching Binance price:", error);
      setBinancePrice(null);
      toast({
        title: "Error",
        description: "No se pudo obtener el precio desde Binance P2P",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExchangeRate(false);
    }
  };

  const handleGenerate = async () => {
    const amount = parseFloat(quotationData.amount);
    const exchangeRate = parseFloat(quotationData.exchangeRate) || 0;
    const amountInBs = parseFloat(quotationData.amountInBs) || 0;
    const swiftBankUSD = parseFloat(quotationData.swiftBankUSD) || 0;
    const correspondentBankUSD =
      parseFloat(quotationData.correspondentBankUSD) || 0;
    const swiftBankBs = parseFloat(quotationData.swiftBankBs) || 0;
    const correspondentBankBs =
      parseFloat(quotationData.correspondentBankBs) || 0;
    const managementServiceBs =
      parseFloat(quotationData.managementServiceBs) || 0;
    const managementServicePercentage =
      parseFloat(quotationData.managementServicePercentage) || 0;
    const totalInBs = parseFloat(quotationData.totalInBs) || 0;

    // Validate required fields
    if (!amount || !quotationData.validUntil) {
      toast({
        title: "Error",
        description: "Monto a enviar y fecha de validez son obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Validate date - prevent submission if date is invalid
    if (!isDateValid) {
      toast({
        title: "Error",
        description: "La fecha de validez debe ser al menos desde mañana",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: quotationData.currency,
          exchangeRate,
          amountInBs,
          swiftBankUSD,
          correspondentBankUSD,
          swiftBankBs,
          correspondentBankBs,
          managementServiceBs,
          managementServicePercentage,
          totalInBs,
          validUntil: quotationData.validUntil,
          terms: quotationData.terms,
          notes: quotationData.notes,
          status: quotationData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al generar la cotización");
      }

      const statusLabel =
        quotationData.status === "DRAFT" ? "borrador" : "publicada";
      toast({
        title: "Éxito",
        description: `Cotización generada como ${statusLabel} correctamente`,
      });

      setIsOpen(false);
      setQuotationData({
        amount: "",
        currency: "USD",
        exchangeRate: "",
        amountInBs: "",
        swiftBankUSD: "",
        correspondentBankUSD: "",
        swiftBankBs: "",
        correspondentBankBs: "",
        managementServiceBs: "",
        managementServicePercentage: "1.5",
        totalInBs: "",
        validUntil: getDefaultValidUntil(),
        terms: "",
        notes: "",
        status: "DRAFT",
      });
      onSuccess();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo generar la cotización",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalInBs =
    (parseFloat(quotationData.amountInBs) || 0) +
    (parseFloat(quotationData.swiftBankBs) || 0) +
    (parseFloat(quotationData.correspondentBankBs) || 0) +
    (parseFloat(quotationData.managementServiceBs) || 0);

  const buttonProps =
    variant === "compact"
      ? {
          className: disabled
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 text-white",
          size: "default" as const,
          disabled: disabled,
        }
      : {
          className: disabled
            ? "w-full justify-start gap-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            : "w-full justify-start gap-2",
          size: "default" as const,
          disabled: disabled,
        };

  return (
    <div className={disabled ? "relative" : ""}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild disabled={disabled}>
          <Button {...buttonProps}>
            <Banknote className="h-4 w-4 mr-2" />
            {variant === "compact" ? "Nueva Cotización" : "Generar Cotización"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Generar Nueva Cotización</DialogTitle>
            <DialogDescription>
              Complete los detalles para generar una cotización para esta
              solicitud.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[calc(85vh-180px)] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Monto a Enviar*</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={quotationData.amount}
                  onChange={(e) =>
                    setQuotationData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda / Tipo de Cambio</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="currency"
                      value="USD"
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.0001"
                    value={quotationData.exchangeRate}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        exchangeRate: e.target.value,
                      }))
                    }
                    placeholder="0.0000"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const amount = parseFloat(quotationData.amount);
                      if (amount > 0) {
                        fetchBinancePrice(amount);
                      } else {
                        toast({
                          title: "Error",
                          description: "Ingrese un monto válido primero",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={isLoadingExchangeRate || !quotationData.amount}
                    className="whitespace-nowrap"
                  >
                    {isLoadingExchangeRate ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Obtener
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Obtén el precio promedio desde Binance P2P
                </p>
              </div>
            </div>

            {/* Binance P2P Price Display - Collapsible */}
            {quotationData.amount &&
              parseFloat(quotationData.amount) > 0 &&
              binancePrice && (
                <Collapsible
                  open={isBinanceCollapsed}
                  onOpenChange={setIsBinanceCollapsed}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span className="font-medium text-blue-900">
                          Precio Binance P2P: {binancePrice.price.toFixed(2)}{" "}
                          BOB/USDT
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {binancePrice.offers} ofertas
                        </Badge>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isBinanceCollapsed ? "rotate-180" : ""}`}
                        />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 bg-white border border-blue-200 rounded-lg p-4">
                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700 font-medium">
                              Precio Promedio:
                            </p>
                            <p className="text-lg font-bold text-blue-900">
                              {binancePrice.price.toFixed(2)} BOB/USDT
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700 font-medium">
                              Disponible:
                            </p>
                            <p className="text-lg font-bold text-blue-900">
                              {binancePrice.available.toLocaleString()} USDT
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700 font-medium">
                              Cobertura:
                            </p>
                            <p className="font-medium text-blue-900">
                              {binancePrice.coverage}%
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700 font-medium">
                              Ofertas Usadas:
                            </p>
                            <p className="font-medium text-blue-900">
                              {binancePrice.offers} ofertas
                            </p>
                          </div>
                        </div>

                        {/* Offers Details */}
                        {binancePrice.offers_used &&
                          binancePrice.offers_used.length > 0 && (
                            <div className="border-t pt-4">
                              <h5 className="font-medium text-blue-900 mb-3">
                                Detalle de Ofertas:
                              </h5>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {binancePrice.offers_used.map(
                                  (offer: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                          {offer.advertiser}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Grado {offer.userGrade}
                                        </Badge>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">
                                          {offer.price} BOB/USDT
                                        </div>
                                        <div className="text-gray-600">
                                          {offer.availableAmount.toLocaleString()}{" "}
                                          USDT
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="border-t pt-2">
                          <p className="text-xs text-blue-600">
                            💡 Precio calculado con {binancePrice.offers}{" "}
                            ofertas de Binance P2P
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amountInBs">
                  Monto a Enviar en Bs (Auto-calculado)
                </Label>
                <Input
                  id="amountInBs"
                  type="number"
                  step="0.01"
                  value={quotationData.amountInBs}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculado automáticamente: Monto × Tipo de Cambio
                </p>
              </div>
            </div>

            {/* Gastos Financieros Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3 text-blue-600">
                Gastos Financieros
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="swiftBankUSD">SWIFT Banco (USD)</Label>
                  <Input
                    id="swiftBankUSD"
                    type="number"
                    step="0.01"
                    value={quotationData.swiftBankUSD}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        swiftBankUSD: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="swiftBankBs">
                    SWIFT Banco (Bs) (Auto-calculado)
                  </Label>
                  <Input
                    id="swiftBankBs"
                    type="number"
                    step="0.01"
                    value={quotationData.swiftBankBs}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculado automáticamente: SWIFT USD × Tipo de Cambio
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="correspondentBankUSD">
                    Com. Corresponsal (USD)
                  </Label>
                  <Input
                    id="correspondentBankUSD"
                    type="number"
                    step="0.01"
                    value={quotationData.correspondentBankUSD}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        correspondentBankUSD: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="correspondentBankBs">
                    Com. Corresponsal (Bs) (Auto-calculado)
                  </Label>
                  <Input
                    id="correspondentBankBs"
                    type="number"
                    step="0.01"
                    value={quotationData.correspondentBankBs}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculado automáticamente: Com. USD × Tipo de Cambio
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managementServicePercentage">
                  Porcentaje Servicio (%)*
                </Label>
                <Input
                  id="managementServicePercentage"
                  type="number"
                  step="0.01"
                  value={quotationData.managementServicePercentage}
                  onChange={(e) =>
                    setQuotationData((prev) => ({
                      ...prev,
                      managementServicePercentage: e.target.value,
                    }))
                  }
                  placeholder="1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se aplica solo sobre el monto a enviar en Bs
                </p>
              </div>
              <div>
                <Label htmlFor="totalInBs">Total en Bs (Auto-calculado)</Label>
                <Input
                  id="totalInBs"
                  type="number"
                  step="0.01"
                  value={quotationData.totalInBs}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed font-semibold"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculado automáticamente: Valor Bs + Gasto Bs + Servicio Bs
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="validUntil">Válida hasta*</Label>
              <Input
                id="validUntil"
                type="datetime-local"
                min={getMinimumDate()}
                value={quotationData.validUntil}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    validUntil: e.target.value,
                  }))
                }
                className={
                  !isDateValid ? "border-red-500 focus:border-red-500" : ""
                }
              />
              <div className="mt-1">
                {!isDateValid ? (
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ La fecha y hora deben ser al menos desde mañana (
                    {format(
                      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                      "dd/MM/yyyy 'a las' HH:mm",
                      { locale: es }
                    )}
                    )
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    La fecha y hora deben ser al menos desde mañana (
                    {format(
                      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                      "dd/MM/yyyy 'a las' HH:mm",
                      { locale: es }
                    )}
                    )
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="terms">Términos y Condiciones</Label>
              <Textarea
                id="terms"
                value={quotationData.terms}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    terms: e.target.value,
                  }))
                }
                placeholder="Términos y condiciones de la cotización..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={quotationData.notes}
                onChange={(e) =>
                  setQuotationData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Notas adicionales para el cliente..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="status">Estado de la Cotización*</Label>
              <Select
                value={quotationData.status}
                onValueChange={(value) =>
                  setQuotationData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">
                    <div className="flex flex-col items-start">
                      <span>Borrador</span>
                      <span className="text-xs text-gray-500">
                        Puede ser modificada, no visible para el importador
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SENT">
                    <div className="flex flex-col items-start">
                      <span>Publicada</span>
                      <span className="text-xs text-gray-500">
                        Visible para el importador, lista para revisión
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {parseFloat(quotationData.totalInBs) > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h4 className="font-medium text-sm mb-2 text-blue-900">
                  Resumen de Cotización
                </h4>
                <div className="space-y-1 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Monto a Enviar ({quotationData.currency}):</span>
                    <span>
                      {parseFloat(quotationData.amount || "0").toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto a Enviar (Bs):</span>
                    <span>
                      {parseFloat(quotationData.amountInBs || "0").toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SWIFT Banco (Bs):</span>
                    <span>
                      {parseFloat(quotationData.swiftBankBs || "0").toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Com. Corresponsal (Bs):</span>
                    <span>
                      {parseFloat(
                        quotationData.correspondentBankBs || "0"
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Servicio de Gestión (
                      {quotationData.managementServicePercentage}%):
                    </span>
                    <span>
                      {parseFloat(
                        quotationData.managementServiceBs || "0"
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-1 mt-2">
                    <div className="flex justify-between font-medium text-blue-900">
                      <span>Total en Bs:</span>
                      <span>
                        {parseFloat(quotationData.totalInBs || "0").toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-blue-700">
                    Estado:{" "}
                    {quotationData.status === "DRAFT"
                      ? "Borrador (no visible para importador)"
                      : "Publicada (visible para importador)"}
                  </p>
                  <p className="text-xs text-blue-700">
                    Válida hasta:{" "}
                    {format(
                      new Date(quotationData.validUntil),
                      "dd/MM/yyyy 'a las' HH:mm",
                      {
                        locale: es,
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !isDateValid || !quotationData.amount}
              className="flex-1"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {quotationData.status === "DRAFT"
                ? "Guardar Borrador"
                : "Generar y Publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {disabled && (
        <div className="absolute -bottom-8 left-0 right-0 text-xs text-gray-500 text-center">
          {disabledReason}
        </div>
      )}
    </div>
  );
}

function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay eventos en el historial aún
        </p>
      ) : (
        events.map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">
                {format(new Date(event.date), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {event.description}
              </div>
              <div className="text-xs text-gray-500">por {event.user}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function InternalNotesCard({ requestId }: { requestId: string }) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: notesData, isLoading: isLoadingNotes } =
    useInternalNotes(requestId);
  const { mutate: addNote, isPending: isAddingNote } = useAddInternalNote();

  const notes = notesData?.notes || [];

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    addNote(
      { requestId, content: newNote },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Nota agregada correctamente",
          });
          setNewNote("");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo agregar la nota",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>NOTAS INTERNAS</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nota Interna</DialogTitle>
                <DialogDescription>
                  Esta nota será visible solo para el equipo administrativo.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribir nota..."
                rows={4}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={isAddingNote || !newNote.trim()}
                >
                  {isAddingNote ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Agregar Nota
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingNotes ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Cargando notas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay notas internas aún
              </p>
            ) : (
              notes.map((note: InternalNote, index: number) => (
                <div key={note.id || index} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{note.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function handleDownloadDocuments(requestId: string, toast: ToastInstance) {
  return async () => {
    try {
      const response = await fetch(
        `/api/requests/${requestId}/download-documents`
      );

      if (!response.ok) {
        throw new Error("Error al descargar documentos");
      }

      // Get the ZIP file as blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Documentos_Solicitud_${requestId}.zip`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Documentos descargados correctamente",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron descargar los documentos",
        variant: "destructive",
      });
    }
  };
}

function QuotationEditForm({
  quotation,
  onSave,
  onCancel,
}: {
  quotation: QuotationItem;
  onSave: (data: {
    amount: number;
    currency: string;
    exchangeRate: number;
    amountInBs: number;
    swiftBankUSD: number;
    correspondentBankUSD: number;
    swiftBankBs: number;
    correspondentBankBs: number;
    managementServiceBs: number;
    managementServicePercentage: number;
    totalInBs: number;
    validUntil: string;
    terms: string;
    notes: string;
    status: string;
  }) => void;
  onCancel: () => void;
}) {
  // Get tomorrow's date as minimum (to ensure it's always future)
  const getMinimumDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Set time to 00:00 (start of day)
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  // Get minimum date as default validUntil
  const getDefaultValidUntil = () => {
    return getMinimumDate();
  };

  const [formData, setFormData] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const defaultValidUntil = tomorrow.toISOString().slice(0, 16);

    return {
      amount: quotation.amount?.toString() || "",
      currency: quotation.currency || "USD",
      exchangeRate: quotation.exchangeRate?.toString() || "",
      amountInBs: quotation.amountInBs?.toString() || "",
      swiftBankUSD: quotation.swiftBankUSD?.toString() || "",
      correspondentBankUSD: quotation.correspondentBankUSD?.toString() || "",
      swiftBankBs: quotation.swiftBankBs?.toString() || "",
      correspondentBankBs: quotation.correspondentBankBs?.toString() || "",
      managementServiceBs: quotation.managementServiceBs?.toString() || "",
      managementServicePercentage:
        quotation.managementServicePercentage?.toString() || "1.5",
      totalInBs: quotation.totalInBs?.toString() || "",
      validUntil: defaultValidUntil,
      terms: quotation.terms || "",
      notes: quotation.notes || "",
      status: quotation.status,
    };
  });

  const [binancePrice, setBinancePrice] = useState<{
    price: number;
    available: number;
    coverage: number;
    offers: number;
    offers_used?: any[];
  } | null>(null);
  const [isBinanceCollapsed, setIsBinanceCollapsed] = useState(false);
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false);

  // Calculate functions (same as in QuotationGenerator)
  const calculateAmountInBs = useCallback(() => {
    const amount = parseFloat(formData.amount) || 0;
    const exchangeRate = parseFloat(formData.exchangeRate) || 0;
    return amount * exchangeRate;
  }, [formData.amount, formData.exchangeRate]);

  const calculateSwiftBankBs = useCallback(() => {
    const swiftBankUSD = parseFloat(formData.swiftBankUSD) || 0;
    const exchangeRate = parseFloat(formData.exchangeRate) || 0;
    return swiftBankUSD * exchangeRate;
  }, [formData.swiftBankUSD, formData.exchangeRate]);

  const calculateCorrespondentBankBs = useCallback(() => {
    const correspondentBankUSD = parseFloat(formData.correspondentBankUSD) || 0;
    const exchangeRate = parseFloat(formData.exchangeRate) || 0;
    return correspondentBankUSD * exchangeRate;
  }, [formData.correspondentBankUSD, formData.exchangeRate]);

  const calculateManagementServiceBs = useCallback(() => {
    const amountInBs = calculateAmountInBs();
    const percentage = parseFloat(formData.managementServicePercentage) || 0;
    return (amountInBs * percentage) / 100;
  }, [calculateAmountInBs, formData.managementServicePercentage]);

  const calculateTotalInBs = useCallback(() => {
    const amountInBs = calculateAmountInBs();
    const swiftBankBs = calculateSwiftBankBs();
    const correspondentBankBs = calculateCorrespondentBankBs();
    const managementServiceBs = calculateManagementServiceBs();
    return amountInBs + swiftBankBs + correspondentBankBs + managementServiceBs;
  }, [
    calculateAmountInBs,
    calculateSwiftBankBs,
    calculateCorrespondentBankBs,
    calculateManagementServiceBs,
  ]);

  // Update calculated fields when dependencies change
  useEffect(() => {
    const amountInBs = calculateAmountInBs();
    const swiftBankBs = calculateSwiftBankBs();
    const correspondentBankBs = calculateCorrespondentBankBs();
    const managementServiceBs = calculateManagementServiceBs();
    const totalInBs = calculateTotalInBs();

    setFormData((prev) => ({
      ...prev,
      amountInBs: amountInBs.toFixed(2),
      swiftBankBs: swiftBankBs.toFixed(2),
      correspondentBankBs: correspondentBankBs.toFixed(2),
      managementServiceBs: managementServiceBs.toFixed(2),
      totalInBs: totalInBs.toFixed(2),
    }));
  }, [
    calculateAmountInBs,
    calculateSwiftBankBs,
    calculateCorrespondentBankBs,
    calculateManagementServiceBs,
    calculateTotalInBs,
  ]);

  // Function to fetch Binance price for specific amount
  const fetchBinancePrice = async (amount: number) => {
    if (!amount || amount <= 0) {
      setBinancePrice(null);
      return;
    }

    setIsLoadingExchangeRate(true);
    try {
      const response = await fetch(
        `/api/binance/exchange-rate?amount=${amount}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setBinancePrice({
          price: data.data.usdt_bob,
          available: data.data.available_amount,
          coverage: data.data.coverage_percentage,
          offers: data.data.offers_count,
          offers_used: data.data.offers_used || [],
        });

        // Update exchange rate with the fetched price
        setFormData((prev) => ({
          ...prev,
          exchangeRate: data.data.usdt_bob.toString(),
        }));

        // Ensure collapsible stays closed when data is fetched
        setIsBinanceCollapsed(false);
      } else {
        setBinancePrice(null);
      }
    } catch (error) {
      console.error("Error fetching Binance price:", error);
      setBinancePrice(null);
    } finally {
      setIsLoadingExchangeRate(false);
    }
  };

  // Don't auto-fetch Binance price - only show existing data

  const handleSave = () => {
    // Validate date
    const selectedDate = new Date(formData.validUntil);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return; // Don't save if date is invalid
    }

    const amount = parseFloat(formData.amount) || 0;
    const exchangeRate = parseFloat(formData.exchangeRate) || 0;
    const amountInBs = parseFloat(formData.amountInBs) || 0;
    const swiftBankUSD = parseFloat(formData.swiftBankUSD) || 0;
    const correspondentBankUSD = parseFloat(formData.correspondentBankUSD) || 0;
    const swiftBankBs = parseFloat(formData.swiftBankBs) || 0;
    const correspondentBankBs = parseFloat(formData.correspondentBankBs) || 0;
    const managementServiceBs = parseFloat(formData.managementServiceBs) || 0;
    const managementServicePercentage =
      parseFloat(formData.managementServicePercentage) || 0;
    const totalInBs = parseFloat(formData.totalInBs) || 0;

    onSave({
      amount,
      currency: formData.currency,
      exchangeRate,
      amountInBs,
      swiftBankUSD,
      correspondentBankUSD,
      swiftBankBs,
      correspondentBankBs,
      managementServiceBs,
      managementServicePercentage,
      totalInBs,
      validUntil: formData.validUntil,
      terms: formData.terms,
      notes: formData.notes,
      status: formData.status,
    });
  };

  return (
    <div
      className="space-y-4 max-h-[calc(85vh-180px)] overflow-y-auto pr-2"
      data-quotation-edit-form
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editAmount">Monto a Enviar*</Label>
          <Input
            id="editAmount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="editCurrency">Moneda / Tipo de Cambio</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="editCurrency"
                value="USD"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <Input
              id="editExchangeRate"
              type="number"
              step="0.0001"
              value={formData.exchangeRate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  exchangeRate: e.target.value,
                }))
              }
              placeholder="0.0000"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const amount = parseFloat(formData.amount);
                if (amount > 0) {
                  fetchBinancePrice(amount);
                }
              }}
              disabled={isLoadingExchangeRate || !formData.amount}
              className="whitespace-nowrap"
            >
              {isLoadingExchangeRate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Cargando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Obtener
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Obtén el precio promedio desde Binance P2P
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editAmountInBs">
            Monto a Enviar en Bs (Auto-calculado)
          </Label>
          <Input
            id="editAmountInBs"
            type="number"
            step="0.01"
            value={formData.amountInBs}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Calculado automáticamente: Monto × Tipo de Cambio
          </p>
        </div>
      </div>

      {/* Binance P2P Price Display - Only show when user requests it */}
      {binancePrice && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Precio Binance P2P
            </h4>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Actualizado
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Precio Promedio:</p>
                <p className="text-lg font-bold text-blue-900">
                  {binancePrice.price.toFixed(2)} BOB/USDT
                </p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Disponible:</p>
                <p className="text-lg font-bold text-blue-900">
                  {binancePrice.available.toLocaleString()} USDT
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Cobertura:</p>
                <p className="font-medium text-blue-900">
                  {binancePrice.coverage}%
                </p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Ofertas:</p>
                <p className="font-medium text-blue-900">
                  {binancePrice.offers} ofertas
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gastos Financieros Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3 text-blue-600">
          Gastos Financieros
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editSwiftBankUSD">SWIFT Banco (USD)</Label>
            <Input
              id="editSwiftBankUSD"
              type="number"
              step="0.01"
              value={formData.swiftBankUSD}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  swiftBankUSD: e.target.value,
                }))
              }
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="editSwiftBankBs">
              SWIFT Banco (Bs) (Auto-calculado)
            </Label>
            <Input
              id="editSwiftBankBs"
              type="number"
              step="0.01"
              value={formData.swiftBankBs}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculado automáticamente: SWIFT USD × Tipo de Cambio
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="editCorrespondentBankUSD">
              Com. Corresponsal (USD)
            </Label>
            <Input
              id="editCorrespondentBankUSD"
              type="number"
              step="0.01"
              value={formData.correspondentBankUSD}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  correspondentBankUSD: e.target.value,
                }))
              }
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="editCorrespondentBankBs">
              Com. Corresponsal (Bs) (Auto-calculado)
            </Label>
            <Input
              id="editCorrespondentBankBs"
              type="number"
              step="0.01"
              value={formData.correspondentBankBs}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculado automáticamente: Com. USD × Tipo de Cambio
            </p>
          </div>
        </div>
      </div>

      {/* Servicio de Gestión Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3 text-green-600">
          Servicio de Gestión
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editManagementServicePercentage">
              Porcentaje Servicio (%)*
            </Label>
            <Input
              id="editManagementServicePercentage"
              type="number"
              step="0.01"
              value={formData.managementServicePercentage}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  managementServicePercentage: e.target.value,
                }))
              }
              placeholder="1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se aplica solo sobre el monto a enviar en Bs
            </p>
          </div>
          <div>
            <Label htmlFor="editManagementServiceBs">
              Servicio de Gestión (Bs) (Auto-calculado)
            </Label>
            <Input
              id="editManagementServiceBs"
              type="number"
              step="0.01"
              value={formData.managementServiceBs}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculado automáticamente: Monto Bs × Porcentaje / 100
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editTotalInBs">Total en Bs (Auto-calculado)</Label>
          <Input
            id="editTotalInBs"
            type="number"
            step="0.01"
            value={formData.totalInBs}
            readOnly
            className="bg-gray-50 cursor-not-allowed font-semibold"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Calculado automáticamente: Valor Bs + Gasto Bs + Servicio Bs
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="editValidUntil">Válida hasta*</Label>
        <Input
          id="editValidUntil"
          type="datetime-local"
          min={getMinimumDate()}
          value={formData.validUntil}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, validUntil: e.target.value }))
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          La fecha y hora deben ser al menos desde mañana
        </p>
      </div>

      <div>
        <Label htmlFor="editStatus">Estado de la Cotización*</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">
              <div className="flex flex-col items-start">
                <span>Borrador</span>
                <span className="text-xs text-gray-500">
                  Puede ser modificada, no visible para el importador
                </span>
              </div>
            </SelectItem>
            <SelectItem value="SENT">
              <div className="flex flex-col items-start">
                <span>Publicada</span>
                <span className="text-xs text-gray-500">
                  Visible para el importador, lista para revisión
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="editTerms">Términos y Condiciones</Label>
        <Textarea
          id="editTerms"
          value={formData.terms}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, terms: e.target.value }))
          }
          placeholder="Términos y condiciones de la cotización..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="editNotes">Notas Adicionales</Label>
        <Textarea
          id="editNotes"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Notas adicionales para el cliente..."
          rows={2}
        />
      </div>

      {parseFloat(formData.totalInBs) > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h4 className="font-medium text-sm mb-2 text-blue-900">
            Resumen de Cotización
          </h4>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>Monto a Enviar ({formData.currency}):</span>
              <span>{parseFloat(formData.amount || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monto a Enviar (Bs):</span>
              <span>{parseFloat(formData.amountInBs || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SWIFT Banco (Bs):</span>
              <span>{parseFloat(formData.swiftBankBs || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Com. Corresponsal (Bs):</span>
              <span>
                {parseFloat(formData.correspondentBankBs || "0").toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Servicio de Gestión ({formData.managementServicePercentage}%):
              </span>
              <span>
                {parseFloat(formData.managementServiceBs || "0").toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex justify-between font-medium text-blue-900">
                <span>Total en Bs:</span>
                <span>{parseFloat(formData.totalInBs || "0").toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-blue-700">
              Estado:{" "}
              {formData.status === "DRAFT"
                ? "Borrador (no visible para importador)"
                : "Publicada (visible para importador)"}
            </p>
            <p className="text-xs text-blue-700">
              Válida hasta:{" "}
              {format(
                new Date(formData.validUntil),
                "dd/MM/yyyy 'a las' HH:mm",
                {
                  locale: es,
                }
              )}
            </p>
          </div>
        </div>
      )}

      {/* Hidden save button for dialog footer to trigger */}
      <button
        type="button"
        data-save-button
        onClick={handleSave}
        className="hidden"
      >
        Guardar Cambios
      </button>
    </div>
  );
}

export default function AdminSolicitudDetail() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [isForceStatusOpen, setIsForceStatusOpen] = useState(false);
  const [forceStatus, setForceStatus] = useState("");
  const [forceReason, setForceReason] = useState("");
  const [editingQuotation, setEditingQuotation] =
    useState<QuotationItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] =
    useState<QuotationItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data, isLoading, refetch } = useRequest(requestId);
  const { updateRequest, isLoading: isUpdating } = useUpdateRequest();
  const { mutate: downloadPDF, isPending: isDownloading } = useDownloadPDF();
  const { data: historyData, isLoading: isLoadingHistory } =
    useRequestHistory(requestId);

  // Add expiration checking
  const { checkExpiredQuotations, isChecking } = useQuotationExpiry();

  const request = data?.request;
  const companyId = request?.company?.id;
  const { data: userDocumentsData, isLoading: isLoadingUserDocuments } =
    useUserDocuments(requestId, companyId || "");
  const history = historyData || [];

  const handleEditQuotation = (quotation: QuotationItem) => {
    setEditingQuotation(quotation);
    setIsEditDialogOpen(true);
  };

  const handleDeleteQuotation = (quotation: QuotationItem) => {
    setQuotationToDelete(quotation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteQuotation = async () => {
    if (!quotationToDelete) return;

    try {
      const response = await fetch(`/api/quotations/${quotationToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la cotización");
      }

      toast({
        title: "Éxito",
        description: "Cotización eliminada correctamente",
      });

      setIsDeleteDialogOpen(false);
      setQuotationToDelete(null);
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cotización",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuotation = async (updatedData: {
    amount: number;
    currency: string;
    exchangeRate: number;
    amountInBs: number;
    swiftBankUSD: number;
    correspondentBankUSD: number;
    swiftBankBs: number;
    correspondentBankBs: number;
    managementServiceBs: number;
    managementServicePercentage: number;
    totalInBs: number;
    validUntil: string;
    terms: string;
    notes: string;
    status: string;
  }) => {
    if (!editingQuotation) return;

    try {
      const response = await fetch(`/api/quotations/${editingQuotation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la cotización");
      }

      toast({
        title: "Éxito",
        description: "Cotización actualizada correctamente",
      });

      setIsEditDialogOpen(false);
      setEditingQuotation(null);
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cotización",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    downloadPDF(requestId, {
      onSuccess: () => {
        toast({
          title: "Éxito",
          description: "PDF generado y descargado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo generar el PDF",
          variant: "destructive",
        });
      },
    });
  };

  const handleForceStatus = async () => {
    if (!forceStatus || !forceReason.trim()) return;

    updateRequest(
      {
        requestId: request.id,
        data: {
          status: forceStatus,
          reviewNotes: `Estado forzado: ${forceReason}`,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Estado actualizado correctamente",
          });
          setIsForceStatusOpen(false);
          setForceStatus("");
          setForceReason("");
          refetch();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Manual refresh function for the "Verificar Estado" button
  const handleManualStatusCheck = async () => {
    try {
      await checkExpiredQuotations(requestId);
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "Error al verificar estado",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando solicitud...</span>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Solicitud no encontrada
          </h3>
          <p className="text-gray-600 text-center">
            La solicitud que buscas no existe o no tienes permisos para verla.
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const allQuotations = request.quotations || [];
  const expiredQuotations = allQuotations.filter((q: QuotationItem) =>
    isQuotationExpired(q.validUntil)
  );
  const draftQuotations = allQuotations.filter(
    (q: QuotationItem) => q.status === "DRAFT"
  );
  const publishedQuotations = allQuotations.filter(
    (q: QuotationItem) =>
      q.status === "SENT" && !isQuotationExpired(q.validUntil)
  );
  const rejectedQuotations = allQuotations.filter(
    (q: QuotationItem) => q.status === "REJECTED"
  );
  const approvedQuotations = allQuotations.filter(
    (q: QuotationItem) => q.status === "ACCEPTED"
  );

  const hasAcceptedQuotation = approvedQuotations.length > 0;

  // Priority logic: Rejected > Expired (when no active quotes) > Drafts
  const shouldShowRejectionAlert =
    rejectedQuotations.length > 0 && publishedQuotations.length === 0;
  const shouldShowExpirationAlert =
    !shouldShowRejectionAlert &&
    expiredQuotations.length > 0 &&
    publishedQuotations.length === 0;
  const shouldShowApprovalAlert = approvedQuotations.length > 0;

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              SOLICITUD DE IMPORTACIÓN - {request.code}
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {request.id} • Creada el{" "}
              {format(new Date(request.createdAt), "dd/MM/yyyy 'a las' HH:mm", {
                locale: es,
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={request.status} />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <Link href="/admin/solicitudes">
                <ArrowLeft className="h-4 w-4" /> Volver
              </Link>
            </Button>
          </div>
        </div>

        {/* Approval Success Alert */}
        {shouldShowApprovalAlert && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    {approvedQuotations.length === 1
                      ? "Cotización Aprobada"
                      : `${approvedQuotations.length} Cotizaciones Aprobadas`}
                  </h3>
                  <p className="text-sm text-green-800 leading-relaxed mb-3">
                    {approvedQuotations.length === 1
                      ? "La cotización ha sido aprobada por el importador. El proceso puede continuar al siguiente paso."
                      : "Las cotizaciones han sido aprobadas. El proceso puede continuar al siguiente paso."}
                  </p>

                  <div className="space-y-2">
                    {approvedQuotations.map((q: QuotationItem) => (
                      <div
                        key={q.id}
                        className="bg-white/50 rounded-lg p-3 border border-green-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-900">
                              {q.code}
                            </p>
                            <p className="text-sm text-green-700">
                              Monto Aprobado: ${q.amount?.toLocaleString()}{" "}
                              {q.currency}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aprobada
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Alert - Highest Priority */}
        {shouldShowRejectionAlert && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {rejectedQuotations.length === 1
                      ? "Cotización Rechazada"
                      : `${rejectedQuotations.length} Cotizaciones Rechazadas`}
                  </h3>

                  <div className="space-y-3 mb-4">
                    {rejectedQuotations.map((q: QuotationItem) => (
                      <div
                        key={q.id}
                        className="bg-white/50 rounded-lg p-3 border border-red-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-red-900">{q.code}</p>
                            <p className="text-sm text-red-700">
                              Monto: ${q.amount?.toLocaleString()} {q.currency}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rechazada
                            </Badge>
                          </div>
                        </div>
                        {q.rejectionReason && (
                          <div className="bg-red-100/70 rounded p-2 mt-2">
                            <p className="text-xs font-medium text-red-800 mb-1">
                              Motivo del rechazo:
                            </p>
                            <p className="text-sm text-red-700">
                              {q.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/70 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-red-900 mb-2">
                      ¿Qué hacer ahora?
                    </h4>
                    <p className="text-sm text-red-800 leading-relaxed">
                      {rejectedQuotations.length === 1
                        ? "El importador ha rechazado la cotización. Revisa el motivo del rechazo y genera una nueva cotización con los ajustes necesarios."
                        : `Se han rechazado ${rejectedQuotations.length} cotizaciones. Revisa los motivos y genera una nueva cotización que atienda las observaciones del importador.`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <QuotationGenerator
                      requestId={requestId}
                      requestAmount={request.amount}
                      onSuccess={handleManualStatusCheck}
                      variant="compact"
                      disabled={hasAcceptedQuotation}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consolidated Expiration Alert - Only show when necessary */}
        {shouldShowExpirationAlert && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    {expiredQuotations.length === 1
                      ? "Cotización Expirada Detectada"
                      : `${expiredQuotations.length} Cotizaciones Expiradas Detectadas`}
                  </h3>

                  <div className="space-y-3 mb-4">
                    {expiredQuotations.map((q: QuotationItem) => (
                      <div
                        key={q.id}
                        className="bg-white/50 rounded-lg p-3 border border-amber-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-amber-900">
                              {q.code}
                            </p>
                            <p className="text-sm text-amber-700">
                              Monto: ${q.amount?.toLocaleString()} {q.currency}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-amber-800">
                              Expiró el{" "}
                              {format(
                                new Date(q.validUntil),
                                "dd/MM/yyyy 'a las' HH:mm",
                                {
                                  locale: es,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/70 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-amber-900 mb-2">
                      ¿Qué hacer ahora?
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {draftQuotations.length > 0
                        ? `Tienes ${draftQuotations.length} cotización${draftQuotations.length !== 1 ? "es" : ""} en borrador que puedes revisar y publicar, o crear una nueva cotización desde cero.`
                        : "Se recomienda generar una nueva cotización para que el importador pueda continuar con el proceso de importación."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <QuotationGenerator
                      requestId={requestId}
                      requestAmount={request.amount}
                      onSuccess={handleManualStatusCheck}
                      variant="compact"
                      disabled={hasAcceptedQuotation}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Draft Quotations Alert */}
        {draftQuotations.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {draftQuotations.length === 1
                      ? "Cotización en Borrador"
                      : `${draftQuotations.length} Cotizaciones en Borrador`}
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {draftQuotations.length === 1
                      ? "Hay una cotización guardada como borrador que no es visible para el importador. Puedes revisarla y publicarla cuando esté lista."
                      : `Hay ${draftQuotations.length} cotizaciones guardadas como borradores que no son visibles para el importador. Puedes revisarlas y publicarlas cuando estén listas.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>INFORMACIÓN GENERAL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Empresa:</span>
                    <span>{request.company?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">País de destino:</span>
                    <span>{request.provider?.country || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Monto estimado:</span>
                    <span>
                      ${request.amount?.toLocaleString()} {request.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Fecha creación:</span>
                    <span>
                      {format(new Date(request.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado actual:</span>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Proveedor:</span>
                    <span>{request.provider?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Documentos:</span>
                    <span>{request.documents?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Creado por:</span>
                    <span>
                      {request.createdBy
                        ? `${request.createdBy.firstName} ${request.createdBy.lastName}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Descripción:</span>
                <p className="text-gray-700 mt-1">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ACCIONES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Descargar PDF
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleDownloadDocuments(requestId, toast)}
                >
                  <Download className="h-4 w-4" />
                  Descargar Documentos
                </Button>

                <QuotationGenerator
                  requestId={requestId}
                  requestAmount={request.amount}
                  onSuccess={handleManualStatusCheck}
                  disabled={hasAcceptedQuotation}
                />

                <Dialog
                  open={isForceStatusOpen}
                  onOpenChange={setIsForceStatusOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> Forzar Estado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Forzar Estado</DialogTitle>
                      <DialogDescription>
                        Cambiar manualmente el estado de la solicitud.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newStatus">Nuevo Estado</Label>
                        <Select
                          value={forceStatus}
                          onValueChange={setForceStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reason">Razón del cambio</Label>
                        <Textarea
                          id="reason"
                          value={forceReason}
                          onChange={(e) => setForceReason(e.target.value)}
                          placeholder="Explicar por qué se está forzando este estado..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsForceStatusOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleForceStatus}
                        disabled={
                          !forceStatus || !forceReason.trim() || isUpdating
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Aplicar Cambio
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quotations Section - Simplified alerts */}
        {allQuotations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  COTIZACIONES
                  {draftQuotations.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {draftQuotations.length} Borrador
                      {draftQuotations.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {publishedQuotations.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {publishedQuotations.length} Publicada
                      {publishedQuotations.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualStatusCheck}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Verificar Estado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allQuotations.map((quotation: QuotationItem) => {
                  const actualStatus = getQuotationStatusWithExpiry(
                    quotation.status,
                    quotation.validUntil
                  );
                  const isExpired = actualStatus === "EXPIRED";
                  const isDraft = quotation.status === "DRAFT";

                  return (
                    <div
                      key={quotation.id}
                      className={`border rounded-lg p-4 ${
                        isExpired
                          ? "bg-red-50 border-red-200"
                          : isDraft
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          Cotización {quotation.code}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isDraft && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <FileText className="h-3 w-3 mr-1" />
                              Borrador
                            </Badge>
                          )}
                          <Badge
                            className={getQuotationStatusColor(actualStatus)}
                          >
                            {getQuotationStatusLabel(actualStatus)}
                          </Badge>
                          {isExpired && !isDraft && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}

                          {/* Action buttons for draft and sent quotations */}
                          {(quotation.status === "DRAFT" ||
                            quotation.status === "SENT") && (
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditQuotation(quotation)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuotation(quotation)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isDraft && (
                        <div className="mb-3 p-2 bg-blue-100 border border-blue-200 rounded text-sm text-blue-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">
                              Cotización en Borrador
                            </span>
                          </div>
                          <p className="mt-1">
                            Esta cotización no es visible para el importador.
                            Puede ser modificada antes de publicarla.
                          </p>
                        </div>
                      )}

                      {/* Only show expiration warning for non-draft quotations */}
                      {isExpired && !isDraft && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">
                              Cotización Expirada
                            </span>
                          </div>
                          <p className="mt-1">
                            Expiró el{" "}
                            {format(
                              new Date(quotation.validUntil),
                              "dd/MM/yyyy 'a las' HH:mm",
                              { locale: es }
                            )}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Monto Total</p>
                          <p className="font-semibold">
                            ${quotation.amount?.toLocaleString()}{" "}
                            {quotation.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Válida hasta</p>
                          <p
                            className={
                              isExpired && !isDraft
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {format(
                              new Date(quotation.validUntil),
                              "dd/MM/yyyy HH:mm",
                              { locale: es }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fecha de Creación</p>
                          <p>
                            {format(
                              new Date(quotation.createdAt),
                              "dd/MM/yyyy",
                              {
                                locale: es,
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {quotation.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded">
                          <p className="text-sm font-medium text-red-800">
                            Motivo de rechazo:
                          </p>
                          <p className="text-sm text-red-700">
                            {quotation.rejectionReason}
                          </p>
                        </div>
                      )}

                      {quotation.notes && (
                        <div className="mt-2">
                          <p className="text-gray-600 text-sm">Notas:</p>
                          <p className="text-sm">{quotation.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <div>
              {/* Request Documents */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3 text-blue-600">
                  📋 Documentos de la Solicitud
                </h4>
                {request.documents && request.documents.length > 0 ? (
                  <div className="space-y-3">
                    {request.documents.map((document: DocumentItem) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        requestId={request.id}
                        compact={false}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-500 text-center">
                        No hay documentos en esta solicitud
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* User Documents */}
              <div>
                <h4 className="text-md font-medium mb-3 text-green-600">
                  Documentos de la empresa
                </h4>
                {isLoadingUserDocuments ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">
                      Cargando documentos del usuario...
                    </span>
                  </div>
                ) : userDocumentsData?.documents &&
                  userDocumentsData.documents.length > 0 ? (
                  <div className="space-y-3">
                    {userDocumentsData.documents.map((document: any) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        requestId={request.id}
                        compact={true}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-500 text-center">
                        No hay documentos adicionales del usuario
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* History */}
        <Card className="mb-6">
          <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle>HISTORIAL</CardTitle>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isHistoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">
                      Cargando historial...
                    </span>
                  </div>
                ) : (
                  <HistoryTimeline events={history} />
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Documents and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <InternalNotesCard requestId={request.id} />
        </div>
      </div>

      {/* Edit Quotation Dialog */}
      {editingQuotation && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                Editar Cotización {editingQuotation.code}
              </DialogTitle>
              <DialogDescription>
                Modifique los detalles de la cotización.
              </DialogDescription>
            </DialogHeader>
            <QuotationEditForm
              quotation={editingQuotation}
              onSave={handleUpdateQuotation}
              onCancel={() => setIsEditDialogOpen(false)}
            />
            <DialogFooter className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // This will be handled by the QuotationEditForm's handleSave
                  // We need to trigger the save from here
                  const formElement = document.querySelector(
                    "[data-quotation-edit-form]"
                  );
                  if (formElement) {
                    const saveButton =
                      formElement.querySelector("[data-save-button]");
                    if (saveButton) {
                      (saveButton as HTMLButtonElement).click();
                    }
                  }
                }}
                className="flex-1"
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Quotation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cotización</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la cotización{" "}
              {quotationToDelete?.code}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteQuotation}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
