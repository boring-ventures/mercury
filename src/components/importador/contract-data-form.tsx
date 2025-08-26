"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  Banknote,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ContractDataFormProps {
  solicitudId: string;
  quotation: {
    id: string;
    code: string;
    amount: number;
    currency: string;
    totalInBs: number;
    terms?: string;
    notes?: string;
  };
  onContractCreated?: () => void;
}

export default function ContractDataForm({
  solicitudId,
  quotation,
  onContractCreated,
}: ContractDataFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyRif: "",
    companyCity: "",

    // Contact Person
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactPosition: "",

    // Contract Details
    contractStartDate: "",
    contractEndDate: "",
    paymentTerms: "",
    deliveryTerms: "",
    specialConditions: "",

    // Banking Information
    bankName: "",
    accountNumber: "",
    accountType: "",
    swiftCode: "",
    beneficiaryName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to create contract
      // const response = await fetch(`/api/contracts`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     solicitudId,
      //     quotationId: quotation.id,
      //     ...formData,
      //   }),
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Contrato creado exitosamente",
        description: "El contrato ha sido generado y está listo para revisión.",
      });

      setIsOpen(false);
      onContractCreated?.();
    } catch (error) {
      toast({
        title: "Error al crear contrato",
        description: "Hubo un problema al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "companyName",
      "companyAddress",
      "companyPhone",
      "companyEmail",
      "companyRif",
      "contactName",
      "contactPhone",
      "contactEmail",
      "contractStartDate",
      "contractEndDate",
      "bankName",
      "accountNumber",
      "beneficiaryName",
    ];

    return requiredFields.every((field) =>
      formData[field as keyof typeof formData]?.trim()
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Building2 className="h-4 w-4 mr-2" />
          Completar Datos del Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Datos del Contrato - Solicitud {solicitudId}
          </DialogTitle>
          <DialogDescription>
            Complete la información necesaria para generar el contrato de
            servicio. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Quotation Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resumen de Cotización Aprobada
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">Cotización</p>
                  <p className="font-bold text-blue-900">{quotation.code}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">Monto Principal</p>
                  <p className="font-bold text-blue-900">
                    ${quotation.amount.toLocaleString()} {quotation.currency}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">Total en Bs</p>
                  <p className="font-bold text-blue-900">
                    Bs {quotation.totalInBs.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">
                  Información Importante
                </h4>
                <p className="text-sm text-amber-800 mt-1">
                  Al completar estos datos, se generará automáticamente el
                  contrato de servicio. Asegúrese de que toda la información sea
                  correcta antes de proceder.
                </p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="companyName"
                    className="flex items-center gap-1"
                  >
                    Nombre de la Empresa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    placeholder="Nombre completo de la empresa"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyRif"
                    className="flex items-center gap-1"
                  >
                    RIF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyRif"
                    value={formData.companyRif}
                    onChange={(e) =>
                      handleInputChange("companyRif", e.target.value)
                    }
                    placeholder="J-12345678-9"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyAddress"
                    className="flex items-center gap-1"
                  >
                    Dirección <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyAddress"
                    value={formData.companyAddress}
                    onChange={(e) =>
                      handleInputChange("companyAddress", e.target.value)
                    }
                    placeholder="Dirección completa"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyCity"
                    className="flex items-center gap-1"
                  >
                    Ciudad
                  </Label>
                  <Input
                    id="companyCity"
                    value={formData.companyCity}
                    onChange={(e) =>
                      handleInputChange("companyCity", e.target.value)
                    }
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyPhone"
                    className="flex items-center gap-1"
                  >
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyPhone"
                    value={formData.companyPhone}
                    onChange={(e) =>
                      handleInputChange("companyPhone", e.target.value)
                    }
                    placeholder="+58 412-123-4567"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyEmail"
                    className="flex items-center gap-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) =>
                      handleInputChange("companyEmail", e.target.value)
                    }
                    placeholder="empresa@ejemplo.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Persona de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="contactName"
                    className="flex items-center gap-1"
                  >
                    Nombre Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    placeholder="Nombre y apellido"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contactPosition"
                    className="flex items-center gap-1"
                  >
                    Cargo
                  </Label>
                  <Input
                    id="contactPosition"
                    value={formData.contactPosition}
                    onChange={(e) =>
                      handleInputChange("contactPosition", e.target.value)
                    }
                    placeholder="Gerente, Director, etc."
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contactPhone"
                    className="flex items-center gap-1"
                  >
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    placeholder="+58 412-123-4567"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contactEmail"
                    className="flex items-center gap-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    placeholder="contacto@ejemplo.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="contractStartDate"
                    className="flex items-center gap-1"
                  >
                    Fecha de Inicio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contractStartDate"
                    type="date"
                    value={formData.contractStartDate}
                    onChange={(e) =>
                      handleInputChange("contractStartDate", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contractEndDate"
                    className="flex items-center gap-1"
                  >
                    Fecha de Finalización{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contractEndDate"
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) =>
                      handleInputChange("contractEndDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentTerms">Condiciones de Pago</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) =>
                      handleInputChange("paymentTerms", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar condiciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">
                        Pago por adelantado
                      </SelectItem>
                      <SelectItem value="partial">Pago parcial</SelectItem>
                      <SelectItem value="upon_completion">
                        Pago al completar
                      </SelectItem>
                      <SelectItem value="net_30">Neto 30 días</SelectItem>
                      <SelectItem value="net_60">Neto 60 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryTerms">Condiciones de Entrega</Label>
                  <Select
                    value={formData.deliveryTerms}
                    onValueChange={(value) =>
                      handleInputChange("deliveryTerms", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar condiciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fob">FOB</SelectItem>
                      <SelectItem value="cif">CIF</SelectItem>
                      <SelectItem value="exw">EXW</SelectItem>
                      <SelectItem value="ddp">DDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="specialConditions">
                  Condiciones Especiales
                </Label>
                <Textarea
                  id="specialConditions"
                  value={formData.specialConditions}
                  onChange={(e) =>
                    handleInputChange("specialConditions", e.target.value)
                  }
                  placeholder="Condiciones especiales o adicionales del contrato..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Información Bancaria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName" className="flex items-center gap-1">
                    Nombre del Banco <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="Nombre del banco"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="accountNumber"
                    className="flex items-center gap-1"
                  >
                    Número de Cuenta <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Número de cuenta bancaria"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Tipo de Cuenta</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) =>
                      handleInputChange("accountType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corriente">
                        Cuenta Corriente
                      </SelectItem>
                      <SelectItem value="ahorro">Cuenta de Ahorro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="swiftCode">Código SWIFT</Label>
                  <Input
                    id="swiftCode"
                    value={formData.swiftCode}
                    onChange={(e) =>
                      handleInputChange("swiftCode", e.target.value)
                    }
                    placeholder="Código SWIFT del banco"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="beneficiaryName"
                    className="flex items-center gap-1"
                  >
                    Nombre del Beneficiario{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={(e) =>
                      handleInputChange("beneficiaryName", e.target.value)
                    }
                    placeholder="Nombre completo del beneficiario de la cuenta"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando Contrato...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Contrato
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
