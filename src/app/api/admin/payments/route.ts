import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin user
    const supabase = createServerComponentClient({ cookies });
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
