"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  ArrowLeft,
  X,
  Calendar,
  Building,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { CashierTransactionStatus } from "@prisma/client";

interface CashierReport {
  id: string;
  assignedAmountBs: number;
  suggestedExchangeRate: number;
  expectedUsdt: number;
  deliveredUsdt: number | null;
  status: CashierTransactionStatus;
  assignedAt: string;
  completedAt: string | null;
  cashier: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  account: {
    id: string;
    name: string;
  };
  quotation: {
    id: string;
    code: string;
    company: {
      name: string;
    };
  };
}

interface ReportSummary {
  totalTransactions: number;
  totalAssignedBs: number;
  totalExpectedUsdt: number;
  totalDeliveredUsdt: number;
  completedCount: number;
  pendingCount: number;
  inProgressCount: number;
  surplusShortage: number;
}

export default function CashierReportsPage() {
  const searchParams = useSearchParams();
  const quotationIdFromUrl = searchParams.get("quotationId");

  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [quotationFilter, setQuotationFilter] = useState<string>(quotationIdFromUrl || "");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);

  // Update quotation filter when URL param changes
  useEffect(() => {
    if (quotationIdFromUrl) {
      setQuotationFilter(quotationIdFromUrl);
    }
  }, [quotationIdFromUrl]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cashier-reports", statusFilter, quotationFilter, companyFilter, startDate, endDate, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (statusFilter !== "todos") {
        params.append("status", statusFilter);
      }
      if (quotationFilter) {
        // We need to get quotation by code and then get its transactions
        params.append("quotationCode", quotationFilter);
      }
      if (companyFilter) {
        params.append("companyName", companyFilter);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      const response = await fetch(`/api/admin/cashier-reports?${params}`);
      if (!response.ok) throw new Error("Failed to fetch cashier reports");
      return response.json();
    },
  });

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    params.append("format", "csv");

    if (statusFilter !== "todos") {
      params.append("status", statusFilter);
    }
    if (quotationFilter) {
      params.append("quotationCode", quotationFilter);
    }
    if (companyFilter) {
      params.append("companyName", companyFilter);
    }
    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }

    window.open(`/api/admin/cashier-reports?${params}`, "_blank");
  };

  const handleClearFilters = () => {
    setStatusFilter("todos");
    setQuotationFilter("");
    setCompanyFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = statusFilter !== "todos" || quotationFilter || companyFilter || startDate || endDate;

  const getStatusBadge = (status: CashierTransactionStatus) => {
    switch (status) {
      case CashierTransactionStatus.PENDING:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case CashierTransactionStatus.IN_PROGRESS:
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            En Proceso
          </Badge>
        );
      case CashierTransactionStatus.COMPLETED:
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar los reportes</p>
      </div>
    );
  }

  const transactions: CashierReport[] = data?.transactions || [];
  const summary: ReportSummary = data?.summary || {
    totalTransactions: 0,
    totalAssignedBs: 0,
    totalExpectedUsdt: 0,
    totalDeliveredUsdt: 0,
    completedCount: 0,
    pendingCount: 0,
    inProgressCount: 0,
    surplusShortage: 0,
  };
  const pagination = data?.pagination || { total: 0, page: 1, limit: 50, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes de Cajeros</h1>
            <p className="text-muted-foreground">
              Visualiza las transacciones y el rendimiento de los cajeros
            </p>
          </div>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {summary.completedCount} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asignado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalAssignedBs.toLocaleString()} Bs
            </div>
            <p className="text-xs text-muted-foreground">
              Monto total en bolivianos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDT Esperado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalExpectedUsdt.toFixed(2)} USDT
            </div>
            <p className="text-xs text-muted-foreground">
              Total esperado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            {summary.surplusShortage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.surplusShortage >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {summary.surplusShortage >= 0 ? "+" : ""}
              {summary.surplusShortage.toFixed(2)} USDT
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalDeliveredUsdt.toFixed(2)} USDT entregado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros</CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value={CashierTransactionStatus.PENDING}>
                    Pendiente
                  </SelectItem>
                  <SelectItem value={CashierTransactionStatus.IN_PROGRESS}>
                    En Proceso
                  </SelectItem>
                  <SelectItem value={CashierTransactionStatus.COMPLETED}>
                    Completado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cotización
              </label>
              <Input
                placeholder="Código de cotización"
                value={quotationFilter}
                onChange={(e) => setQuotationFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Empresa
              </label>
              <Input
                placeholder="Nombre de empresa"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Fin
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {statusFilter !== "todos" && (
                <Badge variant="secondary" className="gap-1">
                  Estado: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setStatusFilter("todos")}
                  />
                </Badge>
              )}
              {quotationFilter && (
                <Badge variant="secondary" className="gap-1">
                  Cotización: {quotationFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setQuotationFilter("")}
                  />
                </Badge>
              )}
              {companyFilter && (
                <Badge variant="secondary" className="gap-1">
                  Empresa: {companyFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setCompanyFilter("")}
                  />
                </Badge>
              )}
              {startDate && (
                <Badge variant="secondary" className="gap-1">
                  Desde: {new Date(startDate).toLocaleDateString("es-BO")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setStartDate("")}
                  />
                </Badge>
              )}
              {endDate && (
                <Badge variant="secondary" className="gap-1">
                  Hasta: {new Date(endDate).toLocaleDateString("es-BO")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setEndDate("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones ({pagination.total})</CardTitle>
          <CardDescription>
            Detalle de todas las transacciones de cajeros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cajero</TableHead>
                  <TableHead>Cotización</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead className="text-right">Asignado (Bs)</TableHead>
                  <TableHead className="text-right">T.C.</TableHead>
                  <TableHead className="text-right">USDT Esperado</TableHead>
                  <TableHead className="text-right">USDT Entregado</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No hay transacciones que mostrar
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => {
                    const deliveredUsdt = Number(transaction.deliveredUsdt || 0);
                    const expectedUsdt = Number(transaction.expectedUsdt);
                    const difference = deliveredUsdt - expectedUsdt;

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {transaction.cashier.firstName}{" "}
                              {transaction.cashier.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {transaction.cashier.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {transaction.quotation.code}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.quotation.company.name}</TableCell>
                        <TableCell>{transaction.account.name}</TableCell>
                        <TableCell className="text-right">
                          {Number(transaction.assignedAmountBs).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(transaction.suggestedExchangeRate).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {expectedUsdt.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.deliveredUsdt !== null ? (
                            deliveredUsdt.toFixed(2)
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.deliveredUsdt !== null ? (
                            <span
                              className={`font-medium ${
                                difference >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {difference >= 0 ? "+" : ""}
                              {difference.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {new Date(transaction.assignedAt).toLocaleDateString(
                                "es-BO"
                              )}
                            </span>
                            {transaction.completedAt && (
                              <span className="text-xs text-muted-foreground">
                                Completado:{" "}
                                {new Date(
                                  transaction.completedAt
                                ).toLocaleDateString("es-BO")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {pagination.page} de {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
