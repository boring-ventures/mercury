import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook for updating document status
export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      docId,
      status,
      reviewNotes,
    }: {
      requestId: string;
      docId: string;
      status: string;
      reviewNotes?: string;
    }) => {
      const response = await fetch(
        `/api/requests/${requestId}/documents/${docId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, reviewNotes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update document status");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate request query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },
  });
}

// Hook for fetching internal notes
export function useInternalNotes(requestId: string) {
  return useQuery({
    queryKey: ["internal-notes", requestId],
    queryFn: async () => {
      const response = await fetch(`/api/requests/${requestId}/notes`);

      if (!response.ok) {
        throw new Error("Failed to fetch internal notes");
      }

      return response.json();
    },
    enabled: !!requestId,
  });
}

// Hook for adding internal notes
export function useAddInternalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      content,
    }: {
      requestId: string;
      content: string;
    }) => {
      const response = await fetch(`/api/requests/${requestId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add internal note");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate notes query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["internal-notes", variables.requestId],
      });
    },
  });
}

// Hook for downloading PDF
export function useDownloadPDF() {
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/requests/${requestId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `solicitud_${requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    },
  });
}

// Hook for fetching audit logs/history
export function useRequestHistory(requestId: string) {
  return useQuery({
    queryKey: ["request-history", requestId],
    queryFn: async () => {
      // This would typically be a separate API endpoint
      // For now, we'll generate history from the request data
      const response = await fetch(`/api/requests/${requestId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch request history");
      }

      const data = await response.json();
      return generateHistoryFromRequest(data.request);
    },
    enabled: !!requestId,
  });
}

// Helper function to generate history from request data
function generateHistoryFromRequest(request: any) {
  if (!request) return [];

  const events = [];

  // Creation event
  events.push({
    date: request.createdAt,
    description: "Solicitud creada",
    user: request.createdBy
      ? `${request.createdBy.firstName} ${request.createdBy.lastName}`
      : "Sistema",
    type: "creation",
  });

  // Documents uploaded
  if (request.documents && request.documents.length > 0) {
    request.documents.forEach((document: any) => {
      events.push({
        date: document.createdAt,
        description: `Documento cargado: ${document.filename}`,
        user: "Cliente",
        type: "document",
      });

      if (document.reviewedAt) {
        events.push({
          date: document.reviewedAt,
          description: `Documento ${document.status.toLowerCase()}: ${document.filename}`,
          user: "Administrador",
          type: "document_review",
        });
      }
    });
  }

  // Status changes
  if (request.reviewedAt) {
    events.push({
      date: request.reviewedAt,
      description: `Estado cambiado a ${getStatusLabel(request.status)}`,
      user: "Administrador",
      type: "status_change",
    });
  }

  // Quotations
  if (request.quotations && request.quotations.length > 0) {
    request.quotations.forEach((quotation: any) => {
      events.push({
        date: quotation.createdAt,
        description: `Cotización generada: ${quotation.code}`,
        user: "Administrador",
        type: "quotation",
      });

      if (quotation.sentAt) {
        events.push({
          date: quotation.sentAt,
          description: `Cotización enviada: ${quotation.code}`,
          user: "Administrador",
          type: "quotation_sent",
        });
      }
    });
  }

  // Contracts
  if (request.contracts && request.contracts.length > 0) {
    request.contracts.forEach((contract: any) => {
      events.push({
        date: contract.createdAt,
        description: `Contrato creado: ${contract.code}`,
        user: "Administrador",
        type: "contract",
      });

      if (contract.signedAt) {
        events.push({
          date: contract.signedAt,
          description: `Contrato firmado: ${contract.code}`,
          user: "Cliente",
          type: "contract_signed",
        });
      }
    });
  }

  // Payments
  if (request.payments && request.payments.length > 0) {
    request.payments.forEach((payment: any) => {
      events.push({
        date: payment.createdAt,
        description: `Pago registrado: ${payment.code}`,
        user: "Administrador",
        type: "payment",
      });

      if (payment.paidAt) {
        events.push({
          date: payment.paidAt,
          description: `Pago completado: ${payment.code}`,
          user: "Sistema",
          type: "payment_completed",
        });
      }
    });
  }

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Helper function to get status label
function getStatusLabel(status: string) {
  const statusLabels: { [key: string]: string } = {
    DRAFT: "Borrador",
    PENDING: "Cotización",
    IN_REVIEW: "En Revisión",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };
  return statusLabels[status] || status;
}
