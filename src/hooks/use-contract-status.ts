import { useQuery } from "@tanstack/react-query";

interface ContractStatus {
  exists: boolean;
  contractId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export function useContractStatus(quotationId: string) {
  return useQuery({
    queryKey: ["contract-status", quotationId],
    queryFn: async (): Promise<ContractStatus> => {
      if (!quotationId) {
        return { exists: false };
      }

      try {
        const response = await fetch(
          `/api/contracts/by-quotation/${quotationId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            return { exists: false };
          }
          throw new Error("Failed to fetch contract status");
        }

        const data = await response.json();
        return {
          exists: true,
          contractId: data.contract.id,
          startDate: data.contract.startDate,
          endDate: data.contract.endDate,
          status: data.contract.status,
        };
      } catch (error) {
        console.error("Error fetching contract status:", error);
        return { exists: false };
      }
    },
    enabled: !!quotationId,
  });
}
