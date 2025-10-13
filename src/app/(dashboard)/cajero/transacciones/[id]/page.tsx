"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { CashierTransactionStatus } from "@prisma/client";

const completeTransactionSchema = z.object({
  deliveredUsdt: z.string().min(1, "El monto de USDT es requerido"),
  notes: z.string().optional(),
});

type CompleteTransactionFormData = z.infer<typeof completeTransactionSchema>;

export default function CajeroTransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["cashier-transaction", resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/cashier/transactions/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to fetch transaction");
      return response.json();
    },
  });

  const form = useForm<CompleteTransactionFormData>({
    resolver: zodResolver(completeTransactionSchema),
    defaultValues: {
      deliveredUsdt: transaction?.deliveredUsdt?.toString() || "",
      notes: transaction?.notes || "",
    },
  });

  const startTransactionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/cashier/transactions/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: CashierTransactionStatus.IN_PROGRESS }),
      });
      if (!response.ok) throw new Error("Failed to start transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashier-transaction", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["cashier-transactions"] });
      toast({
        title: "Transacción iniciada",
        description: "La transacción ahora está en proceso",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo iniciar la transacción",
        variant: "destructive",
      });
    },
  });

  const completeTransactionMutation = useMutation({
    mutationFn: async (data: CompleteTransactionFormData) => {
      const response = await fetch(`/api/cashier/transactions/${resolvedParams.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveredUsdt: parseFloat(data.deliveredUsdt),
          notes: data.notes,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete transaction");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashier-transaction", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["cashier-transactions"] });
      toast({
        title: "Transacción completada",
        description: "La transacción se ha completado exitosamente",
      });
      router.push("/cajero/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleComplete = (data: CompleteTransactionFormData) => {
    completeTransactionMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Transacción no encontrada</p>
        <Link href="/cajero/transacciones">
          <Button variant="outline" className="mt-4">
            Volver a Transacciones
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: CashierTransactionStatus) => {
    switch (status) {
      case CashierTransactionStatus.PENDING:
        return <Badge variant="outline" className="text-lg"><Clock className="h-4 w-4 mr-1" />Pendiente</Badge>;
      case CashierTransactionStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="text-lg"><Loader2 className="h-4 w-4 mr-1" />En Proceso</Badge>;
      case CashierTransactionStatus.COMPLETED:
        return <Badge variant="default" className="text-lg"><CheckCircle2 className="h-4 w-4 mr-1" />Completado</Badge>;
      case CashierTransactionStatus.CANCELLED:
        return <Badge variant="destructive" className="text-lg"><AlertCircle className="h-4 w-4 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const difference = transaction.deliveredUsdt
    ? Number(transaction.deliveredUsdt) - Number(transaction.expectedUsdt)
    : null;

  const isCompleted = transaction.status === CashierTransactionStatus.COMPLETED;
  const isPending = transaction.status === CashierTransactionStatus.PENDING;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cajero/transacciones">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Detalle de Transacción</h1>
          <p className="text-muted-foreground">{transaction.quotation.code}</p>
        </div>
        {getStatusBadge(transaction.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quotation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Cotización</CardTitle>
            <CardDescription>Detalles de la cotización aceptada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Código de Cotización</p>
              <p className="font-medium">{transaction.quotation.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Código de Solicitud</p>
              <p className="font-medium">{transaction.quotation.request.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-medium">{transaction.quotation.company.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Cotización</p>
              <p className="font-medium text-lg">{Number(transaction.quotation.totalInBs).toLocaleString()} Bs</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto en {transaction.quotation.currency}</p>
              <p className="font-medium">{Number(transaction.quotation.amount).toLocaleString()} {transaction.quotation.currency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Cambio</p>
              <p className="font-medium">{Number(transaction.quotation.exchangeRate).toFixed(4)} Bs/{transaction.quotation.currency}</p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Transacción</CardTitle>
            <CardDescription>Detalles de tu asignación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Cuenta Asignada</p>
              <p className="font-medium">{transaction.account.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Límite diario: {Number(transaction.account.dailyLimitBs).toLocaleString()} Bs
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto Asignado</p>
              <p className="font-medium text-lg">{Number(transaction.assignedAmountBs).toLocaleString()} Bs</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Cambio Sugerido</p>
              <p className="font-medium">{Number(transaction.suggestedExchangeRate).toFixed(4)} Bs/USDT</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">USDT Esperado</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {Number(transaction.expectedUsdt).toFixed(6)} USDT
              </p>
            </div>
            {transaction.deliveredUsdt !== null && (
              <div className={`p-4 rounded-lg border ${
                difference && difference >= 0
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              }`}>
                <p className="text-sm font-medium">USDT Entregado</p>
                <p className="text-2xl font-bold">
                  {Number(transaction.deliveredUsdt).toFixed(6)} USDT
                </p>
                {difference !== null && (
                  <p className={`text-sm font-medium mt-1 ${
                    difference >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    Diferencia: {difference >= 0 ? '+' : ''}{difference.toFixed(6)} USDT
                  </p>
                )}
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Asignación</p>
              <p className="text-sm">{new Date(transaction.assignedAt).toLocaleString('es-BO')}</p>
            </div>
            {transaction.completedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Completado</p>
                <p className="text-sm">{new Date(transaction.completedAt).toLocaleString('es-BO')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {!isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Completar Transacción</CardTitle>
            <CardDescription>
              Registra el monto de USDT que has comprado y entregado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPending && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm mb-4">
                  Inicia la transacción para comenzar el proceso de compra de USDT.
                </p>
                <Button
                  onClick={() => startTransactionMutation.mutate()}
                  disabled={startTransactionMutation.isPending}
                >
                  {startTransactionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Iniciar Proceso
                </Button>
              </div>
            )}

            {!isPending && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleComplete)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="deliveredUsdt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>USDT Entregado *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            placeholder="0.000000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa la cantidad exacta de USDT que has comprado y entregado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Agrega cualquier nota o comentario sobre esta transacción..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Información adicional sobre la compra o cualquier incidencia
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={completeTransactionMutation.isPending}
                    >
                      {completeTransactionMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completar Transacción
                    </Button>
                    <Link href="/cajero/transacciones">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes (if completed) */}
      {isCompleted && transaction.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{transaction.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
