"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Use default fonts to avoid CSP issues
// Font.register({
//   family: "Inter",
//   src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
  bankingDetails: {
    marginLeft: 20,
    marginBottom: 15,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    textAlign: "center",
    width: "45%",
  },
  signatureName: {
    marginBottom: 20,
    fontSize: 11,
  },
  signatureTitle: {
    fontSize: 9,
  },
  centerText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
});

interface ContractPDFProps {
  contract: any;
  content: string;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ contract, content }) => {
  // Helper function to convert HTML content to plain text for PDF
  const htmlToText = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  };

  // Parse the contract data
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

  const amount = Number(contract.amount) || 0;
  const fee = Math.round(amount * 0.05);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>DOCUMENTO PRIVADO</Text>

        <Text style={styles.paragraph}>
          Conste por el presente documento privado, un Contrato de Prestación de
          servicios para el pago de proveedores en el extranjero, que con el
          solo reconocimiento de firmas y rúbricas podrá ser elevado a la
          categoría de público, lo suscrito de conformidad a los siguientes
          términos y condiciones:
        </Text>

        <Text style={styles.sectionTitle}>
          PRIMERA: PARTES INTERVINIENTES.-
        </Text>

        <Text style={styles.paragraph}>
          Concurren a la celebración del presente Contrato:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.1.</Text> NORDEX GLOBAL SRL, empresa
          establecida y constituida legalmente con Número de Identificación
          Tributaria – NIT XXXXX, con domicilio en calle Manzana 40, piso 9,
          representado por su Gerente General, Lic. Jimena León Céspedes con
          C.I. 5810245 TJ, mayor de edad, hábil por derecho, en mérito al
          Testimonio 610/2025 del 28 de julio de 2025 otorgado ante la Notaria
          de Fe Pública a cargo de la Dr. Ichin Isaías Ma Avalos, que en
          adelante y para efectos del presente se denominará simplemente el
          "PROVEEDOR".
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.2.</Text>{" "}
          {companyData.name ||
            contract.request?.company?.name ||
            "_________________"}{" "}
          con Matrícula de Comercio y NIT No.{" "}
          {companyData.nit ||
            contract.request?.company?.nit ||
            "_________________"}{" "}
          y domicilio en{" "}
          {companyData.address ||
            contract.request?.company?.address ||
            "_________________"}{" "}
          en la ciudad de{" "}
          {companyData.city ||
            contract.request?.company?.city ||
            "_________________"}
          , legalmente representado por su{" "}
          {contactData.position || "_________________"}{" "}
          {contactData.name ||
            contract.request?.company?.contactName ||
            "_________________"}
          , con cédula de identidad No. {contactData.ci || "_________________"}{" "}
          expedida en{" "}
          {companyData.city ||
            contract.request?.company?.city ||
            "_________________"}
          , de acuerdo al Poder Notarial No. 809/2020 de fecha 15 de diciembre
          del 2020, en adelante y para efectos del presente "IMPORTADOR".
        </Text>

        <Text style={styles.sectionTitle}>SEGUNDA: ANTECEDENTES.-</Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR manifiesta que requiere realizar un pago internacional a
          favor de la empresa{" "}
          {contract.request?.provider?.name || "_________________"}, en el marco
          de la Cotización N.º {contract.quotation?.code || "_________________"}{" "}
          de fecha{" "}
          {contract.createdAt
            ? new Date(contract.createdAt).toLocaleDateString("es-ES")
            : "_________________"}
          , por la compra internacional de productos. En ese contexto, ha
          solicitado al PROVEEDOR una cotización para la prestación del servicio
          de gestión de pago internacional a nombre y por cuenta de{" "}
          {companyData.name ||
            contract.request?.company?.name ||
            "_________________"}
          .
        </Text>

        <Text style={styles.sectionTitle}>TERCERA: OBJETO.-</Text>

        <Text style={styles.paragraph}>
          En virtud del presente contrato, el IMPORTADOR encarga al PROVEEDOR la
          gestión y ejecución de un pago internacional a favor de{" "}
          {contract.request?.provider?.name || "_________________"}, por la suma
          de {numberToWords(amount)} bolivianos (Bs {amount.toLocaleString()})
          por concepto de pago por la compra internacional de productos según{" "}
          {contract.quotation?.code || "_________________"} ("Operación").
        </Text>

        <Text style={styles.paragraph}>
          El PROVEEDOR actuará únicamente como intermediario pagador, sin asumir
          responsabilidad alguna sobre la relación comercial o contractual entre
          el IMPORTADOR y{" "}
          {contract.request?.provider?.name || "_________________"}, salvo la
          correcta ejecución del pago según las instrucciones otorgadas por el
          IMPORTADOR.
        </Text>

        <Text style={styles.sectionTitle}>
          CUARTA: CARACTERÍSTICAS DEL SERVICIO. –
        </Text>

        <Text style={styles.paragraph}>
          El servicio que prestará el PROVEEDOR consistirá en: a) La recepción
          de fondos por parte del IMPORTADOR en moneda nacional en la cuenta
          designada por el PROVEEDOR. b) La conversión de dichos fondos a
          dólares estadounidenses, en caso de ser requerido, utilizando
          plataformas de intercambio autorizadas o mecanismos legales
          disponibles. c) La transferencia de los fondos a la cuenta bancaria
          del proveedor en el exterior, conforme a las instrucciones y datos
          proporcionados por el IMPORTADOR. d) La emisión de documentación de
          respaldo, incluyendo comprobante del pago internacional, y cualquier
          otro documento que certifique la efectivización de la operación.
        </Text>

        <Text style={styles.paragraph}>
          El PROVEEDOR no asumirá responsabilidad por demoras, rechazos u
          observaciones del banco receptor o intermediario, siempre que haya
          actuado conforme a las instrucciones y datos proporcionados por el
          IMPORTADOR.
        </Text>

        <Text style={styles.sectionTitle}>
          QUINTA: PRECIO Y FORMA DE PAGO.-
        </Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR transferirá al PROVEEDOR para la ejecución de las
          operaciones mencionadas el total de lo descrito en la cláusula
          Tercera, bajo el concepto de Pagos a Proveedores Extranjeros, así
          mismo, pagará al PROVEEDOR por concepto de honorarios un total de{" "}
          {numberToWords(fee)} bolivianos (Bs {fee.toLocaleString()}), para lo
          cual el PROVEEDOR emitirá la factura correspondiente al servicio por
          el monto total de los honorarios percibidos al finalizar la ejecución
          de la OPERACIÓN, dejándose constancia que los pagos serán realizado
          mediante transferencia bancaria a la cuenta empresarial del PROVEEDOR:
        </Text>

        <View style={styles.bankingDetails}>
          <Text>
            <Text style={styles.bold}>Nombre del Banco:</Text>{" "}
            {banking.bankName ||
              contract.request?.provider?.bankingDetails?.bankName ||
              "_________________"}
          </Text>
          <Text>
            <Text style={styles.bold}>Titular:</Text>{" "}
            {banking.beneficiaryName ||
              contract.request?.provider?.bankingDetails?.beneficiaryName ||
              "_________________"}
          </Text>
          <Text>
            <Text style={styles.bold}>Número de cuenta:</Text>{" "}
            {banking.accountNumber ||
              contract.request?.provider?.bankingDetails?.accountNumber ||
              "_________________"}
          </Text>
          <Text>
            <Text style={styles.bold}>Moneda:</Text> Dólares Estadounidenses
          </Text>
          <Text>
            <Text style={styles.bold}>Tipo:</Text>{" "}
            {providerData.accountType ||
              banking.accountType ||
              "_________________"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>SEXTA: PLAZO DE CUMPLIMIENTO.-</Text>

        <Text style={styles.paragraph}>
          Las Partes de común acuerdo, convienen que el pago al proveedor
          extranjero será realizado entre el{" "}
          {contract.startDate
            ? formatDate(contract.startDate)
            : "_________________"}{" "}
          hasta el{" "}
          {contract.endDate
            ? formatDate(contract.endDate)
            : "_________________"}
          .
        </Text>

        <Text style={styles.paragraph}>
          En caso de que el PROVEEDOR no realizara el pago correspondiente en el
          plazo convenido, comunicará al IMPORTADOR y devolverá en su totalidad
          lo que hubiese recibido por parte del IMPORTADOR.
        </Text>

        <Text style={styles.paragraph}>
          No se considerará incumplimiento si el pago no puede realizarse por
          razones atribuibles al IMPORTADOR, por fuerza mayor, o por
          circunstancias ajenas al control del PROVEEDOR, incluyendo demoras del
          sistema bancario internacional o restricciones regulatorias.
        </Text>

        <Text style={styles.sectionTitle}>
          SEPTIMA: OBLIGACIONES DE LAS PARTES.-
        </Text>

        <Text style={styles.paragraph}>
          Como consecuencia de la suscripción del presente Contrato, surgen
          determinadas obligaciones para cada una de las partes, a saber:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Obligaciones del PROVEEDOR:</Text>
        </Text>

        <Text style={styles.listItem}>
          • Asumir las obligaciones y compromisos de manera profesional y
          eficiente.
        </Text>
        <Text style={styles.listItem}>• Responder por retrasos.</Text>
        <Text style={styles.listItem}>
          • Proporcionar toda la documentación de respaldo necesaria de la
          efectivización de la operación.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Obligaciones de IMPORTADOR:</Text>
        </Text>

        <Text style={styles.listItem}>
          • Cancelar al PROVEEDOR el total del precio convenido.
        </Text>
        <Text style={styles.listItem}>
          • Proporcionar toda la documentación de respaldo necesaria para
          realización de la operación.
        </Text>
        <Text style={styles.listItem}>
          • Asumir la responsabilidad exclusiva por la veracidad y legalidad de
          los pagos solicitados, eximiendo al PROVEEDOR de cualquier
          responsabilidad relacionada con el destino, calidad, origen o
          legalidad de los productos adquiridos.
        </Text>

        <Text style={styles.sectionTitle}>
          OCTAVA: PERSONAL E INDEPENDENCIA LABORAL.-
        </Text>

        <Text style={styles.paragraph}>
          Se acuerda que por la naturaleza del presente contrato, no existe
          ninguna relación de dependencia laboral entre el IMPORTADOR y el
          PROVEEDOR o sus dependientes, trabajadores o subcontratistas, al
          contrario, se establece una relación exclusivamente de prestación de
          servicio; por lo que el PROVEEDOR o sus dependientes, trabajadores o
          subcontratistas, no deberán considerar que son empleados, agentes o
          funcionarios del IMPORTADOR, debido a que la relación civil existente
          entre las Partes contratantes es celebrada al amparo de lo previsto en
          el Art. 732 parágrafo II del Código Civil y la eficacia del contrato
          conforme al Art. 519 del citado cuerpo legal, siendo inexistente
          relación laboral alguna de subordinación permanente o dependencia.
        </Text>

        <Text style={styles.sectionTitle}>NOVENA: CONFIDENCIALIDAD.-</Text>

        <Text style={styles.paragraph}>
          El PROVEEDOR por sí y por sus dependientes, trabajadores o
          subcontratistas, se obliga a no revelar ni divulgar de modo alguno a
          terceros, como tampoco a usar de cualquier forma, la información
          confidencial que se le suministre y que obtenga de cualquier modo con
          ocasión de la ejecución de los trabajos que realizará para el
          IMPORTADOR.
        </Text>

        <Text style={styles.paragraph}>
          Adicionalmente, el PROVEEDOR se obliga a restringir el acceso a la
          información confidencial sólo a aquellas personas que tengan la
          necesidad de conocerla para los efectos de la realización de los
          trabajos encomendados, sean estos asesores, consultores, dependientes,
          trabajadores o subcontratistas del PROVEEDOR, acceso que deberá en
          todo caso quedar sujeto a la condición que tales personas acepten
          quedar obligadas a guardar la confidencialidad de la información, en
          los mismos términos que el PROVEEDOR.
        </Text>

        <Text style={styles.sectionTitle}>DÉCIMA: DOMICILIOS.-</Text>

        <Text style={styles.paragraph}>
          Las comunicaciones y/o notificaciones entre las Partes contratantes –
          para todos los efectos de este Contrato o las consecuencias emergentes
          del mismo - se enviarán válidamente mediante nota escrita en idioma
          español, en las direcciones indicadas en la cláusula primera.
        </Text>

        <Text style={styles.sectionTitle}>
          DÉCIMA PRIMERA: PREVENCIÓN CONTRA EL LAVADO DE DINERO Y FINANCIAMIENTO
          DEL TERRORISMO.-
        </Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR declara y garantiza que los fondos utilizados para el
          pago de proveedores internacionales tienen un origen lícito, conforme
          a las leyes nacionales e internacionales en materia de prevención del
          lavado de activos y financiamiento del terrorismo. Asimismo,
          manifiesta que dichos fondos no provienen de actividades ilícitas ni
          están relacionados, directa o indirectamente, con el financiamiento
          del terrorismo o cualquier otra actividad delictiva.
        </Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR acepta y declara que ninguno de sus empleado(s),
          trabajador(es), socio(s), dignatario(s), dueño(s), beneficiario(s)
          final(es) han sido objeto de una investigación o han sido imputado(s),
          señalado(s) o sentenciado(s) por los delitos de blanqueo de capitales,
          lavado de activos, financiamiento del terrorismo, financiamiento de
          proliferación de armas de destrucción masiva, cohecho o soborno,
          delitos que se encuentren relacionados o en general, por cualquier
          otro hecho que por su naturaleza pudiese afectar la reputación del
          PROVEEDOR, o sus clientes.
        </Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR se obliga a hacer cumplir con el máximo celo a sus
          empleado(s), trabajador(es), socio(s), dignatario(s), dueño(s),
          beneficiario(s) final(es) o dependiente(s), toda la normativa
          relacionada con delitos de blanqueo de capitales, lavado de activos,
          financiamiento del terrorismo, financiamiento de proliferación de
          armas de destrucción masiva, cohecho o soborno, delitos terroristas o
          sus relacionados, sanciones financieras y embargos financieros
          económicos y comerciales a nivel nacional e internacional, y otras
          figuras delictivas que pudieren afectar el nombre o reputación del
          PROVEEDOR.
        </Text>

        <Text style={styles.paragraph}>
          El IMPORTADOR se compromete a proporcionar la documentación que el
          PROVEEDOR considere necesaria para verificar el origen de los fondos y
          cumplir con las normativas aplicables. En caso de detectarse indicios
          de actividades sospechosas, el PROVEEDOR podrá suspender o cancelar la
          prestación del servicio sin previo aviso, sin que ello genere
          responsabilidad alguna.
        </Text>

        <Text style={styles.sectionTitle}>DÉCIMA SEGUNDA: LEY APLICABLE.-</Text>

        <Text style={styles.paragraph}>
          La ejecución, cumplimiento, incumplimiento e interpretación de este
          Contrato se regirán exclusivamente por las leyes del Estado
          Plurinacional de Bolivia.
        </Text>

        <Text style={styles.sectionTitle}>
          DÉCIMA TERCERA: CONVENIO ARBITRAL.-
        </Text>

        <Text style={styles.paragraph}>
          Las Partes convienen que, en caso que devinieren controversias en el
          cumplimiento, ejecución, resolución e interpretación del presente
          Contrato, estas serán sometidas a Arbitraje a sustanciarse ante el
          Centro de Conciliación y Arbitraje de la Cámara de Industria,
          Comercio, Servicios y Turismo de la ciudad de Santa Cruz (CAINCO), y
          bajo su Reglamento.
        </Text>

        <Text style={styles.paragraph}>
          El laudo arbitral no será apelable ante tribunal alguno u otra
          entidad, será definitivo y de cumplimiento obligatorio para las
          Partes. La Parte cuyo derecho no prevaleciere en el arbitraje
          realizado, pagará todas las costas y gastos razonables en la
          substanciación del mismo, incluyendo los honorarios profesionales del
          abogado y/o apoderado legal contratado y/o designado por la Parte cuyo
          derecho sí prevaleció.
        </Text>

        <Text style={styles.sectionTitle}>DÉCIMA CUARTA: MODIFICACIONES.-</Text>

        <Text style={styles.paragraph}>
          Ningún cambio, modificación o alteración del presente Contrato, será
          válido si el mismo no consta por escrito y cuenta con la firma de
          ambas partes, en una adenda.
        </Text>

        <Text style={styles.sectionTitle}>
          DÉCIMA QUINTA: ACEPTACIÓN Y CONFORMIDAD.-
        </Text>

        <Text style={styles.paragraph}>
          Las Partes, en señal de conformidad y aceptación de todas y cada una
          de las cláusulas del presente Contrato, suscriben el mismo obligándose
          a su fiel y estricto cumplimiento, en dos ejemplares de un solo tenor
          y para el mismo efecto.
        </Text>

        <Text style={styles.centerText}>
          Santa Cruz, {formatDate(new Date().toISOString())}.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>
              {contactData.name ||
                contract.request?.company?.contactName ||
                "_________________"}
            </Text>
            <Text style={styles.signatureTitle}>Pp. / IMPORTADOR</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>Jimena León Céspedes</Text>
            <Text style={styles.signatureTitle}>Pp. / PROVEEDOR</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPDF;
