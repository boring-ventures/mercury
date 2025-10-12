import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CashierTransactionStatus } from "@prisma/client";

// GET: Fetch a single cashier transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await prisma.cashierTransaction.findUnique({
      where: { id: params.id },
      include: {
        quotation: {
          select: {
            id: true,
            code: true,
            totalInBs: true,
            amount: true,
            currency: true,
            exchangeRate: true,
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
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching cashier transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier transaction" },
      { status: 500 }
    );
  }
}

// PATCH: Update a cashier transaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const transaction = await prisma.cashierTransaction.update({
      where: { id: params.id },
      data: updateData,
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
    console.error("Error updating cashier transaction:", error);
    return NextResponse.json(
      { error: "Failed to update cashier transaction" },
      { status: 500 }
    );
  }
}
