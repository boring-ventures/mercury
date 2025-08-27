import { useQuery } from "@tanstack/react-query";

export interface QuotationFilters {
  status?: string;
  currency?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminQuotationItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  totalInBs: number;
  validUntil: string;
  createdAt: string;
  request: {
    id: string;
    code: string;
    company: {
      name: string;
    };
  };
  createdBy: {
    firstName: string;
    lastName: string;
  };
  company: {
    name: string;
  };
}

export interface QuotationsResponse {
  quotations: AdminQuotationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useAdminQuotations(filters: QuotationFilters = {}) {
  const {
    status = "todos",
    currency = "todos",
    search = "",
    page = 1,
    limit = 10,
  } = filters;

  return useQuery<QuotationsResponse>({
    queryKey: ["admin-quotations", { status, currency, search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== "todos" && { status }),
        ...(currency !== "todos" && { currency }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/quotations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quotations");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useQuotationStatusConfig() {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Borrador",
          variant: "secondary" as const,
          icon: "FileText",
        };
      case "SENT":
        return {
          label: "Enviado",
          variant: "default" as const,
          icon: "Clock",
        };
      case "ACCEPTED":
        return {
          label: "Aceptado",
          variant: "default" as const,
          icon: "CheckCircle",
        };
      case "REJECTED":
        return {
          label: "Rechazado",
          variant: "destructive" as const,
          icon: "XCircle",
        };
      case "EXPIRED":
        return {
          label: "Expirado",
          variant: "secondary" as const,
          icon: "AlertTriangle",
        };
      default:
        return {
          label: status,
          variant: "secondary" as const,
          icon: "Clock",
        };
    }
  };

  return { getStatusConfig };
}

export interface AdminQuotationDetail {
  id: string;
  code: string;
  status: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  amountInBs: number;
  swiftBankUSD: number | string;
  correspondentBankUSD: number | string;
  swiftBankBs: number | string;
  correspondentBankBs: number | string;
  managementServiceBs: number;
  managementServicePercentage: number;
  totalInBs: number;
  validUntil: string;
  terms: string | null;
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  request: {
    id: string;
    code: string;
    description: string;
    amount: number;
    currency: string;
    company: {
      name: string;
      country: string;
      email: string;
      phone: string;
    };
  };
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  company: {
    name: string;
    country: string;
  };
}

export function useAdminQuotation(id?: string) {
  return useQuery<{ quotation: AdminQuotationDetail }>({
    queryKey: ["admin-quotation", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/quotations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch quotation");
      return res.json();
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
