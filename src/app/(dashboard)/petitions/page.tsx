"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdminRouteGuard } from "@/components/admin/admin-route-guard";
import Link from "next/link";

interface RegistrationPetition {
  id: string;
  companyName: string;
  ruc: string;
  country: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  bankingDetails: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  documents: {
    id: string;
    filename: string;
    type: string;
    status: string;
  }[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const activityLabels = {
  IMPORTACION_GENERAL: "Importación General",
  IMPORTACION_ALIMENTOS: "Importación de Alimentos",
  IMPORTACION_TEXTILES: "Importación de Textiles",
  IMPORTACION_MAQUINARIA: "Importación de Maquinaria",
  IMPORTACION_ELECTRONICA: "Importación de Electrónicos",
  IMPORTACION_VEHICULOS: "Importación de Vehículos",
  COMERCIO_MAYORISTA: "Comercio Mayorista",
  COMERCIO_MINORISTA: "Comercio Minorista",
  OTROS: "Otros",
};

function PetitionsPageContent() {
  const [petitions, setPetitions] = useState<RegistrationPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await fetch("/api/admin/registration-petitions");
      if (!response.ok) {
        throw new Error("Failed to fetch petitions");
      }
      const data = await response.json();
      setPetitions(data.petitions || []);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredPetitions = petitions.filter((petition) => {
    const matchesStatus =
      statusFilter === "all" || petition.status === statusFilter;
    const matchesSearch =
      petition.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.ruc.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPetitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPetitions = filteredPetitions.slice(startIndex, endIndex);

  const pendingCount = petitions.filter((p) => p.status === "PENDING").length;
  const approvedCount = petitions.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = petitions.filter((p) => p.status === "REJECTED").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Solicitudes de Registro
          </h1>
          <p className="text-gray-600 mt-2">
            Administrar peticiones de registro de nuevos importadores
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{petitions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Petitions Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Solicitudes de Registro</CardTitle>
          <CardDescription>
            {filteredPetitions.length} solicitudes encontradas
          </CardDescription>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por empresa, contacto, email o RUC..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="APPROVED">Aprobadas</SelectItem>
                  <SelectItem value="REJECTED">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          {currentPetitions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No hay solicitudes para mostrar</p>
              {searchTerm && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className="mt-2"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPetitions.map((petition) => (
                    <TableRow
                      key={petition.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {petition.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            RUC: {petition.ruc}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {petition.contactName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {petition.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{petition.country}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[petition.status]}>
                          {statusLabels[petition.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(petition.createdAt), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/petitions/${petition.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a{" "}
                    {Math.min(endIndex, filteredPetitions.length)} de{" "}
                    {filteredPetitions.length} resultados
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          const distance = Math.abs(page - currentPage);
                          return (
                            distance === 0 ||
                            distance === 1 ||
                            page === 1 ||
                            page === totalPages
                          );
                        })
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          </div>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PetitionsPage() {
  return (
    <AdminRouteGuard>
      <PetitionsPageContent />
    </AdminRouteGuard>
  );
}
