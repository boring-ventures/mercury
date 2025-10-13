import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CashierTransactionStatus } from "@prisma/client";

// POST: Cashier participates in a quotation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { cashierId, accountId, assignedAmountBs } = body;

    // Validate required fields
    if (!cashierId || !accountId || !assignedAmountBs) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { id: quotationId } = await params;
    const amount = parseFloat(assignedAmountBs);

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Get quotation
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        cashierTransactions: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    if (quotation.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Quotation is not accepted" },
        { status: 400 }
      );
    }

    // Check if cashier already has a transaction for this quotation
    const existingTransaction = quotation.cashierTransactions.find(
      (t) => t.cashierId === cashierId
    );

    if (existingTransaction) {
      return NextResponse.json(
        { error: "You are already participating in this quotation" },
        { status: 400 }
      );
    }

    // Check remaining amount available
    const totalAssigned = quotation.cashierTransactions.reduce(
      (sum, t) => sum + Number(t.assignedAmountBs),
      0
    );
    const remaining = Number(quotation.totalInBs) - totalAssigned;

    if (amount > remaining) {
      return NextResponse.json(
        {
          error: `Amount exceeds remaining balance. Available: ${remaining.toFixed(2)} Bs`,
        },
        { status: 400 }
      );
    }

    // Check cashier's account
    const account = await prisma.cashierAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.active) {
      return NextResponse.json(
        { error: "Invalid or inactive account" },
        { status: 400 }
      );
    }

    // Check daily limit
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    const todaysTransactions = await prisma.cashierTransaction.findMany({
      where: {
        cashierId,
        accountId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "CANCELLED",
        },
      },
    });

    const usedToday = todaysTransactions.reduce(
      (sum, t) => sum + Number(t.assignedAmountBs),
      0
    );

    const availableToday = Number(account.dailyLimitBs) - usedToday;

    if (amount > availableToday) {
      return NextResponse.json(
        {
          error: `Amount exceeds your daily limit. Available today: ${availableToday.toFixed(2)} Bs`,
        },
        { status: 400 }
      );
    }

    // Calculate expected USDT
    const expectedUsdt = amount / Number(quotation.exchangeRate);

    // Create transaction
    const transaction = await prisma.cashierTransaction.create({
      data: {
        quotationId,
        cashierId,
        accountId,
        assignedAmountBs: amount,
        suggestedExchangeRate: quotation.exchangeRate,
        expectedUsdt,
        status: CashierTransactionStatus.PENDING,
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
            request: {
              select: {
                code: true,
              },
            },
          },
        },
        cashier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating participation:", error);
    return NextResponse.json(
      { error: "Failed to participate in quotation" },
      { status: 500 }
    );
  }
}
