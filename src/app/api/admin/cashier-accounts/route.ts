import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all cashier accounts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (active !== null && active !== undefined && active !== "all") {
      where.active = active === "true";
    }

    // Get total count
    const total = await prisma.cashierAccount.count({ where });

    // Get cashier accounts with pagination
    const accounts = await prisma.cashierAccount.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      accounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cashier accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier accounts" },
      { status: 500 }
    );
  }
}

// POST: Create a new cashier account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dailyLimitBs, active } = body;

    // Validate required fields
    if (!name || !dailyLimitBs) {
      return NextResponse.json(
        { error: "Name and daily limit are required" },
        { status: 400 }
      );
    }

    const account = await prisma.cashierAccount.create({
      data: {
        name,
        dailyLimitBs: parseFloat(dailyLimitBs),
        active: active !== undefined ? active : true,
      },
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

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating cashier account:", error);
    return NextResponse.json(
      { error: "Failed to create cashier account" },
      { status: 500 }
    );
  }
}
