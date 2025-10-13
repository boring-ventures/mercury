import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

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

    // Build date filter
    const dateFilter: any = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) {
        dateFilter.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.createdAt.lte = new Date(dateTo);
      }
    }

    // Get contracts that are completed or provider paid (approved)
    const approvedContracts = await prisma.contract.findMany({
      where: {
        ...dateFilter,
        status: {
          in: ["COMPLETED", "PROVIDER_PAID", "PAYMENT_COMPLETED"],
        },
      },
      include: {
        quotation: true,
      },
    });

    // Calculate total approved amounts in USD and BS
    let totalApprovedUSD = new Prisma.Decimal(0);
    let totalApprovedBS = new Prisma.Decimal(0);
    let totalCommissionsBS = new Prisma.Decimal(0);

    approvedContracts.forEach((contract) => {
      // Sum USD amounts
      if (contract.currency === "USD") {
        totalApprovedUSD = totalApprovedUSD.add(contract.amount);

        // Convert to BS if exchange rate is available
        if (contract.quotation?.exchangeRate) {
          const amountInBS = contract.amount.mul(
            contract.quotation.exchangeRate
          );
          totalApprovedBS = totalApprovedBS.add(amountInBS);
        }
      } else if (contract.currency === "BOB") {
        totalApprovedBS = totalApprovedBS.add(contract.amount);
      }

      // Add commission from quotation if available
      if (contract.quotation?.managementServiceBs) {
        totalCommissionsBS = totalCommissionsBS.add(
          contract.quotation.managementServiceBs
        );
      }
    });

    // Get number of approved requests
    const approvedRequestsCount = await prisma.request.count({
      where: {
        ...dateFilter,
        status: "COMPLETED",
      },
    });

    // Get pending requests
    const pendingRequests = await prisma.request.findMany({
      where: {
        ...dateFilter,
        status: {
          in: ["PENDING", "IN_REVIEW"],
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Get client statistics
    const clientStats = await prisma.company.findMany({
      where: {
        requests: {
          some: dateFilter,
        },
      },
      select: {
        id: true,
        name: true,
        requests: {
          where: dateFilter,
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
          },
        },
      },
    });

    // Process client stats
    const processedClientStats = clientStats.map((client) => {
      const requestCount = client.requests.length;
      const totalAmount = client.requests.reduce((sum, req) => {
        return sum + parseFloat(req.amount.toString());
      }, 0);

      const approvedAmount = client.requests
        .filter((req) => req.status === "COMPLETED")
        .reduce((sum, req) => {
          return sum + parseFloat(req.amount.toString());
        }, 0);

      return {
        id: client.id,
        name: client.name,
        requestCount,
        totalAmount,
        approvedAmount,
      };
    });

    return NextResponse.json({
      totalApprovedUSD: parseFloat(totalApprovedUSD.toString()),
      totalApprovedBS: parseFloat(totalApprovedBS.toString()),
      totalCommissionsBS: parseFloat(totalCommissionsBS.toString()),
      approvedRequestsCount,
      pendingRequests: pendingRequests.map((req) => ({
        id: req.id,
        code: req.code,
        companyName: req.company?.name || "N/A",
        amount: parseFloat(req.amount.toString()),
        currency: req.currency,
        status: req.status,
        createdAt: req.createdAt,
      })),
      clientStats: processedClientStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
