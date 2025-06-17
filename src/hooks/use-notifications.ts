import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  NotificationFilters,
  CreateNotificationData,
  UpdateNotificationData,
} from "@/types/notifications";

// Helper function to build query string
function buildNotificationQueryString(filters: NotificationFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

// Hook for fetching notifications list
export function useNotifications(filters: NotificationFilters = {}) {
  const queryString = buildNotificationQueryString(filters);

  return useQuery({
    queryKey: ["notifications", queryString],
    queryFn: async () => {
      const response = await fetch(`/api/notifications?${queryString}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching notifications");
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time feel
  });
}

// Hook for fetching notification statistics
export function useNotificationStats() {
  return useQuery({
    queryKey: ["notification-stats"],
    queryFn: async () => {
      const response = await fetch("/api/notifications/stats");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching notification stats");
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

// Hook for creating a new notification (admin only)
export function useCreateNotification() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: CreateNotificationData) => {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creating notification");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] });

      toast({
        title: "Notificación creada",
        description:
          data.message || "La notificación ha sido creada exitosamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createNotification: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for updating a notification
export function useUpdateNotification() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      notificationId,
      data,
    }: {
      notificationId: string;
      data: UpdateNotificationData;
    }) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error updating notification");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] });

      // Don't show toast for read updates to avoid spam
      if (!data.data?.read) {
        toast({
          title: "Notificación actualizada",
          description:
            data.message || "La notificación ha sido actualizada exitosamente",
          variant: "default",
        });
      }
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateNotification: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for marking notifications as read
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      notificationIds,
      markAll,
    }: {
      notificationIds?: string[];
      markAll?: boolean;
    }) => {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds, markAll }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error marking notifications as read");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] });

      toast({
        title: "Notificaciones marcadas",
        description:
          data.message || "Las notificaciones han sido marcadas como leídas",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    markAsRead: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for deleting a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error deleting notification");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] });

      toast({
        title: "Notificación eliminada",
        description:
          data.message || "La notificación ha sido eliminada exitosamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    deleteNotification: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for getting unread notification count (for header badge)
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notification-stats"],
    queryFn: async () => {
      const response = await fetch("/api/notifications/stats");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching notification stats");
      }
      const data = await response.json();
      return data.unread || 0;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    select: (data) => data, // Return just the unread count
  });
}
