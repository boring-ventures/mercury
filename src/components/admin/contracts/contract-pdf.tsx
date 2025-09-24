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

// Register fonts for better typography
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Inter-Bold.ttf", fontWeight: "bold" },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica", // Fallback to Helvetica if Inter is not available
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    textTransform: "uppercase",
  },
  heading1: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textTransform: "uppercase",
  },
  heading2: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 15,
    fontSize: 11,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 11,
  },
  centerText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 11,
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
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

interface ContractPDFProps {
  contract: any;
  content: string;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ contract, content }) => {
  // Helper function to parse HTML and extract structured content
  const parseHtmlContent = (html: string) => {
    // Simple HTML parser for our needs
    const sections: { type: string; content: string; level?: number }[] = [];

    // Split by common HTML elements
    const parts = html.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p[^>]*>.*?<\/p>|<ul[^>]*>.*?<\/ul>|<ol[^>]*>.*?<\/ol>)/gi);

    parts.forEach(part => {
      if (!part.trim()) return;

      // Clean up the content
      const cleanContent = part
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();

      if (cleanContent.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/i)) {
        const match = cleanContent.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/i);
        if (match) {
          sections.push({
            type: 'heading',
            content: match[2].replace(/<[^>]*>/g, '').trim(),
            level: parseInt(match[1])
          });
        }
      } else if (cleanContent.match(/<p[^>]*>(.*?)<\/p>/i)) {
        const match = cleanContent.match(/<p[^>]*>(.*?)<\/p>/i);
        if (match) {
          const paragraphContent = match[1].replace(/<[^>]*>/g, '').trim();
          if (paragraphContent) {
            sections.push({
              type: 'paragraph',
              content: paragraphContent
            });
          }
        }
      } else if (cleanContent.match(/<[uo]l[^>]*>(.*?)<\/[uo]l>/i)) {
        const match = cleanContent.match(/<[uo]l[^>]*>(.*?)<\/[uo]l>/i);
        if (match) {
          const listItems = match[1].match(/<li[^>]*>(.*?)<\/li>/gi);
          if (listItems) {
            listItems.forEach(item => {
              const itemContent = item.replace(/<[^>]*>/g, '').trim();
              if (itemContent) {
                sections.push({
                  type: 'listItem',
                  content: itemContent
                });
              }
            });
          }
        }
      } else {
        // Plain text
        const textContent = cleanContent.replace(/<[^>]*>/g, '').trim();
        if (textContent) {
          sections.push({
            type: 'paragraph',
            content: textContent
          });
        }
      }
    });

    return sections;
  };

  const sections = content ? parseHtmlContent(content) : [];

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

  // Helper function to get style based on section type
  const getStyleForSection = (section: { type: string; level?: number }) => {
    switch (section.type) {
      case 'heading':
        if (section.level === 1) return styles.heading1;
        if (section.level === 2) return styles.heading2;
        return styles.heading2; // Default to h2 style for other headings
      case 'listItem':
        return styles.listItem;
      case 'paragraph':
      default:
        return styles.paragraph;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <Text key={index} style={getStyleForSection(section)}>
              {section.type === 'listItem' ? `• ${section.content}` : section.content}
            </Text>
          ))
        ) : (
          <Text style={styles.paragraph}>
            No hay contenido disponible para mostrar en el PDF.
          </Text>
        )}
      </Page>
    </Document>
  );
};

export default ContractPDF;
