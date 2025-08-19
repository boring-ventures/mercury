import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs/promises";
import createReport from "docx-templates";

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

    const data = {
      contract: {
        code: contract.code,
        title: contract.title,
        date: (contract.signedAt || contract.createdAt).toISOString(),
        city: company?.city || "",
        year: new Date().getFullYear(),
        subtitle: "Pago de Proveedores",
        amount: contract.amount,
        currency: contract.currency,
        startDate:
          contract.startDate?.toISOString?.() || new Date().toISOString(),
        endDate: contract.endDate?.toISOString?.() || new Date().toISOString(),
      },
      importer: {
        name: company?.name || "",
        nit: (company as any)?.nit || "",
        address: (company as any)?.bankingDetails?.address || "",
        city: company?.city || "",
        representative: {
          name:
            additionalData.representative?.name ||
            (company as any)?.contactName ||
            "",
          ci: additionalData.representative?.ci || "",
          role:
            additionalData.representative?.role ||
            (company as any)?.contactPosition ||
            "",
          notary: {
            name: additionalData.notary?.name || "",
          },
          testimonioNumber: additionalData.notary?.testimonioNumber || "",
          testimonioDate: additionalData.notary?.testimonioDate || "",
          power: {
            number: additionalData.power?.number || "",
            date: additionalData.power?.date || "",
          },
        },
      },
      provider: provider
        ? {
            name: provider.name,
            nit: "",
            address: (provider as any)?.bankingDetails?.address || "",
            city: (company?.city as string) || "",
            representative: {
              name:
                ((provider as any)?.user?.firstName || "") +
                (provider?.user?.lastName ? ` ${provider.user.lastName}` : ""),
              ci: "",
              role: "Representante Legal",
              notary: { name: "" },
              testimonioNumber: "",
              testimonioDate: "",
            },
          }
        : null,
      quotation: contract.quotation
        ? {
            number: contract.quotation.code,
            date: (
              contract.quotation.respondedAt || contract.quotation.createdAt
            ).toISOString(),
          }
        : null,
      service: {
        description: request?.description || contract.description || "",
        amount: Number(contract.amount),
        currency: contract.currency,
        amountWords: "",
        fee: Number((contract.quotation as any)?.managementServiceBs || 0),
        feeWords: "",
      },
      beneficiary: {
        name: additionalData.additional?.beneficiaryName || "",
      },
      reference: {
        name: additionalData.additional?.referenceName || "",
        date: additionalData.additional?.referenceDate || "",
      },
      bank: {
        name:
          additionalData.banking?.bankName ||
          banking.bankName ||
          banking.name ||
          "",
        holder:
          additionalData.banking?.accountHolder ||
          banking.accountHolder ||
          banking.holder ||
          company?.name ||
          "",
        accountNumber:
          additionalData.banking?.accountNumber ||
          banking.accountNumber ||
          banking.account ||
          "",
        currency: banking.currency || "bolivianos",
        type:
          additionalData.banking?.accountType ||
          banking.type ||
          "Cuenta corriente",
      },
      items: [] as Array<{
        description: string;
        amount: number;
        currency: string;
      }>,
    };

    // Mark missing fields with emoji for easy visual detection in the DOCX
    const markMissing = (value: any): any => {
      if (value === null || value === undefined) return "🔴";
      if (typeof value === "string") return value.trim() === "" ? "🔴" : value;
      if (Array.isArray(value)) return value.map((v) => markMissing(v));
      if (typeof value === "object") {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value)) out[k] = markMissing(v);
        return out;
      }
      return value;
    };

    const dataWithEmojis = markMissing(data);

    const buffer = await createReport({
      template: templateBuffer,
      data: dataWithEmojis,
      cmdDelimiter: ["{", "}"],
      noSandbox: true,
      failFast: false,
      rejectNullish: false,
      additionalJsContext: {
        formatDate: (d?: string | Date) =>
          d
            ? new Date(d).toLocaleDateString("es-BO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
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
    return NextResponse.json(
      { error: "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}
