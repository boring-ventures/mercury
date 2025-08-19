import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Check,
  Building2,
  User,
  Calendar,
  DollarSign,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContractPreviewModalProps {
  contract: {
    id: string;
    code: string;
    title: string;
    description: string;
    amount: number;
    currency: string;
    status: string;
    startDate: string;
    endDate: string;
    terms: string;
    createdAt: string;
    signedAt?: string;
  };
  company: {
    name: string;
    nit: string;
    city: string;
    contactName: string;
    contactPosition: string;
  };
  quotation: {
    code: string;
    amount: number;
    currency: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onContractAccepted: () => void;
}

export function ContractPreviewModal({
  contract,
  company,
  quotation,
  isOpen,
  onClose,
  onContractAccepted,
}: ContractPreviewModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/contracts/${contract.id}/docx`);
      if (!response.ok) {
        throw new Error("Error downloading contract");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-${contract.code}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Contrato descargado",
        description: "El archivo del contrato se ha descargado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al descargar el contrato",
        variant: "destructive",
      });
    }
  };

  const handleAccept = async () => {
    setIsAccepting(true);

    try {
      const response = await fetch(`/api/contracts/${contract.id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error accepting contract");
      }

      toast({
        title: "Contrato aceptado",
        description:
          "El contrato ha sido aceptado exitosamente. Se ha notificado al administrador.",
      });

      onContractAccepted();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error aceptando el contrato",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-orange-100 text-orange-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Borrador";
      case "ACTIVE":
        return "Activo";
      case "COMPLETED":
        return "Completado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vista Previa del Contrato
          </DialogTitle>
          <DialogDescription>
            Revise los detalles del contrato antes de aceptarlo. Puede descargar
            el documento completo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{contract.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Código: {contract.code}
                  </p>
                </div>
                <Badge className={getStatusColor(contract.status)}>
                  {getStatusLabel(contract.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Fecha de Creación</p>
                    <p className="font-medium">
                      {format(new Date(contract.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Monto del Contrato</p>
                    <p className="font-medium">
                      ${contract.amount.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Empresa</p>
                    <p className="font-medium">{company.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Descripción del Servicio
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {contract.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Período del Contrato
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Inicio:</span>
                      <span className="font-medium">
                        {format(new Date(contract.startDate), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fin:</span>
                      <span className="font-medium">
                        {format(new Date(contract.endDate), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Información Financiera
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cotización:</span>
                      <span className="font-medium">{quotation.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monto:</span>
                      <span className="font-medium">
                        ${quotation.amount.toLocaleString()}{" "}
                        {quotation.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Datos de la Empresa
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nombre:</span>
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">NIT:</span>
                      <span className="font-medium">{company.nit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ciudad:</span>
                      <span className="font-medium">{company.city}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Representante Legal
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nombre:</span>
                      <span className="font-medium">{company.contactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cargo:</span>
                      <span className="font-medium">
                        {company.contactPosition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          {contract.terms && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Términos y Condiciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {contract.terms}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">
                    Importante
                  </h4>
                  <p className="text-sm text-orange-800">
                    Al aceptar este contrato, usted confirma que ha revisado
                    todos los términos y condiciones y está de acuerdo con los
                    mismos. Esta acción es irreversible y procederá al siguiente
                    paso del proceso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAccepting}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isAccepting}
            className="flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar DOCX
          </Button>

          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            {isAccepting ? "Aceptando..." : "Aceptar Contrato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
