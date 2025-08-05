import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

// GET: Fetch all contracts with filtering and pagination (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const currency = searchParams.get("currency");
    const search = searchParams.get("search");

    // Get authenticated admin user
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is admin
    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build where clause
    const whereClause: any = {};

    if (status && status !== "todos") {
      whereClause.status = status;
    }

    if (currency && currency !== "todos") {
      whereClause.currency = currency;
    }

    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { request: { code: { contains: search, mode: "insensitive" } } },
        { quotation: { code: { contains: search, mode: "insensitive" } } },
        { company: { name: { contains: search, mode: "insensitive" } } },
        { createdBy: { firstName: { contains: search, mode: "insensitive" } } },
        { createdBy: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get contracts with pagination
    const [contracts, totalCount] = await Promise.all([
      prisma.contract.findMany({
        where: whereClause,
        select: {
          id: true,
          code: true,
          title: true,
          status: true,
          amount: true,
          currency: true,
          startDate: true,
          endDate: true,
          signedAt: true,
          createdAt: true,
          request: {
            select: {
              id: true,
              code: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
          quotation: {
            select: {
              id: true,
              code: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contract.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      contracts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}
