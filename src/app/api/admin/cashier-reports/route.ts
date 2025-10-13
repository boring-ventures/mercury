import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CashierTransactionStatus } from "@prisma/client";

// GET: Fetch cashier reports with CSV export option
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format"); // 'json' or 'csv'
    const cashierId = searchParams.get("cashierId");
    const accountId = searchParams.get("accountId");
    const status = searchParams.get("status");
    const quotationCode = searchParams.get("quotationCode");
    const companyName = searchParams.get("companyName");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (cashierId) where.cashierId = cashierId;
    if (accountId) where.accountId = accountId;
    if (status) where.status = status as CashierTransactionStatus;

    // Filter by quotation code
    if (quotationCode) {
      where.quotation = {
        code: {
          contains: quotationCode,
          mode: "insensitive",
        },
      };
    }

    // Filter by company name
    if (companyName) {
      where.quotation = {
        ...where.quotation,
        company: {
          name: {
            contains: companyName,
            mode: "insensitive",
          },
        },
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get transactions with all details
    const transactions = await prisma.cashierTransaction.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip: format === "csv" ? undefined : skip,
      take: format === "csv" ? undefined : limit,
    });

    // Calculate summary statistics
    const summary = {
      totalTransactions: transactions.length,
      totalAssignedBs: transactions.reduce(
        (sum, t) => sum + Number(t.assignedAmountBs),
        0
      ),
      totalExpectedUsdt: transactions.reduce(
        (sum, t) => sum + Number(t.expectedUsdt),
        0
      ),
      totalDeliveredUsdt: transactions.reduce(
        (sum, t) => sum + (t.deliveredUsdt ? Number(t.deliveredUsdt) : 0),
        0
      ),
      completedCount: transactions.filter(
        (t) => t.status === CashierTransactionStatus.COMPLETED
      ).length,
      pendingCount: transactions.filter(
        (t) => t.status === CashierTransactionStatus.PENDING
      ).length,
      inProgressCount: transactions.filter(
        (t) => t.status === CashierTransactionStatus.IN_PROGRESS
      ).length,
      surplusShortage: 0, // Will be calculated below
    };

    // Calculate surplus/shortage
    summary.surplusShortage =
      summary.totalDeliveredUsdt - summary.totalExpectedUsdt;

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = [
        "ID Transacción",
        "Fecha Asignación",
        "Fecha Completado",
        "Código Cotización",
        "Código Solicitud",
        "Empresa",
        "Cajero",
        "Cuenta",
        "Monto Asignado (Bs)",
        "Tipo de Cambio",
        "USDT Esperado",
        "USDT Entregado",
        "Diferencia USDT",
        "Estado",
        "Notas",
      ];

      const csvRows = transactions.map((t) => {
        const difference = t.deliveredUsdt
          ? (Number(t.deliveredUsdt) - Number(t.expectedUsdt)).toFixed(6)
          : "N/A";

        return [
          t.id,
          new Date(t.assignedAt).toLocaleString("es-BO"),
          t.completedAt
            ? new Date(t.completedAt).toLocaleString("es-BO")
            : "N/A",
          t.quotation.code,
          t.quotation.request.code,
          t.quotation.company.name,
          `${t.cashier.firstName} ${t.cashier.lastName}`,
          t.account.name,
          Number(t.assignedAmountBs).toFixed(2),
          Number(t.suggestedExchangeRate).toFixed(4),
          Number(t.expectedUsdt).toFixed(6),
          t.deliveredUsdt ? Number(t.deliveredUsdt).toFixed(6) : "N/A",
          difference,
          t.status,
          t.notes || "",
        ];
      });

      const csv = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="cashier-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Return JSON
    const total = await prisma.cashierTransaction.count({ where });

    return NextResponse.json({
      transactions,
      summary,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cashier reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier reports" },
      { status: 500 }
    );
  }
}
