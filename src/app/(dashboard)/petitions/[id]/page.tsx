"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  MessageSquare,
  UserCheck,
  UserX,
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  CheckCircle,
  Loader2,
  XCircle,
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
    mimeType: string;
    type: string;
    status: string;
    url?: string;
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

interface DocumentViewerProps {
  document: {
    id: string;
    filename: string;
    mimeType: string;
    type?: string;
    url?: string;
  };
}

function DocumentViewer({ document }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isImage =
    document.mimeType?.toLowerCase().includes("image") ||
    document.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  const isPDF =
    document.mimeType?.toLowerCase().includes("pdf") ||
    document.filename.toLowerCase().endsWith(".pdf");

  // For demo purposes, using placeholder URLs
  const documentUrl = document.url || `/api/documents/${document.id}`;

  if (isImage) {
    return (
      <div className="relative group">
        <div className="border rounded-lg overflow-hidden bg-gray-50">
          <img
            src={documentUrl}
            alt={document.filename}
            className="w-full h-64 object-contain"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src =
                `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsFullscreen(true)}
            className="bg-white/90 hover:bg-white"
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Ver completa
          </Button>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={documentUrl}
                alt={document.filename}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isPDF) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <div className="h-96">
          <iframe
            src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            className="w-full h-full"
            title={document.filename}
            onError={() => {
              // Fallback if PDF fails to load
              console.log("PDF failed to load:", document.filename);
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se puede mostrar el PDF</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(documentUrl, "_blank")}
                  className="mt-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </iframe>
        </div>
      </div>
    );
  }

  // Default fallback for other file types
  return (
    <div className="border rounded-lg p-8 text-center bg-gray-50">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">Vista previa no disponible</p>
      <p className="text-sm text-gray-500 mb-4">{document.filename}</p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(documentUrl, "_blank")}
      >
        <Download className="h-4 w-4 mr-2" />
        Descargar
      </Button>
    </div>
  );
}

function PetitionDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const petitionId = params.id as string;

  const [petition, setPetition] = useState<RegistrationPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // New state for note functionality
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [downloadingDocuments, setDownloadingDocuments] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteAddedRecently, setNoteAddedRecently] = useState(false);

  useEffect(() => {
    if (petitionId) {
      fetchPetition();
    }
  }, [petitionId]);

  const fetchPetition = async () => {
    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${petitionId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Error",
            description: "Solicitud no encontrada",
            variant: "destructive",
          });
          router.push("/petitions");
          return;
        }
        throw new Error("Failed to fetch petition");
      }
      const data = await response.json();
      setPetition(data.petition);
    } catch (error) {
      console.error("Error fetching petition:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!petition || !newNote.trim()) {
      toast({
        title: "Error",
        description: "La nota no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    setAddingNote(true);

    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${petition.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: newNote.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al agregar la nota");
      }

      toast({
        title: "Nota agregada",
        description: "La nota se ha agregado correctamente",
      });

      // Refresh petition data to show the new note
      await fetchPetition();

      // Reset form
      setNewNote("");
      setShowAddNoteDialog(false);

      // Show recent note indicator
      setNoteAddedRecently(true);
      setTimeout(() => setNoteAddedRecently(false), 5000); // Remove after 5 seconds
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al agregar la nota",
        variant: "destructive",
      });
    } finally {
      setAddingNote(false);
    }
  };

  const handleDownloadDocuments = async () => {
    if (!petition) return;

    if (!petition.documents || petition.documents.length === 0) {
      toast({
        title: "Sin documentos",
        description: "Esta solicitud no tiene documentos para descargar",
        variant: "destructive",
      });
      return;
    }

    setDownloadingDocuments(true);

    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${petition.id}/download-documents`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al descargar documentos");
      }

      // Get the ZIP file as blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `Documentos_${petition.companyName}_${petition.id.slice(-8)}.zip`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Descarga iniciada",
        description: `Descargando: ${filename}. Si algunos documentos no están disponibles, se incluirán archivos de error con los detalles.`,
      });
    } catch (error) {
      console.error("Error downloading documents:", error);
      toast({
        title: "Error al descargar",
        description:
          error instanceof Error
            ? error.message
            : "Error al descargar documentos. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setDownloadingDocuments(false);
    }
  };

  const handlePetitionAction = async (action: "approve" | "reject") => {
    if (!petition) return;

    // Validate inputs based on action
    if (action === "reject" && !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "La razón del rechazo es obligatoria",
        variant: "destructive",
      });
      return;
    }

    setProcessingAction(petition.id);

    try {
      const response = await fetch(
        `/api/admin/registration-petitions/${petition.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            reviewNotes: reviewNotes.trim() || null,
            rejectionReason:
              action === "reject" ? rejectionReason.trim() : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      toast({
        title: "Acción completada",
        description:
          action === "approve"
            ? "✅ Solicitud aprobada correctamente. Se ha creado la cuenta del usuario y se han enviado las credenciales por email."
            : "❌ Solicitud rechazada. Se ha enviado una notificación detallada al solicitante.",
      });

      // Refresh petition data
      await fetchPetition();

      // Reset form state
      setRejectionReason("");
      setReviewNotes("");
    } catch (error) {
      console.error(`Error ${action}ing petition:`, error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Error al ${action === "approve" ? "aprobar" : "rechazar"} la solicitud`,
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Solicitud no encontrada
        </h1>
        <Button asChild>
          <Link href="/petitions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a solicitudes
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            SOLICITUD DE REGISTRO - {petition.companyName}
          </h1>
          <p className="text-gray-600 mt-1">
            ID: {petition.id} • Recibida el{" "}
            {format(new Date(petition.createdAt), "dd/MM/yyyy 'a las' HH:mm", {
              locale: es,
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={statusColors[petition.status]} variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {statusLabels[petition.status]}
          </Badge>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href="/petitions">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Information - Larger Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                INFORMACIÓN DE LA EMPRESA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Nombre de la empresa:</span>
                    <span>{petition.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">RUC/NIT:</span>
                    <span>{petition.ruc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">País:</span>
                    <span>{petition.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Actividad económica:</span>
                    <span>
                      {activityLabels[
                        petition.activity as keyof typeof activityLabels
                      ] || petition.activity}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado actual:</span>
                    <Badge
                      className={statusColors[petition.status]}
                      variant="outline"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {statusLabels[petition.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de solicitud:</span>
                    <span>
                      {format(new Date(petition.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                INFORMACIÓN DE CONTACTO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Nombre de contacto:</span>
                <span>{petition.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cargo:</span>
                <span>{petition.contactPosition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${petition.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {petition.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Teléfono:</span>
                <a
                  href={`tel:${petition.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {petition.phone}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>ACCIONES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {petition.status === "PENDING" ? (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start gap-2">
                      <CheckCircle className="h-4 w-4" /> Aprobar Solicitud
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-green-600">
                        Aprobar Solicitud de Registro
                      </DialogTitle>
                      <DialogDescription>
                        Se creará una cuenta completa para el usuario y se
                        enviarán las credenciales por email
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">
                          ✅ Acciones que se realizarán:
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Crear usuario en Supabase Auth</li>
                          <li>• Crear perfil de importador</li>
                          <li>• Registrar empresa en el sistema</li>
                          <li>• Generar credenciales temporales</li>
                          <li>• Enviar email de bienvenida con credenciales</li>
                        </ul>
                      </div>

                      <div>
                        <Label htmlFor="approval-notes">
                          Notas de Aprobación (Opcional)
                        </Label>
                        <Textarea
                          id="approval-notes"
                          placeholder="Comentarios adicionales para el usuario o notas internas..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Estas notas aparecerán en el email de confirmación
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogTrigger>
                        <Button
                          onClick={() => handlePetitionAction("approve")}
                          disabled={processingAction === petition.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingAction === petition.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar Aprobación
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Rechazar Solicitud
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-600">
                        Rechazar Solicitud de Registro
                      </DialogTitle>
                      <DialogDescription>
                        Se enviará una notificación detallada al solicitante con
                        los motivos del rechazo
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
                        <Label htmlFor="rejection-reason">
                          Razón del Rechazo{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="rejection-reason"
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

                      <div>
                        <Label htmlFor="rejection-notes">
                          Notas Adicionales (Opcional)
                        </Label>
                        <Textarea
                          id="rejection-notes"
                          placeholder="Comentarios adicionales o sugerencias para mejorar la solicitud..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Notas complementarias que aparecerán en el email
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogTrigger>
                        <Button
                          variant="destructive"
                          onClick={() => handlePetitionAction("reject")}
                          disabled={
                            !rejectionReason.trim() ||
                            processingAction === petition.id
                          }
                        >
                          {processingAction === petition.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Confirmar Rechazo
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="text-center p-4">
                <Badge
                  className={statusColors[petition.status]}
                  variant="outline"
                >
                  {statusLabels[petition.status]}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Esta solicitud ya ha sido procesada
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleDownloadDocuments}
              disabled={downloadingDocuments || !petition.documents?.length}
              title={
                !petition.documents?.length
                  ? "No hay documentos para descargar"
                  : "Descargar todos los documentos en un archivo ZIP"
              }
            >
              {downloadingDocuments ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloadingDocuments ? "Descargando..." : "Descargar Documentos"}
            </Button>

            <Dialog
              open={showAddNoteDialog}
              onOpenChange={setShowAddNoteDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Agregar Nota
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    Agregar Nota
                  </DialogTitle>
                  <DialogDescription>
                    Agregar una nota interna a esta solicitud de registro. Esta
                    información solo será visible para administradores.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="new-note"
                      className="flex items-center justify-between"
                    >
                      <span>Nota</span>
                      <span className="text-xs text-muted-foreground">
                        {newNote.length}/500 caracteres
                      </span>
                    </Label>
                    <Textarea
                      id="new-note"
                      placeholder="Escribir nota..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value.slice(0, 500))}
                      className="mt-1 resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Esta nota aparecerá en el historial de la solicitud con tu
                      nombre y fecha
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddNoteDialog(false);
                        setNewNote("");
                      }}
                      disabled={addingNote}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddNote}
                      disabled={addingNote || !newNote.trim()}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {addingNote ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Agregando...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Agregar Nota
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Banking Details */}
      <Card>
        <CardHeader>
          <CardTitle>INFORMACIÓN BANCARIA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{petition.bankingDetails}</p>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>DOCUMENTOS ADJUNTOS</CardTitle>
          <CardDescription>
            {petition.documents.length} documento(s) adjunto(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {petition.documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay documentos adjuntos
            </p>
          ) : (
            <div className="space-y-6">
              {petition.documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{doc.filename}</h3>
                        <p className="text-sm text-gray-500">{doc.mimeType}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`/api/documents/${doc.id}`, "_blank")
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Abrir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = `/api/documents/${doc.id}`;
                          link.download = doc.filename;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>

                  {/* Document Viewer */}
                  <DocumentViewer document={doc} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>HISTORIAL Y NOTAS</span>
            {petition.reviewNotes && (
              <span className="text-sm font-normal text-muted-foreground">
                {
                  petition.reviewNotes
                    .split("\n\n")
                    .filter((note) => note.trim()).length
                }{" "}
                nota(s)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Registro cronológico de actividades y notas internas de la solicitud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Collect all timeline items and sort by date */}
          {(() => {
            const timelineItems = [];

            // Add system entry
            timelineItems.push({
              type: "system",
              timestamp: new Date(petition.createdAt),
              id: "system",
            });

            // Add notes
            if (petition.reviewNotes) {
              petition.reviewNotes
                .split("\n\n")
                .filter((note) => note.trim())
                .forEach((note, index) => {
                  const noteMatch = note.match(/^\[(.*?) - (.*?)\] (.*)$/s);
                  if (noteMatch) {
                    const [, timestamp, author, content] = noteMatch;
                    timelineItems.push({
                      type: "note",
                      timestamp: new Date(timestamp),
                      author,
                      content,
                      id: `note-${index}`,
                    });
                  } else {
                    timelineItems.push({
                      type: "note",
                      timestamp: new Date(petition.createdAt),
                      author: "Nota",
                      content: note,
                      id: `legacy-note-${index}`,
                    });
                  }
                });
            }

            // Add approval/rejection event if exists
            if (
              petition.reviewedAt &&
              (petition.status === "APPROVED" || petition.status === "REJECTED")
            ) {
              timelineItems.push({
                type: "decision",
                timestamp: new Date(petition.reviewedAt),
                status: petition.status,
                rejectionReason: petition.rejectionReason,
                id: "decision",
              });
            }

            // Sort by timestamp (newest first)
            timelineItems.sort(
              (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            );

            return timelineItems.map((item) => {
              if (item.type === "system") {
                return (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg bg-blue-50 border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">Sistema</span>
                      <span className="text-sm text-blue-600">
                        {format(item.timestamp, "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Solicitud de registro recibida. Documentos en revisión.
                    </p>
                  </div>
                );
              } else if (item.type === "note") {
                const isRecent =
                  item.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000);

                return (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg transition-all duration-300 ${
                      isRecent
                        ? "bg-amber-50 border-amber-300 shadow-sm"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">
                          {item.author}
                        </span>
                        {isRecent && (
                          <span className="px-2 py-1 text-xs bg-amber-200 text-amber-800 rounded-full">
                            Reciente
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-amber-600">
                        {format(item.timestamp, "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 whitespace-pre-wrap leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                );
              } else {
                // Decision item (approval/rejection)
                return (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg ${
                      item.status === "APPROVED"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-medium ${
                          item.status === "APPROVED"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {item.status === "APPROVED"
                          ? "✅ Solicitud Aprobada"
                          : "❌ Solicitud Rechazada"}
                      </span>
                      <span
                        className={`text-sm ${
                          item.status === "APPROVED"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {format(item.timestamp, "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    {item.rejectionReason && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Razón del rechazo:
                        </p>
                        <p className="text-sm text-red-700 whitespace-pre-wrap">
                          {item.rejectionReason}
                        </p>
                      </div>
                    )}
                    {item.status === "APPROVED" && (
                      <p className="text-sm text-green-700">
                        Se ha creado la cuenta del usuario y se han enviado las
                        credenciales por email.
                      </p>
                    )}
                  </div>
                );
              }
            });
          })()}

          {/* Show message if no notes */}
          {!petition.reviewNotes && petition.status === "PENDING" && (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No hay notas agregadas aún. Utiliza el botón "Agregar Nota" para
                añadir comentarios internos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PetitionDetailPage() {
  return (
    <AdminRouteGuard>
      <PetitionDetailPageContent />
    </AdminRouteGuard>
  );
}
