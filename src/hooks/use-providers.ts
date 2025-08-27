import { useQuery } from "@tanstack/react-query";

interface Provider {
  id: string;
  name: string;
  country: string;
  bankingDetails: {
    bankName?: string;
    accountNumber?: string;
    swiftCode?: string;
    bankAddress?: string;
    beneficiaryName?: string;
  } | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

interface ProvidersResponse {
  providers: Provider[];
}

export const useProviders = () => {
  return useQuery<ProvidersResponse>({
    queryKey: ["providers"],
    queryFn: async () => {
      const response = await fetch("/api/providers");
      if (!response.ok) {
        throw new Error("Failed to fetch providers");
      }
      return response.json();
    },
  });
};
