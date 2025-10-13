import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuotationStatus } from "@prisma/client";

// POST: Manually sync cashier transactions for already accepted quotations
export async function POST(request: NextRequest) {
  try {
    // Get all accepted quotations that don't have cashier transactions yet
    const acceptedQuotations = await prisma.quotation.findMany({
      where: {
        status: QuotationStatus.ACCEPTED,
      },
      include: {
        cashierTransactions: true,
        request: {
          include: {
            company: true,
          },
        },
      },
    });

    // Get all active cashiers
    const cashiers = await prisma.profile.findMany({
      where: {
        role: "CAJERO",
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (cashiers.length === 0) {
      return NextResponse.json({
        message: "No hay cajeros activos en el sistema",
        created: 0,
      });
    }

    // Get or create default account
    let defaultAccount = await prisma.cashierAccount.findFirst({
      where: { active: true },
    });

    if (!defaultAccount) {
      defaultAccount = await prisma.cashierAccount.create({
        data: {
          name: "Cuenta por Defecto",
          dailyLimitBs: 1000000,
          active: true,
        },
      });
    }

    let createdCount = 0;
    const results = [];

    // Create transactions for each quotation
    for (const quotation of acceptedQuotations) {
      const quotationResult = {
        quotationCode: quotation.code,
        transactionsCreated: 0,
        cashiers: [] as string[],
      };

      for (const cashier of cashiers) {
        // Check if transaction already exists
        const existingTransaction = await prisma.cashierTransaction.findFirst({
          where: {
            quotationId: quotation.id,
            cashierId: cashier.id,
          },
        });

        if (!existingTransaction) {
          // Check if cashier has an assigned account
          const cashierAssignment = await prisma.cashierAssignment.findFirst({
            where: {
              cashierId: cashier.id,
              account: {
                active: true,
              },
            },
            include: {
              account: true,
            },
          });

          const accountToUse = cashierAssignment?.account || defaultAccount;
          const expectedUsdt = Number(quotation.totalInBs) / Number(quotation.exchangeRate);

          await prisma.cashierTransaction.create({
            data: {
              quotationId: quotation.id,
              cashierId: cashier.id,
              accountId: accountToUse.id,
              assignedAmountBs: quotation.totalInBs,
              suggestedExchangeRate: quotation.exchangeRate,
              expectedUsdt: expectedUsdt,
              status: "PENDING",
            },
          });

          createdCount++;
          quotationResult.transactionsCreated++;
          quotationResult.cashiers.push(`${cashier.firstName} ${cashier.lastName}`);
        }
      }

      if (quotationResult.transactionsCreated > 0) {
        results.push(quotationResult);
      }
    }

    return NextResponse.json({
      message: `Se crearon ${createdCount} transacciones de cajero`,
      acceptedQuotations: acceptedQuotations.length,
      activeCashiers: cashiers.length,
      created: createdCount,
      details: results,
    });
  } catch (error) {
    console.error("Error syncing cashier transactions:", error);
    return NextResponse.json(
      { error: "Failed to sync cashier transactions" },
      { status: 500 }
    );
  }
}

// GET: Check status of cashier transactions
export async function GET(request: NextRequest) {
  try {
    // Get statistics
    const acceptedQuotations = await prisma.quotation.count({
      where: { status: QuotationStatus.ACCEPTED },
    });

    const activeCashiers = await prisma.profile.count({
      where: {
        role: "CAJERO",
        status: "ACTIVE",
      },
    });

    const cashierTransactions = await prisma.cashierTransaction.count();

    const pendingTransactions = await prisma.cashierTransaction.count({
      where: { status: "PENDING" },
    });

    const completedTransactions = await prisma.cashierTransaction.count({
      where: { status: "COMPLETED" },
    });

    const cashierAccounts = await prisma.cashierAccount.count({
      where: { active: true },
    });

    // Get quotations without transactions
    const quotationsWithoutTransactions = await prisma.quotation.findMany({
      where: {
        status: QuotationStatus.ACCEPTED,
        cashierTransactions: {
          none: {},
        },
      },
      select: {
        id: true,
        code: true,
        totalInBs: true,
      },
    });

    return NextResponse.json({
      statistics: {
        acceptedQuotations,
        activeCashiers,
        totalCashierTransactions: cashierTransactions,
        pendingTransactions,
        completedTransactions,
        activeCashierAccounts: cashierAccounts,
      },
      quotationsWithoutTransactions: quotationsWithoutTransactions.length,
      quotationsNeedingSync: quotationsWithoutTransactions,
      needsSync: quotationsWithoutTransactions.length > 0,
    });
  } catch (error) {
    console.error("Error checking cashier transaction status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
