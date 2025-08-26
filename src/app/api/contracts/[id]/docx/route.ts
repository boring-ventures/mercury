import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs/promises";
import { createReport } from "docx-templates";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;

    // Auth: admin or assigned user can download; for now require session
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Load contract and relations
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: true,
        quotation: true,
        request: {
          include: { company: true, provider: { include: { user: true } } },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Locate template .docx
    const candidatePaths = [
      // Preferred: inside src/
      path.join(
        process.cwd(),
        "src",
        "templates",
        "contracts",
        "provider-payment.docx"
      ),
      path.join(
        process.cwd(),
        "src",
        "templates",
        "contracts",
        "contract.docx"
      ),
      path.join(
        process.cwd(),
        "src",
        "templates",
        "contracts",
        "provider-template.docx"
      ),
      // Also support project root templates/
      path.join(
        process.cwd(),
        "templates",
        "contracts",
        "provider-payment.docx"
      ),
      path.join(process.cwd(), "templates", "contracts", "contract.docx"),
      path.join(
        process.cwd(),
        "templates",
        "contracts",
        "provider-template.docx"
      ),
    ];

    let templateBuffer: Buffer | null = null;
    for (const p of candidatePaths) {
      try {
        const file = await fs.readFile(p);
        templateBuffer = file;
        break;
      } catch (_) {
        // try next path
      }
    }

    if (!templateBuffer) {
      return NextResponse.json(
        { error: "Template not found", tried: candidatePaths },
        { status: 404 }
      );
    }

    // Prepare data for template
    const request = contract.request;
    const company = request?.company || contract.company;
    const provider = request?.provider || null;

    const banking =
      (company as unknown as { bankingDetails?: any })?.bankingDetails || {};

    // Get additional contract data if available
    const additionalData = (contract as any)?.additionalData || {};

    // Extract comprehensive form data we're now storing
    const companyData = additionalData.companyData || {};
    const contactData = additionalData.contactData || {};
    const providerData = additionalData.providerData || {};

    // Helper function to get value with meaningful fallback
    const getValue = (...values: any[]): string => {
      for (const value of values) {
        if (value !== null && value !== undefined) {
          // Convert Decimal objects to string
          if (value && typeof value === "object" && "toFixed" in value) {
            return value.toFixed(2);
          }
          // Convert Date objects to DD/MM/YYYY format
          if (value instanceof Date) {
            return value.toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
          // Convert other values to string
          const stringValue = String(value).trim();
          if (stringValue !== "") {
            return stringValue;
          }
        }
      }
      return ""; // Return empty string only if all values are truly empty
    };

    // Helper function to convert numbers to words in Spanish
    const numberToWords = (num: number): string => {
      if (num === 0) return "cero";

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
      const hundreds = [
        "",
        "ciento",
        "doscientos",
        "trescientos",
        "cuatrocientos",
        "quinientos",
        "seiscientos",
        "setecientos",
        "ochocientos",
        "novecientos",
      ];

      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        if (num % 10 === 0) return tens[Math.floor(num / 10)];
        if (num < 30) return "veinti" + units[num % 10];
        return tens[Math.floor(num / 10)] + " y " + units[num % 10];
      }
      if (num < 1000) {
        if (num === 100) return "cien";
        if (num % 100 === 0) return hundreds[Math.floor(num / 100)];
        return hundreds[Math.floor(num / 100)] + " " + numberToWords(num % 100);
      }
      if (num < 1000000) {
        if (num === 1000) return "mil";
        if (num < 2000) return "mil " + numberToWords(num % 1000);
        if (num % 1000 === 0)
          return numberToWords(Math.floor(num / 1000)) + " mil";
        return (
          numberToWords(Math.floor(num / 1000)) +
          " mil " +
          numberToWords(num % 1000)
        );
      }

      return num.toString(); // Fallback for very large numbers
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
      contract.request?.provider?.bankingDetails
    );

    // Debug logging to see what data we have (after functions are defined)
    console.log("Contract DOCX Generation - Available data:");
    console.log("companyData:", companyData);
    console.log("contactData:", contactData);
    console.log("providerData:", providerData);
    console.log("additionalData.banking:", additionalData.banking);
    console.log(
      "Additional representative data:",
      additionalData.representative
    );
    console.log("Company contact data:", (company as any)?.contactPosition);
    console.log(
      "Contract dates - startDate:",
      contract.startDate,
      "endDate:",
      contract.endDate
    );
    console.log(
      "Formatted dates - startDate:",
      getValue(contract.startDate),
      "endDate:",
      getValue(contract.endDate)
    );
    console.log(
      "Raw dates for template - startDate:",
      contract.startDate,
      "endDate:",
      contract.endDate
    );
    console.log(
      "Date types - startDate type:",
      typeof contract.startDate,
      "endDate type:",
      typeof contract.endDate
    );

    // Use the same field structure as the working contract preview
    const data = {
      // Add dates at root level for direct template access
      startDate: contract.startDate
        ? getValue(contract.startDate)
        : getValue(new Date()),
      endDate: contract.endDate
        ? getValue(contract.endDate)
        : getValue(new Date()),
      contractDate: getValue(contract.signedAt || contract.createdAt),

      // Add dates in multiple possible formats the template might expect
      plazoStartDate: contract.startDate
        ? getValue(contract.startDate)
        : getValue(new Date()),
      plazoEndDate: contract.endDate
        ? getValue(contract.endDate)
        : getValue(new Date()),

      // Add dates as simple strings without formatting for direct template access
      startDateSimple: contract.startDate
        ? contract.startDate.toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : new Date().toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      endDateSimple: contract.endDate
        ? contract.endDate.toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : new Date().toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),

      // Contract basic info
      contract: {
        code: contract.code,
        title: contract.title,
        date: getValue(contract.signedAt || contract.createdAt),
        startDate: contract.startDate
          ? getValue(contract.startDate)
          : getValue(new Date()),
        endDate: contract.endDate
          ? getValue(contract.endDate)
          : getValue(new Date()),
        // Provide raw dates for formatDate() function calls in template
        startDateRaw: contract.startDate || new Date(),
        endDateRaw: contract.endDate || new Date(),
        dateRaw: contract.signedAt || contract.createdAt,
        // Also provide as simple strings for direct template access
        startDateStr: contract.startDate
          ? getValue(contract.startDate)
          : getValue(new Date()),
        endDateStr: contract.endDate
          ? getValue(contract.endDate)
          : getValue(new Date()),
        amount: getValue(contract.amount),
        currency: contract.currency,
      },

      // Nested structure that the DOCX template expects
      importer: {
        company: getValue(companyData.name, company?.name),
        nit: getValue(
          companyData.nit,
          additionalData.additional?.nit,
          (company as any)?.nit
        ),
        address: getValue(
          companyData.address,
          additionalData.additional?.address,
          (company as any)?.bankingDetails?.address
        ),
        city: getValue(
          companyData.city,
          additionalData.additional?.city,
          company?.city,
          company?.country
        ),
        phone: getValue(companyData.phone),
        email: getValue(companyData.email),
        // Add CI at the top level for direct template access
        ci: getValue(
          contactData.ci,
          additionalData.representative?.ci,
          additionalData.additional?.representative?.ci,
          (company as any)?.contactPosition,
          "Por definir"
        ),
        representative: {
          role: getValue(
            contactData.position,
            additionalData.representative?.role,
            additionalData.additional?.representative?.role
          ),
          name: getValue(
            contactData.name,
            additionalData.representative?.name,
            additionalData.additional?.representative?.name,
            (company as any)?.contactName
          ),
          ci: getValue(
            contactData.ci,
            additionalData.representative?.ci,
            additionalData.additional?.representative?.ci,
            (company as any)?.contactPosition,
            "Por definir"
          ),
          phone: getValue(contactData.phone),
          email: getValue(contactData.email),
          notary: {
            name: getValue(additionalData.notary?.name),
          },
          testimonioNumber: getValue(additionalData.notary?.testimonioNumber),
          testimonioDate: getValue(additionalData.notary?.testimonioDate),
          power: {
            number: getValue(additionalData.power?.number),
            date: getValue(additionalData.power?.date),
          },
        },
      },

      // Provider info
      beneficiary: {
        name: getValue(provider?.name),
      },
      provider: {
        name: getValue(provider?.name),
        bankName: getValue(
          providerData.bankName,
          additionalData.banking?.bankName,
          providerBankingDetails.bankName
        ),
        accountNumber: getValue(
          providerData.accountNumber,
          additionalData.banking?.accountNumber,
          providerBankingDetails.accountNumber
        ),
        swiftCode: getValue(
          providerData.swiftCode,
          additionalData.banking?.swiftCode,
          providerBankingDetails.swiftCode
        ),
        beneficiaryName: getValue(
          providerData.beneficiaryName,
          additionalData.banking?.accountHolder,
          providerBankingDetails.accountHolder
        ),
        bankAddress: getValue(
          providerData.bankAddress,
          additionalData.banking?.bankAddress,
          providerBankingDetails.bankAddress
        ),
        accountType: getValue(
          providerData.accountType,
          additionalData.banking?.accountType,
          providerBankingDetails.accountType
        ),
        email: getValue(providerData.email, provider?.email),
        phone: getValue(providerData.phone, provider?.phone),
        country: getValue(providerData.country),
      },

      // Reference and quotation
      reference: {
        name: getValue(contract.quotation?.code),
      },
      quotation: {
        date: getValue(contract.createdAt),
      },

      // Service amounts
      service: {
        amountWords: numberToWords(Number(contract.amount || 0)),
        amount: getValue(contract.amount),
        feeWords: numberToWords(
          Math.round(Number(contract.amount || 0) * 0.05)
        ),
        fee: getValue(Math.round(Number(contract.amount || 0) * 0.05)),
      },

      // Banking info
      bank: {
        name: getValue(
          providerData.bankName,
          additionalData.banking?.bankName,
          providerBankingDetails.bankName
        ),
        holder: getValue(
          providerData.beneficiaryName,
          additionalData.banking?.accountHolder,
          providerBankingDetails.accountHolder
        ),
        accountNumber: getValue(
          providerData.accountNumber,
          additionalData.banking?.accountNumber,
          providerBankingDetails.accountNumber
        ),
        swiftCode: getValue(
          providerData.swiftCode,
          providerBankingDetails.swiftCode
        ),
        address: getValue(
          providerData.bankAddress,
          providerBankingDetails.bankAddress
        ),
        currency: "bolivianos",
        type: getValue(
          providerData.accountType,
          additionalData.banking?.accountType,
          "Cuenta corriente"
        ),
      },
    };

    // Add comprehensive debugging (safe logging)
    try {
      console.log(
        "DOCX Data Structure - Complete data object:",
        JSON.stringify(data, null, 2)
      );
    } catch (e) {
      console.log("DOCX Data Structure - Could not stringify data:", e);
      console.log("Data keys:", Object.keys(data));
    }

    // Debug: Check what the template is actually receiving for dates
    console.log("=== DATE DEBUGGING ===");
    console.log("Root level dates:");
    console.log("- startDate:", data.startDate);
    console.log("- endDate:", data.endDate);
    console.log("- contractDate:", data.contractDate);
    console.log("Contract object dates:");
    console.log("- contract.startDate:", data.contract.startDate);
    console.log("- contract.endDate:", data.contract.endDate);
    console.log("- contract.startDateRaw:", data.contract.startDateRaw);
    console.log("- contract.endDateRaw:", data.contract.endDateRaw);
    console.log("=== END DATE DEBUGGING ===");

    // Fields that are optional and shouldn't be marked as missing
    const optionalFields = [
      "swiftCode",
      "address",
      "phone",
      "email",
      "nit",
      "currency",
      "testimonioNumber",
      "testimonioDate",
      "power.number",
      "power.date",
      "reference.name",
      "reference.date",
      "beneficiary.name",
    ];

    // Helper to check if a field path is optional
    const isOptionalField = (path: string): boolean => {
      return optionalFields.some((opt) => path.includes(opt));
    };

    // Mark missing fields with emoji for easy visual detection in the DOCX
    const markMissing = (value: any, path: string = ""): any => {
      if (value === null || value === undefined) {
        return isOptionalField(path) ? "" : "🔴";
      }
      if (typeof value === "string") {
        return value.trim() === ""
          ? isOptionalField(path)
            ? ""
            : "🔴"
          : value;
      }
      if (Array.isArray(value)) {
        return value.map((v, i) => markMissing(v, `${path}[${i}]`));
      }
      if (typeof value === "object") {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value)) {
          out[k] = markMissing(v, path ? `${path}.${k}` : k);
        }
        return out;
      }
      return value;
    };

    // Re-enable intelligent red dot marking
    const dataWithEmojis = markMissing(data);
    console.log("Final data for template:", Object.keys(dataWithEmojis));

    const buffer = await createReport({
      template: templateBuffer,
      data: dataWithEmojis,
      cmdDelimiter: ["{", "}"],
      noSandbox: true,
      failFast: false,
      rejectNullish: false,
      additionalJsContext: {
        formatDate: (d?: string | Date) => {
          console.log("formatDate called with:", d, "type:", typeof d);
          if (!d) {
            console.log("formatDate: no date provided");
            return "";
          }
          try {
            // Handle both Date objects and date strings
            let date: Date;
            if (d instanceof Date) {
              date = d;
              console.log("formatDate: processing Date object:", date);
            } else if (typeof d === "string") {
              // Try to parse the date string
              date = new Date(d);
              if (isNaN(date.getTime())) {
                console.log("formatDate: Invalid date string:", d);
                return "Fecha no válida";
              }
              console.log("formatDate: parsed string to Date:", date);
            } else {
              date = new Date(d);
              if (isNaN(date.getTime())) {
                console.log("formatDate: Invalid date value:", d);
                return "Fecha no válida";
              }
              console.log("formatDate: converted value to Date:", date);
            }

            const result = date.toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            console.log("formatDate: returning formatted result:", result);
            return result;
          } catch (error) {
            console.log("formatDate: Error formatting date:", d, error);
            return "Fecha no válida";
          }
        },
        upper: (s?: string) => (s ? String(s).toUpperCase() : ""),
      },
    });

    const filename = `contrato-${contract.code}.docx`;
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating contract DOCX:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "Failed to generate DOCX",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
