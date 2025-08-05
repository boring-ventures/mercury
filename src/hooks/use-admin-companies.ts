"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Company {
  id: string;
  name: string;
  nit: string;
  companyType: string;
  country: string;
  city: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
    requests: number;
    contracts: number;
  };
}

export interface CompanyWithDetails extends Company {
  users: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
    status: string;
    createdAt: string;
  }>;
  requests: Array<{
    id: string;
    code: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
  _count: {
    users: number;
    requests: number;
    contracts: number;
    documents: number;
  };
}

export interface CompanyListFilters {
  search?: string;
  status?: string;
  companyType?: string;
  activity?: string;
  page?: number;
  limit?: number;
}

export interface CompanyListResponse {
  companies: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCompanyRequest {
  name: string;
  nit: string;
  companyType: string;
  country: string;
  city: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  bankingDetails?: any;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  status?: string;
}

// Fetch companies with filters and pagination
export const useAdminCompanies = (filters: CompanyListFilters = {}) => {
  return useQuery({
    queryKey: ["admin-companies", filters],
    queryFn: async (): Promise<CompanyListResponse> => {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.companyType)
        params.append("companyType", filters.companyType);
      if (filters.activity) params.append("activity", filters.activity);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/admin/companies?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch companies");
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Fetch a specific company by ID
export const useAdminCompany = (id: string) => {
  return useQuery({
    queryKey: ["admin-company", id],
    queryFn: async (): Promise<CompanyWithDetails> => {
      const response = await fetch(`/api/admin/companies/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch company");
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

// Create a new company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyData: CreateCompanyRequest): Promise<Company> => {
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create company");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate companies queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
    },
  });
};

// Update a company
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCompanyRequest;
    }): Promise<Company> => {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update company");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the company in cache
      queryClient.setQueryData(["admin-company", variables.id], data);

      // Invalidate companies list to refetch
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
    },
  });
};

// Delete a company (soft delete)
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete company");
      }

      return response.json();
    },
    onSuccess: (data, id) => {
      // Remove company from cache
      queryClient.removeQueries({ queryKey: ["admin-company", id] });

      // Invalidate companies list to refetch
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
    },
  });
};
