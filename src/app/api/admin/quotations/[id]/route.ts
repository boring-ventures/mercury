import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

function toNumber(value: any): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  if (typeof value === "object" && "toNumber" in value) {
    try {
      // Prisma Decimal
      // @ts-ignore
      return value.toNumber();
    } catch {
      // @ts-ignore
      const asString = value.toString?.();
      return asString ? parseFloat(asString) : 0;
    }
  }
  return Number(value) || 0;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            company: true,
          },
        },
        createdBy: true,
        company: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const serialized = {
      id: quotation.id,
      code: quotation.code,
      status: quotation.status,
      amount: toNumber(quotation.amount),
      currency: quotation.currency,
      exchangeRate: toNumber(quotation.exchangeRate),
      amountInBs: toNumber(quotation.amountInBs),
      swiftBankUSD: toNumber(quotation.swiftBankUSD),
      correspondentBankUSD: toNumber(quotation.correspondentBankUSD),
      swiftBankBs: toNumber(quotation.swiftBankBs),
      correspondentBankBs: toNumber(quotation.correspondentBankBs),
      managementServiceBs: toNumber(quotation.managementServiceBs),
      managementServicePercentage: toNumber(
        quotation.managementServicePercentage
      ),
      totalInBs: toNumber(quotation.totalInBs),
      validUntil: quotation.validUntil.toISOString(),
      terms: quotation.terms || null,
      notes: quotation.notes || null,
      rejectionReason: quotation.rejectionReason || null,
      createdAt: quotation.createdAt.toISOString(),
      request: {
        id: quotation.request.id,
        code: quotation.request.code,
        description: quotation.request.description,
        amount: toNumber(quotation.request.amount),
        currency: quotation.request.currency,
        company: {
          name: quotation.request.company.name,
          country: quotation.request.company.country,
          email: quotation.request.company.email,
          phone: quotation.request.company.phone,
        },
      },
      createdBy: {
        firstName: quotation.createdBy.firstName || "",
        lastName: quotation.createdBy.lastName || "",
        email: quotation.createdBy.email || "",
      },
      company: {
        name: quotation.company.name,
        country: quotation.company.country,
      },
    };

    return NextResponse.json({ quotation: serialized });
  } catch (error) {
    console.error("Error fetching quotation detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotation detail" },
      { status: 500 }
    );
  }
}
