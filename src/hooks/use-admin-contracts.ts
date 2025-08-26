import { useQuery } from "@tanstack/react-query";

export interface ContractFilters {
  status?: string;
  currency?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminContractItem {
  id: string;
  code: string;
  title: string;
  status: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  signedAt?: string;
  createdAt: string;
  request?: {
    id: string;
    code: string;
    company: {
      name: string;
    };
  };
  quotation?: {
    id: string;
    code: string;
  };
  createdBy: {
    firstName: string;
    lastName: string;
  };
  company: {
    name: string;
  };
}

export interface ContractsResponse {
  contracts: AdminContractItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useAdminContracts(filters: ContractFilters = {}) {
  const {
    status = "todos",
    currency = "todos",
    search = "",
    page = 1,
    limit = 10,
  } = filters;

  return useQuery<ContractsResponse>({
    queryKey: ["admin-contracts", { status, currency, search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== "todos" && { status }),
        ...(currency !== "todos" && { currency }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/contracts?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useContractStatusConfig() {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Borrador",
          variant: "secondary" as const,
          icon: "FileText",
        };
      case "ACTIVE":
        return {
          label: "Activo",
          variant: "default" as const,
          icon: "Play",
        };
      case "COMPLETED":
        return {
          label: "Completado",
          variant: "default" as const,
          icon: "CheckSquare",
        };
      case "CANCELLED":
        return {
          label: "Cancelado",
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

export interface AdminContractDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  signedAt: string | null;
  terms: string;
  conditions: string | null;
  createdAt: string;
  additionalData?: {
    companyData?: any;
    contactData?: any;
    providerData?: any;
  };
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
    provider?: {
      name: string;
      country: string;
      email: string;
      phone: string;
      bankingDetails: any;
    } | null;
  } | null;
  quotation: {
    id: string;
    code: string;
    amount: number;
    currency: string;
  } | null;
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

export function useAdminContract(id?: string) {
  return useQuery<{ contract: AdminContractDetail }>({
    queryKey: ["admin-contract", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/contracts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch contract");
      return res.json();
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
