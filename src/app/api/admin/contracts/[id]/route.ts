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
      // @ts-ignore Prisma Decimal
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

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            company: true,
          },
        },
        quotation: true,
        createdBy: true,
        company: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const serialized = {
      id: contract.id,
      code: contract.code,
      title: contract.title,
      description: contract.description,
      status: contract.status,
      amount: toNumber(contract.amount),
      currency: contract.currency,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      signedAt: contract.signedAt ? contract.signedAt.toISOString() : null,
      terms: contract.terms,
      conditions: contract.conditions || null,
      createdAt: contract.createdAt.toISOString(),
      request: contract.request
        ? {
            id: contract.request.id,
            code: contract.request.code,
            description: contract.request.description,
            amount: toNumber(contract.request.amount),
            currency: contract.request.currency,
            company: {
              name: contract.request.company.name,
              country: contract.request.company.country,
              email: contract.request.company.email,
              phone: contract.request.company.phone,
            },
          }
        : null,
      quotation: contract.quotation
        ? {
            id: contract.quotation.id,
            code: contract.quotation.code,
            amount: toNumber(contract.quotation.amount),
            currency: contract.quotation.currency,
          }
        : null,
      createdBy: {
        firstName: contract.createdBy.firstName || "",
        lastName: contract.createdBy.lastName || "",
        email: contract.createdBy.email || "",
      },
      company: {
        name: contract.company.name,
        country: contract.company.country,
      },
    };

    return NextResponse.json({ contract: serialized });
  } catch (error) {
    console.error("Error fetching contract detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract detail" },
      { status: 500 }
    );
  }
}
