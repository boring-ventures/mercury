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
  Truck,
  Globe,
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Loader2,
} from "lucide-react";
import { useAdminProviders } from "@/hooks/use-admin-providers";
import { ProviderDataTable } from "@/components/admin/providers/provider-data-table";
import { CreateProviderDialog } from "@/components/admin/providers/create-provider-dialog";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch providers and stats
  const { data: providersData, isLoading } = useAdminProviders({
    search: searchTerm,
    country: countryFilter === "all" ? undefined : countryFilter,
  });

  const providers = providersData?.providers || [];
  const totalProviders = providersData?.pagination?.total || 0;

  // Calculate stats
  const stats = {
    totalProviders,
    totalRequests: providers.reduce((sum, p) => sum + p._count.requests, 0),
    countries: new Set(providers.map((p) => p.country)).size,
    providersWithUsers: providers.filter((p) => p.user).length,
  };

  // Get unique countries for filter
  const countries = Array.from(new Set(providers.map((p) => p.country))).sort();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Proveedores
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los proveedores registrados en la plataforma
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
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proveedores
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.totalProviders
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Proveedores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Solicitudes
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Países</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.countries
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Países representados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Con Usuario Asignado
            </CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.providersWithUsers
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Proveedores con usuario
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
              {totalProviders} proveedores encontrados
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los países</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <ProviderDataTable
            providers={providers}
            pagination={providersData?.pagination}
          />
        </CardContent>
      </Card>

      {/* Create Provider Dialog */}
      <CreateProviderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
