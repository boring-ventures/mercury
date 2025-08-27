"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Provider } from "@/hooks/use-admin-providers";

interface ProviderDetailDialogProps {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProviderDetailDialog({
  provider,
  open,
  onOpenChange,
}: ProviderDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Proveedor</DialogTitle>
          <DialogDescription>
            Información detallada de {provider.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <p className="text-sm text-gray-600">{provider.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">País</label>
              <p className="text-sm text-gray-600">{provider.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-gray-600">
                {provider.email || "No especificado"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <p className="text-sm text-gray-600">
                {provider.phone || "No especificado"}
              </p>
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
