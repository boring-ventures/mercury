import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface RequestFilters {
  status?: string;
  country?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateRequestData {
  amount: number;
  currency?: string;
  description: string;
  providerName: string;
  providerCountry: string;
  providerBankingDetails: string;
  documents?: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    type?: string;
  }>;
}

export interface UpdateRequestData {
  status?: string;
  reviewNotes?: string;
  assignedToId?: string;
  amount?: number;
  description?: string;
}

// Helper function to build query string
function buildQueryString(filters: RequestFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

// Hook for fetching requests list
export function useRequests(filters: RequestFilters = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ["requests", queryString],
    queryFn: async () => {
      const response = await fetch(`/api/requests?${queryString}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching requests");
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
}

// Hook for fetching a single request
export function useRequest(requestId: string) {
  return useQuery({
    queryKey: ["request", requestId],
    queryFn: async () => {
      const response = await fetch(`/api/requests/${requestId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching request");
      }
      return response.json();
    },
    enabled: !!requestId,
    staleTime: 30000, // 30 seconds
  });
}

// Hook for creating a new request
export function useCreateRequest() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: CreateRequestData) => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creating request");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      toast({
        title: "Solicitud creada",
        description: data.message || "La solicitud ha sido creada exitosamente",
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
    createRequest: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for updating a request
export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      requestId,
      data,
    }: {
      requestId: string;
      data: UpdateRequestData;
    }) => {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error updating request");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data, variables) => {
      setIsLoading(false);
      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });

      toast({
        title: "Solicitud actualizada",
        description:
          data.message || "La solicitud ha sido actualizada exitosamente",
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
    updateRequest: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// Hook for deleting a request
export function useDeleteRequest() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error deleting request");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      toast({
        title: "Solicitud eliminada",
        description:
          data.message || "La solicitud ha sido eliminada exitosamente",
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
    deleteRequest: mutation.mutate,
    isLoading: isLoading || mutation.isPending,
    error: mutation.error,
  };
}

// Helper hook for status mapping
export function useRequestStatusConfig() {
  const statusConfig = {
    DRAFT: {
      label: "Borrador",
      color: "bg-gray-100 text-gray-800",
      icon: "FileText",
    },
    PENDING: {
      label: "Cotización",
      color: "bg-yellow-100 text-yellow-800",
      icon: "Clock",
    },
    IN_REVIEW: {
      label: "En Revisión",
      color: "bg-blue-100 text-blue-800",
      icon: "Eye",
    },
    APPROVED: {
      label: "Aprobado",
      color: "bg-green-100 text-green-800",
      icon: "CheckCircle",
    },
    REJECTED: {
      label: "Rechazado",
      color: "bg-red-100 text-red-800",
      icon: "XCircle",
    },
    COMPLETED: {
      label: "Completado",
      color: "bg-green-100 text-green-800",
      icon: "CheckCircle",
    },
    CANCELLED: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
      icon: "XCircle",
    },
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    );
  };

  return { statusConfig, getStatusConfig };
}

// Hook for determining workflow steps
export function useRequestWorkflow() {
  const getWorkflowStep = (request: any): number => {
    // Based on request status and related entities
    if (!request) return 1;

    // Check if has quotations
    const hasQuotation = request.quotations && request.quotations.length > 0;
    const hasActiveQuotation =
      hasQuotation &&
      request.quotations.some(
        (q: any) => q.status === "SENT" || q.status === "ACCEPTED"
      );

    // Check if has contracts
    const hasContract = request.contracts && request.contracts.length > 0;
    const hasActiveContract =
      hasContract && request.contracts.some((c: any) => c.status === "ACTIVE");

    // Check if has payments to provider
    const hasProviderPayment = request.payments && request.payments.length > 0;
    const hasProviderPaymentCompleted =
      hasProviderPayment &&
      request.payments.some(
        (p: any) => p.type === "DEPOSIT" && p.status === "COMPLETED"
      );

    // Check if process is completed
    const isCompleted = request.status === "COMPLETED";

    if (isCompleted) return 5; // Factura Final
    if (hasProviderPaymentCompleted) return 4; // Pago a Proveedor
    if (hasActiveContract) return 3; // Contrato
    if (hasActiveQuotation) return 2; // Cotización
    return 1; // Nueva Solicitud
  };

  const getNextAction = (request: any) => {
    const step = getWorkflowStep(request);
    const actions = {
      1: {
        text: "Esperar Cotización",
        href: `/importador/solicitudes/${request?.code || request?.id}`,
      },
      2: {
        text: "Revisar Cotización",
        href: `/importador/solicitudes/${request?.code || request?.id}/cotizacion`,
      },
      3: {
        text: "Revisar Contrato",
        href: `/importador/solicitudes/${request?.code || request?.id}/contrato`,
      },
      4: {
        text: "Ver Pago Proveedor",
        href: `/importador/solicitudes/${request?.code || request?.id}/pago-proveedor`,
      },
      5: {
        text: "Ver Factura Final",
        href: `/importador/solicitudes/${request?.code || request?.id}/factura-final`,
      },
    };
    return actions[step as keyof typeof actions] || actions[1];
  };

  const getProgress = (request: any): number => {
    const step = getWorkflowStep(request);
    return (step / 5) * 100;
  };

  return {
    getWorkflowStep,
    getNextAction,
    getProgress,
  };
}
