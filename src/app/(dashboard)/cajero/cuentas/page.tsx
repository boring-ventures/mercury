"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Wallet, TrendingUp, DollarSign, AlertCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const accountSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  dailyLimitBs: z.string().min(1, "El límite diario es requerido"),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface CashierAccount {
  id: string;
  name: string;
  dailyLimitBs: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    cashierTransactions: number;
  };
}

interface DailyUsage {
  accountId: string;
  accountName: string;
  usedToday: number;
  dailyLimit: number;
  percentageUsed: number;
  remainingLimit: number;
  transactionCount: number;
}

export default function CajeroCuentasPage() {
  const { profile } = useCurrentUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CashierAccount | null>(null);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      dailyLimitBs: "",
    },
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["my-cashier-accounts", profile?.id],
    queryFn: async () => {
      const response = await fetch(`/api/cashier/my-accounts?cashierId=${profile?.id}`);
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json() as Promise<CashierAccount[]>;
    },
    enabled: !!profile?.id,
  });

  const { data: dailyUsageData, isLoading: usageLoading } = useQuery({
    queryKey: ["cashier-daily-usage", profile?.id],
    queryFn: async () => {
      const response = await fetch(`/api/cashier/accounts/daily-usage?cashierId=${profile?.id}`);
      if (!response.ok) throw new Error("Failed to fetch daily usage");
      return response.json();
    },
    enabled: !!profile?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AccountFormData) => {
      const response = await fetch(`/api/cashier/my-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashierId: profile?.id,
          name: data.name,
          dailyLimitBs: data.dailyLimitBs,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create account");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cashier-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-daily-usage"] });
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta bancaria ha sido creada exitosamente",
      });
      setCreateDialogOpen(false);
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

  const updateMutation = useMutation({
    mutationFn: async (data: AccountFormData & { id: string }) => {
      const response = await fetch(`/api/cashier/my-accounts/${data.id}?cashierId=${profile?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashierId: profile?.id,
          name: data.name,
          dailyLimitBs: data.dailyLimitBs,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update account");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cashier-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-daily-usage"] });
      toast({
        title: "Cuenta actualizada",
        description: "Los cambios han sido guardados exitosamente",
      });
      setEditDialogOpen(false);
      setSelectedAccount(null);
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

  const deleteMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await fetch(`/api/cashier/my-accounts/${accountId}?cashierId=${profile?.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cashier-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-daily-usage"] });
      toast({
        title: "Cuenta eliminada",
        description: "La cuenta ha sido eliminada exitosamente",
      });
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dailyUsage: DailyUsage[] = dailyUsageData?.usage || [];

  const handleCreate = () => {
    form.reset();
    setCreateDialogOpen(true);
  };

  const handleEdit = (account: CashierAccount) => {
    setSelectedAccount(account);
    form.setValue("name", account.name);
    form.setValue("dailyLimitBs", account.dailyLimitBs.toString());
    setEditDialogOpen(true);
  };

  const handleDelete = (account: CashierAccount) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const onSubmitCreate = (data: AccountFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitEdit = (data: AccountFormData) => {
    if (!selectedAccount) return;
    updateMutation.mutate({ ...data, id: selectedAccount.id });
  };

  const confirmDelete = () => {
    if (!selectedAccount) return;
    deleteMutation.mutate(selectedAccount.id);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  if (accountsLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const myAccounts = accounts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Cuentas Bancarias</h1>
          <p className="text-muted-foreground">
            Gestiona tus cuentas y límites diarios
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cuenta
        </Button>
      </div>

      {myAccounts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No tienes cuentas bancarias</p>
              <p className="text-sm mb-4">Crea tu primera cuenta para comenzar a operar</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cuentas Activas</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myAccounts.filter(a => a.active).length}</div>
                <p className="text-xs text-muted-foreground">
                  De {myAccounts.length} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Límite Total Diario</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {myAccounts
                    .reduce((sum, a) => sum + Number(a.dailyLimitBs), 0)
                    .toLocaleString()} Bs
                </div>
                <p className="text-xs text-muted-foreground">
                  Capacidad total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponible Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyUsage
                    .reduce((sum, u) => sum + u.remainingLimit, 0)
                    .toLocaleString()} Bs
                </div>
                <p className="text-xs text-muted-foreground">
                  Límite disponible
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {myAccounts.map((account) => {
              const usage = dailyUsage.find(u => u.accountId === account.id);
              const usedToday = usage?.usedToday || 0;
              const dailyLimit = Number(account.dailyLimitBs);
              const remaining = dailyLimit - usedToday;
              const percentage = dailyLimit > 0 ? (usedToday / dailyLimit) * 100 : 0;

              return (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        <CardTitle>{account.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.active ? "default" : "secondary"}>
                          {account.active ? "Activa" : "Inactiva"}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(account)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Creada el {new Date(account.createdAt).toLocaleDateString('es-BO')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Daily Limit */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Límite Diario</span>
                        <span className="font-medium">{dailyLimit.toLocaleString()} Bs</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usado Hoy</span>
                        <span className={`font-medium ${getUsageColor(percentage)}`}>
                          {usedToday.toLocaleString()} Bs ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Disponible</span>
                        <span className="font-medium text-green-600">
                          {remaining.toLocaleString()} Bs
                        </span>
                      </div>
                    </div>

                    {/* Usage Warning */}
                    {percentage >= 90 && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-600">
                          Has alcanzado el {percentage.toFixed(0)}% del límite diario
                        </p>
                      </div>
                    )}

                    {/* Transaction Count */}
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {account._count.cashierTransactions} transacciones realizadas
                      </div>
                      {usage && (
                        <div className="text-sm text-muted-foreground">
                          {usage.transactionCount} transacciones hoy
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Cuenta</DialogTitle>
            <DialogDescription>
              Agrega una nueva cuenta bancaria para operar
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Cuenta *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Banco Nacional - Caja General" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un nombre descriptivo para identificar esta cuenta
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyLimitBs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite Diario (Bs) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Monto máximo que puedes manejar por día con esta cuenta
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Crear Cuenta
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cuenta</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu cuenta bancaria
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Cuenta *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Banco Nacional - Caja General" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyLimitBs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite Diario (Bs) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Cambiar el límite no afecta las transacciones ya realizadas hoy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la cuenta &quot;{selectedAccount?.name}&quot;.
              {selectedAccount && selectedAccount._count.cashierTransactions > 0 && (
                <span className="block mt-2 text-red-600">
                  Esta cuenta tiene {selectedAccount._count.cashierTransactions} transacciones asociadas.
                  Solo se puede eliminar si no tiene transacciones activas.
                </span>
              )}
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
