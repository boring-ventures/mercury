import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createReport } from "docx-templates";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId } = body;

    // Get authenticated user
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get contract with all related data
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        request: {
          include: {
            provider: true,
            company: true,
          },
        },
        quotation: true,
        createdBy: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to access this contract
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Only allow access if user is admin or the contract creator
    if (
      userProfile.role !== "SUPERADMIN" &&
      contract.createdById !== userProfile.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

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
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
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

    const additionalData = (contract.additionalData as any) || {};

    // Map the actual data structure from the contract generation API
    const representative = additionalData.representative || {};
    const notary = additionalData.notary || {};
    const power = additionalData.power || {};
    const banking = additionalData.banking || {};
    const additional = additionalData.additional || {};

    const providerBankingDetails = getBankingDetails(
      contract.request?.provider?.bankingDetails
    );

    // Prepare template data
    const templateData = {
      importer: {
        company: contract.request?.company?.name || "_________________",
        nit: "_________________", // NIT not available in company object
        address: "_________________", // Address not available in company object
        city: contract.request?.company?.country || "_________________",
        representative: {
          role: representative.role || "_________________",
          name: representative.name || "_________________",
        },
        ci: representative.ci || "_________________",
      },
      beneficiary: {
        name: contract.request?.provider?.name || "_________________",
      },
      provider: {
        name: contract.request?.provider?.name || "_________________",
        bankName: providerBankingDetails.bankName || "_________________",
        accountNumber:
          providerBankingDetails.accountNumber || "_________________",
        swiftCode: providerBankingDetails.swiftCode || "_________________",
        beneficiaryName:
          providerBankingDetails.beneficiaryName || "_________________",
        bankAddress: providerBankingDetails.bankAddress || "_________________",
        accountType: banking.accountType || "_________________",
      },
      reference: {
        name: contract.quotation?.code || "_________________",
      },
      quotation: {
        date: formatDate(
          contract.quotation?.createdAt?.toISOString() ||
            contract.createdAt.toISOString()
        ),
      },
      service: {
        amountWords: numberToWords(Number(contract.amount) || 0),
        amount: (Number(contract.amount) || 0).toLocaleString(),
        feeWords: numberToWords(
          Math.round((Number(contract.amount) || 0) * 0.05)
        ), // 5% fee
        fee: Math.round((Number(contract.amount) || 0) * 0.05).toLocaleString(),
      },
      contract: {
        startDate: formatDate(contract.startDate.toISOString()),
        endDate: formatDate(contract.endDate.toISOString()),
        date: formatDate(new Date().toISOString()),
      },
    };

    // Read the template file
    const templatePath = join(
      process.cwd(),
      "templates",
      "contracts",
      "provider-template.docx"
    );
    const template = readFileSync(templatePath);

    // Generate the DOCX
    const buffer = await createReport({
      template,
      data: templateData,
      cmdDelimiter: ["{", "}"],
    });

    // Return the generated DOCX
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Contrato_${contract.code}.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}
