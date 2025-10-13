import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CashierTransactionStatus } from "@prisma/client";

// GET: Fetch cashier transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get("cashierId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (cashierId) where.cashierId = cashierId;
    if (status) where.status = status as CashierTransactionStatus;

    const total = await prisma.cashierTransaction.count({ where });

    const transactions = await prisma.cashierTransaction.findMany({
      where,
      include: {
        quotation: {
          select: {
            id: true,
            code: true,
            totalInBs: true,
            amount: true,
            currency: true,
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cashier transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier transactions" },
      { status: 500 }
    );
  }
}

// POST: Assign cashier to a quotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quotationId, cashierId, accountId, assignedAmountBs } = body;

    // Validate required fields
    if (!quotationId || !cashierId || !accountId || !assignedAmountBs) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get quotation details
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      select: {
        id: true,
        totalInBs: true,
        amount: true,
        exchangeRate: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Calculate expected USDT based on assigned amount
    const expectedUsdt = parseFloat(assignedAmountBs) / parseFloat(quotation.exchangeRate.toString());

    // Create transaction
    const transaction = await prisma.cashierTransaction.create({
      data: {
        quotationId,
        cashierId,
        accountId,
        assignedAmountBs: parseFloat(assignedAmountBs),
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

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating cashier transaction:", error);
    return NextResponse.json(
      { error: "Failed to create cashier transaction" },
      { status: 500 }
    );
  }
}
