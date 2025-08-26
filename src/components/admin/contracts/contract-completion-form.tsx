"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContractCompletionFormProps {
  contractId: string;
  contractCode: string;
  currentStartDate?: string;
  currentEndDate?: string;
  onCompleted: () => void;
}

export function ContractCompletionForm({
  contractId,
  contractCode,
  currentStartDate,
  currentEndDate,
  onCompleted,
}: ContractCompletionFormProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState(
    currentStartDate ? currentStartDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    currentEndDate ? currentEndDate.split("T")[0] : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Por favor complete ambas fechas",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Error",
        description: "La fecha de inicio debe ser anterior a la fecha de fin",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/admin/contracts/${contractId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Error al completar el contrato";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Éxito",
        description: "Contrato completado exitosamente",
      });
      onCompleted();
    } catch (error) {
      console.error("Error completing contract:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al completar el contrato",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Completar Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">
              Fecha de Inicio <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">
              Fecha de Fin <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completar Contrato
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Al completar el contrato:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Se actualizarán las fechas del contrato</li>
              <li>El estado cambiará a "COMPLETED"</li>
              <li>Se enviará notificación al importador</li>
              <li>Se enviará email al importador</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
