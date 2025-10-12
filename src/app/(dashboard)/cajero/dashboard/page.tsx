"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, Clock, CheckCircle2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
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
  quotation: {
    id: string;
    code: string;
    totalInBs: number;
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

export default function CajeroDashboardPage() {
  const { profile, isLoading: profileLoading } = useCurrentUser();

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
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

  const totalDelivered = completedTransactions.reduce((sum, t) => sum + (t.deliveredUsdt || 0), 0);
  const totalExpected = completedTransactions.reduce((sum, t) => sum + t.expectedUsdt, 0);
  const difference = totalDelivered - totalExpected;

  if (profileLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: CashierTransactionStatus) => {
    switch (status) {
      case CashierTransactionStatus.PENDING:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case CashierTransactionStatus.IN_PROGRESS:
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />En Proceso</Badge>;
      case CashierTransactionStatus.COMPLETED:
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Cajero</h1>
        <p className="text-muted-foreground">
          Bienvenido, {profile?.firstName} {profile?.lastName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Cotizaciones asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Loader2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Transacciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Transacciones finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            {difference >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference >= 0 ? '+' : ''}{difference.toFixed(2)} USDT
            </div>
            <p className="text-xs text-muted-foreground">Superávit/Déficit</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cotizaciones Pendientes</CardTitle>
            <CardDescription>Cotizaciones aceptadas que requieren compra de USDT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.quotation.code}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.quotation.company.name}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Monto: <span className="font-medium text-foreground">{transaction.quotation.totalInBs.toLocaleString()} Bs</span>
                      </span>
                      <span className="text-muted-foreground">
                        Cuenta: <span className="font-medium text-foreground">{transaction.account.name}</span>
                      </span>
                    </div>
                  </div>
                  <Link href={`/cajero/transacciones/${transaction.id}`}>
                    <Button>
                      <Wallet className="h-4 w-4 mr-2" />
                      Procesar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress Transactions */}
      {inProgressTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transacciones en Proceso</CardTitle>
            <CardDescription>Transacciones que estás procesando actualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.quotation.code}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.quotation.company.name}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Esperado: <span className="font-medium text-foreground">{transaction.expectedUsdt.toFixed(2)} USDT</span>
                      </span>
                      <span className="text-muted-foreground">
                        Cuenta: <span className="font-medium text-foreground">{transaction.account.name}</span>
                      </span>
                    </div>
                  </div>
                  <Link href={`/cajero/transacciones/${transaction.id}`}>
                    <Button variant="secondary">
                      Continuar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Completed */}
      {completedTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Completadas Recientes</CardTitle>
            <CardDescription>Últimas 5 transacciones completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTransactions.slice(0, 5).map((transaction) => {
                const diff = (transaction.deliveredUsdt || 0) - transaction.expectedUsdt;
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{transaction.quotation.code}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.quotation.company.name}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Entregado: <span className="font-medium text-foreground">{transaction.deliveredUsdt?.toFixed(2)} USDT</span>
                        </span>
                        <span className={`font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(2)} USDT
                        </span>
                      </div>
                    </div>
                    <Link href={`/cajero/transacciones/${transaction.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
            {completedTransactions.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/cajero/transacciones">
                  <Button variant="outline">Ver Todas las Transacciones</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay transacciones asignadas.</p>
              <p className="text-sm mt-2">Las cotizaciones aceptadas aparecerán aquí.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
