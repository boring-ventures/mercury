import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Register fonts (optional, but recommended for better appearance)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1e40af",
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#1e40af",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: "35%",
    fontSize: 10,
    fontWeight: 500,
    color: "#475569",
  },
  value: {
    width: "65%",
    fontSize: 10,
    fontWeight: 400,
    color: "#1e293b",
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 700,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    color: "#1e293b",
  },
  totalRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f1f5f9",
    marginTop: 5,
    borderRadius: 4,
  },
  totalLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 700,
    color: "#1e293b",
  },
  totalValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: 700,
    color: "#1e40af",
    textAlign: "right",
  },
  conditions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  conditionsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#92400e",
    marginBottom: 8,
  },
  conditionsText: {
    fontSize: 9,
    color: "#78350f",
    lineHeight: 1.5,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
});

interface QuotationPDFDocumentProps {
  date: string;
  company: string;
  client: string;
  amountToSend: string;
  currency: string;
  exchangeRate: string;
  swiftFee: string;
  correspondentFee: string;
  interestRate: string;
  totals: {
    amountInCurrency: number;
    amountInBs: number;
    swiftFeeUSD: number;
    swiftFeeBS: number;
    correspondentFeeUSD: number;
    correspondentFeeBS: number;
    interestAmount: number;
    totalInBs: number;
  };
}

export const QuotationPDFDocument: React.FC<QuotationPDFDocumentProps> = ({
  date,
  company,
  client,
  amountToSend,
  currency,
  exchangeRate,
  swiftFee,
  correspondentFee,
  interestRate,
  totals,
}) => {
  const formattedDate = format(new Date(date), "dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NORDEX GLOBAL SRL</Text>
          <Text style={styles.subtitle}>
            Soluciones Financieras Internacionales
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Cotización</Text>

        {/* Date */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Empresa:</Text>
            <Text style={styles.value}>{company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{client}</Text>
          </View>
        </View>

        {/* Quotation Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLES DE LA OPERACIÓN</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Concepto</Text>
              <Text style={styles.tableHeaderText}>Monto</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Monto a enviar ({currency})
              </Text>
              <Text style={styles.tableCell}>
                {totals.amountInCurrency.toFixed(2)} {currency}
              </Text>
            </View>
            {currency !== "BS" && (
              <>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    Tipo de cambio ({currency}/Bs)
                  </Text>
                  <Text style={styles.tableCell}>{exchangeRate}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Equivalente en Bolivianos</Text>
                  <Text style={styles.tableCell}>
                    {totals.amountInBs.toFixed(2)} Bs
                  </Text>
                </View>
              </>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Comisión Swift ({totals.swiftFeeUSD.toFixed(2)} USD)
              </Text>
              <Text style={styles.tableCell}>
                {totals.swiftFeeBS.toFixed(2)} Bs
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Comisión Corresponsal ({totals.correspondentFeeUSD.toFixed(2)} USD)
              </Text>
              <Text style={styles.tableCell}>
                {totals.correspondentFeeBS.toFixed(2)} Bs
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Interés ({interestRate}%)</Text>
              <Text style={styles.tableCell}>
                {totals.interestAmount.toFixed(2)} Bs
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
              <Text style={styles.totalValue}>
                {totals.totalInBs.toFixed(2)} Bs
              </Text>
            </View>
          </View>
        </View>

        {/* Conditions */}
        <View style={styles.conditions}>
          <Text style={styles.conditionsTitle}>
            CONDICIONES DE LA OPERACIÓN
          </Text>
          <Text style={styles.conditionsText}>
            1. La presente cotización tiene una validez de 24 horas a partir de
            su emisión, debido a la variación constante del tipo de cambio y
            costos asociados. La operación será ejecutada en un plazo de hasta
            un (1) día hábil contado desde la confirmación del depósito íntegro
            del monto total cotizado, el cual deberá realizarse exclusivamente
            mediante transferencia bancaria a la cuenta empresarial de NORDEX
            GLOBAL SRL.
            {"\n\n"}
            Nordex garantiza que el monto neto en dólares será acreditado a la
            cuenta del proveedor extranjero, siendo el cliente responsable
            únicamente de transferir el monto total indicado en bolivianos.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            NORDEX GLOBAL SRL - Soluciones Financieras Internacionales
          </Text>
          <Text style={styles.footerText}>
            www.nordexglobal.com | contacto@nordexglobal.com | +591 000 0000
          </Text>
        </View>
      </Page>
    </Document>
  );
};
