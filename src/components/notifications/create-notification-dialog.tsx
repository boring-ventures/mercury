"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Users, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCreateNotification } from "@/hooks/use-notifications";
import { useUsers } from "@/hooks/use-users";
import { NotificationType } from "@/types/notifications";

const createNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título es muy largo"),
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .max(500, "El mensaje es muy largo"),
  type: z.nativeEnum(NotificationType),
  recipients: z.enum(["all", "specific"]),
  profileIds: z.array(z.string()).optional(),
});

type CreateNotificationFormData = z.infer<typeof createNotificationSchema>;

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateNotificationDialog = ({
  open,
  onOpenChange,
}: CreateNotificationDialogProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { createNotification, isLoading } = useCreateNotification();
  const { data: usersData } = useUsers({
    limit: 100,
    status: "ACTIVE",
  });

  const users = usersData?.users || [];

  const form = useForm<CreateNotificationFormData>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.INFO,
      recipients: "all",
      profileIds: [],
    },
  });

  const recipients = form.watch("recipients");

  const handleSubmit = async (data: CreateNotificationFormData) => {
    try {
      let payload;

      if (data.recipients === "all") {
        // Send to all active users
        const allUserIds = users.map((user) => user.id);
        payload = {
          title: data.title,
          message: data.message,
          type: data.type,
          profileIds: allUserIds,
        };
      } else {
        // Send to specific users
        payload = {
          title: data.title,
          message: data.message,
          type: data.type,
          profileIds: selectedUsers,
        };
      }

      createNotification(payload);
      onOpenChange(false);
      form.reset();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = () => {
    const allUserIds = users.map((user) => user.id);
    setSelectedUsers(allUserIds);
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  // Update form data when selected users change
  useEffect(() => {
    form.setValue("profileIds", selectedUsers);
  }, [selectedUsers, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Crear Nueva Notificación
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 flex-1 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título de la notificación"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NotificationType.INFO}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            Información
                          </div>
                        </SelectItem>
                        <SelectItem value={NotificationType.SUCCESS}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            Éxito
                          </div>
                        </SelectItem>
                        <SelectItem value={NotificationType.WARNING}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            Advertencia
                          </div>
                        </SelectItem>
                        <SelectItem value={NotificationType.ERROR}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            Error
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe el mensaje de la notificación"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatarios</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona los destinatarios" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Todos los usuarios activos
                        </div>
                      </SelectItem>
                      <SelectItem value="specific">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Usuarios específicos
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {recipients === "specific" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Seleccionar Usuarios ({selectedUsers.length} seleccionados)
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Seleccionar todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Deseleccionar todos
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-48 border rounded-md p-4">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleUserToggle(user.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {user.company?.name || "Sin empresa"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (recipients === "specific" && selectedUsers.length === 0)
                }
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar Notificación
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
