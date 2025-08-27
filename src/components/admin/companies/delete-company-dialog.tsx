"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Company } from "@/hooks/use-admin-companies";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Eliminar Empresa</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar {company.name}?
          </DialogDescription>
        </DialogHeader>

        <div className="text-center text-gray-500">
          <p>Funcionalidad de eliminación en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
