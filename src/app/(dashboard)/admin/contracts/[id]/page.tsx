"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Eye,
  XCircle,
  CheckCircle,
  FileText,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Building,
  User,
  Download,
  Edit,
  Trash2,
  Package,
  FileSignature,
  Play,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { useAdminContract } from "@/hooks/use-admin-contracts";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ContractPreview from "@/components/admin/contracts/contract-preview";
import { ContractDateEdit } from "@/components/admin/contracts/contract-date-edit";
import { ContractCompletionForm } from "@/components/admin/contracts/contract-completion-form";

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Borrador",
          variant: "secondary" as const,
          icon: "FileText",
        };
      case "ACTIVE":
        return {
          label: "Activo",
          variant: "default" as const,
          icon: "Play",
        };
      case "COMPLETED":
        return {
          label: "Completado",
          variant: "default" as const,
          icon: "CheckSquare",
        };
      case "CANCELLED":
        return {
          label: "Cancelado",
          variant: "destructive" as const,
          icon: "XCircle",
        };
      case "EXPIRED":
        return {
          label: "Expirado",
          variant: "secondary" as const,
          icon: "AlertTriangle",
        };
      default:
        return {
          label: status,
          variant: "secondary" as const,
          icon: "Clock",
        };
    }
  };

  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (config.icon) {
      case "Clock":
        return <Clock className="h-3 w-3 mr-1" />;
      case "DollarSign":
        return <DollarSign className="h-3 w-3 mr-1" />;
      case "Eye":
        return <Eye className="h-3 w-3 mr-1" />;
      case "CheckCircle":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "XCircle":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "FileText":
        return <FileText className="h-3 w-3 mr-1" />;
      case "AlertCircle":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "AlertTriangle":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "Play":
        return <Play className="h-3 w-3 mr-1" />;
      case "CheckSquare":
        return <CheckSquare className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant={config.variant} className="flex items-center">
      {getIcon()}
      {config.label}
    </Badge>
  );
}

function isExpired(endDate: string): boolean {
  return new Date(endDate) < new Date();
}

export default function AdminContractDetail() {
  const params = useParams();
  const contractId = params.id as string;
  const { data, isLoading, error } = useAdminContract(contractId);
  const contract = data?.contract;

  const [isActivating, setIsActivating] = useState(false);
  const [showDateEdit, setShowDateEdit] = useState(false);

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      const res = await fetch("/api/admin/contracts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contractId, status: "ACTIVE" }),
      });
      if (!res.ok) throw new Error("Failed to activate contract");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/contracts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contrato</h1>
              <p className="text-muted-foreground">Cargando detalles...</p>
            </div>
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/contracts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contrato</h1>
              <p className="text-muted-foreground">
                No se pudo cargar el contrato
              </p>
            </div>
          </div>
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/contracts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contrato {contract.code}
            </h1>
            <p className="text-muted-foreground">{contract.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={contract.status} />
          {isExpired(contract.endDate) && (
            <Badge variant="destructive" className="text-xs">
              Expirado
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Código
                  </label>
                  <p className="text-lg font-medium">{contract.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={contract.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Monto
                  </label>
                  <p className="text-lg font-medium">
                    {formatCurrency(contract.amount, contract.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Período
                  </label>
                  <p className="text-lg font-medium">
                    {format(new Date(contract.startDate), "dd/MM/yyyy", {
                      locale: es,
                    })}{" "}
                    -{" "}
                    {format(new Date(contract.endDate), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Firma
                  </label>
                  <p className="text-lg font-medium">
                    {contract.signedAt
                      ? format(new Date(contract.signedAt), "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "No firmado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </label>
                  <p className="text-lg font-medium">
                    {format(new Date(contract.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{contract.description}</p>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Términos
                </label>
                <p className="text-sm mt-1">{contract.terms}</p>
              </div>
              {contract.conditions && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Condiciones Especiales
                  </label>
                  <p className="text-sm mt-1">{contract.conditions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Preview */}
          {(() => {
            console.log(
              "Admin Contract Detail - Contract data being passed to preview:",
              contract
            );
            return <ContractPreview contract={contract} />;
          })()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Solicitud Relacionada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Código
                </label>
                <p className="text-sm font-medium">
                  {contract.request?.code || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-sm">
                  {contract.request?.description || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto
                </label>
                <p className="text-sm">
                  {formatCurrency(
                    contract.request?.amount,
                    contract.request?.currency
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cotización Relacionada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Código
                </label>
                <p className="text-sm font-medium">
                  {contract.quotation?.code}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto
                </label>
                <p className="text-sm">
                  {formatCurrency(
                    contract.quotation?.amount,
                    contract.quotation?.currency
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-sm font-medium">{contract.company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  País
                </label>
                <p className="text-sm">{contract.company.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{contract.request?.company.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <p className="text-sm">{contract.request?.company.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Creado por
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-sm font-medium">
                  {contract.createdBy.firstName} {contract.createdBy.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{contract.createdBy.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="text-sm">
                  {format(new Date(contract.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/contracts/${contractId}/docx`
                    );
                    if (!res.ok) throw new Error("No se pudo generar el DOCX");
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `contrato-${contract?.code || contractId}.docx`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar DOCX
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowDateEdit(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Fechas
              </Button>
              <Button className="w-full" variant="outline" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>

              <Button
                className="w-full"
                onClick={handleActivate}
                disabled={isActivating}
              >
                <Play className="h-4 w-4 mr-2" />
                {isActivating ? "Activando..." : "Activar contrato"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contract Completion Form - Only show for ACTIVE contracts */}
        {contract && contract.status === "ACTIVE" && (
          <div className="mt-6">
            <ContractCompletionForm
              contractId={contract.id}
              contractCode={contract.code}
              currentStartDate={contract.startDate}
              currentEndDate={contract.endDate}
              onCompleted={() => {
                // Refresh the page to show updated status
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>

      {/* Contract Date Edit Modal */}
      {contract && showDateEdit && (
        <ContractDateEdit
          contract={{
            id: contract.id,
            code: contract.code,
            startDate: contract.startDate,
            endDate: contract.endDate,
          }}
          isOpen={showDateEdit}
          onClose={() => setShowDateEdit(false)}
          onSave={() => {
            // Refresh the contract data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
