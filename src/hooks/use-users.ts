"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UserListFilters,
  UserListResponse,
  UserWithDetails,
  CreateUserRequest,
  UpdateUserRequest,
  UserStats,
} from "@/types/users";

// Fetch users with filters and pagination
export const useUsers = (filters: UserListFilters = {}) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async (): Promise<UserListResponse> => {
      const params = new URLSearchParams();

      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.companyId) params.append("companyId", filters.companyId);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/users?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch users");
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Fetch a specific user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<UserWithDetails> => {
      const response = await fetch(`/api/users/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

// Fetch user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: async (): Promise<UserStats> => {
      const response = await fetch("/api/users/stats");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch user stats");
      }

      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userData: CreateUserRequest
    ): Promise<UserWithDetails> => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate users queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};

// Update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserRequest;
    }): Promise<UserWithDetails> => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the user in cache
      queryClient.setQueryData(["user", variables.id], data);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};

// Delete a user (soft delete)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      return response.json();
    },
    onSuccess: (data, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ["user", id] });

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};

// Bulk update users status
export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userIds,
      updates,
    }: {
      userIds: string[];
      updates: Partial<UpdateUserRequest>;
    }): Promise<{ message: string; updatedCount: number }> => {
      const promises = userIds.map((id) =>
        fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        })
      );

      const responses = await Promise.all(promises);

      // Check if all requests succeeded
      const failedRequests = responses.filter((response) => !response.ok);
      if (failedRequests.length > 0) {
        throw new Error(`Failed to update ${failedRequests.length} users`);
      }

      return {
        message: "Users updated successfully",
        updatedCount: userIds.length,
      };
    },
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};
