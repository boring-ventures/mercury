import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch cashier's own accounts
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

    // Verify the user is a cashier
    const profile = await prisma.profile.findUnique({
      where: { id: cashierId },
      select: { role: true },
    });

    if (!profile || profile.role !== "CAJERO") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get cashier's own accounts (where they are the owner)
    const accounts = await prisma.cashierAccount.findMany({
      where: {
        cashierAssignments: {
          some: {
            cashierId: cashierId,
          },
        },
      },
      include: {
        _count: {
          select: {
            cashierTransactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching cashier accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

// POST: Create a new account for the cashier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cashierId, name, dailyLimitBs } = body;

    // Validate required fields
    if (!cashierId || !name || !dailyLimitBs) {
      return NextResponse.json(
        { error: "Cashier ID, name, and daily limit are required" },
        { status: 400 }
      );
    }

    // Verify the user is a cashier
    const profile = await prisma.profile.findUnique({
      where: { id: cashierId },
      select: { role: true },
    });

    if (!profile || profile.role !== "CAJERO") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const limit = parseFloat(dailyLimitBs);
    if (limit <= 0) {
      return NextResponse.json(
        { error: "Daily limit must be greater than 0" },
        { status: 400 }
      );
    }

    // Create the account
    const account = await prisma.cashierAccount.create({
      data: {
        name,
        dailyLimitBs: limit,
        active: true,
      },
    });

    // Automatically assign this account to the cashier who created it
    await prisma.cashierAssignment.create({
      data: {
        cashierId: cashierId,
        accountId: account.id,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating cashier account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
