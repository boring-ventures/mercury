"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Company } from "@/hooks/use-admin-companies";

interface CompanyDetailDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailDialog({
  company,
  open,
  onOpenChange,
}: CompanyDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Empresa</DialogTitle>
          <DialogDescription>
            Información detallada de {company.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <p className="text-sm text-gray-600">{company.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">NIT</label>
              <p className="text-sm text-gray-600">{company.nit}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-gray-600">{company.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <p className="text-sm text-gray-600">{company.phone}</p>
            </div>
          </div>

          <div className="text-center text-gray-500">
            <p>Funcionalidad de detalles en desarrollo...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
