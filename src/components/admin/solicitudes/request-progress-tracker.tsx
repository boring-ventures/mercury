"use client";

import { CheckCircle, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RequestProgressTrackerProps {
  status: string;
  quotations?: Array<{
    id: string;
    status: string;
  }>;
  contracts?: Array<{
    id: string;
    status: string;
  }>;
  payments?: Array<{
    id: string;
    status: string;
    type: string;
  }>;
}

interface ProgressStep {
  key: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

export function RequestProgressTracker({
  status,
  quotations,
  contracts,
  payments,
}: RequestProgressTrackerProps) {
  // Determinar el estado de cada paso basado en los datos de la solicitud
  const getProgressSteps = (): ProgressStep[] => {
    // 1. Nueva solicitud - siempre está completada si existe la solicitud
    const newRequestCompleted = true;

    // 2. Cotización - completada si hay al menos una cotización aceptada
    const hasAcceptedQuotation = quotations?.some(
      (q) => q.status === "ACCEPTED"
    );

    // 3. Contrato - completado si hay al menos un contrato con estado apropiado
    const hasContract = contracts?.some(
      (c) =>
        c.status === "SIGNED" ||
        c.status === "ACTIVE" ||
        c.status === "PAYMENT_PENDING" ||
        c.status === "PAYMENT_REVIEWED" ||
        c.status === "PROVIDER_PAID" ||
        c.status === "PAYMENT_COMPLETED" ||
        c.status === "COMPLETED"
    );

    // 4. Pago a proveedor - completado si hay al menos un pago al proveedor confirmado
    const hasProviderPayment = payments?.some(
      (p) =>
        p.type === "PROVIDER_PAYMENT" &&
        (p.status === "CONFIRMED" || p.status === "COMPLETED")
    ) || contracts?.some(
      (c) =>
        c.status === "PROVIDER_PAID" ||
        c.status === "PAYMENT_COMPLETED" ||
        c.status === "COMPLETED"
    );

    // 5. Factura Final - completada si el proceso está completado o hay factura final
    const hasFinalInvoice = status === "COMPLETED" || payments?.some(
      (p) =>
        p.type === "FINAL_INVOICE" &&
        (p.status === "ISSUED" || p.status === "PAID" || p.status === "COMPLETED")
    );

    return [
      {
        key: "new-request",
        label: "Nueva solicitud",
        completed: newRequestCompleted,
      },
      {
        key: "quotation",
        label: "Cotización",
        completed: hasAcceptedQuotation || false,
      },
      {
        key: "contract",
        label: "Contrato",
        completed: hasContract || false,
      },
      {
        key: "provider-payment",
        label: "Pago a proveedor",
        completed: hasProviderPayment || false,
      },
      {
        key: "final-invoice",
        label: "Factura Final",
        completed: hasFinalInvoice || false,
      },
    ];
  };

  const steps = getProgressSteps();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        {steps.map((step, index) => (
          <Tooltip key={step.key}>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 fill-green-100" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
                {index < steps.length - 1 && (
                  <div
                    className={`w-2 h-0.5 mx-0.5 ${
                      step.completed ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-medium">{step.label}</p>
              <p className="text-xs text-gray-500">
                {step.completed ? "Completado" : "Pendiente"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
