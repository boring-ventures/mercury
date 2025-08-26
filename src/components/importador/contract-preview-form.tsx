"use client";

import { useState, useEffect } from "react";
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
  Eye,
  Download,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useContractStatus } from "@/hooks/use-contract-status";
import { useQueryClient } from "@tanstack/react-query";

// Helper function to download text as file
const downloadTextAsFile = (
  content: string,
  filename: string,
  contentType: string
) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface ContractPreviewFormProps {
  solicitudId: string;
  quotation: {
    id: string;
    code: string;
    amount: number;
    currency: string;
    totalInBs: number;
    terms?: string;
    notes?: string;
    description?: string;
    createdAt?: string;
  };
  company?: {
    name?: string;
    nit?: string;
    city?: string;
    contactName?: string;
    contactPosition?: string;
    email?: string;
    phone?: string;
    address?: string;
    bankingDetails?: any;
    documents?: Array<{
      id: string;
      type: string;
      documentInfo?: string;
    }>;
  };
  request?: {
    description?: string;
    provider?: {
      name?: string;
      country?: string;
      bankingDetails?: any;
      email?: string;
      phone?: string;
    };
    documents?: Array<{
      id: string;
      type: string;
      documentInfo?: string;
    }>;
  };
  onContractCreated?: () => void;
}

interface ContractFormData {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyRif: string;
  companyCity: string;

  // Contact Person
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactPosition: string;
  contactCI: string;

  // Notary Information
  notaryName: string;
  testimonioNumber: string;
  powerNumber: string;

  // Contract Details
  contractStartDate: string;
  contractEndDate: string;
  paymentTerms: string;
  deliveryTerms: string;
  specialConditions: string;

  // Provider Information (from request)
  providerName: string;
  providerCountry: string;
  providerEmail: string;
  providerPhone: string;
  providerBankName: string;
  providerAccountNumber: string;
  providerSwiftCode: string;
  providerBankAddress: string;
  providerBeneficiaryName: string;
  providerAccountType: string;
}

// Contract template with placeholders
const CONTRACT_TEMPLATE = `DOCUMENTO PRIVADO

Conste por el presente documento privado, un Contrato de Prestación de servicios para el pago de proveedores en el extranjero, que con el solo reconocimiento de firmas y rúbricas podrá ser elevado a la categoría de público, lo suscrito de conformidad a los siguientes términos y condiciones:

PRIMERA: PARTES INTERVINIENTES.-

Concurren a la celebración del presente Contrato:

1.1. NORDEX GLOBAL SRL, empresa establecida y constituida legalmente con Número de Identificación Tributaria – NIT XXXXX, con domicilio en calle Manzana 40, piso 9, representado por su Gerente General, Lic. Jimena León Céspedes con C.I. 5810245 TJ, mayor de edad, hábil por derecho, en mérito al Testimonio 610/2025 del 28 de julio de 2025 otorgado ante la Notaria de Fe Pública a cargo de la Dr. Ichin Isaías Ma Avalos, que en adelante y para efectos del presente se denominará simplemente el "PROVEEDOR".

1.2. {importer.company} con Matrícula de Comercio y NIT No. {importer.nit} y domicilio en {importer.address} en la ciudad de {importer.city}, legalmente representado por su {importer.representative.role} {importer.representative.name}, con cédula de identidad No. {importer.ci} expedida en {importer.city}, de acuerdo al Poder Notarial No. 809/2020 de fecha 15 de diciembre del 2020, en adelante y para efectos del presente "IMPORTADOR".

SEGUNDA: ANTECEDENTES.- 

El IMPORTADOR manifiesta que requiere realizar un pago internacional a favor de la empresa {beneficiary.name}, en el marco de la Cotización N.º  {reference.name} de fecha {quotation.date}, por la compra internacional de productos. En ese contexto, ha solicitado al PROVEEDOR una cotización para la prestación del servicio de gestión de pago internacional a nombre y por cuenta de {importer.company}.

TERCERA: OBJETO.- 

En virtud del presente contrato, el IMPORTADOR encarga al PROVEEDOR la gestión y ejecución de un pago internacional a favor de {provider.name}, por la suma de {service.amountWords} bolivianos (Bs {service.amount}) por concepto de pago por la compra internacional de productos según {reference.name} ("Operación").

El PROVEEDOR actuará únicamente como intermediario pagador, sin asumir responsabilidad alguna sobre la relación comercial o contractual entre el IMPORTADOR y {provider.name}, salvo la correcta ejecución del pago según las instrucciones otorgadas por el IMPORTADOR.

CUARTA: CARACTERÍSTICAS DEL SERVICIO. – 

El servicio que prestará el PROVEEDOR consistirá en: a) La recepción de fondos por parte del IMPORTADOR en moneda nacional en la cuenta designada por el PROVEEDOR. b) La conversión de dichos fondos a dólares estadounidenses, en caso de ser requerido, utilizando plataformas de intercambio autorizadas o mecanismos legales disponibles. c) La transferencia de los fondos a la cuenta bancaria del proveedor en el exterior, conforme a las instrucciones y datos proporcionados por el IMPORTADOR. d) La emisión de documentación de respaldo, incluyendo comprobante del pago internacional, y cualquier otro documento que certifique la efectivización de la operación.

El PROVEEDOR no asumirá responsabilidad por demoras, rechazos u observaciones del banco receptor o intermediario, siempre que haya actuado conforme a las instrucciones y datos proporcionados por el IMPORTADOR.

QUINTA: PRECIO Y FORMA DE PAGO.- 

El IMPORTADOR transferirá al PROVEEDOR para la ejecución de las operaciones mencionadas el total de lo descrito en la cláusula Tercera, bajo el concepto de Pagos a Proveedores Extranjeros, así mismo, pagará al PROVEEDOR por concepto de honorarios un total de {service.feeWords} bolivianos (Bs {service.fee}), para lo cual el PROVEEDOR emitirá la factura correspondiente al servicio por el monto total de los honorarios percibidos al finalizar la ejecución de la OPERACIÓN, dejándose constancia que los pagos serán realizado mediante transferencia bancaria a la cuenta empresarial del PROVEEDOR:

Nombre del Banco: {provider.bankName}
Titular: {provider.beneficiaryName}
Número de cuenta: {provider.accountNumber}
Moneda: Dólares Estadounidenses
Tipo: {provider.accountType}

SEXTA: PLAZO DE CUMPLIMIENTO.- 

Las Partes de común acuerdo, convienen que el pago al proveedor extranjero será realizado entre el {contract.startDate} hasta el {contract.endDate}.

En caso de que el PROVEEDOR no realizara el pago correspondiente en el plazo convenido, comunicará al IMPORTADOR y devolverá en su totalidad lo que hubiese recibido por parte del IMPORTADOR.

No se considerará incumplimiento si el pago no puede realizarse por razones atribuibles al IMPORTADOR, por fuerza mayor, o por circunstancias ajenas al control del PROVEEDOR, incluyendo demoras del sistema bancario internacional o restricciones regulatorias.

SEPTIMA: OBLIGACIONES DE LAS PARTES.- 

Como consecuencia de la suscripción del presente Contrato, surgen determinadas obligaciones para cada una de las partes, a saber:
Obligaciones del PROVEEDOR:
- Asumir las obligaciones y compromisos de manera profesional y eficiente.
- Responder por retrasos.
- Proporcionar toda la documentación de respaldo necesaria de la efectivización de la operación.
Obligaciones de IMPORTADOR:
- Cancelar al PROVEEDOR el total del precio convenido.   
- Proporcionar toda la documentación de respaldo necesaria para realización de la operación.   
- Asumir la responsabilidad exclusiva por la veracidad y legalidad de los pagos solicitados, eximiendo al PROVEEDOR de cualquier responsabilidad relacionada con el destino, calidad, origen o legalidad de los productos adquiridos.

OCTAVA: PERSONAL E INDEPENDENCIA LABORAL.- 

Se acuerda que por la naturaleza del presente contrato, no existe ninguna relación de dependencia laboral entre el IMPORTADOR y el PROVEEDOR o sus dependientes, trabajadores o subcontratistas, al contrario, se establece una relación exclusivamente de prestación de servicio; por lo que el PROVEEDOR o sus dependientes, trabajadores o subcontratistas, no deberán considerar que son empleados, agentes o funcionarios del IMPORTADOR, debido a que la relación civil existente entre las Partes contratantes es celebrada al amparo de lo previsto en el Art. 732 parágrafo II del Código Civil y la eficacia del contrato conforme al Art. 519 del citado cuerpo legal, siendo inexistente relación laboral alguna de subordinación permanente o dependencia.

NOVENA: CONFIDENCIALIDAD.- 

El PROVEEDOR por sí y por sus dependientes, trabajadores o subcontratistas, se obliga a no revelar ni divulgar de modo alguno a terceros, como tampoco a usar de cualquier forma, la información confidencial que se le suministre y que obtenga de cualquier modo con ocasión de la ejecución de los trabajos que realizará para el IMPORTADOR.

Adicionalmente, el PROVEEDOR se obliga a restringir el acceso a la información confidencial sólo a aquellas personas que tengan la necesidad de conocerla para los efectos de la realización de los trabajos encomendados, sean estos asesores, consultores, dependientes, trabajadores o subcontratistas del PROVEEDOR, acceso que deberá en todo caso quedar sujeto a la condición que tales personas acepten quedar obligadas a guardar la confidencialidad de la información, en los mismos términos que el PROVEEDOR.

DÉCIMA: DOMICILIOS.- 

Las comunicaciones y/o notificaciones entre las Partes contratantes – para todos los efectos de este Contrato o las consecuencias emergentes del mismo - se enviarán válidamente mediante nota escrita en idioma español, en las direcciones indicadas en la cláusula primera.

DÉCIMA PRIMERA: PREVENCIÓN CONTRA EL LAVADO DE DINERO Y FINANCIAMIENTO DEL TERRORISMO.- 

El IMPORTADOR declara y garantiza que los fondos utilizados para el pago de proveedores internacionales tienen un origen lícito, conforme a las leyes nacionales e internacionales en materia de prevención del lavado de activos y financiamiento del terrorismo. Asimismo, manifiesta que dichos fondos no provienen de actividades ilícitas ni están relacionados, directa o indirectamente, con el financiamiento del terrorismo o cualquier otra actividad delictiva.

El IMPORTADOR acepta y declara que ninguno de sus empleado(s), trabajador(es), socio(s), dignatario(s), dueño(s), beneficiario(s) final(es) han sido objeto de una investigación o han sido imputado(s), señalado(s) o sentenciado(s) por los delitos de blanqueo de capitales, lavado de activos, financiamiento del terrorismo, financiamiento de proliferación de armas de destrucción masiva, cohecho o soborno, delitos que se encuentren relacionados o en general, por cualquier otro hecho que por su naturaleza pudiese afectar la reputación del PROVEEDOR, o sus clientes.  
El IMPORTADOR se obliga a hacer cumplir con el máximo celo a sus empleado(s), trabajador(es), socio(s), dignatario(s), dueño(s), beneficiario(s) final(es) o dependiente(s), toda la normativa relacionada con delitos de blanqueo de capitales, lavado de activos, financiamiento del terrorismo, financiamiento de proliferación de armas de destrucción masiva, cohecho o soborno, delitos terroristas o sus relacionados, sanciones financieras y embargos financieros económicos y comerciales a nivel nacional e internacional, y otras figuras delictivas que pudieren afectar el nombre o reputación del PROVEEDOR.

El IMPORTADOR se compromete a proporcionar la documentación que el PROVEEDOR considere necesaria para verificar el origen de los fondos y cumplir con las normativas aplicables. En caso de detectarse indicios de actividades sospechosas, el PROVEEDOR podrá suspender o cancelar la prestación del servicio sin previo aviso, sin que ello genere responsabilidad alguna.

DÉCIMA SEGUNDA: LEY APLICABLE.- 

La ejecución, cumplimiento, incumplimiento e interpretación de este Contrato se regirán exclusivamente por las leyes del Estado Plurinacional de Bolivia.

DÉCIMA TERCERA: CONVENIO ARBITRAL.- 

Las Partes convienen que, en caso que devinieren controversias en el cumplimiento, ejecución, resolución e interpretación del presente Contrato, estas serán sometidas a Arbitraje a sustanciarse ante el Centro de Conciliación y Arbitraje de la Cámara de Industria, Comercio, Servicios y Turismo de la ciudad de Santa Cruz (CAINCO), y bajo su Reglamento. 

El laudo arbitral no será apelable ante tribunal alguno u otra entidad, será definitivo y de cumplimiento obligatorio para las Partes. La Parte cuyo derecho no prevaleciere en el arbitraje realizado, pagará todas las costas y gastos razonables en la substanciación del mismo, incluyendo los honorarios profesionales del abogado y/o apoderado legal contratado y/o designado por la Parte cuyo derecho sí prevaleció.

DÉCIMA CUARTA: MODIFICACIONES.- 

Ningún cambio, modificación o alteración del presente Contrato, será válido si el mismo no consta por escrito y cuenta con la firma de ambas partes, en una adenda. 

DÉCIMA QUINTA: ACEPTACIÓN Y CONFORMIDAD.- 

Las Partes, en señal de conformidad y aceptación de todas y cada una de las cláusulas del presente Contrato, suscriben el mismo obligándose a su fiel y estricto cumplimiento, en dos ejemplares de un solo tenor y para el mismo efecto.

Santa Cruz, {contract.date}.

{importer.representative.name}
Pp. / IMPORTADOR	Jimena León Céspedes
Pp. / PROVEEDOR`;

// Helper function to format numbers to words
function numberToWords(num: number): string {
  const units = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const teens = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const tens = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  if (num === 0) return "cero";
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const unit = num % 10;
    const ten = Math.floor(num / 10);
    return unit === 0 ? tens[ten] : `${tens[ten]} y ${units[unit]}`;
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return remainder === 0
      ? `${units[hundred]}cientos`
      : `${units[hundred]}cientos ${numberToWords(remainder)}`;
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return remainder === 0
      ? `${numberToWords(thousand)} mil`
      : `${numberToWords(thousand)} mil ${numberToWords(remainder)}`;
  }

  return num.toString();
}

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return "___/___/____";
  try {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: es,
    });
  } catch {
    return "___/___/____";
  }
}

export default function ContractPreviewForm({
  solicitudId,
  quotation,
  company,
  request,
  onContractCreated,
}: ContractPreviewFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Check contract status
  const { data: contractStatus } = useContractStatus(quotation.id);

  // Extract CI information from documents (check both request and company documents)
  const getCIFromDocuments = () => {
    // First check request documents
    if (request?.documents) {
      const carnetDocument = request.documents.find(
        (doc) => doc.type === "CARNET_IDENTIDAD"
      );
      if (carnetDocument?.documentInfo) {
        return carnetDocument.documentInfo;
      }
    }

    // Then check company documents (from registration)
    if (company?.documents) {
      const carnetDocument = company.documents.find(
        (doc) => doc.type === "CARNET_IDENTIDAD"
      );
      if (carnetDocument?.documentInfo) {
        return carnetDocument.documentInfo;
      }
    }

    return "";
  };

  // Helper function to safely get banking details
  const getBankingDetails = (bankingDetails: any) => {
    if (!bankingDetails) return {};

    // If it's a string, try to parse it as JSON
    if (typeof bankingDetails === "string") {
      try {
        return JSON.parse(bankingDetails);
      } catch {
        return {};
      }
    }

    // If it's already an object, return it
    if (typeof bankingDetails === "object") {
      return bankingDetails;
    }

    return {};
  };

  const [formData, setFormData] = useState<ContractFormData>({
    // Company Information
    companyName: company?.name || "",
    companyAddress: company?.address || "",
    companyPhone: company?.phone || "",
    companyEmail: company?.email || "",
    companyRif: company?.nit || "",
    companyCity: company?.city || "",

    // Contact Person
    contactName: company?.contactName || "",
    contactPhone: company?.phone || "",
    contactEmail: company?.email || "",
    contactPosition: company?.contactPosition || "",
    contactCI: getCIFromDocuments(),

    // Notary Information
    notaryName: "",
    testimonioNumber: "",
    powerNumber: "",

    // Contract Details
    contractStartDate: contractStatus?.startDate
      ? format(new Date(contractStatus.startDate), "yyyy-MM-dd")
      : "",
    contractEndDate: contractStatus?.endDate
      ? format(new Date(contractStatus.endDate), "yyyy-MM-dd")
      : "",
    paymentTerms: "",
    deliveryTerms: "",
    specialConditions: "",

    // Provider Information
    providerName: request?.provider?.name || "",
    providerCountry: request?.provider?.country || "",
    providerEmail: request?.provider?.email || "",
    providerPhone: request?.provider?.phone || "",
    providerBankName:
      getBankingDetails(request?.provider?.bankingDetails)?.bankName || "",
    providerAccountNumber:
      getBankingDetails(request?.provider?.bankingDetails)?.accountNumber || "",
    providerSwiftCode:
      getBankingDetails(request?.provider?.bankingDetails)?.swiftCode || "",
    providerBankAddress:
      getBankingDetails(request?.provider?.bankingDetails)?.bankAddress || "",
    providerBeneficiaryName:
      getBankingDetails(request?.provider?.bankingDetails)?.beneficiaryName ||
      "",
    providerAccountType: "",
  });

  // Check if contract exists and get its data
  const contractExists = contractStatus?.exists || false;

  // Update form data when props change
  useEffect(() => {
    // Debug: Log provider data
    console.log("Provider data:", request?.provider);
    console.log("Provider banking details:", request?.provider?.bankingDetails);
    console.log(
      "Provider banking details type:",
      typeof request?.provider?.bankingDetails
    );
    console.log(
      "Provider banking details keys:",
      request?.provider?.bankingDetails
        ? Object.keys(request.provider.bankingDetails)
        : "No banking details"
    );

    setFormData((prev) => ({
      ...prev,
      // Company Information
      companyName: company?.name || "",
      companyAddress: company?.address || "",
      companyPhone: company?.phone || "",
      companyEmail: company?.email || "",
      companyRif: company?.nit || "",
      companyCity: company?.city || "",

      // Contact Person
      contactName: company?.contactName || "",
      contactPhone: company?.phone || "",
      contactEmail: company?.email || "",
      contactPosition: company?.contactPosition || "",
      contactCI: getCIFromDocuments(),

      // Contract Details (update with contract data if available)
      contractStartDate: contractStatus?.startDate
        ? format(new Date(contractStatus.startDate), "yyyy-MM-dd")
        : "",
      contractEndDate: contractStatus?.endDate
        ? format(new Date(contractStatus.endDate), "yyyy-MM-dd")
        : "",

      // Provider Information
      providerName: request?.provider?.name || "",
      providerCountry: request?.provider?.country || "",
      providerEmail: request?.provider?.email || "",
      providerPhone: request?.provider?.phone || "",
      providerBankName:
        getBankingDetails(request?.provider?.bankingDetails)?.bankName || "",
      providerAccountNumber:
        getBankingDetails(request?.provider?.bankingDetails)?.accountNumber ||
        "",
      providerSwiftCode:
        getBankingDetails(request?.provider?.bankingDetails)?.swiftCode || "",
      providerBankAddress:
        getBankingDetails(request?.provider?.bankingDetails)?.bankAddress || "",
      providerBeneficiaryName:
        getBankingDetails(request?.provider?.bankingDetails)?.beneficiaryName ||
        "",
      providerAccountType: "",
    }));
  }, [company, request, contractStatus]);

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    console.log("Form field changed:", field, "Value:", value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate contract preview with form data
  const generateContractPreview = () => {
    // Helper function to format numbers to words
    const numberToWords = (num: number): string => {
      if (!num || isNaN(num)) return "cero";

      const units = [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
      ];
      const teens = [
        "diez",
        "once",
        "doce",
        "trece",
        "catorce",
        "quince",
        "dieciséis",
        "diecisiete",
        "dieciocho",
        "diecinueve",
      ];
      const tens = [
        "",
        "",
        "veinte",
        "treinta",
        "cuarenta",
        "cincuenta",
        "sesenta",
        "setenta",
        "ochenta",
        "noventa",
      ];

      if (num === 0) return "cero";
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const unit = num % 10;
        const ten = Math.floor(num / 10);
        return unit === 0 ? tens[ten] : `${tens[ten]} y ${units[unit]}`;
      }
      if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return remainder === 0
          ? `${units[hundred]}cientos`
          : `${units[hundred]}cientos ${numberToWords(remainder)}`;
      }
      if (num < 1000000) {
        const thousand = Math.floor(num / 1000);
        const remainder = num % 1000;
        return remainder === 0
          ? `${numberToWords(thousand)} mil`
          : `${numberToWords(thousand)} mil ${numberToWords(remainder)}`;
      }

      return num.toString();
    };

    // Helper function to format date
    const formatDate = (dateString: string): string => {
      if (!dateString) return "___/___/____";
      try {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
          locale: es,
        });
      } catch {
        return "___/___/____";
      }
    };

    // Helper function to safely get banking details
    const getBankingDetails = (bankingDetails: any) => {
      if (!bankingDetails) return {};
      if (typeof bankingDetails === "string") {
        try {
          return JSON.parse(bankingDetails);
        } catch {
          return {};
        }
      }
      if (typeof bankingDetails === "object") {
        return bankingDetails;
      }
      return {};
    };

    const providerBankingDetails = getBankingDetails(
      request?.provider?.bankingDetails
    );

    const replacements = {
      "{importer.company}": formData.companyName || "_________________",
      "{importer.nit}": formData.companyRif || "_________________",
      "{importer.address}": formData.companyAddress || "_________________",
      "{importer.city}": formData.companyCity || "_________________",
      "{importer.representative.role}":
        formData.contactPosition || "_________________",
      "{importer.representative.name}":
        formData.contactName || "_________________",
      "{importer.ci}": formData.contactCI || "_________________",
      "{beneficiary.name}": request?.provider?.name || "_________________",
      "{provider.name}": request?.provider?.name || "_________________",
      "{provider.bankName}":
        providerBankingDetails.bankName || "_________________",
      "{provider.accountNumber}":
        providerBankingDetails.accountNumber || "_________________",
      "{provider.swiftCode}":
        providerBankingDetails.swiftCode || "_________________",
      "{provider.beneficiaryName}":
        providerBankingDetails.beneficiaryName || "_________________",
      "{provider.bankAddress}":
        providerBankingDetails.bankAddress || "_________________",
      "{provider.accountType}":
        formData.providerAccountType || "_________________",
      "{reference.name}": quotation?.code || "_________________",
      "{quotation.date}": format(
        new Date(quotation?.createdAt || new Date()),
        "dd/MM/yyyy",
        { locale: es }
      ),
      "{service.amountWords}": numberToWords(quotation?.amount || 0),
      "{service.amount}": (quotation?.amount || 0).toLocaleString(),
      "{service.feeWords}": numberToWords(
        Math.round((quotation?.amount || 0) * 0.05)
      ), // 5% fee
      "{service.fee}": Math.round(
        (quotation?.amount || 0) * 0.05
      ).toLocaleString(),
      "{contract.startDate}": formatDate(formData.contractStartDate),
      "{contract.endDate}": formatDate(formData.contractEndDate),
      "{contract.date}": formatDate(new Date().toISOString()),
    };

    let contractText = CONTRACT_TEMPLATE;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      contractText = contractText.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        value
      );
    });

    return contractText;
  };

  // Generate initial contract if it doesn't exist
  const handleGenerateContract = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/quotations/${quotation.id}/generate-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Required fields for API validation
            representativeName: formData.contactName,
            representativeCI: formData.contactCI,
            representativeRole: formData.contactPosition,
            notaryName: formData.notaryName || "Por definir",
            testimonioNumber: formData.testimonioNumber || "000/0000",
            testimonioDate: new Date().toISOString(),
            powerNumber: formData.powerNumber || "000/0000",
            powerDate: new Date().toISOString(),
            bankName: formData.providerBankName,
            accountHolder: formData.providerBeneficiaryName,
            accountNumber: formData.providerAccountNumber,
            accountType: formData.providerAccountType,
            contractTitle: `Contrato de Servicio - ${quotation.code}`,
            contractDescription: quotation.description,
            startDate: new Date().toISOString(), // Will be updated by admin
            endDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days from now, will be updated by admin

            // Complete form data to save in additionalData
            formData: formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el contrato");
      }

      toast({
        title: "Contrato generado",
        description:
          "El contrato ha sido generado exitosamente. Ahora puede completar los datos.",
      });

      // Refresh contract status
      await queryClient.invalidateQueries({
        queryKey: ["contract-status", quotation.id],
      });
    } catch (error) {
      console.error("Error generating contract:", error);
      toast({
        title: "Error al generar contrato",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un problema al generar el contrato.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If contract doesn't exist, generate it first
    if (!contractExists) {
      await handleGenerateContract();
      return;
    }

    setIsLoading(true);

    try {
      // Update the existing contract with the form data
      const response = await fetch(
        `/api/contracts/${contractStatus?.contractId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include all the form data for the contract
            companyData: {
              name: formData.companyName,
              address: formData.companyAddress,
              phone: formData.companyPhone,
              email: formData.companyEmail,
              nit: formData.companyRif,
              city: formData.companyCity,
            },
            contactData: {
              name: formData.contactName,
              phone: formData.contactPhone,
              email: formData.contactEmail,
              position: formData.contactPosition,
              ci: formData.contactCI,
            },
            providerData: {
              accountType: formData.providerAccountType,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el contrato");
      }

      toast({
        title: "Contrato enviado al administrador",
        description:
          "El contrato ha sido enviado al administrador para revisión y completación.",
      });

      // Refetch contract status to update the UI
      await queryClient.invalidateQueries({
        queryKey: ["contract-status", quotation.id],
      });

      setIsOpen(false);
      onContractCreated?.();
    } catch (error) {
      console.error("Error updating contract:", error);
      toast({
        title: "Error al completar contrato",
        description: "Hubo un problema al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation for initial contract generation (minimal required fields)
  const canGenerateContract = () => {
    const requiredForGeneration = [
      "contactName",
      "contactCI",
      "providerBankName",
      "providerBeneficiaryName",
      "providerAccountNumber",
      "providerAccountType",
    ];

    return requiredForGeneration.every((field) =>
      formData[field as keyof ContractFormData]?.trim()
    );
  };

  // Validation for final contract completion (all fields required)
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
      "contactCI",
      "providerAccountType",
    ];

    // Check if all required fields are filled (excluding contract dates since they're set by admin)
    const allFieldsFilled = requiredFields.every((field) =>
      formData[field as keyof ContractFormData]?.trim()
    );

    // Contract must exist and dates must be set by admin
    return (
      contractExists &&
      formData.contractStartDate &&
      formData.contractEndDate &&
      allFieldsFilled
    );
  };

  // Force contract preview to regenerate when form data changes
  const [contractPreview, setContractPreview] = useState("");

  useEffect(() => {
    console.log(
      "Form data changed, regenerating preview. Provider account type:",
      formData.providerAccountType
    );
    const preview = generateContractPreview();
    setContractPreview(preview);
  }, [formData]);

  // Download DOCX function
  const handleDownloadDOCX = async () => {
    try {
      if (!contractStatus?.exists || !contractStatus?.contractId) {
        toast({
          title: "Error al descargar",
          description: "El contrato debe estar creado antes de descargar.",
          variant: "destructive",
        });
        return;
      }

      if (contractStatus?.status !== "COMPLETED") {
        toast({
          title: "Error al descargar",
          description:
            "El administrador debe completar el contrato antes de descargar.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/contracts/generate-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: contractStatus.contractId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el documento");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contrato_${solicitudId}_${format(new Date(), "yyyy-MM-dd")}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Documento descargado",
        description: "El contrato ha sido descargado exitosamente.",
      });
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      toast({
        title: "Error al descargar",
        description: "Hubo un problema al generar el documento DOCX.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Building2 className="h-4 w-4 mr-2" />
          Generar Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Generar Contrato - Solicitud {solicitudId}
          </DialogTitle>
          <DialogDescription>
            Complete la información necesaria para generar el contrato. Vea la
            vista previa en tiempo real.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-[calc(90vh-120px)]">
          {/* Contract Preview - Left Side */}
          <div className="flex-1 bg-white border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Vista Previa del Contrato
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Vista Completa
                </Button>
                {contractStatus?.exists && (
                  <Badge
                    variant={
                      contractStatus?.status === "COMPLETED"
                        ? "default"
                        : contractStatus?.status === "ACTIVE"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {contractStatus?.status === "COMPLETED"
                      ? "Completado por Admin"
                      : contractStatus?.status === "ACTIVE"
                        ? "Enviado al Admin"
                        : contractStatus?.status || "Borrador"}
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDOCX}
                  disabled={
                    !contractStatus?.exists ||
                    !contractStatus?.contractId ||
                    contractStatus?.status !== "COMPLETED"
                  }
                  title={
                    !contractStatus?.exists
                      ? "El contrato debe ser creado por el administrador"
                      : !contractStatus?.contractId
                        ? "Error al obtener información del contrato"
                        : contractStatus?.status !== "COMPLETED"
                          ? "El administrador debe completar el contrato antes de descargar"
                          : "Descargar contrato en formato DOCX"
                  }
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar DOCX
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto h-full">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                  {contractPreview}
                </pre>
              </div>
            </div>
          </div>

          {/* Form - Right Side */}
          <div className="w-96 bg-gray-50 border rounded-lg overflow-y-auto">
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Datos del Contrato
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Complete los campos marcados con *
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Company Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Información de la Empresa
                </h4>

                <div>
                  <Label
                    htmlFor="companyName"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="companyRif"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                  {formData.companyRif && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-completado desde datos de la empresa
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="companyAddress"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="companyCity"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                  />
                  {formData.companyCity && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-completado desde datos de la empresa
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="companyPhone"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="companyEmail"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact Person */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Persona de Contacto
                </h4>

                <div>
                  <Label
                    htmlFor="contactName"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                  {formData.contactName && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-completado desde datos de la empresa
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="contactPosition"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                  />
                  {formData.contactPosition && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-completado desde datos de la empresa
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="contactPhone"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contactEmail"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contactCI"
                    className="flex items-center gap-1 text-xs"
                  >
                    Cédula de Identidad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactCI"
                    value={formData.contactCI}
                    onChange={(e) =>
                      handleInputChange("contactCI", e.target.value)
                    }
                    placeholder="12345678 SC"
                    className="text-sm"
                    required
                  />
                  {formData.contactCI && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-completado desde documentos subidos
                    </p>
                  )}
                </div>
              </div>

              {/* Contract Details */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Detalles del Contrato
                </h4>

                <div>
                  <Label
                    htmlFor="contractStartDate"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                    disabled
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Las fechas del contrato deben ser establecidas por el
                    administrador
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="contractEndDate"
                    className="flex items-center gap-1 text-xs"
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
                    className="text-sm"
                    required
                    disabled
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Las fechas del contrato deben ser establecidas por el
                    administrador
                  </p>
                </div>

                {/* Admin Notice */}
                {contractExists &&
                formData.contractStartDate &&
                formData.contractEndDate ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-green-900 mb-1">
                          Contrato Listo para Enviar al Admin
                        </p>
                        <p className="text-xs text-green-800">
                          El contrato ha sido creado y las fechas han sido
                          establecidas. Complete el formulario para enviar al
                          administrador.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-amber-900 mb-1">
                          {contractExists
                            ? "Fechas del Contrato Pendientes"
                            : "Listo para Generar Contrato"}
                        </p>
                        <p className="text-xs text-amber-800">
                          {contractExists
                            ? "El contrato ha sido creado pero el administrador aún debe establecer las fechas de inicio y finalización."
                            : "Complete los datos del formulario y haga clic en 'Generar Contrato' para crear el contrato inicial."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Provider Information (Read-only) */}
              {request?.provider && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Información del Proveedor
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 mb-2">
                      <strong>
                        Datos del proveedor (auto-completados desde la
                        solicitud):
                      </strong>
                    </p>
                    <div className="space-y-1 text-xs text-blue-700">
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {formData.providerName || "No especificado"}
                      </p>
                      <p>
                        <strong>País:</strong>{" "}
                        {formData.providerCountry || "No especificado"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {formData.providerEmail || "No especificado"}
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {formData.providerPhone || "No especificado"}
                      </p>
                      <p>
                        <strong>Banco:</strong>{" "}
                        {formData.providerBankName || "No especificado"}
                      </p>
                      <p>
                        <strong>Número de cuenta:</strong>{" "}
                        {formData.providerAccountNumber || "No especificado"}
                      </p>
                      <p>
                        <strong>Código SWIFT:</strong>{" "}
                        {formData.providerSwiftCode || "No especificado"}
                      </p>
                      <p>
                        <strong>Dirección del banco:</strong>{" "}
                        {formData.providerBankAddress || "No especificado"}
                      </p>
                      <p>
                        <strong>Beneficiario:</strong>{" "}
                        {formData.providerBeneficiaryName || "No especificado"}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Estos datos se incluirán automáticamente en el contrato
                    </p>
                  </div>
                </div>
              )}

              {/* Provider Account Type Selection */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Tipo de Cuenta del Proveedor
                </h4>
                <div>
                  <Label
                    htmlFor="providerAccountType"
                    className="flex items-center gap-1 text-xs"
                  >
                    Tipo de Cuenta <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.providerAccountType}
                    onValueChange={(value) => {
                      console.log("Select onValueChange triggered:", value);
                      handleInputChange("providerAccountType", value);
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Seleccionar tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cuenta Corriente">
                        Cuenta Corriente
                      </SelectItem>
                      <SelectItem value="Cuenta de Ahorro">
                        Cuenta de Ahorro
                      </SelectItem>
                      <SelectItem value="Cuenta de Cheques">
                        Cuenta de Cheques
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Debug display */}
                  <p className="text-xs text-gray-500 mt-1">
                    Current value: {formData.providerAccountType || "None"}
                  </p>
                </div>
              </div>

              {/* Request Information (Read-only) */}
              {request?.description && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Información de la Solicitud
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-800 mb-2">
                      <strong>Descripción de la solicitud:</strong>
                    </p>
                    <div className="text-xs text-gray-700">
                      <p>{request.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Document Information */}
              {(request?.documents && request.documents.length > 0) ||
              (company?.documents && company.documents.length > 0) ? (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Información de Documentos Disponibles
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 mb-2">
                      <strong>
                        Datos extraídos de documentos (registro y solicitud):
                      </strong>
                    </p>
                    <div className="space-y-1 text-xs text-blue-700">
                      {/* Company documents (from registration) */}
                      {company?.documents && company.documents.length > 0 && (
                        <>
                          <p className="font-medium text-blue-800 mt-2">
                            📋 Documentos de Registro:
                          </p>
                          {company.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-start gap-2"
                            >
                              <span className="font-medium">
                                {doc.type === "CARNET_IDENTIDAD" && "CI:"}
                                {doc.type === "NIT" && "NIT:"}
                                {doc.type === "MATRICULA_COMERCIO" &&
                                  "Matrícula:"}
                                {doc.type === "PODER_REPRESENTANTE" && "Poder:"}
                              </span>
                              <span>
                                {doc.documentInfo ||
                                  "Sin información adicional"}
                              </span>
                            </div>
                          ))}
                        </>
                      )}

                      {/* Request documents */}
                      {request?.documents && request.documents.length > 0 && (
                        <>
                          <p className="font-medium text-blue-800 mt-2">
                            📄 Documentos de Solicitud:
                          </p>
                          {request.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-start gap-2"
                            >
                              <span className="font-medium">
                                {doc.type === "CARNET_IDENTIDAD" && "CI:"}
                                {doc.type === "NIT" && "NIT:"}
                                {doc.type === "MATRICULA_COMERCIO" &&
                                  "Matrícula:"}
                                {doc.type === "PODER_REPRESENTANTE" && "Poder:"}
                              </span>
                              <span>
                                {doc.documentInfo ||
                                  "Sin información adicional"}
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Company Banking Information (Read-only) */}
              {company?.bankingDetails && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Información Bancaria de la Empresa
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-800 mb-2">
                      <strong>
                        Datos bancarios de la empresa (disponibles):
                      </strong>
                    </p>
                    <div className="space-y-1 text-xs text-green-700">
                      {company.bankingDetails.bankName && (
                        <p>
                          <strong>Banco:</strong>{" "}
                          {company.bankingDetails.bankName}
                        </p>
                      )}
                      {company.bankingDetails.accountNumber && (
                        <p>
                          <strong>Número de cuenta:</strong>{" "}
                          {company.bankingDetails.accountNumber}
                        </p>
                      )}
                      {company.bankingDetails.swiftCode && (
                        <p>
                          <strong>Código SWIFT:</strong>{" "}
                          {company.bankingDetails.swiftCode}
                        </p>
                      )}
                      {company.bankingDetails.bankAddress && (
                        <p>
                          <strong>Dirección del banco:</strong>{" "}
                          {company.bankingDetails.bankAddress}
                        </p>
                      )}
                      {company.bankingDetails.beneficiaryName && (
                        <p>
                          <strong>Beneficiario:</strong>{" "}
                          {company.bankingDetails.beneficiaryName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={
                    isLoading ||
                    (!contractExists ? !canGenerateContract() : !isFormValid())
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : !contractExists ? (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Contrato
                    </>
                  ) : !formData.contractStartDate ||
                    !formData.contractEndDate ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Esperando Fechas del Contrato
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Enviar al Admin
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
