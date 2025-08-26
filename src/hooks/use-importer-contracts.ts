import { useQuery } from "@tanstack/react-query";

interface Contract {
  id: string;
  code: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  terms: string;
  conditions?: string;
  additionalData?: any;
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  requestId?: string;
  quotationId?: string;
  companyId: string;
  createdById: string;
  assignedToId?: string;
  company: {
    id: string;
    name: string;
    country: string;
    city: string;
    email: string;
    phone: string;
  };
  createdBy: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  quotation?: {
    id: string;
    code: string;
    amount: number;
    currency: string;
  };
  request?: {
    id: string;
    code: string;
    description: string;
    amount: number;
    currency: string;
  };
}

interface UseImporterContractsReturn {
  contracts: Contract[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useImporterContracts(): UseImporterContractsReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["importer-contracts"],
    queryFn: async (): Promise<Contract[]> => {
      const response = await fetch("/api/importador/contracts");

      if (!response.ok) {
        throw new Error("Error al cargar contratos");
      }

      const result = await response.json();
      return result.contracts || [];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    contracts: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
