"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface DraftQuotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DraftQuotationModal({
  open,
  onOpenChange,
}: DraftQuotationModalProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    company: "",
    client: "",
    amountToSend: "",
    currency: "USD",
    exchangeRate: "6.96",
    swiftFee: "25", // En USD
    correspondentFee: "0", // En USD
    interestRate: "3",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch exchange rate from Binance when amount or currency changes
  const fetchExchangeRate = async () => {
    if (!formData.amountToSend || formData.currency === "BS") return;

    setIsFetchingRate(true);
    try {
      const response = await fetch(
        `/api/binance/exchange-rate?amount=${formData.amountToSend}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener tipo de cambio");
      }
      const data = await response.json();
      if (data.success && data.data?.usdt_bob) {
        handleInputChange("exchangeRate", data.data.usdt_bob.toString());
        toast({
          title: "Tipo de cambio actualizado",
          description: `Tasa P2P Binance: ${data.data.usdt_bob.toFixed(2)} Bs/${formData.currency}`,
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener el tipo de cambio de Binance",
        variant: "destructive",
      });
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Auto-fetch exchange rate when modal opens
  useEffect(() => {
    if (open && formData.amountToSend && formData.currency !== "BS") {
      fetchExchangeRate();
    }
  }, [open]);

  const calculateTotal = () => {
    const amount = parseFloat(formData.amountToSend) || 0;
    const rate = parseFloat(formData.exchangeRate) || 0;
    const swiftFeeUSD = parseFloat(formData.swiftFee) || 0;
    const correspondentFeeUSD = parseFloat(formData.correspondentFee) || 0;
    const interestRate = parseFloat(formData.interestRate) || 0;

    // Convertir comisiones de USD a Bs
    const swiftFeeBS = swiftFeeUSD * rate;
    const correspondentFeeBS = correspondentFeeUSD * rate;

    if (formData.currency === "USD" || formData.currency === "EUR") {
      const amountInBs = amount * rate;
      const interestAmount = (amountInBs * interestRate) / 100;
      const totalInBs = amountInBs + swiftFeeBS + correspondentFeeBS + interestAmount;

      return {
        amountInCurrency: amount,
        amountInBs,
        swiftFeeUSD,
        swiftFeeBS,
        correspondentFeeUSD,
        correspondentFeeBS,
        interestAmount,
        totalInBs,
      };
    } else {
      // BS
      const interestAmount = (amount * interestRate) / 100;
      const totalInBs = amount + swiftFeeBS + correspondentFeeBS + interestAmount;

      return {
        amountInCurrency: amount,
        amountInBs: amount,
        swiftFeeUSD,
        swiftFeeBS,
        correspondentFeeUSD,
        correspondentFeeBS,
        interestAmount,
        totalInBs,
      };
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const totals = calculateTotal();
      const response = await fetch("/api/generate-draft-quotation-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totals,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Cotizacion_Borrador_${format(new Date(), "yyyyMMdd")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF generado",
        description: "La cotización se ha descargado exitosamente",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Error al generar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totals = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cotización Borrador</DialogTitle>
          <DialogDescription>
            Complete los datos para generar una cotización en PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nombre de la empresa"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                placeholder="Nombre del cliente"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
              />
            </div>

            {/* Monto a Enviar */}
            <div className="space-y-2">
              <Label htmlFor="amountToSend">Monto a Enviar</Label>
              <Input
                id="amountToSend"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amountToSend}
                onChange={(e) =>
                  handleInputChange("amountToSend", e.target.value)
                }
              />
            </div>

            {/* Moneda */}
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dólares (USD)</SelectItem>
                  <SelectItem value="EUR">Euros (EUR)</SelectItem>
                  <SelectItem value="BS">Bolivianos (Bs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Cambio con botón de actualizar */}
            {formData.currency !== "BS" && (
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">
                  Tipo de Cambio ({formData.currency}/Bs)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    placeholder="6.96"
                    value={formData.exchangeRate}
                    onChange={(e) =>
                      handleInputChange("exchangeRate", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={fetchExchangeRate}
                    disabled={isFetchingRate || !formData.amountToSend}
                    title="Obtener tasa de Binance P2P"
                  >
                    {isFetchingRate ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click en el icono para obtener la tasa actual de Binance P2P
                </p>
              </div>
            )}

            {/* Swift Bancario */}
            <div className="space-y-2">
              <Label htmlFor="swiftFee">Comisión Swift (USD)</Label>
              <Input
                id="swiftFee"
                type="number"
                step="0.01"
                placeholder="25.00"
                value={formData.swiftFee}
                onChange={(e) => handleInputChange("swiftFee", e.target.value)}
              />
            </div>

            {/* Comisión Corresponsal */}
            <div className="space-y-2">
              <Label htmlFor="correspondentFee">
                Comisión Corresponsal (USD)
              </Label>
              <Input
                id="correspondentFee"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.correspondentFee}
                onChange={(e) =>
                  handleInputChange("correspondentFee", e.target.value)
                }
              />
            </div>

            {/* Porcentaje Interés */}
            <div className="space-y-2">
              <Label htmlFor="interestRate">Porcentaje Interés (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="3.00"
                value={formData.interestRate}
                onChange={(e) =>
                  handleInputChange("interestRate", e.target.value)
                }
              />
            </div>
          </div>

          {/* Cálculos */}
          {formData.amountToSend && (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-2 mt-6">
              <h3 className="font-semibold text-sm mb-3">Resumen de Cotización</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monto en {formData.currency}:</span>
                  <span className="font-medium">
                    {totals.amountInCurrency.toFixed(2)} {formData.currency}
                  </span>
                </div>
                {formData.currency !== "BS" && (
                  <div className="flex justify-between text-sm">
                    <span>Equivalente en Bs:</span>
                    <span className="font-medium">
                      {totals.amountInBs.toFixed(2)} Bs
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Comisión Swift ({totals.swiftFeeUSD.toFixed(2)} USD):</span>
                  <span className="font-medium">
                    {totals.swiftFeeBS.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Comisión Corresponsal ({totals.correspondentFeeUSD.toFixed(2)} USD):</span>
                  <span className="font-medium">
                    {totals.correspondentFeeBS.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interés ({formData.interestRate}%):</span>
                  <span className="font-medium">
                    {totals.interestAmount.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                  <span>Total a Pagar:</span>
                  <span className="text-blue-600">
                    {totals.totalInBs.toFixed(2)} Bs
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={
              isGenerating ||
              !formData.company ||
              !formData.client ||
              !formData.amountToSend
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Generar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
