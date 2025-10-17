"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  CheckCircle,
  Loader2,
  ArrowRight,
  Calendar,
  FileText,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ContractEditor from "@/components/admin/contracts/contract-editor";

interface ContractStepViewProps {
  request: any;
  onUpdate: () => void;
  onNext: () => void;
}

export default function ContractStepView({
  request,
  onUpdate,
  onNext,
}: ContractStepViewProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [contractContent, setContractContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isSavingDates, setIsSavingDates] = useState(false);

  // Form state for contract dates - start and end date for payment deadline
  const [paymentStartDate, setPaymentStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentEndDate, setPaymentEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Get existing contracts
  const contracts = request.contracts || [];
  const acceptedQuotation = request.quotations?.find(
    (q: any) => q.status === "ACCEPTED"
  );
  const activeContract = contracts.find(
    (c: any) =>
      c.status === "DRAFT" ||
      c.status === "ACTIVE" ||
      c.status === "COMPLETED" ||
      c.status === "SIGNED" ||
      c.status === "PAYMENT_PENDING" ||
      c.status === "PAYMENT_REVIEWED" ||
      c.status === "PROVIDER_PAID" ||
      c.status === "PAYMENT_COMPLETED"
  );
  const hasActiveContract = !!activeContract;

  // Debug logging
  console.log("=== CONTRACT STEP VIEW DEBUG ===");
  console.log("Request:", request);
  console.log("Contracts:", contracts);
  console.log("Active Contract:", activeContract);
  console.log("Has Active Contract:", hasActiveContract);
  console.log("Accepted Quotation:", acceptedQuotation);
  console.log("Contract Content:", contractContent);
  console.log("=== END DEBUG ===");

  // Generate full contract content function (from reference implementation)
  const generateFullContractContent = (quotation: any, contract: any) => {
    const additionalData = (contract?.additionalData as any) || {};
    const companyData = additionalData.companyData || {};
    const contactData = additionalData.contactData || {};
    const banking = additionalData.banking || {};

    console.log("=== GENERATING CONTRACT CONTENT ===");
    console.log("Contract:", contract);
    console.log("Quotation:", quotation);
    console.log("Request:", request);
    console.log("Additional Data:", additionalData);

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
        // Parse the date string as local date to avoid timezone issues
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed

        return date.toLocaleDateString("es-ES", {
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
        request?.company?.name ||
        contract?.company?.name ||
        companyData.name ||
        "Empresa Importadora",
      "{importer.nit}":
        request?.company?.nit ||
        contract?.company?.nit ||
        companyData.nit ||
        "NIT no especificado",
      "{importer.address}": companyData.address || "Dirección no especificada",
      "{importer.city}":
        request?.company?.city ||
        contract?.company?.city ||
        companyData.city ||
        "Ciudad no especificada",
      "{importer.representative.role}":
        request?.company?.contactPosition ||
        contract?.company?.contactPosition ||
        companyData.contactPosition ||
        "Representante Legal",
      "{importer.representative.name}":
        request?.company?.contactName ||
        contract?.company?.contactName ||
        `${request?.createdBy?.firstName || ""} ${request?.createdBy?.lastName || ""}`.trim() ||
        contactData.name ||
        companyData.contactName ||
        "Representante Legal",
      "{importer.ci}": (() => {
        const carnetDocument = request?.company?.documents?.find(
          (doc: any) => doc.type === "CARNET_IDENTIDAD" && doc.documentInfo
        );
        return (
          carnetDocument?.documentInfo || contactData.ci || "_________________"
        );
      })(),
      "{beneficiary.name}": request?.provider?.name || "_________________",
      "{provider.name}": request?.provider?.name || "_________________",
      "{provider.bankName}":
        banking.bankName ||
        request?.provider?.bankingDetails?.bankName ||
        "_________________",
      "{provider.accountNumber}":
        banking.accountNumber ||
        request?.provider?.bankingDetails?.accountNumber ||
        "_________________",
      "{provider.swiftCode}":
        banking.swiftCode ||
        request?.provider?.bankingDetails?.swiftCode ||
        "_________________",
      "{provider.beneficiaryName}":
        banking.beneficiaryName ||
        request?.provider?.bankingDetails?.beneficiaryName ||
        "_________________",
      "{provider.bankAddress}":
        banking.bankAddress ||
        request?.provider?.bankingDetails?.bankAddress ||
        "_________________",
      "{provider.accountType}": banking.accountType || "_________________",
      "{reference.name}":
        quotation?.code || contract?.quotation?.code || "_________________",
      "{quotation.date}": quotation?.createdAt
        ? new Date(quotation.createdAt).toLocaleDateString("es-ES")
        : contract?.quotation?.createdAt
          ? new Date(contract.quotation.createdAt).toLocaleDateString("es-ES")
          : "_________________",
      "{service.amountWords}": numberToWords(
        Number(
          quotation?.totalInBs ||
            quotation?.amount ||
            contract?.quotation?.totalInBs ||
            contract?.amount
        ) || 0
      ),
      "{service.amount}": (
        Number(
          quotation?.totalInBs ||
            quotation?.amount ||
            contract?.quotation?.totalInBs ||
            contract?.amount
        ) || 0
      ).toLocaleString(),
      "{service.feeWords}": numberToWords(
        Math.round(
          (Number(
            quotation?.totalInBs ||
              quotation?.amount ||
              contract?.quotation?.totalInBs ||
              contract?.amount
          ) || 0) * 0.05
        )
      ),
      "{service.fee}": Math.round(
        (Number(
          quotation?.totalInBs ||
            quotation?.amount ||
            contract?.quotation?.totalInBs ||
            contract?.amount
        ) || 0) * 0.05
      ).toLocaleString(),
      "{contract.startDate}": contract?.startDate
        ? formatDate(contract.startDate)
        : paymentStartDate
          ? formatDate(paymentStartDate)
          : "_________________",
      "{contract.endDate}": contract?.endDate
        ? formatDate(contract.endDate)
        : paymentEndDate
          ? formatDate(paymentEndDate)
          : "_________________",
      "{contract.date}": formatDate(new Date().toISOString()),
    };

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
<p><strong>Nombre del Banco:</strong> Banco Mercantil Santa Cruz S.A</p>
<p><strong>Titular:</strong> J&R Asesores de Mercado S.R.L.</p>
<p><strong>Número de cuenta:</strong> 4011108567</p>
<p><strong>Moneda:</strong> bolivianos</p>
<p><strong>Tipo:</strong> Cuenta Corriente</p>
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


<p style="margin-top: 4rem; text-align: center;">
<strong>{importer.representative.name}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Jimena León Céspedes</strong>
</p>
<p style="text-align: center;">
<strong>Pp. / IMPORTADOR</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Pp. / PROVEEDOR</strong>
</p>`;

    let contractText = contractTemplate;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      contractText = contractText.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        value
      );
    });

    return contractText;
  };

  // Load contract content when active contract exists
  useEffect(() => {
    console.log("Contract Step - Request:", request);
    console.log("Contract Step - Contracts Array:", contracts);
    console.log("Contract Step - Active Contract:", activeContract);
    console.log("Contract Step - Accepted Quotation:", acceptedQuotation);
    console.log("Contract Step - Has Active Contract:", hasActiveContract);

    if (activeContract && acceptedQuotation) {
      console.log("Generating contract content...");

      // Set payment dates from contract if they exist
      if (activeContract.startDate) {
        setPaymentStartDate(
          new Date(activeContract.startDate).toISOString().split("T")[0]
        );
      }
      if (activeContract.endDate) {
        setPaymentEndDate(
          new Date(activeContract.endDate).toISOString().split("T")[0]
        );
      }

      if (activeContract.content && activeContract.content.trim()) {
        console.log("Using existing contract content");
        setContractContent(activeContract.content);
      } else {
        console.log("Generating new contract content from template");
        const fullContent = generateFullContractContent(
          acceptedQuotation,
          activeContract
        );
        console.log("Generated content length:", fullContent.length);
        setContractContent(fullContent);
      }
    }
  }, [activeContract, acceptedQuotation]);

  // Handle contract dates update
  const handleUpdateContractDates = async () => {
    if (!activeContract) return;

    if (!paymentStartDate || !paymentEndDate) {
      toast({
        title: "Error",
        description: "Por favor ingrese ambas fechas del plazo de pago",
        variant: "destructive",
      });
      return;
    }

    setIsSavingDates(true);
    try {
      const response = await fetch(
        `/api/admin/contracts/${activeContract.id}/dates`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: paymentStartDate,
            endDate: paymentEndDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar las fechas");
      }

      toast({
        title: "Fechas actualizadas",
        description:
          "Las fechas del contrato se han actualizado correctamente.",
      });

      // Regenerate contract content with new dates
      const fullContent = generateFullContractContent(acceptedQuotation, {
        ...activeContract,
        startDate: paymentStartDate,
        endDate: paymentEndDate,
      });
      setContractContent(fullContent);

      // Update contract content in the database
      await fetch(`/api/admin/contracts/${activeContract.id}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: fullContent }),
      });

      setIsEditingDates(false);
      onUpdate(); // Refresh the request data
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las fechas del contrato.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDates(false);
    }
  };

  // Handle content saving
  const handleSaveContent = async (content: string) => {
    if (!activeContract) return;

    setIsSavingContent(true);
    try {
      const response = await fetch(
        `/api/admin/contracts/${activeContract.id}/content`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el contenido");
      }

      setContractContent(content);
      toast({
        title: "Contenido guardado",
        description: "El contenido del contrato se ha guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el contenido del contrato.",
        variant: "destructive",
      });
    } finally {
      setIsSavingContent(false);
    }
  };

  // Handle preview (no-op for now)
  const handlePreview = (content: string) => {
    console.log("Preview content:", content);
  };

  // Handle download
  const handleDownload = (content: string) => {
    console.log("Download content:", content);
  };

  const handleCreateContract = async () => {
    if (!acceptedQuotation) {
      toast({
        title: "Error",
        description:
          "Se necesita una cotización aceptada para crear el contrato",
        variant: "destructive",
      });
      return;
    }

    if (!paymentStartDate || !paymentEndDate) {
      toast({
        title: "Error",
        description:
          "Por favor ingrese ambas fechas del plazo de pago al proveedor",
        variant: "destructive",
      });
      return;
    }

    // Calculate other dates based on paymentEndDate
    const paymentEndDateObj = new Date(paymentEndDate);
    const arrivalDate = new Date(
      paymentEndDateObj.getTime() + 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0]; // +30 days
    const documentDeliveryDate = new Date(
      paymentEndDateObj.getTime() + 45 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0]; // +45 days

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId: acceptedQuotation.id,
          paymentDate: paymentStartDate,
          arrivalDate,
          documentDeliveryDate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el contrato");
      }

      const data = await response.json();

      toast({
        title: "Contrato creado",
        description: "El contrato se ha creado correctamente",
      });

      // Auto-complete the contract
      await handleCompleteContract(
        data.contract.id,
        paymentStartDate,
        paymentEndDate
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el contrato",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteContract = async (
    contractId: string,
    startDate: string,
    endDate: string
  ) => {
    setIsCompleting(true);
    try {
      const response = await fetch(
        `/api/admin/contracts/${contractId}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate,
            endDate,
            notes: "Auto-completado en flujo de adaptación",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al completar el contrato");
      }

      toast({
        title: "Contrato completado",
        description:
          "El contrato se ha marcado como completado y se ha movido al siguiente paso",
      });

      onUpdate();
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el contrato",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (hasActiveContract) {
    const isReadOnly =
      activeContract.status !== "DRAFT" && activeContract.status !== "ACTIVE";

    // Determine status label and color
    const getStatusDisplay = (status: string) => {
      switch (status) {
        case "DRAFT":
          return { label: "Borrador", color: "yellow" };
        case "ACTIVE":
          return { label: "Activo", color: "blue" };
        case "COMPLETED":
          return { label: "Completado", color: "green" };
        default:
          return { label: status, color: "green" };
      }
    };

    const statusDisplay = getStatusDisplay(activeContract.status);

    return (
      <div className="space-y-6">
        {/* Contract Info Alert */}
        <div
          className={`border rounded-lg p-4 ${
            statusDisplay.color === "yellow"
              ? "bg-yellow-50 border-yellow-200"
              : statusDisplay.color === "blue"
                ? "bg-blue-50 border-blue-200"
                : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle
              className={`h-5 w-5 ${
                statusDisplay.color === "yellow"
                  ? "text-yellow-600"
                  : statusDisplay.color === "blue"
                    ? "text-blue-600"
                    : "text-green-600"
              }`}
            />
            <div className="flex-1">
              <p
                className={`font-medium ${
                  statusDisplay.color === "yellow"
                    ? "text-yellow-900"
                    : statusDisplay.color === "blue"
                      ? "text-blue-900"
                      : "text-green-900"
                }`}
              >
                Contrato {activeContract?.code} - {statusDisplay.label}
              </p>
              <p
                className={`text-sm mt-1 ${
                  statusDisplay.color === "yellow"
                    ? "text-yellow-700"
                    : statusDisplay.color === "blue"
                      ? "text-blue-700"
                      : "text-green-700"
                }`}
              >
                {isReadOnly
                  ? "Vista del contrato (solo lectura)"
                  : "Puede editar el contenido del contrato a continuación. Las fechas del contrato son editables."}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Dates Editor */}
        {!isReadOnly && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Modifique las fechas del plazo de pago al proveedor. Al guardar,
                el contrato se regenerará con las nuevas fechas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPaymentStartDate">
                    Fecha de Inicio del Plazo *
                  </Label>
                  <Input
                    id="editPaymentStartDate"
                    type="date"
                    value={paymentStartDate}
                    onChange={(e) => setPaymentStartDate(e.target.value)}
                    disabled={isSavingDates}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPaymentEndDate">
                    Fecha de Fin del Plazo *
                  </Label>
                  <Input
                    id="editPaymentEndDate"
                    type="date"
                    value={paymentEndDate}
                    onChange={(e) => setPaymentEndDate(e.target.value)}
                    disabled={isSavingDates}
                  />
                </div>
              </div>

              <Button
                onClick={handleUpdateContractDates}
                disabled={isSavingDates}
                className="w-full"
              >
                {isSavingDates ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando fechas...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Actualizar Fechas y Regenerar Contrato
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contract Editor */}
        {contractContent && activeContract && (
          <ContractEditor
            initialContent={contractContent}
            onSave={handleSaveContent}
            onPreview={handlePreview}
            onDownload={handleDownload}
            contractCode={activeContract.code}
            contract={{
              ...activeContract,
              request: request, // Add request data for template variables
            }}
            isReadOnly={isReadOnly}
          />
        )}

        {/* Complete Contract and Next Step Button */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {activeContract.status === "DRAFT" && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Debes completar el contrato antes de continuar al siguiente paso.
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    setIsCompleting(true);
                    try {
                      await fetch(`/api/admin/contracts/${activeContract.id}/complete`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          startDate: paymentStartDate,
                          endDate: paymentEndDate,
                          notes: "Completado en flujo de adaptación",
                        }),
                      });
                      toast({
                        title: "Contrato completado",
                        description: "El contrato ha sido marcado como completado",
                      });
                      onUpdate();
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "No se pudo completar el contrato",
                        variant: "destructive",
                      });
                    } finally {
                      setIsCompleting(false);
                    }
                  }}
                  disabled={isCompleting}
                  className="w-full"
                  size="lg"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Completando contrato...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar Contrato
                    </>
                  )}
                </Button>
              </>
            )}
            <Button onClick={onNext} className="w-full" size="lg" variant={activeContract.status === "DRAFT" ? "outline" : "default"}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Continuar al Pago al Proveedor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!acceptedQuotation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cotización Requerida
              </h3>
              <p className="text-gray-600">
                Se necesita una cotización aceptada antes de crear el contrato
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Crear y Completar Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Flujo de Adaptación
                </p>
                <p className="text-sm text-blue-700">
                  En el flujo de adaptación, el contrato será creado y
                  completado automáticamente con las fechas especificadas.
                </p>
              </div>
            </div>
          </div>

          {/* Quotation Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Cotización Asociada</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Código:</span>{" "}
                <span className="font-medium">{acceptedQuotation.code}</span>
              </p>
              <p>
                <span className="text-gray-600">Monto Total:</span>{" "}
                <span className="font-medium">
                  {acceptedQuotation.totalInBs?.toLocaleString("es-BO")} Bs
                </span>
              </p>
            </div>
          </div>

          {/* Payment Deadline Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Plazo de Pago al Proveedor
            </h3>
            <p className="text-sm text-gray-600">
              Estas fechas definen el período en el que se realizará el pago al
              proveedor y serán editables en el contrato generado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentStartDate">
                  Fecha de Inicio del Plazo *
                </Label>
                <Input
                  id="paymentStartDate"
                  type="date"
                  value={paymentStartDate}
                  onChange={(e) => setPaymentStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentEndDate">Fecha de Fin del Plazo *</Label>
                <Input
                  id="paymentEndDate"
                  type="date"
                  value={paymentEndDate}
                  onChange={(e) => setPaymentEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleCreateContract}
            disabled={isCreating || isCompleting}
            className="w-full"
            size="lg"
          >
            {isCreating || isCompleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isCreating ? "Creando contrato..." : "Completando contrato..."}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Crear y Completar Contrato
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
