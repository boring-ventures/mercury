"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Provider } from "@/hooks/use-admin-providers";

interface EditProviderDialogProps {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProviderDialog({
  provider,
  open,
  onOpenChange,
}: EditProviderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
          <DialogDescription>
            Modificar información de {provider.name}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center text-gray-500">
          <p>Funcionalidad de edición en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
