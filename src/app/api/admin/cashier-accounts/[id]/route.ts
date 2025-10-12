import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch a single cashier account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.cashierAccount.findUnique({
      where: { id: params.id },
      include: {
        cashierAssignments: {
          include: {
            cashier: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        cashierTransactions: {
          include: {
            cashier: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            quotation: {
              select: {
                id: true,
                code: true,
                totalInBs: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            cashierAssignments: true,
            cashierTransactions: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Cashier account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching cashier account:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier account" },
      { status: 500 }
    );
  }
}

// PATCH: Update a cashier account
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, dailyLimitBs, active } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (dailyLimitBs !== undefined) updateData.dailyLimitBs = parseFloat(dailyLimitBs);
    if (active !== undefined) updateData.active = active;

    const account = await prisma.cashierAccount.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        dailyLimitBs: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            cashierAssignments: true,
            cashierTransactions: true,
          },
        },
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error updating cashier account:", error);
    return NextResponse.json(
      { error: "Failed to update cashier account" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a cashier account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if there are any assignments or transactions
    const account = await prisma.cashierAccount.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            cashierAssignments: true,
            cashierTransactions: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Cashier account not found" },
        { status: 404 }
      );
    }

    if (account._count.cashierTransactions > 0) {
      return NextResponse.json(
        { error: "Cannot delete account with existing transactions. Deactivate it instead." },
        { status: 400 }
      );
    }

    // Delete assignments first
    if (account._count.cashierAssignments > 0) {
      await prisma.cashierAssignment.deleteMany({
        where: { accountId: params.id },
      });
    }

    // Delete the account
    await prisma.cashierAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting cashier account:", error);
    return NextResponse.json(
      { error: "Failed to delete cashier account" },
      { status: 500 }
    );
  }
}
