"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { CashierTransactionStatus } from "@prisma/client";

interface CashierTransaction {
  id: string;
  quotationId: string;
  assignedAmountBs: number;
  suggestedExchangeRate: number;
  expectedUsdt: number;
  deliveredUsdt: number | null;
  status: CashierTransactionStatus;
  assignedAt: string;
  completedAt: string | null;
  notes: string | null;
  quotation: {
    id: string;
    code: string;
    totalInBs: number;
    amount: number;
    currency: string;
    company: {
      name: string;
    };
    request: {
      code: string;
    };
  };
  account: {
    name: string;
    dailyLimitBs: number;
  };
}

export default function CajeroTransaccionesPage() {
  const { profile } = useCurrentUser();

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["cashier-transactions", profile?.id],
    queryFn: async () => {
      const response = await fetch(`/api/cashier/transactions?cashierId=${profile?.id}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!profile?.id,
  });

  const transactions: CashierTransaction[] = transactionsData?.transactions || [];

  const pendingTransactions = transactions.filter(t => t.status === CashierTransactionStatus.PENDING);
  const inProgressTransactions = transactions.filter(t => t.status === CashierTransactionStatus.IN_PROGRESS);
  const completedTransactions = transactions.filter(t => t.status === CashierTransactionStatus.COMPLETED);
  const cancelledTransactions = transactions.filter(t => t.status === CashierTransactionStatus.CANCELLED);

  const getStatusBadge = (status: CashierTransactionStatus) => {
    switch (status) {
      case CashierTransactionStatus.PENDING:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case CashierTransactionStatus.IN_PROGRESS:
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1" />En Proceso</Badge>;
      case CashierTransactionStatus.COMPLETED:
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>;
      case CashierTransactionStatus.CANCELLED:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTransaction = (transaction: CashierTransaction) => {
    const diff = transaction.deliveredUsdt ? (Number(transaction.deliveredUsdt) - Number(transaction.expectedUsdt)) : null;

    return (
      <div
        key={transaction.id}
        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-medium">{transaction.quotation.code}</p>
            {getStatusBadge(transaction.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            {transaction.quotation.company.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>
              <p className="font-medium">{transaction.quotation.totalInBs.toLocaleString()} Bs</p>
            </div>
            <div>
              <span className="text-muted-foreground">Asignado:</span>
              <p className="font-medium">{Number(transaction.assignedAmountBs).toLocaleString()} Bs</p>
            </div>
            <div>
              <span className="text-muted-foreground">USDT Esperado:</span>
              <p className="font-medium">{Number(transaction.expectedUsdt).toFixed(2)} USDT</p>
            </div>
            {transaction.deliveredUsdt !== null && (
              <div>
                <span className="text-muted-foreground">USDT Entregado:</span>
                <p className={`font-medium ${diff && diff < 0 ? 'text-red-600' : diff && diff > 0 ? 'text-green-600' : ''}`}>
                  {Number(transaction.deliveredUsdt).toFixed(2)} USDT
                  {diff !== null && (
                    <span className="text-xs ml-1">
                      ({diff >= 0 ? '+' : ''}{diff.toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Cuenta:</span>
            <span className="ml-2 font-medium">{transaction.account.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Asignado: {new Date(transaction.assignedAt).toLocaleString('es-BO')}
            {transaction.completedAt && (
              <> • Completado: {new Date(transaction.completedAt).toLocaleString('es-BO')}</>
            )}
          </div>
        </div>
        <Link href={`/cajero/transacciones/${transaction.id}`}>
          <Button variant={transaction.status === CashierTransactionStatus.PENDING ? "default" : "outline"}>
            {transaction.status === CashierTransactionStatus.COMPLETED ? "Ver Detalles" : "Procesar"}
          </Button>
        </Link>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground">
          Gestiona tus transacciones de compra de USDT
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pendientes
            {pendingTransactions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pendingTransactions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En Proceso
            {inProgressTransactions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{inProgressTransactions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas
            {completedTransactions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{completedTransactions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Pendientes</CardTitle>
              <CardDescription>
                Cotizaciones aceptadas que requieren compra de USDT
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay transacciones pendientes
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingTransactions.map(renderTransaction)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones en Proceso</CardTitle>
              <CardDescription>
                Transacciones que estás procesando actualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inProgressTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay transacciones en proceso
                </p>
              ) : (
                <div className="space-y-4">
                  {inProgressTransactions.map(renderTransaction)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Completadas</CardTitle>
              <CardDescription>
                Historial de transacciones finalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay transacciones completadas
                </p>
              ) : (
                <div className="space-y-4">
                  {completedTransactions.map(renderTransaction)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Transacciones</CardTitle>
              <CardDescription>
                Historial completo de todas tus transacciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay transacciones
                </p>
              ) : (
                <div className="space-y-4">
                  {transactions.map(renderTransaction)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
