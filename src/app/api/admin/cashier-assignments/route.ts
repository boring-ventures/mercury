import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// GET: Fetch all cashier assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get("cashierId");
    const accountId = searchParams.get("accountId");

    const where: any = {};
    if (cashierId) where.cashierId = cashierId;
    if (accountId) where.accountId = accountId;

    const assignments = await prisma.cashierAssignment.findMany({
      where,
      include: {
        cashier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            dailyLimitBs: true,
            active: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching cashier assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier assignments" },
      { status: 500 }
    );
  }
}

// POST: Create a new cashier assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cashierId, accountId } = body;

    // Validate required fields
    if (!cashierId || !accountId) {
      return NextResponse.json(
        { error: "Cashier ID and Account ID are required" },
        { status: 400 }
      );
    }

    // Verify cashier exists and has CAJERO role
    const cashier = await prisma.profile.findUnique({
      where: { id: cashierId },
      select: { role: true },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Cashier not found" },
        { status: 404 }
      );
    }

    if (cashier.role !== UserRole.CAJERO) {
      return NextResponse.json(
        { error: "User is not a cashier" },
        { status: 400 }
      );
    }

    // Verify account exists
    const account = await prisma.cashierAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Cashier account not found" },
        { status: 404 }
      );
    }

    // Create assignment (unique constraint will prevent duplicates)
    const assignment = await prisma.cashierAssignment.create({
      data: {
        cashierId,
        accountId,
      },
      include: {
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
            active: true,
          },
        },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating cashier assignment:", error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "This cashier is already assigned to this account" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create cashier assignment" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a cashier assignment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    await prisma.cashierAssignment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Assignment removed successfully" });
  } catch (error) {
    console.error("Error deleting cashier assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete cashier assignment" },
      { status: 500 }
    );
  }
}
