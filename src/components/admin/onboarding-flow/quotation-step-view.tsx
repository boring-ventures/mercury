"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DollarSign,
  CheckCircle,
  Loader2,
  ArrowRight,
  Calculator,
  Info,
  RefreshCw,
  Banknote,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatExchangeRate } from "@/lib/utils";

interface QuotationStepViewProps {
  request: any;
  onUpdate: () => void;
  onNext: () => void;
}

export default function QuotationStepView({
  request,
  onUpdate,
  onNext,
}: QuotationStepViewProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // Get tomorrow's date as minimum (to ensure it's always future)
  const getMinimumDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Set time to 00:00 (start of day)
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  };

  // Get default valid until date (same as minimum date)
  const getDefaultValidUntil = () => {
    return getMinimumDate();
  };

  // Form state
  const [amount, setAmount] = useState(request.amount?.toString() || "");
  const [currency] = useState(request.currency || "USD");
  const [exchangeRate, setExchangeRate] = useState("6.96");
  const [swiftBankUSD, setSwiftBankUSD] = useState("15");
  const [correspondentBankUSD, setCorrespondentBankUSD] = useState("10");
  const [managementServicePercentage, setManagementServicePercentage] =
    useState("3");
  const [validUntil, setValidUntil] = useState(getDefaultValidUntil());
  const [terms, setTerms] = useState(
    "- El tipo de cambio es referencial y puede variar.\n- Los costos bancarios pueden ser ajustados según el banco corresponsal.\n- La cotización es válida por el período indicado."
  );
  const [notes, setNotes] = useState("");

  // Binance state
  const [binancePrice, setBinancePrice] = useState<{
    price: number;
    available: number;
    coverage: number;
    offers: number;
    offers_used?: any[];
  } | null>(null);
  const [isBinanceCollapsed, setIsBinanceCollapsed] = useState(true);
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false);

  // Get existing quotations
  const quotations = request.quotations || [];
  const hasAcceptedQuotation = quotations.some(
    (q: any) => q.status === "ACCEPTED"
  );

  // Calculate values
  const amountNum = parseFloat(amount) || 0;
  const exchangeRateNum = parseFloat(exchangeRate) || 0;
  const swiftUSD = parseFloat(swiftBankUSD) || 0;
  const correspondentUSD = parseFloat(correspondentBankUSD) || 0;
  const managementPercent = parseFloat(managementServicePercentage) || 0;

  const amountInBs = Math.round(amountNum * exchangeRateNum);
  const swiftBs = Math.round(swiftUSD * exchangeRateNum);
  const correspondentBs = Math.round(correspondentUSD * exchangeRateNum);
  const managementServiceBs = Math.round(
    amountInBs * (managementPercent / 100)
  );
  const totalInBs =
    amountInBs + swiftBs + correspondentBs + managementServiceBs;

  // Function to fetch Binance price for specific amount
  const fetchBinancePrice = useCallback(
    async (fetchAmount: number) => {
      if (!fetchAmount || fetchAmount <= 0) {
        setBinancePrice(null);
        return;
      }

      setIsLoadingExchangeRate(true);
      try {
        const response = await fetch(
          `/api/binance/exchange-rate?amount=${fetchAmount}`
        );
        const data = await response.json();

        if (data.success) {
          setBinancePrice({
            price: data.data.usdt_bob,
            available: data.data.available,
            coverage: data.data.coverage_percentage,
            offers: data.data.total_offers,
            offers_used: data.data.offers_used || [],
          });

          // Update exchange rate with the fetched price
          setExchangeRate(data.data.usdt_bob.toString());

          toast({
            title: "Tipo de cambio actualizado",
            description: `Precio desde Binance P2P: ${(data.data.usdt_bob || 0).toFixed(2)} BOB/USDT`,
          });

          setIsBinanceCollapsed(false);
        } else {
          setBinancePrice(null);
          toast({
            title: "Error",
            description: data.error || "No se pudo obtener el precio",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching Binance price:", error);
        setBinancePrice(null);
        toast({
          title: "Error",
          description: "No se pudo obtener el precio desde Binance P2P",
          variant: "destructive",
        });
      } finally {
        setIsLoadingExchangeRate(false);
      }
    },
    [toast]
  );

  // Auto-fetch Binance price when amount changes
  useEffect(() => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      const timeoutId = setTimeout(() => {
        fetchBinancePrice(amountNum);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    } else if (amountNum === 0) {
      setBinancePrice(null);
    }
  }, [amount, fetchBinancePrice]);

  const handleCreateQuotation = async () => {
    if (!amount || !exchangeRate) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`/api/requests/${request.id}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          currency,
          exchangeRate: exchangeRateNum,
          amountInBs,
          swiftBankUSD: swiftUSD,
          correspondentBankUSD: correspondentUSD,
          swiftBankBs: swiftBs,
          correspondentBankBs: correspondentBs,
          managementServiceBs,
          managementServicePercentage: managementPercent,
          totalInBs,
          validUntil: new Date(validUntil + "T23:59:59").toISOString(),
          terms,
          notes: notes || undefined,
          status: "SENT", // Create as SENT (will be auto-accepted)
          skipNotifications: true, // Skip email notifications in onboarding flow
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la cotización");
      }

      const data = await response.json();

      toast({
        title: "Cotización creada",
        description: "La cotización se ha creado correctamente",
      });

      // Now auto-accept it
      await handleAutoAcceptQuotation(data.quotation.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cotización",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAutoAcceptQuotation = async (quotationId: string) => {
    setIsAccepting(true);
    try {
      // Accept the quotation automatically (no need to publish, already SENT)
      const response = await fetch(`/api/requests/${request.id}/quotations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId,
          action: "ACCEPTED",
          notes: "Auto-aprobado en flujo de adaptación",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al aceptar la cotización");
      }

      toast({
        title: "Cotización aceptada",
        description:
          "La cotización se ha aceptado automáticamente y se ha movido al siguiente paso",
      });

      onUpdate();
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo aceptar la cotización",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (hasAcceptedQuotation) {
    const acceptedQuotation = quotations.find(
      (q: any) => q.status === "ACCEPTED"
    );

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Cotización Aceptada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-900">
                  La cotización ha sido aceptada
                </p>
              </div>
              <p className="text-sm text-green-700">
                Código: {acceptedQuotation?.code}
              </p>
              <p className="text-sm text-green-700">
                Monto Total:{" "}
                {formatCurrency(acceptedQuotation?.totalInBs || 0, "Bs")}
              </p>
            </div>

            <Button onClick={onNext} className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continuar al Contrato
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Crear Cotización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Flujo de Adaptación
                </p>
                <p className="text-sm text-blue-700">
                  En el flujo de adaptación, la cotización será creada y
                  aceptada automáticamente para continuar con el proceso.
                </p>
              </div>
            </div>
          </div>

          {/* Amount and Exchange Rate Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Monto a Enviar (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 5000"
              />
            </div>
            <div>
              <Label htmlFor="currency">Moneda / Tipo de Cambio</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="currency"
                    value="USD"
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="0.0000"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const fetchAmount = parseFloat(amount);
                    if (fetchAmount > 0) {
                      fetchBinancePrice(fetchAmount);
                    } else {
                      toast({
                        title: "Error",
                        description: "Ingrese un monto válido primero",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={isLoadingExchangeRate || !amount}
                  className="whitespace-nowrap"
                >
                  {isLoadingExchangeRate ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Obtener
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Obtén el precio promedio desde Binance P2P
              </p>
            </div>
          </div>

          {/* Amount in Bs Display */}
          {amount && parseFloat(amount) > 0 && exchangeRate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Monto Convertido
                  </p>
                  <p className="text-xs text-green-700">
                    {formatCurrency(amountNum, "USD")} ×{" "}
                    {formatExchangeRate(exchangeRateNum)} Bs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(amountInBs, "Bs")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Binance P2P Price Display - Collapsible */}
          {amount && parseFloat(amount) > 0 && binancePrice && (
            <Collapsible
              open={isBinanceCollapsed}
              onOpenChange={setIsBinanceCollapsed}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                >
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <span className="font-medium text-blue-900">
                      Precio Binance P2P: {(binancePrice.price || 0).toFixed(2)}{" "}
                      BOB/USDT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {binancePrice.offers} ofertas
                    </Badge>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isBinanceCollapsed ? "rotate-180" : ""}`}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 bg-white border border-blue-200 rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">
                          Precio Promedio:
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {(binancePrice.price || 0).toFixed(2)} BOB/USDT
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Disponible:</p>
                        <p className="text-lg font-bold text-blue-900">
                          {(binancePrice.available || 0).toLocaleString()} USDT
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Cobertura:</p>
                        <p className="font-medium text-blue-900">
                          {binancePrice.coverage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">
                          Ofertas Usadas:
                        </p>
                        <p className="font-medium text-blue-900">
                          {binancePrice.offers} ofertas
                        </p>
                      </div>
                    </div>

                    {/* Offers Details */}
                    {binancePrice.offers_used &&
                      binancePrice.offers_used.length > 0 && (
                        <div className="border-t pt-4">
                          <h5 className="font-medium text-blue-900 mb-3">
                            Detalle de Ofertas:
                          </h5>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {binancePrice.offers_used.map(
                              (offer: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {offer.advertiser}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Grado {offer.userGrade}
                                    </Badge>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">
                                      {offer.price} BOB/USDT
                                    </div>
                                    <div className="text-gray-600">
                                      {(
                                        offer.availableAmount || 0
                                      ).toLocaleString()}{" "}
                                      USDT
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className="border-t pt-2">
                      <p className="text-xs text-blue-600">
                        💡 Precio calculado con {binancePrice.offers} ofertas de
                        Binance P2P
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Banking Fees */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Comisiones Bancarias</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="swiftBankUSD">Swift Bancario (USD) *</Label>
                <Input
                  id="swiftBankUSD"
                  type="number"
                  step="0.01"
                  value={swiftBankUSD}
                  onChange={(e) => setSwiftBankUSD(e.target.value)}
                  placeholder="Ej: 15"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculado automáticamente: SWIFT USD × Tipo de Cambio ={" "}
                  {formatCurrency(swiftBs, "Bs")}
                </p>
              </div>
              <div>
                <Label htmlFor="correspondentBankUSD">
                  Banco Corresponsal (USD) *
                </Label>
                <Input
                  id="correspondentBankUSD"
                  type="number"
                  step="0.01"
                  value={correspondentBankUSD}
                  onChange={(e) => setCorrespondentBankUSD(e.target.value)}
                  placeholder="Ej: 10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculado automáticamente: Com. USD × Tipo de Cambio ={" "}
                  {formatCurrency(correspondentBs, "Bs")}
                </p>
              </div>
            </div>
          </div>

          {/* Management Service */}
          <div>
            <Label htmlFor="managementServicePercentage">
              Servicio de Gestión (%) *
            </Label>
            <Input
              id="managementServicePercentage"
              type="number"
              step="0.01"
              value={managementServicePercentage}
              onChange={(e) => setManagementServicePercentage(e.target.value)}
              placeholder="Ej: 3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculado automáticamente: {managementPercent}% de{" "}
              {formatCurrency(amountInBs, "Bs")} ={" "}
              {formatCurrency(managementServiceBs, "Bs")}
            </p>
          </div>

          {/* Valid Until */}
          <div>
            <Label htmlFor="validUntil">Válido hasta*</Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              min={getMinimumDate()}
            />
            <p className="text-xs text-gray-500 mt-1">
              La cotización será válida hasta esta fecha
            </p>
          </div>

          {/* Calculated Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Resumen de Cotización
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monto en USD:</span>
                <span className="font-semibold">
                  {formatCurrency(amountNum, "USD")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tipo de cambio:</span>
                <span className="font-semibold">
                  {formatExchangeRate(exchangeRateNum)} Bs
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monto en Bs:</span>
                <span className="font-semibold">
                  {formatCurrency(amountInBs, "Bs")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Swift Bancario:</span>
                <span className="font-semibold">
                  {formatCurrency(swiftBs, "Bs")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Banco Corresponsal:</span>
                <span className="font-semibold">
                  {formatCurrency(correspondentBs, "Bs")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Servicio de Gestión ({managementPercent}%):</span>
                <span className="font-semibold">
                  {formatCurrency(managementServiceBs, "Bs")}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold text-lg">TOTAL EN BS:</span>
                <span className="font-bold text-lg text-blue-900">
                  {formatCurrency(totalInBs, "Bs")}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div>
            <Label htmlFor="terms">Términos y Condiciones</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={5}
              placeholder="Términos y condiciones de la cotización"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas Adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notas o comentarios adicionales"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleCreateQuotation}
            disabled={isCreating || isAccepting}
            className="w-full"
            size="lg"
          >
            {isCreating || isAccepting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isCreating
                  ? "Creando cotización..."
                  : "Aceptando cotización..."}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Crear y Aceptar Cotización
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
