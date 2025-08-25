"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProvider } from "@/hooks/use-admin-providers";
import { Loader2 } from "lucide-react";
import { capitalizeCountry } from "@/lib/utils";

const createProviderSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Debe ser un email válido")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .optional()
    .or(z.literal("")),
  bankingDetails: z.string().optional(),
});

type CreateProviderForm = z.infer<typeof createProviderSchema>;

interface CreateProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProviderDialog({
  open,
  onOpenChange,
}: CreateProviderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createProvider = useCreateProvider();

  const form = useForm<CreateProviderForm>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      name: "",
      country: "",
      email: "",
      phone: "",
      bankingDetails: "",
    },
  });

  const onSubmit = async (data: CreateProviderForm) => {
    try {
      setIsSubmitting(true);

      await createProvider.mutateAsync({
        ...data,
        country: capitalizeCountry(data.country),
        email: data.email || undefined,
        phone: data.phone || undefined,
        bankingDetails: data.bankingDetails
          ? JSON.parse(data.bankingDetails)
          : null,
      });

      toast({
        title: "Proveedor creado",
        description: "El proveedor se ha creado exitosamente.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating provider:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al crear el proveedor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
          <DialogDescription>
            Complete la información del proveedor. Los campos marcados con * son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proveedor *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre del proveedor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el país" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ingrese el email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bankingDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles Bancarios (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese los detalles bancarios en formato JSON (opcional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Puede incluir información bancaria en formato JSON. Ejemplo:{" "}
                    {"{"}&quot;bank&quot;: &quot;Banco Central&quot;,
                    &quot;account&quot;: &quot;123456789&quot;{"}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear Proveedor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
