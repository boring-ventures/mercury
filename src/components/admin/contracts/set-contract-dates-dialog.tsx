"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Building2,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

interface SetContractDatesDialogProps {
  quotation: {
    id: string;
    code?: string;
    amount?: number;
    currency?: string;
    totalInBs?: number;
    terms?: string;
    notes?: string;
    createdAt?: string;
    validUntil?: string;
  };
  request: {
    id: string;
    code: string;
    description: string;
    company: {
      name: string;
      email: string;
    };
    provider?: {
      name?: string;
      country?: string;
    };
  };
  onDatesSet?: () => void;
}

export default function SetContractDatesDialog({
  quotation,
  request,
  onDatesSet,
}: SetContractDatesDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Fechas requeridas",
        description:
          "Debe establecer tanto la fecha de inicio como la de finalización.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Fechas inválidas",
        description:
          "La fecha de inicio debe ser anterior a la fecha de finalización.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quotationId: quotation.id,
          title: `Contrato - ${request.code}`,
          description: request.description,
          amount: quotation.totalInBs || 0,
          currency: "BOB",
          startDate,
          endDate,
          terms: quotation.terms || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el contrato");
      }

      const result = await response.json();

      toast({
        title: "Contrato creado exitosamente",
        description: `El contrato ${result.contract.code} ha sido creado con las fechas especificadas.`,
      });

      setIsOpen(false);
      onDatesSet?.();
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        title: "Error al crear contrato",
        description:
          "Hubo un problema al crear el contrato. Inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isQuotationExpired = quotation.validUntil
    ? new Date() > new Date(quotation.validUntil)
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isQuotationExpired}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Establecer Fechas del Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Establecer Fechas del Contrato
          </DialogTitle>
          <DialogDescription>
            Configure las fechas de inicio y finalización para el contrato
            basado en la cotización {quotation.code}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quotation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumen de la Cotización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Código
                  </Label>
                  <p className="font-semibold">{quotation.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Monto Total
                  </Label>
                  <p className="font-semibold">
                    {formatCurrency(quotation.totalInBs, "BOB")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Empresa
                  </Label>
                  <p className="font-semibold">{request.company.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Solicitud
                  </Label>
                  <p className="font-semibold">{request.code}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Descripción
                </Label>
                <p className="text-sm text-gray-700 mt-1">
                  {request.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Válida hasta:{" "}
                  {quotation.validUntil
                    ? format(new Date(quotation.validUntil), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "No especificada"}
                </span>
                {isQuotationExpired && (
                  <span className="text-red-600 font-medium">(Expirada)</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contract Dates Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha desde la cual el contrato será efectivo
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      Fecha de Finalización{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                      required
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha hasta la cual el contrato será válido
                    </p>
                  </div>
                </div>

                {/* Validation Messages */}
                {startDate &&
                  endDate &&
                  new Date(startDate) >= new Date(endDate) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            Fechas inválidas
                          </p>
                          <p className="text-xs text-red-800 mt-1">
                            La fecha de inicio debe ser anterior a la fecha de
                            finalización.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Success Preview */}
                {startDate &&
                  endDate &&
                  new Date(startDate) < new Date(endDate) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Período del Contrato
                          </p>
                          <p className="text-xs text-green-800 mt-1">
                            Desde{" "}
                            {format(
                              new Date(startDate),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: es }
                            )}
                            hasta{" "}
                            {format(
                              new Date(endDate),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: es }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !startDate ||
                      !endDate ||
                      new Date(startDate) >= new Date(endDate)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando Contrato...
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 mr-2" />
                        Crear Contrato
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
