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
            company: {
              include: {
                documents: true,
              },
            },
            provider: true,
          },
        },
        quotation: true,
        createdBy: true,
        company: {
          include: {
            documents: true,
          },
        },
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
      additionalData: contract.additionalData,
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
              nit: contract.request.company.nit,
              city: contract.request.company.city,
              address: `${contract.request.company.city || "Ciudad"}, ${contract.request.company.country || "País"}`,
              contactName: contract.request.company.contactName,
              contactPosition: contract.request.company.contactPosition,
              documents: contract.request.company.documents,
            },
            provider: contract.request.provider
              ? {
                  name: contract.request.provider.name,
                  country: contract.request.provider.country,
                  email: contract.request.provider.email,
                  phone: contract.request.provider.phone,
                  bankingDetails: contract.request.provider.bankingDetails,
                }
              : null,
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
        nit: contract.company.nit,
        city: contract.company.city,
        address: `${contract.company.city || "Ciudad"}, ${contract.company.country || "País"}`,
        contactName: contract.company.contactName,
        contactPosition: contract.company.contactPosition,
        email: contract.company.email,
        phone: contract.company.phone,
        documents: contract.company.documents,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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

    // Allow both admin and importador to update contracts
    if (profile.role !== "SUPERADMIN" && profile.role !== "IMPORTADOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Determine update type based on request body
    const isDateUpdate = body.startDate && body.endDate;
    const isFormDataUpdate =
      body.companyData || body.contactData || body.providerData;

    let updateData: any = {};

    if (isDateUpdate) {
      // Admin date update - only update dates
      updateData = {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      };
    } else if (isFormDataUpdate) {
      // Importador form submission - update additional data and mark as active
      updateData = {
        additionalData: {
          companyData: body.companyData || {},
          contactData: body.contactData || {},
          providerData: body.providerData || {},
        },
        status: "ACTIVE", // Mark as active when completed
        signedAt: new Date(), // Mark as signed
      };
    } else {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
    });
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}
