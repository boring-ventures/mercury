import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Get daily usage for cashier accounts
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

    // Get cashier's assigned accounts
    const assignments = await prisma.cashierAssignment.findMany({
      where: {
        cashierId: cashierId,
        account: {
          active: true,
        },
      },
      include: {
        account: true,
      },
    });

    // Get today's date range (start and end of day)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Calculate usage for each account
    const usage = await Promise.all(
      assignments.map(async (assignment) => {
        // Sum all assigned amounts for transactions created today for this account and cashier
        const todaysTransactions = await prisma.cashierTransaction.findMany({
          where: {
            cashierId: cashierId,
            accountId: assignment.accountId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              not: "CANCELLED",
            },
          },
          select: {
            assignedAmountBs: true,
          },
        });

        const usedToday = todaysTransactions.reduce(
          (sum, t) => sum + Number(t.assignedAmountBs),
          0
        );

        const dailyLimit = Number(assignment.account.dailyLimitBs);
        const remainingLimit = Math.max(0, dailyLimit - usedToday);
        const percentageUsed = dailyLimit > 0 ? (usedToday / dailyLimit) * 100 : 0;

        return {
          accountId: assignment.accountId,
          accountName: assignment.account.name,
          usedToday,
          dailyLimit,
          remainingLimit,
          percentageUsed,
          transactionCount: todaysTransactions.length,
        };
      })
    );

    return NextResponse.json({
      usage,
      date: now.toISOString(),
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching daily usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily usage" },
      { status: 500 }
    );
  }
}
