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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateCompany } from "@/hooks/use-admin-companies";
import { Loader2 } from "lucide-react";

const createCompanySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  nit: z.string().min(8, "El NIT debe tener al menos 8 caracteres"),
  companyType: z.string().min(1, "Debe seleccionar un tipo de empresa"),
  country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  activity: z.string().min(1, "Debe seleccionar una actividad"),
  contactName: z
    .string()
    .min(2, "El nombre de contacto debe tener al menos 2 caracteres"),
  contactPosition: z
    .string()
    .min(2, "El cargo debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  bankingDetails: z.string().optional(),
});

type CreateCompanyForm = z.infer<typeof createCompanySchema>;

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCompanyDialog({
  open,
  onOpenChange,
}: CreateCompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createCompany = useCreateCompany();

  const form = useForm<CreateCompanyForm>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      nit: "",
      companyType: "",
      country: "",
      city: "",
      activity: "",
      contactName: "",
      contactPosition: "",
      email: "",
      phone: "",
      bankingDetails: "",
    },
  });

  const onSubmit = async (data: CreateCompanyForm) => {
    try {
      setIsSubmitting(true);

      await createCompany.mutateAsync({
        ...data,
        bankingDetails: data.bankingDetails
          ? JSON.parse(data.bankingDetails)
          : null,
      });

      toast({
        title: "Empresa creada",
        description: "La empresa se ha creado exitosamente.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating company:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear la empresa",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Empresa</DialogTitle>
          <DialogDescription>
            Complete la información de la empresa. Todos los campos marcados con
            * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Empresa *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre de la empresa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el NIT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Empresa *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo de empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SA">Sociedad Anónima</SelectItem>
                        <SelectItem value="SRL">Sociedad Limitada</SelectItem>
                        <SelectItem value="UNIPERSONAL">
                          Empresa Unipersonal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actividad *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la actividad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IMPORTACION_GENERAL">
                          Importación General
                        </SelectItem>
                        <SelectItem value="IMPORTACION_ALIMENTOS">
                          Importación Alimentos
                        </SelectItem>
                        <SelectItem value="IMPORTACION_TEXTILES">
                          Importación Textiles
                        </SelectItem>
                        <SelectItem value="IMPORTACION_MAQUINARIA">
                          Importación Maquinaria
                        </SelectItem>
                        <SelectItem value="IMPORTACION_ELECTRONICA">
                          Importación Electrónica
                        </SelectItem>
                        <SelectItem value="IMPORTACION_VEHICULOS">
                          Importación Vehículos
                        </SelectItem>
                        <SelectItem value="COMERCIO_MAYORISTA">
                          Comercio Mayorista
                        </SelectItem>
                        <SelectItem value="COMERCIO_MINORISTA">
                          Comercio Minorista
                        </SelectItem>
                        <SelectItem value="OTROS">Otros</SelectItem>
                      </SelectContent>
                    </Select>
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

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese la ciudad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Contacto *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre de contacto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el cargo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
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
                    <FormLabel>Teléfono *</FormLabel>
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
                Crear Empresa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
