import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, User, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContractDataFormProps {
  quotation: {
    id: string;
    code: string;
    amount: number;
    currency: string;
    description: string;
    validUntil: string;
  };
  company: {
    name: string;
    nit: string;
    city: string;
    contactName: string;
    contactPosition: string;
  };
  onContractGenerated: (contractId: string) => void;
}

interface ContractFormData {
  // Company representative details
  representativeName: string;
  representativeCI: string;
  representativeRole: string;

  // Notary information
  notaryName: string;
  testimonioNumber: string;
  testimonioDate: string;

  // Power of attorney
  powerNumber: string;
  powerDate: string;

  // Contract details
  contractTitle: string;
  contractDescription: string;
  startDate: string;
  endDate: string;

  // Banking details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;

  // Additional details
  beneficiaryName: string;
  referenceName: string;
  referenceDate: string;
}

export function ContractDataForm({
  quotation,
  company,
  onContractGenerated,
}: ContractDataFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    representativeName: company.contactName || "",
    representativeCI: "",
    representativeRole: company.contactPosition || "Representante Legal",
    notaryName: "",
    testimonioNumber: "",
    testimonioDate: "",
    powerNumber: "",
    powerDate: "",
    contractTitle: `Contrato de Servicio - ${quotation.code}`,
    contractDescription: quotation.description,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    bankName: "",
    accountHolder: company.name,
    accountNumber: "",
    accountType: "Cuenta corriente",
    beneficiaryName: "",
    referenceName: "",
    referenceDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/quotations/${quotation.id}/generate-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error generating contract");
      }

      const { contractId } = await response.json();

      toast({
        title: "Contrato generado exitosamente",
        description: "El contrato ha sido creado y está listo para revisión.",
      });

      setIsOpen(false);
      onContractGenerated(contractId);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error generando el contrato",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.representativeName.trim() &&
      formData.representativeCI.trim() &&
      formData.notaryName.trim() &&
      formData.testimonioNumber.trim() &&
      formData.testimonioDate.trim() &&
      formData.powerNumber.trim() &&
      formData.powerDate.trim() &&
      formData.bankName.trim() &&
      formData.accountNumber.trim()
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Generar Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generar Contrato de Servicio</DialogTitle>
          <DialogDescription>
            Complete los datos requeridos para generar el contrato. Los campos
            marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quotation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen de Cotización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Código de Cotización
                  </Label>
                  <p className="text-lg font-semibold">{quotation.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Monto</Label>
                  <p className="text-lg font-semibold">
                    ${quotation.amount.toLocaleString()} {quotation.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Empresa</Label>
                  <p className="text-lg font-semibold">{company.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">NIT</Label>
                  <p className="text-lg font-semibold">{company.nit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Representative Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Representante Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="representativeName"
                    className="text-sm font-medium"
                  >
                    Nombre Completo *
                  </Label>
                  <Input
                    id="representativeName"
                    value={formData.representativeName}
                    onChange={(e) =>
                      handleInputChange("representativeName", e.target.value)
                    }
                    placeholder="Nombre completo del representante"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="representativeCI"
                    className="text-sm font-medium"
                  >
                    Cédula de Identidad *
                  </Label>
                  <Input
                    id="representativeCI"
                    value={formData.representativeCI}
                    onChange={(e) =>
                      handleInputChange("representativeCI", e.target.value)
                    }
                    placeholder="Número de CI"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="representativeRole"
                    className="text-sm font-medium"
                  >
                    Cargo *
                  </Label>
                  <Input
                    id="representativeRole"
                    value={formData.representativeRole}
                    onChange={(e) =>
                      handleInputChange("representativeRole", e.target.value)
                    }
                    placeholder="Cargo en la empresa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notary Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Notarial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notaryName" className="text-sm font-medium">
                    Nombre del Notario *
                  </Label>
                  <Input
                    id="notaryName"
                    value={formData.notaryName}
                    onChange={(e) =>
                      handleInputChange("notaryName", e.target.value)
                    }
                    placeholder="Nombre del notario"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="testimonioNumber"
                    className="text-sm font-medium"
                  >
                    Número de Testimonio *
                  </Label>
                  <Input
                    id="testimonioNumber"
                    value={formData.testimonioNumber}
                    onChange={(e) =>
                      handleInputChange("testimonioNumber", e.target.value)
                    }
                    placeholder="Número de testimonio"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="testimonioDate"
                    className="text-sm font-medium"
                  >
                    Fecha de Testimonio *
                  </Label>
                  <Input
                    id="testimonioDate"
                    type="date"
                    value={formData.testimonioDate}
                    onChange={(e) =>
                      handleInputChange("testimonioDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Power of Attorney */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Poder de Representación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="powerNumber" className="text-sm font-medium">
                    Número de Poder *
                  </Label>
                  <Input
                    id="powerNumber"
                    value={formData.powerNumber}
                    onChange={(e) =>
                      handleInputChange("powerNumber", e.target.value)
                    }
                    placeholder="Número de poder"
                  />
                </div>
                <div>
                  <Label htmlFor="powerDate" className="text-sm font-medium">
                    Fecha de Poder *
                  </Label>
                  <Input
                    id="powerDate"
                    type="date"
                    value={formData.powerDate}
                    onChange={(e) =>
                      handleInputChange("powerDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalles del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contractTitle" className="text-sm font-medium">
                  Título del Contrato
                </Label>
                <Input
                  id="contractTitle"
                  value={formData.contractTitle}
                  onChange={(e) =>
                    handleInputChange("contractTitle", e.target.value)
                  }
                  placeholder="Título del contrato"
                />
              </div>
              <div>
                <Label
                  htmlFor="contractDescription"
                  className="text-sm font-medium"
                >
                  Descripción del Servicio
                </Label>
                <Textarea
                  id="contractDescription"
                  value={formData.contractDescription}
                  onChange={(e) =>
                    handleInputChange("contractDescription", e.target.value)
                  }
                  placeholder="Descripción detallada del servicio"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Fecha de Inicio
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Fecha de Finalización
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Bancaria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName" className="text-sm font-medium">
                    Nombre del Banco *
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="Nombre del banco"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="accountHolder"
                    className="text-sm font-medium"
                  >
                    Titular de la Cuenta
                  </Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) =>
                      handleInputChange("accountHolder", e.target.value)
                    }
                    placeholder="Titular de la cuenta"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-medium"
                  >
                    Número de Cuenta *
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Número de cuenta"
                  />
                </div>
                <div>
                  <Label htmlFor="accountType" className="text-sm font-medium">
                    Tipo de Cuenta
                  </Label>
                  <Input
                    id="accountType"
                    value={formData.accountType}
                    onChange={(e) =>
                      handleInputChange("accountType", e.target.value)
                    }
                    placeholder="Tipo de cuenta"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Información Adicional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="beneficiaryName"
                    className="text-sm font-medium"
                  >
                    Nombre del Beneficiario
                  </Label>
                  <Input
                    id="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={(e) =>
                      handleInputChange("beneficiaryName", e.target.value)
                    }
                    placeholder="Nombre del beneficiario"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="referenceName"
                    className="text-sm font-medium"
                  >
                    Nombre de Referencia
                  </Label>
                  <Input
                    id="referenceName"
                    value={formData.referenceName}
                    onChange={(e) =>
                      handleInputChange("referenceName", e.target.value)
                    }
                    placeholder="Nombre de referencia"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="referenceDate"
                    className="text-sm font-medium"
                  >
                    Fecha de Referencia
                  </Label>
                  <Input
                    id="referenceDate"
                    type="date"
                    value={formData.referenceDate}
                    onChange={(e) =>
                      handleInputChange("referenceDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Generando..." : "Generar Contrato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
