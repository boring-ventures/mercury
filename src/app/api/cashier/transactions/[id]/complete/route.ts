import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CashierTransactionStatus } from "@prisma/client";

// POST: Complete a cashier transaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { deliveredUsdt, notes } = body;

    if (!deliveredUsdt || deliveredUsdt <= 0) {
      return NextResponse.json(
        { error: "Delivered USDT amount is required and must be positive" },
        { status: 400 }
      );
    }

    const { id: transactionId } = await params;

    // Get existing transaction
    const existingTransaction = await prisma.cashierTransaction.findUnique({
      where: { id: transactionId },
      include: {
        quotation: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (existingTransaction.status === CashierTransactionStatus.COMPLETED) {
      return NextResponse.json(
        { error: "Transaction is already completed" },
        { status: 400 }
      );
    }

    // Update transaction
    const transaction = await prisma.cashierTransaction.update({
      where: { id: transactionId },
      data: {
        deliveredUsdt: parseFloat(deliveredUsdt),
        status: CashierTransactionStatus.COMPLETED,
        completedAt: new Date(),
        notes: notes || null,
      },
      include: {
        quotation: {
          select: {
            id: true,
            code: true,
            totalInBs: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        cashier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            dailyLimitBs: true,
          },
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error completing cashier transaction:", error);
    return NextResponse.json(
      { error: "Failed to complete cashier transaction" },
      { status: 500 }
    );
  }
}
