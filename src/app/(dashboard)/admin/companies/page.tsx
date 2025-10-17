"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Loader2,
} from "lucide-react";
import { useAdminCompanies } from "@/hooks/use-admin-companies";
import { CompanyDataTable } from "@/components/admin/companies/company-data-table";
import { CreateCompanyDialog } from "@/components/admin/companies/create-company-dialog";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch companies and stats
  const { data: companiesData, isLoading } = useAdminCompanies({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    companyType: companyTypeFilter === "all" ? undefined : companyTypeFilter,
    activity: activityFilter === "all" ? undefined : activityFilter,
  });

  const companies = companiesData?.companies || [];
  const totalCompanies = companiesData?.pagination?.total || 0;

  // Calculate stats
  const stats = {
    totalCompanies,
    activeCompanies: companies.filter((c) => c.status === "ACTIVE").length,
    inactiveCompanies: companies.filter((c) => c.status === "INACTIVE").length,
    totalUsers: companies.reduce((sum, c) => sum + c._count.users, 0),
    totalRequests: companies.reduce((sum, c) => sum + c._count.requests, 0),
    totalContracts: companies.reduce((sum, c) => sum + c._count.contracts, 0),
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Empresas
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las empresas registradas en la plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Empresa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.totalCompanies
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Empresas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.activeCompanies
              )}
            </div>
            <p className="text-xs text-muted-foreground">Empresas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.totalUsers
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Solicitudes
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.totalRequests
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Solicitudes procesadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <Badge variant="outline">
              {totalCompanies} empresas encontradas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activas</SelectItem>
                <SelectItem value="INACTIVE">Inactivas</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={companyTypeFilter}
              onValueChange={setCompanyTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="SA">Sociedad Anónima</SelectItem>
                <SelectItem value="SRL">Sociedad Limitada</SelectItem>
                <SelectItem value="UNIPERSONAL">Empresa Unipersonal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las actividades</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyDataTable
            companies={companies}
            pagination={companiesData?.pagination}
          />
        </CardContent>
      </Card>

      {/* Create Company Dialog */}
      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
