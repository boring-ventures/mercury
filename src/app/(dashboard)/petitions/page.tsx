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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Loader2,
  Ban,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdminRouteGuard } from "@/components/admin/admin-route-guard";
import Link from "next/link";

interface RegistrationPetition {
  id: string;
  companyName: string;
  nit: string;
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

function PetitionsPageContent() {
  const [petitions, setPetitions] = useState<RegistrationPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Reject dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState<RegistrationPetition | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petitionToDelete, setPetitionToDelete] = useState<RegistrationPetition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleRejectClick = (petition: RegistrationPetition) => {
    setSelectedPetition(petition);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedPetition || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "La razón del rechazo es obligatoria",
        variant: "destructive",
      });
      return;
    }

    setIsRejecting(true);

    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${selectedPetition.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al rechazar la solicitud");
      }

      toast({
        title: "Solicitud rechazada",
        description: "Se ha enviado una notificación detallada al solicitante.",
      });

      // Refresh petitions list
      await fetchPetitions();

      // Close dialog and reset state
      setRejectDialogOpen(false);
      setSelectedPetition(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting petition:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al rechazar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDeleteClick = (petition: RegistrationPetition) => {
    setPetitionToDelete(petition);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!petitionToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${petitionToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la solicitud");
      }

      toast({
        title: "Solicitud eliminada",
        description: "La solicitud de registro y sus documentos han sido eliminados.",
      });

      // Refresh petitions list
      await fetchPetitions();

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPetitionToDelete(null);
    } catch (error) {
      console.error("Error deleting petition:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
      petition.nit.includes(searchTerm);

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
                  placeholder="Buscar por empresa, contacto, email o NIT..."
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
                            NIT: {petition.nit}
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
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/petitions/${petition.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Link>
                          </Button>
                          {petition.status === "PENDING" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectClick(petition);
                              }}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(petition);
                            }}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Rechazar Solicitud de Registro
            </DialogTitle>
            <DialogDescription>
              {selectedPetition && (
                <>
                  Rechazando solicitud de <strong>{selectedPetition.companyName}</strong>
                  . Se enviará una notificación detallada al solicitante.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                ⚠️ Acciones que se realizarán:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Marcar solicitud como rechazada</li>
                <li>• Registrar motivos del rechazo</li>
                <li>• Enviar email detallado al solicitante</li>
                <li>• Permitir nueva solicitud en el futuro</li>
              </ul>
            </div>

            <div>
              <Label htmlFor="rejection-reason-quick">
                Razón del Rechazo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejection-reason-quick"
                placeholder="Explique detalladamente por qué se rechaza la solicitud..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Esta información aparecerá en el email de notificación
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedPetition(null);
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rechazando...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Confirmar Rechazo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Eliminar Solicitud de Registro
            </DialogTitle>
            <DialogDescription>
              {petitionToDelete && (
                <>
                  Eliminando solicitud de <strong>{petitionToDelete.companyName}</strong>
                  . Esta acción no se puede deshacer.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                ⚠️ Esta acción eliminará permanentemente:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• La solicitud de registro</li>
                <li>• Todos los documentos asociados</li>
                <li>
                  • Nota: Si la solicitud fue aprobada, la empresa creada NO
                  será eliminada
                </li>
              </ul>
            </div>

            {petitionToDelete && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Información de la solicitud:
                </h4>
                <dl className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Empresa:</dt>
                    <dd className="font-medium">{petitionToDelete.companyName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">NIT:</dt>
                    <dd className="font-medium">{petitionToDelete.nit}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Contacto:</dt>
                    <dd className="font-medium">{petitionToDelete.contactName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Estado:</dt>
                    <dd>
                      <Badge className={statusColors[petitionToDelete.status]}>
                        {statusLabels[petitionToDelete.status]}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPetitionToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar Eliminación
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
