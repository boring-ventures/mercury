"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Company } from "@/hooks/use-admin-companies";

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCompanyDialog({
  company,
  open,
  onOpenChange,
}: EditCompanyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Modificar información de {company.name}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center text-gray-500">
          <p>Funcionalidad de edición en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
