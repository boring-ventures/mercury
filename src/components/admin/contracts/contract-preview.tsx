"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Download,
  Building2,
  User,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

interface ContractPreviewProps {
  contract: {
    id: string;
    code: string;
    title: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    additionalData?: {
      companyData?: any;
      contactData?: any;
      providerData?: any;
    };
    request?: {
      id: string;
      code: string;
      description: string;
      amount: number;
      currency: string;
      company: {
        name: string;
        country: string;
        email: string;
        phone: string;
      };
      provider?: {
        name: string;
        country: string;
        email: string;
        phone: string;
        bankingDetails: any;
      } | null;
    } | null;
    quotation?: {
      id: string;
      code: string;
      amount: number;
      currency: string;
    } | null;
  };
}

export default function ContractPreview({ contract }: ContractPreviewProps) {
  const [contractPreview, setContractPreview] = useState("");

  // Generate contract preview with contract data
  const generateContractPreview = () => {
    console.log("Admin Contract Preview - Contract data:", contract);
    console.log(
      "Admin Contract Preview - Additional data:",
      contract.additionalData
    );

    const additionalData = (contract.additionalData as any) || {};

    // Map the actual data structure from the contract generation API
    const representative = additionalData.representative || {};
    const notary = additionalData.notary || {};
    const power = additionalData.power || {};
    const banking = additionalData.banking || {};
    const additional = additionalData.additional || {};

    console.log("Admin Contract Preview - Parsed data:", {
      representative,
      notary,
      power,
      banking,
      additional,
      requestProvider: contract.request?.provider,
    });

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
      contract.request?.provider?.bankingDetails
    );

    const replacements = {
      "{importer.company}":
        contract.request?.company?.name || "_________________",
      "{importer.nit}": "_________________", // NIT not available in company object
      "{importer.address}": "_________________", // Address not available in company object
      "{importer.city}":
        contract.request?.company?.country || "_________________",
      "{importer.representative.role}":
        representative.role || "_________________",
      "{importer.representative.name}":
        representative.name || "_________________",
      "{importer.ci}": representative.ci || "_________________",
      "{beneficiary.name}":
        contract.request?.provider?.name || "_________________",
      "{provider.name}":
        contract.request?.provider?.name || "_________________",
      "{provider.bankName}": banking.bankName || "_________________",
      "{provider.accountNumber}": banking.accountNumber || "_________________",
      "{provider.swiftCode}": banking.swiftCode || "_________________",
      "{provider.beneficiaryName}":
        banking.accountHolder || "_________________",
      "{provider.bankAddress}": banking.bankAddress || "_________________",
      "{provider.accountType}": banking.accountType || "_________________",
      "{reference.name}": contract.quotation?.code || "_________________",
      "{quotation.date}": format(new Date(contract.createdAt), "dd/MM/yyyy", {
        locale: es,
      }),
      "{service.amountWords}": numberToWords(Number(contract.amount) || 0),
      "{service.amount}": (Number(contract.amount) || 0).toLocaleString(),
      "{service.feeWords}": numberToWords(
        Math.round((Number(contract.amount) || 0) * 0.05)
      ), // 5% fee
      "{service.fee}": Math.round(
        (Number(contract.amount) || 0) * 0.05
      ).toLocaleString(),
      "{contract.startDate}": formatDate(contract.startDate),
      "{contract.endDate}": formatDate(contract.endDate),
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

  useEffect(() => {
    const preview = generateContractPreview();
    setContractPreview(preview);
  }, [contract]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Vista Previa del Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Contrato {contract.code}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Vista Previa
              </Badge>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                {contractPreview}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
