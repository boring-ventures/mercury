"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Eye,
  XCircle,
  CheckCircle,
  FileText,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Building,
  User,
  Download,
  Trash2,
  Package,
  FileSignature,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { useAdminContract } from "@/hooks/use-admin-contracts";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ContractPreview from "@/components/admin/contracts/contract-preview";
import ContractEditor from "@/components/admin/contracts/contract-editor";
import { ContractDateEdit } from "@/components/admin/contracts/contract-date-edit";
import { ContractCompletionForm } from "@/components/admin/contracts/contract-completion-form";

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Borrador",
          variant: "secondary" as const,
          icon: "FileText",
        };

      case "COMPLETED":
        return {
          label: "Completado",
          variant: "default" as const,
          icon: "CheckSquare",
        };
      case "CANCELLED":
        return {
          label: "Cancelado",
          variant: "destructive" as const,
          icon: "XCircle",
        };
      case "EXPIRED":
        return {
          label: "Expirado",
          variant: "secondary" as const,
          icon: "AlertTriangle",
        };
      default:
        return {
          label: status,
          variant: "secondary" as const,
          icon: "Clock",
        };
    }
  };

  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (config.icon) {
      case "Clock":
        return <Clock className="h-3 w-3 mr-1" />;
      case "DollarSign":
        return <DollarSign className="h-3 w-3 mr-1" />;
      case "Eye":
        return <Eye className="h-3 w-3 mr-1" />;
      case "CheckCircle":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "XCircle":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "FileText":
        return <FileText className="h-3 w-3 mr-1" />;
      case "AlertCircle":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "AlertTriangle":
        return <AlertTriangle className="h-3 w-3 mr-1" />;

      case "CheckSquare":
        return <CheckSquare className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant={config.variant} className="flex items-center">
      {getIcon()}
      {config.label}
    </Badge>
  );
}

function isExpired(endDate: string): boolean {
  return new Date(endDate) < new Date();
}

export default function AdminContractDetail() {
  const params = useParams();
  const contractId = params.id as string;
  const { data, isLoading, error } = useAdminContract(contractId);
  const contract = data?.contract;
  const { toast } = useToast();

  const [showDateEdit, setShowDateEdit] = useState(false);
  const [selectedContractDates, setSelectedContractDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contractContent, setContractContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Handle date selection from contract preview
  const handleContractDatesChanged = (startDate: string, endDate: string) => {
    setSelectedContractDates({ startDate, endDate });
  };

  // Generate full contract content (same as preview)
  const generateFullContractContent = (contract: any) => {
    const additionalData = (contract.additionalData as any) || {};
    const companyData = additionalData.companyData || {};
    const contactData = additionalData.contactData || {};
    const providerData = additionalData.providerData || {};
    const banking = additionalData.banking || {};

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
        return new Date(dateString).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return "___/___/____";
      }
    };

    const replacements = {
      "{importer.company}":
        companyData.name ||
        contract.request?.company?.name ||
        "_________________",
      "{importer.nit}":
        companyData.nit ||
        contract.request?.company?.nit ||
        "_________________",
      "{importer.address}":
        companyData.address ||
        contract.request?.company?.address ||
        "_________________",
      "{importer.city}":
        companyData.city ||
        contract.request?.company?.city ||
        "_________________",
      "{importer.representative.role}":
        contactData.position || "_________________",
      "{importer.representative.name}":
        contactData.name ||
        contract.request?.company?.contactName ||
        "_________________",
      "{importer.ci}": contactData.ci || "_________________",
      "{beneficiary.name}":
        contract.request?.provider?.name || "_________________",
      "{provider.name}":
        contract.request?.provider?.name || "_________________",
      "{provider.bankName}":
        banking.bankName ||
        contract.request?.provider?.bankingDetails?.bankName ||
        "_________________",
      "{provider.accountNumber}":
        banking.accountNumber ||
        contract.request?.provider?.bankingDetails?.accountNumber ||
        "_________________",
      "{provider.swiftCode}":
        banking.swiftCode ||
        contract.request?.provider?.bankingDetails?.swiftCode ||
        "_________________",
      "{provider.beneficiaryName}":
        banking.beneficiaryName ||
        contract.request?.provider?.bankingDetails?.beneficiaryName ||
        "_________________",
      "{provider.bankAddress}":
        banking.bankAddress ||
        contract.request?.provider?.bankingDetails?.bankAddress ||
        "_________________",
      "{provider.accountType}":
        providerData.accountType || banking.accountType || "_________________",
      "{reference.name}": contract.quotation?.code || "_________________",
      "{quotation.date}": contract.createdAt
        ? new Date(contract.createdAt).toLocaleDateString("es-ES")
        : "_________________",
      "{service.amountWords}": numberToWords(Number(contract.amount) || 0),
      "{service.amount}": (Number(contract.amount) || 0).toLocaleString(),
      "{service.feeWords}": numberToWords(
        Math.round((Number(contract.amount) || 0) * 0.05)
      ),
      "{service.fee}": Math.round(
        (Number(contract.amount) || 0) * 0.05
      ).toLocaleString(),
      "{contract.startDate}": contract.startDate
        ? formatDate(contract.startDate)
        : "_________________",
      "{contract.endDate}": contract.endDate
        ? formatDate(contract.endDate)
        : "_________________",
      "{contract.date}": formatDate(new Date().toISOString()),
    };

    // Use the same contract template as the preview but with proper HTML formatting
    const contractTemplate = `<h1 style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 2rem;">DOCUMENTO PRIVADO</h1>

<p style="text-align: justify; margin-bottom: 2rem;">Conste por el presente documento privado, un Contrato de Prestación de servicios para el pago de proveedores en el extranjero, que con el solo reconocimiento de firmas y rúbricas podrá ser elevado a la categoría de público, lo suscrito de conformidad a los siguientes términos y condiciones:</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">PRIMERA: PARTES INTERVINIENTES.-</h2>

<p style="margin-bottom: 1rem;">Concurren a la celebración del presente Contrato:</p>

<p style="margin-bottom: 1rem;"><strong>1.1.</strong> NORDEX GLOBAL SRL, empresa establecida y constituida legalmente con Número de Identificación Tributaria – NIT XXXXX, con domicilio en calle Manzana 40, piso 9, representado por su Gerente General, Lic. Jimena León Céspedes con C.I. 5810245 TJ, mayor de edad, hábil por derecho, en mérito al Testimonio 610/2025 del 28 de julio de 2025 otorgado ante la Notaria de Fe Pública a cargo de la Dr. Ichin Isaías Ma Avalos, que en adelante y para efectos del presente se denominará simplemente el "PROVEEDOR".</p>

<p style="margin-bottom: 2rem;"><strong>1.2.</strong> {importer.company} con Matrícula de Comercio y NIT No. {importer.nit} y domicilio en {importer.address} en la ciudad de {importer.city}, legalmente representado por su {importer.representative.role} {importer.representative.name}, con cédula de identidad No. {importer.ci} expedida en {importer.city}, de acuerdo al Poder Notarial No. 809/2020 de fecha 15 de diciembre del 2020, en adelante y para efectos del presente "IMPORTADOR".</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">SEGUNDA: ANTECEDENTES.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">El IMPORTADOR manifiesta que requiere realizar un pago internacional a favor de la empresa {beneficiary.name}, en el marco de la Cotización N.º {reference.name} de fecha {quotation.date}, por la compra internacional de productos. En ese contexto, ha solicitado al PROVEEDOR una cotización para la prestación del servicio de gestión de pago internacional a nombre y por cuenta de {importer.company}.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">TERCERA: OBJETO.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">En virtud del presente contrato, el IMPORTADOR encarga al PROVEEDOR la gestión y ejecución de un pago internacional a favor de {provider.name}, por la suma de {service.amountWords} bolivianos (Bs {service.amount}) por concepto de pago por la compra internacional de productos según {reference.name} ("Operación").</p>

<p style="text-align: justify; margin-bottom: 2rem;">El PROVEEDOR actuará únicamente como intermediario pagador, sin asumir responsabilidad alguna sobre la relación comercial o contractual entre el IMPORTADOR y {provider.name}, salvo la correcta ejecución del pago según las instrucciones otorgadas por el IMPORTADOR.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">CUARTA: CARACTERÍSTICAS DEL SERVICIO. –</h2>

<p style="text-align: justify; margin-bottom: 1rem;">El servicio que prestará el PROVEEDOR consistirá en: a) La recepción de fondos por parte del IMPORTADOR en moneda nacional en la cuenta designada por el PROVEEDOR. b) La conversión de dichos fondos a dólares estadounidenses, en caso de ser requerido, utilizando plataformas de intercambio autorizadas o mecanismos legales disponibles. c) La transferencia de los fondos a la cuenta bancaria del proveedor en el exterior, conforme a las instrucciones y datos proporcionados por el IMPORTADOR. d) La emisión de documentación de respaldo, incluyendo comprobante del pago internacional, y cualquier otro documento que certifique la efectivización de la operación.</p>

<p style="text-align: justify; margin-bottom: 2rem;">El PROVEEDOR no asumirá responsabilidad por demoras, rechazos u observaciones del banco receptor o intermediario, siempre que haya actuado conforme a las instrucciones y datos proporcionados por el IMPORTADOR.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">QUINTA: PRECIO Y FORMA DE PAGO.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">El IMPORTADOR transferirá al PROVEEDOR para la ejecución de las operaciones mencionadas el total de lo descrito en la cláusula Tercera, bajo el concepto de Pagos a Proveedores Extranjeros, así mismo, pagará al PROVEEDOR por concepto de honorarios un total de {service.feeWords} bolivianos (Bs {service.fee}), para lo cual el PROVEEDOR emitirá la factura correspondiente al servicio por el monto total de los honorarios percibidos al finalizar la ejecución de la OPERACIÓN, dejándose constancia que los pagos serán realizado mediante transferencia bancaria a la cuenta empresarial del PROVEEDOR:</p>

<div style="margin-left: 2rem; margin-bottom: 2rem;">
<p><strong>Nombre del Banco:</strong> {provider.bankName}</p>
<p><strong>Titular:</strong> {provider.beneficiaryName}</p>
<p><strong>Número de cuenta:</strong> {provider.accountNumber}</p>
<p><strong>Moneda:</strong> Dólares Estadounidenses</p>
<p><strong>Tipo:</strong> {provider.accountType}</p>
</div>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">SEXTA: PLAZO DE CUMPLIMIENTO.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">Las Partes de común acuerdo, convienen que el pago al proveedor extranjero será realizado entre el {contract.startDate} hasta el {contract.endDate}.</p>

<p style="text-align: justify; margin-bottom: 1rem;">En caso de que el PROVEEDOR no realizara el pago correspondiente en el plazo convenido, comunicará al IMPORTADOR y devolverá en su totalidad lo que hubiese recibido por parte del IMPORTADOR.</p>

<p style="text-align: justify; margin-bottom: 2rem;">No se considerará incumplimiento si el pago no puede realizarse por razones atribuibles al IMPORTADOR, por fuerza mayor, o por circunstancias ajenas al control del PROVEEDOR, incluyendo demoras del sistema bancario internacional o restricciones regulatorias.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">SEPTIMA: OBLIGACIONES DE LAS PARTES.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">Como consecuencia de la suscripción del presente Contrato, surgen determinadas obligaciones para cada una de las partes, a saber:</p>

<p style="margin-bottom: 0.5rem;"><strong>Obligaciones del PROVEEDOR:</strong></p>
<ul style="margin-left: 2rem; margin-bottom: 1rem;">
<li>Asumir las obligaciones y compromisos de manera profesional y eficiente.</li>
<li>Responder por retrasos.</li>
<li>Proporcionar toda la documentación de respaldo necesaria de la efectivización de la operación.</li>
</ul>

<p style="margin-bottom: 0.5rem;"><strong>Obligaciones de IMPORTADOR:</strong></p>
<ul style="margin-left: 2rem; margin-bottom: 2rem;">
<li>Cancelar al PROVEEDOR el total del precio convenido.</li>
<li>Proporcionar toda la documentación de respaldo necesaria para realización de la operación.</li>
<li>Asumir la responsabilidad exclusiva por la veracidad y legalidad de los pagos solicitados, eximiendo al PROVEEDOR de cualquier responsabilidad relacionada con el destino, calidad, origen o legalidad de los productos adquiridos.</li>
</ul>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">OCTAVA: PERSONAL E INDEPENDENCIA LABORAL.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">Se acuerda que por la naturaleza del presente contrato, no existe ninguna relación de dependencia laboral entre el IMPORTADOR y el PROVEEDOR o sus dependientes, trabajadores o subcontratistas, al contrario, se establece una relación exclusivamente de prestación de servicio; por lo que el PROVEEDOR o sus dependientes, trabajadores o subcontratistas, no deberán considerar que son empleados, agentes o funcionarios del IMPORTADOR, debido a que la relación civil existente entre las Partes contratantes es celebrada al amparo de lo previsto en el Art. 732 parágrafo II del Código Civil y la eficacia del contrato conforme al Art. 519 del citado cuerpo legal, siendo inexistente relación laboral alguna de subordinación permanente o dependencia.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">NOVENA: CONFIDENCIALIDAD.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">El PROVEEDOR por sí y por sus dependientes, trabajadores o subcontratistas, se obliga a no revelar ni divulgar de modo alguno a terceros, como tampoco a usar de cualquier forma, la información confidencial que se le suministre y que obtenga de cualquier modo con ocasión de la ejecución de los trabajos que realizará para el IMPORTADOR.</p>

<p style="text-align: justify; margin-bottom: 2rem;">Adicionalmente, el PROVEEDOR se obliga a restringir el acceso a la información confidencial sólo a aquellas personas que tengan la necesidad de conocerla para los efectos de la realización de los trabajos encomendados, sean estos asesores, consultores, dependientes, trabajadores o subcontratistas del PROVEEDOR, acceso que deberá en todo caso quedar sujeto a la condición que tales personas acepten quedar obligadas a guardar la confidencialidad de la información, en los mismos términos que el PROVEEDOR.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA: DOMICILIOS.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">Las comunicaciones y/o notificaciones entre las Partes contratantes – para todos los efectos de este Contrato o las consecuencias emergentes del mismo - se enviarán válidamente mediante nota escrita en idioma español, en las direcciones indicadas en la cláusula primera.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA PRIMERA: PREVENCIÓN CONTRA EL LAVADO DE DINERO Y FINANCIAMIENTO DEL TERRORISMO.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">El IMPORTADOR declara y garantiza que los fondos utilizados para el pago de proveedores internacionales tienen un origen lícito, conforme a las leyes nacionales e internacionales en materia de prevención del lavado de activos y financiamiento del terrorismo. Asimismo, manifiesta que dichos fondos no provienen de actividades ilícitas ni están relacionados, directa o indirectamente, con el financiamiento del terrorismo o cualquier otra actividad delictiva.</p>

<p style="text-align: justify; margin-bottom: 1rem;">El IMPORTADOR acepta y declara que ninguno de sus empleado(s), trabajador(es), socio(s), dignatario(s), dueño(s), beneficiario(s) final(es) han sido objeto de una investigación o han sido imputado(s), señalado(s) o sentenciado(s) por los delitos de blanqueo de capitales, lavado de activos, financiamiento del terrorismo, financiamiento de proliferación de armas de destrucción masiva, cohecho o soborno, delitos que se encuentren relacionados o en general, por cualquier otro hecho que por su naturaleza pudiese afectar la reputación del PROVEEDOR, o sus clientes.</p>

<p style="text-align: justify; margin-bottom: 1rem;">El IMPORTADOR se obliga a hacer cumplir con el máximo celo a sus empleado(s), trabajador(es), socio(s), dignatario(s), dueño(s), beneficiario(s) final(es) o dependiente(s), toda la normativa relacionada con delitos de blanqueo de capitales, lavado de activos, financiamiento del terrorismo, financiamiento de proliferación de armas de destrucción masiva, cohecho o soborno, delitos terroristas o sus relacionados, sanciones financieras y embargos financieros económicos y comerciales a nivel nacional e internacional, y otras figuras delictivas que pudieren afectar el nombre o reputación del PROVEEDOR.</p>

<p style="text-align: justify; margin-bottom: 2rem;">El IMPORTADOR se compromete a proporcionar la documentación que el PROVEEDOR considere necesaria para verificar el origen de los fondos y cumplir con las normativas aplicables. En caso de detectarse indicios de actividades sospechosas, el PROVEEDOR podrá suspender o cancelar la prestación del servicio sin previo aviso, sin que ello genere responsabilidad alguna.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA SEGUNDA: LEY APLICABLE.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">La ejecución, cumplimiento, incumplimiento e interpretación de este Contrato se regirán exclusivamente por las leyes del Estado Plurinacional de Bolivia.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA TERCERA: CONVENIO ARBITRAL.-</h2>

<p style="text-align: justify; margin-bottom: 1rem;">Las Partes convienen que, en caso que devinieren controversias en el cumplimiento, ejecución, resolución e interpretación del presente Contrato, estas serán sometidas a Arbitraje a sustanciarse ante el Centro de Conciliación y Arbitraje de la Cámara de Industria, Comercio, Servicios y Turismo de la ciudad de Santa Cruz (CAINCO), y bajo su Reglamento.</p>

<p style="text-align: justify; margin-bottom: 2rem;">El laudo arbitral no será apelable ante tribunal alguno u otra entidad, será definitivo y de cumplimiento obligatorio para las Partes. La Parte cuyo derecho no prevaleciere en el arbitraje realizado, pagará todas las costas y gastos razonables en la substanciación del mismo, incluyendo los honorarios profesionales del abogado y/o apoderado legal contratado y/o designado por la Parte cuyo derecho sí prevaleció.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA CUARTA: MODIFICACIONES.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">Ningún cambio, modificación o alteración del presente Contrato, será válido si el mismo no consta por escrito y cuenta con la firma de ambas partes, en una adenda.</p>

<h2 style="font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">DÉCIMA QUINTA: ACEPTACIÓN Y CONFORMIDAD.-</h2>

<p style="text-align: justify; margin-bottom: 2rem;">Las Partes, en señal de conformidad y aceptación de todas y cada una de las cláusulas del presente Contrato, suscriben el mismo obligándose a su fiel y estricto cumplimiento, en dos ejemplares de un solo tenor y para el mismo efecto.</p>

<p style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">Santa Cruz, {contract.date}.</p>

<div style="display: flex; justify-content: space-between; margin-top: 3rem;">
<div style="text-align: center;">
<p style="margin-bottom: 3rem;">{importer.representative.name}</p>
<p>Pp. / IMPORTADOR</p>
</div>
<div style="text-align: center;">
<p style="margin-bottom: 3rem;">Jimena León Céspedes</p>
<p>Pp. / PROVEEDOR</p>
</div>
</div>`;

    let contractText = contractTemplate;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      contractText = contractText.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        value
      );
    });

    return contractText;
  };

  // Load contract content when contract is loaded
  useEffect(() => {
    console.log("Contract loaded:", contract);
    console.log("Contract content:", contract?.content);

    if (contract?.content) {
      setContractContent(contract.content);
    } else if (contract) {
      // Generate the full contract content using the same logic as the preview
      const fullContent = generateFullContractContent(contract);
      setContractContent(fullContent);
    }
  }, [contract]);

  // Handle content saving
  const handleSaveContent = async (content: string) => {
    setIsSavingContent(true);
    try {
      const response = await fetch(
        `/api/admin/contracts/${contractId}/content`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        console.error("Error details:", errorData.details);
        throw new Error(errorData.error || "Error al guardar el contenido");
      }

      setContractContent(content);
      toast({
        title: "Contenido guardado",
        description: "El contenido del contrato se ha guardado correctamente.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el contenido del contrato.",
        variant: "destructive",
      });
    } finally {
      setIsSavingContent(false);
    }
  };

  // Handle preview
  const handlePreview = (content: string) => {
    // This could open a modal or navigate to a preview page
    console.log("Preview content:", content);
  };

  // Handle download
  const handleDownload = (content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `contrato-${contract?.code || contractId}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/contracts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contrato</h1>
              <p className="text-muted-foreground">Cargando detalles...</p>
            </div>
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/contracts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contrato</h1>
              <p className="text-muted-foreground">
                No se pudo cargar el contrato
              </p>
            </div>
          </div>
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/contracts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contrato {contract.code}
            </h1>
            <p className="text-muted-foreground">{contract.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={contract.status} />
          {isExpired(contract.endDate) && (
            <Badge variant="destructive" className="text-xs">
              Expirado
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Código
                  </label>
                  <p className="text-lg font-medium">{contract.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={contract.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Monto
                  </label>
                  <p className="text-lg font-medium">
                    {formatCurrency(contract.amount, contract.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Período
                  </label>
                  <p className="text-lg font-medium">
                    {format(new Date(contract.startDate), "dd/MM/yyyy", {
                      locale: es,
                    })}{" "}
                    -{" "}
                    {format(new Date(contract.endDate), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Firma
                  </label>
                  <p className="text-lg font-medium">
                    {contract.signedAt
                      ? format(new Date(contract.signedAt), "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "No firmado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </label>
                  <p className="text-lg font-medium">
                    {format(new Date(contract.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{contract.description}</p>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Términos
                </label>
                <p className="text-sm mt-1">{contract.terms}</p>
              </div>
              {contract.conditions && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Condiciones Especiales
                  </label>
                  <p className="text-sm mt-1">{contract.conditions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submitted Form Data */}
          {contract.additionalData && (
            <Card>
              <CardHeader>
                <CardTitle>Datos Enviados por el Importador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const additionalData = contract.additionalData as any;
                  const companyData = additionalData?.companyData || {};
                  const contactData = additionalData?.contactData || {};
                  const providerData = additionalData?.providerData || {};

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Information */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Información de la Empresa
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">
                              Nombre:
                            </span>
                            <span className="ml-2">
                              {companyData.name || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              NIT:
                            </span>
                            <span className="ml-2">
                              {companyData.nit || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Dirección:
                            </span>
                            <span className="ml-2">
                              {companyData.address || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Ciudad:
                            </span>
                            <span className="ml-2">
                              {companyData.city || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Teléfono:
                            </span>
                            <span className="ml-2">
                              {companyData.phone || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Email:
                            </span>
                            <span className="ml-2">
                              {companyData.email || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Persona de Contacto
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">
                              Nombre:
                            </span>
                            <span className="ml-2">
                              {contactData.name || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Cargo:
                            </span>
                            <span className="ml-2">
                              {contactData.position || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Teléfono:
                            </span>
                            <span className="ml-2">
                              {contactData.phone || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Email:
                            </span>
                            <span className="ml-2">
                              {contactData.email || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Cédula:
                            </span>
                            <span className="ml-2">
                              {contactData.ci || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Provider Information */}
                      {Object.keys(providerData).length > 0 && (
                        <div className="space-y-3 md:col-span-2">
                          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Información del Proveedor
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">
                                Tipo de Cuenta:
                              </span>
                              <span className="ml-2">
                                {providerData.accountType || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Contract Editor/Preview Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Contrato</h3>
                {isEditing && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Modo Edición
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Vista Previa" : "Editar Contrato"}
                </Button>
              </div>
            </div>
          </div>

          {/* Contract Editor or Preview */}
          {isEditing ? (
            <ContractEditor
              initialContent={contractContent}
              onSave={handleSaveContent}
              onPreview={handlePreview}
              onDownload={handleDownload}
              contractCode={contract?.code || contractId}
              contract={contract}
              isReadOnly={false}
            />
          ) : (
            <ContractPreview
              contract={contract}
              onDatesChanged={handleContractDatesChanged}
              isDateSelectionEnabled={contract?.status === "ACTIVE"}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Solicitud Relacionada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Código
                </label>
                <p className="text-sm font-medium">
                  {contract.request?.code || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-sm">
                  {contract.request?.description || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto
                </label>
                <p className="text-sm">
                  {formatCurrency(
                    contract.request?.amount,
                    contract.request?.currency
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cotización Relacionada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Código
                </label>
                <p className="text-sm font-medium">
                  {contract.quotation?.code}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto
                </label>
                <p className="text-sm">
                  {formatCurrency(
                    contract.quotation?.amount,
                    contract.quotation?.currency
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-sm font-medium">{contract.company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  País
                </label>
                <p className="text-sm">{contract.company.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{contract.request?.company.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <p className="text-sm">{contract.request?.company.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Creado por
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-sm font-medium">
                  {contract.createdBy.firstName} {contract.createdBy.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{contract.createdBy.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="text-sm">
                  {format(new Date(contract.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/contracts/${contractId}/docx`
                    );
                    if (!res.ok) throw new Error("No se pudo generar el DOCX");
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `contrato-${contract?.code || contractId}.docx`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar DOCX
              </Button>
              {/* Contract Completion Form - Only show for DRAFT contracts */}
              {contract && contract.status === "ACTIVE" && (
                <ContractCompletionForm
                  contractId={contract.id}
                  contractCode={contract.code}
                  currentStartDate={
                    selectedContractDates?.startDate || contract.startDate
                  }
                  currentEndDate={
                    selectedContractDates?.endDate || contract.endDate
                  }
                  onCompleted={() => {
                    // Refresh the page to show updated status
                    window.location.reload();
                  }}
                />
              )}

              <Button className="w-full" variant="outline" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contract Date Edit Modal */}
      {contract && showDateEdit && (
        <ContractDateEdit
          contract={{
            id: contract.id,
            code: contract.code,
            startDate: contract.startDate,
            endDate: contract.endDate,
          }}
          isOpen={showDateEdit}
          onClose={() => setShowDateEdit(false)}
          onSave={() => {
            // Refresh the contract data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
