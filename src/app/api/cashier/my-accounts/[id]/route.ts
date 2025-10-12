import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Get a specific account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get("cashierId");

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
      );
    }

    const account = await prisma.cashierAccount.findFirst({
      where: {
        id: params.id,
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
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// PATCH: Update an account
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { cashierId, name, dailyLimitBs, active } = body;

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
      );
    }

    // Verify the cashier owns this account
    const assignment = await prisma.cashierAssignment.findFirst({
      where: {
        accountId: params.id,
        cashierId: cashierId,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "You don't have permission to edit this account" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (dailyLimitBs !== undefined) {
      const limit = parseFloat(dailyLimitBs);
      if (limit <= 0) {
        return NextResponse.json(
          { error: "Daily limit must be greater than 0" },
          { status: 400 }
        );
      }
      updateData.dailyLimitBs = limit;
    }
    if (active !== undefined) updateData.active = active;

    const account = await prisma.cashierAccount.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            cashierTransactions: true,
          },
        },
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get("cashierId");

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
      );
    }

    // Verify the cashier owns this account
    const assignment = await prisma.cashierAssignment.findFirst({
      where: {
        accountId: params.id,
        cashierId: cashierId,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "You don't have permission to delete this account" },
        { status: 403 }
      );
    }

    // Check if there are any transactions using this account
    const transactionCount = await prisma.cashierTransaction.count({
      where: {
        accountId: params.id,
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete account with ${transactionCount} active transaction(s). Complete or cancel them first.`,
        },
        { status: 400 }
      );
    }

    // Delete the assignment first
    await prisma.cashierAssignment.delete({
      where: { id: assignment.id },
    });

    // Then delete the account
    await prisma.cashierAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
