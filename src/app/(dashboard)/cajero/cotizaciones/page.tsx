"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const participateSchema = z.object({
  accountId: z.string().min(1, "Selecciona una cuenta"),
  assignedAmountBs: z.string().min(1, "Ingresa el monto"),
});

type ParticipateFormData = z.infer<typeof participateSchema>;

interface AvailableQuotation {
  id: string;
  code: string;
  totalInBs: number;
  exchangeRate: number;
  amount: number;
  currency: string;
  totalAssigned: number;
  remainingAmount: number;
  canParticipate: boolean;
  company: {
    name: string;
  };
  request: {
    code: string;
  };
}

interface CashierAccount {
  id: string;
  name: string;
  dailyLimitBs: number;
  active: boolean;
}

export default function CajeroCotizacionesPage() {
  const { profile } = useCurrentUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuotation, setSelectedQuotation] =
    useState<AvailableQuotation | null>(null);
  const [participateDialogOpen, setParticipateDialogOpen] = useState(false);

  const form = useForm<ParticipateFormData>({
    resolver: zodResolver(participateSchema),
    defaultValues: {
      accountId: "",
      assignedAmountBs: "",
    },
  });

  const { data: quotationsData, isLoading: quotationsLoading } = useQuery({
    queryKey: ["available-quotations", profile?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/cashier/available-quotations?cashierId=${profile?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch quotations");
      return response.json();
    },
    enabled: !!profile?.id,
  });

  const { data: accountsData } = useQuery({
    queryKey: ["cashier-assignments", profile?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/cashier-assignments?cashierId=${profile?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json();
    },
    enabled: !!profile?.id,
  });

  const { data: dailyUsageData } = useQuery({
    queryKey: ["cashier-daily-usage", profile?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/cashier/accounts/daily-usage?cashierId=${profile?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch daily usage");
      return response.json();
    },
    enabled: !!profile?.id,
  });

  const participateMutation = useMutation({
    mutationFn: async (
      data: ParticipateFormData & { quotationId: string; cashierId: string }
    ) => {
      const response = await fetch(
        `/api/cashier/quotations/${data.quotationId}/participate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cashierId: data.cashierId,
            accountId: data.accountId,
            assignedAmountBs: data.assignedAmountBs,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to participate");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-quotations"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-daily-usage"] });
      toast({
        title: "¡Participación exitosa!",
        description: "Ahora puedes procesar tu transacción",
      });
      setParticipateDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const availableQuotations: AvailableQuotation[] =
    quotationsData?.available || [];
  const accounts: { account: CashierAccount }[] = accountsData || [];
  const dailyUsage = dailyUsageData?.usage || [];

  const handleParticipate = (quotation: AvailableQuotation) => {
    setSelectedQuotation(quotation);
    setParticipateDialogOpen(true);
    form.setValue("assignedAmountBs", "");
  };

  const onSubmit = (data: ParticipateFormData) => {
    if (!selectedQuotation || !profile) return;

    participateMutation.mutate({
      ...data,
      quotationId: selectedQuotation.id,
      cashierId: profile.id,
    });
  };

  const selectedAccountId = form.watch("accountId");
  const selectedAccount = accounts.find(
    (a) => a.account.id === selectedAccountId
  )?.account;
  const accountUsage = dailyUsage.find(
    (u: any) => u.accountId === selectedAccountId
  );
  const availableLimit = accountUsage?.remainingLimit || 0;

  if (quotationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cotizaciones Disponibles</h1>
        <p className="text-muted-foreground">
          Selecciona una cotización para participar en la compra de USDT
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableQuotations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cotizaciones para participar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableQuotations
                .reduce((sum, q) => sum + Number(q.remainingAmount), 0)
                .toLocaleString()}{" "}
              Bs
            </div>
            <p className="text-xs text-muted-foreground">
              Monto disponible total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tu Capacidad</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyUsage
                .reduce((sum: number, u: any) => sum + u.remainingLimit, 0)
                .toLocaleString()}{" "}
              Bs
            </div>
            <p className="text-xs text-muted-foreground">
              Límite disponible hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Quotations */}
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones Disponibles</CardTitle>
          <CardDescription>
            Puedes participar en estas cotizaciones aceptadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableQuotations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay cotizaciones disponibles en este momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableQuotations.map((quotation) => {
                const expectedUsdt =
                  Number(quotation.remainingAmount) /
                  Number(quotation.exchangeRate);
                // Check if cashier has ANY available limit (even if less than full remaining amount)
                const hasAvailableLimit = dailyUsage.some(
                  (u: any) => u.remainingLimit > 0
                );
                const maxCanParticipate = Math.max(
                  ...dailyUsage.map((u: any) => u.remainingLimit || 0)
                );

                return (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-lg">{quotation.code}</p>
                        <Badge variant="secondary">Disponible</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quotation.company.name}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Monto Total:
                          </span>
                          <p className="font-medium">
                            {Number(quotation.totalInBs).toLocaleString()} Bs
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Ya Asignado:
                          </span>
                          <p className="font-medium">
                            {quotation.totalAssigned.toLocaleString()} Bs
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Disponible:
                          </span>
                          <p className="font-medium text-green-600">
                            {quotation.remainingAmount.toLocaleString()} Bs
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            USDT Aprox:
                          </span>
                          <p className="font-medium">
                            {expectedUsdt.toFixed(2)} USDT
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tipo de cambio:{" "}
                        {Number(quotation.exchangeRate).toFixed(4)} Bs/USDT
                      </div>
                      {hasAvailableLimit &&
                        maxCanParticipate < quotation.remainingAmount && (
                          <div className="text-xs text-amber-600 dark:text-amber-400">
                            Puedes participar hasta{" "}
                            {maxCanParticipate.toLocaleString()} Bs
                          </div>
                        )}
                    </div>
                    <Button
                      onClick={() => handleParticipate(quotation)}
                      disabled={!quotation.canParticipate || !hasAvailableLimit}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Participar
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participate Dialog */}
      <Dialog
        open={participateDialogOpen}
        onOpenChange={setParticipateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participar en Cotización</DialogTitle>
            <DialogDescription>
              {selectedQuotation?.code} - {selectedQuotation?.company.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {selectedQuotation && (
                <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto disponible:
                    </span>
                    <span className="font-medium">
                      {selectedQuotation.remainingAmount.toLocaleString()} Bs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tipo de cambio:
                    </span>
                    <span className="font-medium">
                      {Number(selectedQuotation.exchangeRate).toFixed(4)}{" "}
                      Bs/USDT
                    </span>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta Bancaria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu cuenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.account.id} value={a.account.id}>
                            {a.account.name} (Disponible:{" "}
                            {dailyUsage
                              .find((u: any) => u.accountId === a.account.id)
                              ?.remainingLimit.toLocaleString() || 0}{" "}
                            Bs)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona la cuenta bancaria que usarás
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAccount && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                  <p className="font-medium">Límite disponible hoy:</p>
                  <p className="text-lg font-bold text-blue-600">
                    {availableLimit.toLocaleString()} Bs
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="assignedAmountBs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto a Participar (Bs) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        max={Math.min(
                          selectedQuotation?.remainingAmount || 0,
                          availableLimit
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Máximo:{" "}
                      {Math.min(
                        selectedQuotation?.remainingAmount || 0,
                        availableLimit
                      ).toLocaleString()}{" "}
                      Bs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setParticipateDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={participateMutation.isPending}>
                  {participateMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Confirmar Participación
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
