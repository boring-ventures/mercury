"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Truck,
  FileText,
  Calendar,
  Globe,
  User,
} from "lucide-react";
import { Provider } from "@/hooks/use-admin-providers";
import { ProviderDetailDialog } from "./provider-detail-dialog";
import { EditProviderDialog } from "./edit-provider-dialog";
import { DeleteProviderDialog } from "./delete-provider-dialog";

interface ProviderDataTableProps {
  providers: Provider[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function ProviderDataTable({
  providers,
  pagination,
}: ProviderDataTableProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  };

  if (providers.length === 0) {
    return (
      <div className="text-center py-8">
        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay proveedores registrados
        </h3>
        <p className="text-gray-500">
          No se encontraron proveedores que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Usuario Asignado</TableHead>
              <TableHead>Solicitudes</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    {provider.email && (
                      <div className="text-sm text-gray-500">
                        {provider.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">{provider.country}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {provider.phone ? (
                      <span>{provider.phone}</span>
                    ) : (
                      <span className="text-gray-400">Sin teléfono</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {provider.user ? (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-blue-600" />
                      <div className="text-sm">
                        <div className="font-medium">
                          {provider.user.firstName} {provider.user.lastName}
                        </div>
                        {provider.user.company && (
                          <div className="text-xs text-gray-500">
                            {provider.user.company.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Sin usuario asignado
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium">
                      {provider._count.requests}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(provider.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(provider)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(provider)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(provider)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} proveedores
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {selectedProvider && (
        <>
          <ProviderDetailDialog
            provider={selectedProvider}
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          />
          <EditProviderDialog
            provider={selectedProvider}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteProviderDialog
            provider={selectedProvider}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
