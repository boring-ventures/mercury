"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Company } from "@/hooks/use-admin-companies";
import { useToast } from "@/components/ui/use-toast";

interface DeleteCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCompanyDialog({
  company,
  open,
  onOpenChange,
}: DeleteCompanyDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteCompanyMutation = useMutation({
    mutationFn: async ({ hardDelete }: { hardDelete: boolean }) => {
      const url = `/api/admin/companies/${company.id}${hardDelete ? "?hard=true" : ""}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete company");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: "Empresa eliminada",
        description: variables.hardDelete
          ? `${company.name} y todos sus datos relacionados han sido eliminados permanentemente.`
          : `${company.name} ha sido desactivada.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (hardDelete: boolean) => {
    deleteCompanyMutation.mutate({ hardDelete });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Eliminar Empresa</DialogTitle>
          <DialogDescription>
            Esta acción eliminará permanentemente a {company.name} y todos sus datos relacionados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Advertencia!</strong> Esta acción eliminará permanentemente:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{company._count.users} usuario(s)</li>
                <li>{company._count.requests} solicitud(es)</li>
                <li>{company._count.contracts} contrato(s)</li>
                <li>Todas las cotizaciones relacionadas</li>
                <li>Todos los pagos relacionados</li>
                <li>Todos los documentos relacionados</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-700 font-medium mb-2">
              Información de la empresa:
            </p>
            <dl className="text-sm space-y-1">
              <div className="flex justify-between">
                <dt className="text-gray-600">Nombre:</dt>
                <dd className="font-medium">{company.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">NIT:</dt>
                <dd className="font-medium">{company.nit}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Email:</dt>
                <dd className="font-medium">{company.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteCompanyMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(true)}
            disabled={deleteCompanyMutation.isPending}
          >
            {deleteCompanyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar Permanentemente"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
