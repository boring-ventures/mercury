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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  FileText,
  Calendar,
} from "lucide-react";
import { Company } from "@/hooks/use-admin-companies";
import { CompanyDetailDialog } from "./company-detail-dialog";
import { EditCompanyDialog } from "./edit-company-dialog";
import { DeleteCompanyDialog } from "./delete-company-dialog";

interface CompanyDataTableProps {
  companies: Company[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function CompanyDataTable({
  companies,
  pagination,
}: CompanyDataTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case "INACTIVE":
        return <Badge variant="secondary">Inactiva</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompanyTypeLabel = (type: string) => {
    switch (type) {
      case "SOCIEDAD_ANONIMA":
        return "Sociedad Anónima";
      case "SOCIEDAD_LIMITADA":
        return "Sociedad Limitada";
      case "EMPRESA_UNIPERSONAL":
        return "Empresa Unipersonal";
      case "COOPERATIVA":
        return "Cooperativa";
      case "OTRO":
        return "Otro";
      default:
        return type;
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case "COMERCIO":
        return "Comercio";
      case "INDUSTRIA":
        return "Industria";
      case "SERVICIOS":
        return "Servicios";
      case "AGRICULTURA":
        return "Agricultura";
      case "MINERIA":
        return "Minería";
      case "CONSTRUCCION":
        return "Construcción";
      case "OTRO":
        return "Otro";
      default:
        return activity;
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay empresas registradas
        </h3>
        <p className="text-gray-500">
          No se encontraron empresas que coincidan con los filtros aplicados.
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
              <TableHead>Empresa</TableHead>
              <TableHead>NIT</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Estadísticas</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-gray-500">
                      {company.contactName} • {company.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {company.nit}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getCompanyTypeLabel(company.companyType)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getActivityLabel(company.activity)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(company.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span>{company._count.users}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-green-600" />
                      <span>{company._count.requests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-purple-600" />
                      <span>{company._count.contracts}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(company.createdAt), "dd/MM/yyyy", {
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
                        onClick={() => handleViewDetails(company)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(company)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(company)}
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
            {pagination.total} empresas
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
      {selectedCompany && (
        <>
          <CompanyDetailDialog
            company={selectedCompany}
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          />
          <EditCompanyDialog
            company={selectedCompany}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteCompanyDialog
            company={selectedCompany}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
