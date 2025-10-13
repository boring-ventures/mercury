import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuotationStatus } from "@prisma/client";

// GET: Fetch available quotations that cashier can participate in
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get("cashierId");

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
      );
    }

    // Get all accepted quotations
    const acceptedQuotations = await prisma.quotation.findMany({
      where: {
        status: QuotationStatus.ACCEPTED,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        request: {
          select: {
            id: true,
            code: true,
          },
        },
        cashierTransactions: {
          select: {
            id: true,
            cashierId: true,
            status: true,
            assignedAmountBs: true,
          },
        },
      },
      orderBy: {
        respondedAt: "desc",
      },
    });

    // Separate quotations into:
    // 1. Available to participate (no transaction for this cashier)
    // 2. Already participating (has transaction for this cashier)
    const availableQuotations = [];
    const participatingQuotations = [];

    for (const quotation of acceptedQuotations) {
      const cashierTransaction = quotation.cashierTransactions.find(
        (t) => t.cashierId === cashierId
      );

      if (cashierTransaction) {
        // Cashier is already participating
        participatingQuotations.push({
          ...quotation,
          myTransaction: cashierTransaction,
        });
      } else {
        // Cashier can participate
        // Calculate how much is still available
        const totalAssigned = quotation.cashierTransactions.reduce(
          (sum, t) => sum + Number(t.assignedAmountBs),
          0
        );
        const remaining = Number(quotation.totalInBs) - totalAssigned;

        availableQuotations.push({
          ...quotation,
          totalAssigned,
          remainingAmount: remaining,
          canParticipate: remaining > 0,
        });
      }
    }

    return NextResponse.json({
      available: availableQuotations,
      participating: participatingQuotations,
      total: acceptedQuotations.length,
    });
  } catch (error) {
    console.error("Error fetching available quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch available quotations" },
      { status: 500 }
    );
  }
}
