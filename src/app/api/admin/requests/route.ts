import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notifyAllAdmins } from "@/lib/notifications";
import { capitalizeCountry } from "@/lib/utils";

// Helper function to generate request code with new format: [CompanyPrefix][Month][Year][SequentialNumber]
async function generateRequestCode(companyName: string): Promise<string> {
  // Generate company prefix: first two letters or first letter of each word
  const generateCompanyPrefix = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word: take first two letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of each word
      return words
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
    }
  };

  const companyPrefix = generateCompanyPrefix(companyName);

  // Get current month and year
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01-12
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits

  // Find the highest sequential number for this company in the current month/year
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const existingRequests = await prisma.request.findMany({
    where: {
      company: {
        name: companyName,
      },
      createdAt: {
        gte: currentMonthStart,
        lt: nextMonthStart,
      },
    },
    select: { code: true },
  });

  // Extract sequential numbers from existing codes and find the next one
  const pattern = new RegExp(`^${companyPrefix}${month}${year}(\\d{2})$`);
  const existingNumbers = existingRequests
    .map((r) => {
      const match = r.code.match(pattern);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => num > 0);

  const nextSequentialNumber =
    existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  return `${companyPrefix}${month}${year}${nextSequentialNumber.toString().padStart(2, "0")}`;
}

interface DocumentUpload {
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type?: string;
  documentInfo?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });

    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Solo los administradores pueden usar este endpoint" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companyId,
      amount,
      currency,
      description,
      providerName,
      providerCountry,
      providerBankName,
      providerAccountNumber,
      providerSwiftCode,
      providerBankAddress,
      providerBeneficiaryName,
      providerEmail,
      providerPhone,
      providerAdditionalInfo,
      documents,
    } = body;

    // Validate required fields
    if (!companyId) {
      return NextResponse.json(
        { error: "Se requiere una empresa" },
        { status: 400 }
      );
    }

    // Get company information
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    // Create or find provider - handle empty fields with defaults
    let provider = null;
    if (providerName && providerCountry) {
      provider = await prisma.provider.findFirst({
        where: {
          name: providerName,
          country: providerCountry,
          userId: profile.id,
        },
      });

      if (!provider) {
        provider = await prisma.provider.create({
          data: {
            name: providerName,
            country: capitalizeCountry(providerCountry),
            userId: profile.id,
            email: providerEmail || null,
            phone: providerPhone || null,
            additionalInfo: providerAdditionalInfo || null,
            bankingDetails: {
              bankName: providerBankName || null,
              accountNumber: providerAccountNumber || null,
              swiftCode: providerSwiftCode || null,
              bankAddress: providerBankAddress || null,
              beneficiaryName: providerBeneficiaryName || null,
            },
          },
        });
      } else {
        // Update existing provider with new information
        provider = await prisma.provider.update({
          where: { id: provider.id },
          data: {
            email: providerEmail || null,
            phone: providerPhone || null,
            additionalInfo: providerAdditionalInfo || null,
            bankingDetails: {
              bankName: providerBankName || null,
              accountNumber: providerAccountNumber || null,
              swiftCode: providerSwiftCode || null,
              bankAddress: providerBankAddress || null,
              beneficiaryName: providerBeneficiaryName || null,
            },
          },
        });
      }
    }

    // Generate unique request code
    const code = await generateRequestCode(company.name);

    // Create the request - handle empty fields with defaults
    const newRequest = await prisma.request.create({
      data: {
        code,
        amount: amount ? parseFloat(amount) : 0,
        currency: currency || "USD",
        description: description || "Sin descripción",
        status: "PENDING",
        providerId: provider?.id,
        companyId: companyId,
        createdById: profile.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            nit: true,
            city: true,
            contactName: true,
            contactPosition: true,
            email: true,
            phone: true,
            bankingDetails: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            country: true,
            email: true,
            phone: true,
            bankingDetails: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // If documents were uploaded, create document records
    if (documents && Array.isArray(documents)) {
      const documentPromises = documents.map((doc: DocumentUpload) => {
        return prisma.document.create({
          data: {
            filename: doc.filename,
            fileUrl: doc.fileUrl,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: (doc.type || "PROFORMA_INVOICE") as
              | "PROFORMA_INVOICE"
              | "FACTURA_COMERCIAL"
              | "OTHER",
            documentInfo: doc.documentInfo || null,
            requestId: newRequest.id,
            companyId: companyId,
          },
        });
      });

      await Promise.all(documentPromises);
    }

    // Notify admins about the new solicitud (optional, since admin created it)
    try {
      await notifyAllAdmins("REQUEST_CREATED", {
        requestId: newRequest.id,
        requestCode: newRequest.code,
        companyName: newRequest.company?.name,
        amount: newRequest.amount,
        currency: newRequest.currency,
        createdBy: `${profile.firstName} ${profile.lastName}`,
      });
    } catch (notificationError) {
      console.error("Error sending notification to admins:", notificationError);
      // Don't fail the request creation if notification fails
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: "Solicitud creada exitosamente",
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
