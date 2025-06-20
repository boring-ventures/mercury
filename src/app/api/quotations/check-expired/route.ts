import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    // Get all quotations for the request that might be expired
    const quotations = await prisma.quotation.findMany({
      where: {
        requestId: requestId,
        status: {
          in: ["DRAFT", "SENT"], // Only check active quotations
        },
      },
    });

    const now = new Date();
    const updatedQuotations = [];

    // Check each quotation for expiration
    for (const quotation of quotations) {
      if (new Date(quotation.validUntil) < now) {
        // Mark as expired
        const updated = await prisma.quotation.update({
          where: { id: quotation.id },
          data: { status: "EXPIRED" },
        });
        updatedQuotations.push(updated);
      }
    }

    // Return the updated quotations and count
    return NextResponse.json({
      success: true,
      expiredCount: updatedQuotations.length,
      expiredQuotations: updatedQuotations,
    });
  } catch (error) {
    console.error("Error checking expired quotations:", error);
    return NextResponse.json(
      { error: "Error checking expired quotations" },
      { status: 500 }
    );
  }
}
