"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Borrador",
          variant: "secondary" as const,
          icon: "FileText",
        };
      case "SENT":
        return {
          label: "Enviado",
          variant: "default" as const,
          icon: "Clock",
        };
      case "ACCEPTED":
        return {
          label: "Aceptado",
          variant: "default" as const,
          icon: "CheckCircle",
        };
      case "REJECTED":
        return {
          label: "Rechazado",
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

function isExpired(validUntil: string): boolean {
  return new Date(validUntil) < new Date();
}

export default function AdminQuotationDetail() {
  const params = useParams();
  const quotationId = params.id as string;

  // Mock data - replace with actual API call
  const quotation = {
    id: quotationId,
    code: "COT-001",
    status: "SENT",
    amount: 50000,
    currency: "USD",
    exchangeRate: 6.9,
    amountInBs: 345000,
    swiftBankUSD: "CHASUS33",
    correspondentBankUSD: "Bank of America",
    swiftBankBs: "BANCOBOL",
    correspondentBankBs: "Banco de Bolivia",
    managementServiceBs: 5000,
    managementServicePercentage: 1.45,
    totalInBs: 350000,
    validUntil: "2025-01-15",
    terms: "Pago al contado, entrega en 30 días",
    notes: "Cotización válida hasta la fecha indicada",
    rejectionReason: null,
    createdAt: "2025-01-10T10:00:00Z",
    request: {
      id: "req-1",
      code: "SH-001",
      description: "Importación de maquinaria industrial",
      amount: 50000,
      currency: "USD",
      company: {
        name: "Empresa A",
        country: "Bolivia",
        email: "contacto@empresaa.com",
        phone: "+591 2 123456",
      },
    },
    createdBy: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@mercury.com",
    },
    company: {
      name: "Empresa A",
      country: "Bolivia",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Cotización {quotation.code}
            </h1>
            <p className="text-muted-foreground">Detalles de la cotización</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={quotation.status} />
          {isExpired(quotation.validUntil) && (
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
                  <p className="text-lg font-medium">{quotation.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={quotation.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Monto
                  </label>
                  <p className="text-lg font-medium">
                    {quotation.amount.toLocaleString()} {quotation.currency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total en Bs
                  </label>
                  <p className="text-lg font-medium">
                    {quotation.totalInBs.toLocaleString()} Bs
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Cambio
                  </label>
                  <p className="text-lg font-medium">
                    {quotation.exchangeRate}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Válido hasta
                  </label>
                  <p className="text-lg font-medium">
                    {format(new Date(quotation.validUntil), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles Bancarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    SWIFT Bank USD
                  </label>
                  <p className="text-sm">{quotation.swiftBankUSD}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Banco Corresponsal USD
                  </label>
                  <p className="text-sm">{quotation.correspondentBankUSD}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    SWIFT Bank Bs
                  </label>
                  <p className="text-sm">{quotation.swiftBankBs}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Banco Corresponsal Bs
                  </label>
                  <p className="text-sm">{quotation.correspondentBankBs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Términos
                </label>
                <p className="text-sm mt-1">{quotation.terms}</p>
              </div>
              {quotation.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notas
                  </label>
                  <p className="text-sm mt-1">{quotation.notes}</p>
                </div>
              )}
              {quotation.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-destructive">
                    Motivo de Rechazo
                  </label>
                  <p className="text-sm mt-1 text-destructive">
                    {quotation.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
                <p className="text-sm font-medium">{quotation.request.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-sm">{quotation.request.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto
                </label>
                <p className="text-sm">
                  {quotation.request.amount.toLocaleString()}{" "}
                  {quotation.request.currency}
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
                <p className="text-sm font-medium">{quotation.company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  País
                </label>
                <p className="text-sm">{quotation.company.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{quotation.request.company.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <p className="text-sm">{quotation.request.company.phone}</p>
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
                  {quotation.createdBy.firstName} {quotation.createdBy.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{quotation.createdBy.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="text-sm">
                  {format(new Date(quotation.createdAt), "dd/MM/yyyy HH:mm", {
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
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button className="w-full" variant="outline" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
