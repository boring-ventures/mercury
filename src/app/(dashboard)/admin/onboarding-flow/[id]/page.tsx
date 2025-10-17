"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  FileText,
  DollarSign,
  Building2,
  Banknote,
  Receipt,
  Loader2,
  Package,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRequest } from "@/hooks/use-requests";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Workflow steps for onboarding flow
const WORKFLOW_STEPS = [
  {
    id: 1,
    name: "Solicitud",
    icon: FileText,
    description: "Información de la solicitud",
  },
  {
    id: 2,
    name: "Cotización",
    icon: DollarSign,
    description: "Crear cotización",
  },
  {
    id: 3,
    name: "Contrato",
    icon: Building2,
    description: "Gestionar contrato",
  },
  {
    id: 4,
    name: "Pago Proveedor",
    icon: Banknote,
    description: "Documentos de pago",
  },
  {
    id: 5,
    name: "Factura Final",
    icon: Receipt,
    description: "Factura del servicio",
  },
];

function WorkflowStepTracker({
  currentStep,
  onStepClick,
  quotations,
  contracts,
  payments,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
  quotations?: Array<{ id: string; status: string }>;
  contracts?: Array<{ id: string; status: string }>;
  payments?: Array<{ id: string; status: string; type: string }>;
}) {
  // Determine if each step is completed
  const getStepStatus = (stepId: number) => {
    switch (stepId) {
      case 1:
        return true; // Always completed if request exists
      case 2:
        return quotations?.some((q) => q.status === "ACCEPTED") || false;
      case 3:
        return (
          contracts?.some(
            (c) =>
              c.status === "SIGNED" ||
              c.status === "ACTIVE" ||
              c.status === "PAYMENT_PENDING" ||
              c.status === "PAYMENT_REVIEWED" ||
              c.status === "PROVIDER_PAID" ||
              c.status === "PAYMENT_COMPLETED" ||
              c.status === "COMPLETED"
          ) || false
        );
      case 4:
        return (
          payments?.some(
            (p) =>
              p.type === "PARTIAL" &&
              (p.status === "COMPLETED" || p.status === "IN_PROGRESS")
          ) ||
          contracts?.some(
            (c) =>
              c.status === "PROVIDER_PAID" || c.status === "PAYMENT_COMPLETED"
          ) ||
          false
        );
      case 5:
        return (
          payments?.some(
            (p) =>
              p.type === "FINAL" &&
              (p.status === "COMPLETED" || p.status === "IN_PROGRESS")
          ) || false
        );
      default:
        return false;
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-lg border">
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = getStepStatus(step.id);
        const isCurrent = currentStep === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepClick(step.id)}
              className="flex flex-col items-center hover:scale-105 transition-transform"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </button>
            {index < WORKFLOW_STEPS.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-2",
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Import step components (we'll create these next)
import RequestStepView from "@/components/admin/onboarding-flow/request-step-view";
import QuotationStepView from "@/components/admin/onboarding-flow/quotation-step-view";
import ContractStepView from "@/components/admin/onboarding-flow/contract-step-view";
import ProviderPaymentStepView from "@/components/admin/onboarding-flow/provider-payment-step-view";
import FinalInvoiceStepView from "@/components/admin/onboarding-flow/final-invoice-step-view";

export default function OnboardingFlowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const { data, isLoading, refetch } = useRequest(requestId);

  const request = data?.request;

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando flujo...</span>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Flujo no encontrado
          </h3>
          <p className="text-gray-600 text-center mb-4">
            El flujo de adaptación que buscas no existe.
          </p>
          <Button onClick={() => router.push("/admin/onboarding-flow")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Flujos
          </Button>
        </div>
      </div>
    );
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RequestStepView request={request} onUpdate={refetch} />;
      case 2:
        return (
          <QuotationStepView
            request={request}
            onUpdate={refetch}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <ContractStepView
            request={request}
            onUpdate={refetch}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <ProviderPaymentStepView
            request={request}
            onUpdate={refetch}
            onNext={() => setCurrentStep(5)}
          />
        );
      case 5:
        return <FinalInvoiceStepView request={request} onUpdate={refetch} />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/onboarding-flow")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Flujo de Adaptación - {request.code}
              </h1>
              <p className="text-gray-600">
                Gestiona todos los pasos del proceso de onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Empresa</p>
                  <p className="font-medium">
                    {request.company?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Monto</p>
                  <p className="font-medium">
                    {formatCurrency(request.amount, request.currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Creado</p>
                  <p className="font-medium">
                    {format(new Date(request.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Proveedor</p>
                  <p className="font-medium">
                    {request.provider?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Tracker */}
        <WorkflowStepTracker
          currentStep={currentStep}
          onStepClick={handleStepClick}
          quotations={request.quotations}
          contracts={request.contracts}
          payments={request.payments}
        />

        {/* Step Content */}
        <div className="min-h-[400px]">{renderStepContent()}</div>
      </div>
    </div>
  );
}
