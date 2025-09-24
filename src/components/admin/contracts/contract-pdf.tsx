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

// Create styles with enhanced formatting support
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#000000",
  },
  // Headings
  heading1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heading2: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heading3: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  heading4: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  heading5: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  heading6: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  // Paragraphs and text
  paragraph: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.6,
  },
  paragraphCenter: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.6,
    textAlign: "center",
  },
  paragraphLeft: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.6,
    textAlign: "left",
  },
  paragraphRight: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.6,
    textAlign: "right",
  },
  paragraphJustify: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  // Lists
  listItem: {
    marginLeft: 25,
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 1.5,
  },
  // Blockquotes
  blockquote: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    paddingLeft: 15,
    borderLeft: "3pt solid #cccccc",
    fontSize: 11,
    fontStyle: "italic",
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  // Text formatting
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecoration: "underline",
  },
  // Font families
  fontTimes: {
    fontFamily: "Times-Roman",
  },
  fontHelvetica: {
    fontFamily: "Helvetica",
  },
  fontCourier: {
    fontFamily: "Courier",
  },
  // Special elements
  signatureSection: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    textAlign: "center",
    width: "45%",
    borderTop: "2pt solid #000000",
    paddingTop: 15,
  },
  signatureName: {
    marginBottom: 30,
    fontSize: 12,
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

interface ContractPDFProps {
  contract: any;
  content: string;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ contract, content }) => {
  // Enhanced HTML parser with better formatting preservation
  const parseHtmlContent = (html: string) => {
    const sections: {
      type: string;
      content: string;
      level?: number;
      alignment?: string;
      isBold?: boolean;
      isItalic?: boolean;
      isUnderline?: boolean;
      color?: string;
      fontFamily?: string;
    }[] = [];

    // Clean up HTML entities first
    const cleanHtml = html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // More comprehensive regex to capture elements with their styling
    const elementRegex =
      /<(h[1-6]|p|ul|ol|blockquote|div)([^>]*)>(.*?)<\/\1>/gis;
    const matches = Array.from(cleanHtml.matchAll(elementRegex));

    if (matches.length === 0) {
      // If no structured elements found, treat as plain text
      const plainText = cleanHtml.replace(/<[^>]*>/g, "").trim();
      if (plainText) {
        sections.push({
          type: "paragraph",
          content: plainText,
        });
      }
      return sections;
    }

    matches.forEach((match) => {
      const [fullMatch, tag, attributes, innerContent] = match;

      // Extract styling information from attributes
      const styleMatch = attributes.match(/style="([^"]*)"/);
      const style = styleMatch ? styleMatch[1] : "";

      // Parse alignment
      let alignment = "justify"; // default
      if (
        style.includes("text-align: center") ||
        attributes.includes("center")
      ) {
        alignment = "center";
      } else if (style.includes("text-align: left")) {
        alignment = "left";
      } else if (style.includes("text-align: right")) {
        alignment = "right";
      } else if (style.includes("text-align: justify")) {
        alignment = "justify";
      }

      // Parse text formatting
      const isBold =
        innerContent.includes("<strong>") ||
        innerContent.includes("<b>") ||
        style.includes("font-weight: bold");
      const isItalic =
        innerContent.includes("<em>") ||
        innerContent.includes("<i>") ||
        style.includes("font-style: italic");
      const isUnderline =
        innerContent.includes("<u>") ||
        style.includes("text-decoration: underline");

      // Parse color
      const colorMatch = style.match(/color:\s*([^;]+)/);
      const color = colorMatch ? colorMatch[1].trim() : undefined;

      // Parse font family
      const fontMatch = style.match(/font-family:\s*([^;]+)/);
      const fontFamily = fontMatch
        ? fontMatch[1].replace(/['"]/g, "").trim()
        : undefined;

      if (tag.match(/h[1-6]/)) {
        const level = parseInt(tag.charAt(1));
        const textContent = innerContent.replace(/<[^>]*>/g, "").trim();
        if (textContent) {
          sections.push({
            type: "heading",
            content: textContent,
            level,
            alignment,
            isBold,
            isItalic,
            isUnderline,
            color,
            fontFamily,
          });
        }
      } else if (tag === "p" || tag === "div") {
        const textContent = innerContent.replace(/<[^>]*>/g, "").trim();
        if (textContent) {
          sections.push({
            type: "paragraph",
            content: textContent,
            alignment,
            isBold,
            isItalic,
            isUnderline,
            color,
            fontFamily,
          });
        }
      } else if (tag === "ul" || tag === "ol") {
        const listItems = innerContent.match(/<li[^>]*>(.*?)<\/li>/gis);
        if (listItems) {
          listItems.forEach((item) => {
            const itemContent = item
              .replace(/<li[^>]*>|<\/li>/g, "")
              .replace(/<[^>]*>/g, "")
              .trim();
            if (itemContent) {
              sections.push({
                type: "listItem",
                content: itemContent,
                alignment,
                isBold,
                isItalic,
                isUnderline,
                color,
                fontFamily,
              });
            }
          });
        }
      } else if (tag === "blockquote") {
        const textContent = innerContent.replace(/<[^>]*>/g, "").trim();
        if (textContent) {
          sections.push({
            type: "blockquote",
            content: textContent,
            alignment,
            isBold,
            isItalic,
            isUnderline,
            color,
            fontFamily,
          });
        }
      }
    });

    // If no sections were parsed, fall back to simple text extraction
    if (sections.length === 0) {
      const plainText = cleanHtml.replace(/<[^>]*>/g, "").trim();
      if (plainText) {
        sections.push({
          type: "paragraph",
          content: plainText,
        });
      }
    }

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

  // Helper function to get style based on section properties
  const getStyleForSection = (section: {
    type: string;
    level?: number;
    alignment?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    color?: string;
    fontFamily?: string;
  }) => {
    const baseStyles: any[] = [];

    // Base style based on type
    switch (section.type) {
      case "heading":
        switch (section.level) {
          case 1:
            baseStyles.push(styles.heading1);
            break;
          case 2:
            baseStyles.push(styles.heading2);
            break;
          case 3:
            baseStyles.push(styles.heading3);
            break;
          case 4:
            baseStyles.push(styles.heading4);
            break;
          case 5:
            baseStyles.push(styles.heading5);
            break;
          case 6:
            baseStyles.push(styles.heading6);
            break;
          default:
            baseStyles.push(styles.heading2);
        }
        break;
      case "listItem":
        baseStyles.push(styles.listItem);
        break;
      case "blockquote":
        baseStyles.push(styles.blockquote);
        break;
      case "paragraph":
      default:
        // Add alignment-specific paragraph style
        switch (section.alignment) {
          case "center":
            baseStyles.push(styles.paragraphCenter);
            break;
          case "left":
            baseStyles.push(styles.paragraphLeft);
            break;
          case "right":
            baseStyles.push(styles.paragraphRight);
            break;
          case "justify":
          default:
            baseStyles.push(styles.paragraphJustify);
            break;
        }
        break;
    }

    // Add text formatting
    if (section.isBold) baseStyles.push(styles.bold);
    if (section.isItalic) baseStyles.push(styles.italic);
    if (section.isUnderline) baseStyles.push(styles.underline);

    // Add font family
    if (section.fontFamily) {
      if (section.fontFamily.toLowerCase().includes("times")) {
        baseStyles.push(styles.fontTimes);
      } else if (section.fontFamily.toLowerCase().includes("courier")) {
        baseStyles.push(styles.fontCourier);
      } else if (
        section.fontFamily.toLowerCase().includes("helvetica") ||
        section.fontFamily.toLowerCase().includes("arial")
      ) {
        baseStyles.push(styles.fontHelvetica);
      }
    }

    // Add custom styles for color and alignment
    const customStyle: any = {};

    if (
      section.color &&
      section.color !== "#000000" &&
      section.color !== "black"
    ) {
      customStyle.color = section.color;
    }

    // Override alignment for headings if specified
    if (section.type === "heading" && section.alignment) {
      customStyle.textAlign = section.alignment;
    }

    return [...baseStyles, customStyle];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sections.length > 0 ? (
          sections.map((section, index) => {
            const sectionStyles = getStyleForSection(section);
            const displayContent =
              section.type === "listItem"
                ? `• ${section.content}`
                : section.content;

            return (
              <Text key={index} style={sectionStyles}>
                {displayContent}
              </Text>
            );
          })
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
