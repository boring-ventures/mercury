import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface QuotationExpiryResult {
  checkExpiredQuotations: (requestId: string) => Promise<void>;
  isChecking: boolean;
  hasExpiredQuotations: boolean;
  expiredCount: number;
}

export function useQuotationExpiry(): QuotationExpiryResult {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [hasExpiredQuotations, setHasExpiredQuotations] = useState(false);
  const [expiredCount, setExpiredCount] = useState(0);

  const checkExpiredQuotations = async (requestId: string) => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/quotations/check-expired", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error("Error checking expired quotations");
      }

      const data = await response.json();

      if (data.expiredCount > 0) {
        setHasExpiredQuotations(true);
        setExpiredCount(data.expiredCount);

        toast({
          title: "Cotizaciones Expiradas",
          description: `${data.expiredCount} cotización(es) han expirado y se marcaron automáticamente.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking expired quotations:", error);
      toast({
        title: "Error",
        description: "No se pudo verificar el estado de las cotizaciones",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkExpiredQuotations,
    isChecking,
    hasExpiredQuotations,
    expiredCount,
  };
}

// Utility function to check if a quotation is expired
export function isQuotationExpired(validUntil: string | Date): boolean {
  return new Date() > new Date(validUntil);
}

// Utility function to get quotation status with expiry consideration
export function getQuotationStatusWithExpiry(
  status: string,
  validUntil: string | Date
): string {
  if (
    (status === "DRAFT" || status === "SENT") &&
    isQuotationExpired(validUntil)
  ) {
    return "EXPIRED";
  }
  return status;
}

// Utility function to get status color for quotations
export function getQuotationStatusColor(status: string): string {
  switch (status) {
    case "DRAFT":
      return "bg-orange-100 text-orange-800";
    case "SENT":
      return "bg-blue-100 text-blue-800";
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "EXPIRED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Utility function to get status label for quotations
export function getQuotationStatusLabel(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Borrador";
    case "SENT":
      return "Enviada";
    case "ACCEPTED":
      return "Aprobada";
    case "REJECTED":
      return "Rechazada";
    case "EXPIRED":
      return "Expirada";
    default:
      return status;
  }
}
