import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin user
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Fetch all payments with basic data first
    const payments = await prisma.payment.findMany({
      include: {
        contract: {
          include: {
            company: true,
            quotation: {
              include: {
                request: {
                  include: {
                    provider: true,
                  },
                },
              },
            },
            createdBy: true,
          },
        },
        documents: {
          where: {
            type: "COMPROBANTE_PAGO",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Found payments:", payments.length);

    // For payments without documents, try to find documents by contract
    const paymentsWithDocuments = await Promise.all(
      payments.map(async (payment) => {
        if (!payment.documents || payment.documents.length === 0) {
          // Try to find documents for this contract
          const contractDocuments = await prisma.document.findMany({
            where: {
              contractId: payment.contractId,
              type: "COMPROBANTE_PAGO",
            },
          });

          if (contractDocuments.length > 0) {
            console.log(
              `Found ${contractDocuments.length} documents for contract ${payment.contractId} but not linked to payment ${payment.id}`
            );
            return {
              ...payment,
              documents: contractDocuments,
            };
          }
        }
        return payment;
      })
    );

    // Debug: Log each payment and its documents
    paymentsWithDocuments.forEach((payment, index) => {
      console.log(`Payment ${index + 1}:`, {
        id: payment.id,
        code: payment.code,
        documentsCount: payment.documents?.length || 0,
        documents: payment.documents?.map((doc) => ({
          id: doc.id,
          filename: doc.filename,
          type: doc.type,
          paymentId: doc.paymentId,
        })),
      });
    });

    return NextResponse.json({ payments: paymentsWithDocuments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Error al cargar los pagos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== PAYMENT CREATION API START ===");

    // Authenticate admin user
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      console.log("Profile not found for user:", user.id);
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    if (profile.role !== "SUPERADMIN") {
      console.log("Unauthorized role:", profile.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { contractId, type, status, notes } = body;

    console.log("Request body:", { contractId, type, status, notes });

    if (!contractId || !type) {
      return NextResponse.json(
        { error: "contractId y type son requeridos" },
        { status: 400 }
      );
    }

    // Verify contract exists
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: true,
      },
    });

    if (!contract) {
      console.log("Contract not found:", contractId);
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    console.log("Contract found:", {
      id: contract.id,
      code: contract.code,
      companyId: contract.companyId,
      amount: contract.amount,
      currency: contract.currency,
    });

    if (!contract.companyId) {
      console.log("Contract has no companyId");
      return NextResponse.json(
        { error: "El contrato no tiene una empresa asociada" },
        { status: 400 }
      );
    }

    // Validate contract amount
    if (!contract.amount || contract.amount <= 0) {
      console.log("Contract has invalid amount:", contract.amount);
      return NextResponse.json(
        { error: "El contrato no tiene un monto válido" },
        { status: 400 }
      );
    }

    // Generate payment code
    const paymentCount = await prisma.payment.count();
    const code = `PAY-${String(paymentCount + 1).padStart(6, "0")}`;

    console.log("Creating payment with data:", {
      code,
      contractId,
      companyId: contract.companyId,
      type,
      status: status || "PENDING",
      description:
        notes || `Pago de tipo ${type} para contrato ${contract.code}`,
      amount: contract.amount,
      currency: contract.currency,
    });

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        code,
        contractId,
        requestId: contract.requestId, // Associate with request
        companyId: contract.companyId,
        type,
        status: status || "PENDING",
        description:
          notes || `Pago de tipo ${type} para contrato ${contract.code}`,
        amount: new Decimal(contract.amount),
        currency: contract.currency,
      },
    });

    console.log("Payment created successfully:", payment.id);

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("=== PAYMENT CREATION API ERROR ===");
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Error al crear el pago",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
