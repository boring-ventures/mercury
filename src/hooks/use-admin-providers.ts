"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Provider {
  id: string;
  name: string;
  country: string;
  bankingDetails: any;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: {
      id: string;
      name: string;
    } | null;
  } | null;
  _count: {
    requests: number;
  };
}

export interface ProviderWithDetails extends Provider {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
    status: string;
    company: {
      id: string;
      name: string;
      nit: string;
    } | null;
  } | null;
  requests: Array<{
    id: string;
    code: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    company: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    requests: number;
  };
}

export interface ProviderListFilters {
  search?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface ProviderListResponse {
  providers: Provider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProviderRequest {
  name: string;
  country: string;
  bankingDetails?: any;
  email?: string;
  phone?: string;
  userId?: string;
}

export interface UpdateProviderRequest extends Partial<CreateProviderRequest> {}

// Fetch providers with filters and pagination
export const useAdminProviders = (filters: ProviderListFilters = {}) => {
  return useQuery({
    queryKey: ["admin-providers", filters],
    queryFn: async (): Promise<ProviderListResponse> => {
      const params = new URLSearchParams();

      if (filters.country) params.append("country", filters.country);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/admin/providers?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch providers");
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Fetch a specific provider by ID
export const useAdminProvider = (id: string) => {
  return useQuery({
    queryKey: ["admin-provider", id],
    queryFn: async (): Promise<ProviderWithDetails> => {
      const response = await fetch(`/api/admin/providers/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch provider");
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

// Create a new provider
export const useCreateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      providerData: CreateProviderRequest
    ): Promise<Provider> => {
      const response = await fetch("/api/admin/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create provider");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate providers queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
  });
};

// Update a provider
export const useUpdateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProviderRequest;
    }): Promise<Provider> => {
      const response = await fetch(`/api/admin/providers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update provider");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the provider in cache
      queryClient.setQueryData(["admin-provider", variables.id], data);

      // Invalidate providers list to refetch
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
  });
};

// Delete a provider
export const useDeleteProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/admin/providers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete provider");
      }

      return response.json();
    },
    onSuccess: (data, id) => {
      // Remove provider from cache
      queryClient.removeQueries({ queryKey: ["admin-provider", id] });

      // Invalidate providers list to refetch
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
  });
};
