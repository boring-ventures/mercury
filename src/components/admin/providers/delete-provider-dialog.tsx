"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Provider } from "@/hooks/use-admin-providers";

interface DeleteProviderDialogProps {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProviderDialog({
  provider,
  open,
  onOpenChange,
}: DeleteProviderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Eliminar Proveedor</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar {provider.name}?
          </DialogDescription>
        </DialogHeader>

        <div className="text-center text-gray-500">
          <p>Funcionalidad de eliminación en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
