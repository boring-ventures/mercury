import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";

// API route for creating quotations for a request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestIdOrCode } = await params;
    const body = await request.json();

    const {
      amount,
      currency,
      exchangeRate,
      amountInBs,
      swiftBankUSD,
      correspondentBankUSD,
      swiftBankBs,
      correspondentBankBs,
      managementServiceBs,
      managementServicePercentage,
      totalInBs,
      validUntil,
      terms,
      notes,
      status,
    } = body;

    // Validate required fields
    if (!amount || !validUntil) {
      return NextResponse.json(
        { error: "Amount to send and valid until date are required" },
        { status: 400 }
      );
    }

    // Get current user from session
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
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find request by ID or code
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    const requestData = await prisma.request.findUnique({
      where: whereClause,
      include: {
        company: true,
        createdBy: true,
        quotations: {
          where: { status: "ACCEPTED" },
          select: { id: true },
        },
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check if there's already an accepted quotation
    if (requestData.quotations.length > 0) {
      return NextResponse.json(
        {
          error:
            "No se pueden crear nuevas cotizaciones cuando ya hay una cotización aceptada para esta solicitud",
        },
        { status: 400 }
      );
    }

    // Generate quotation code
    const generateQuotationCode = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `COT-${timestamp}-${random}`;
    };

    let quotationCode = generateQuotationCode();

    // Ensure code is unique
    let existingQuotation = await prisma.quotation.findUnique({
      where: { code: quotationCode },
    });

    while (existingQuotation) {
      quotationCode = generateQuotationCode();
      existingQuotation = await prisma.quotation.findUnique({
        where: { code: quotationCode },
      });
    }

    // Create the quotation
    const quotation = await prisma.quotation.create({
      data: {
        code: quotationCode,
        amount: parseFloat(amount),
        currency: currency || "USD",
        description: `Cotización para solicitud ${requestData.code}`,
        validUntil: new Date(validUntil),
        status: status || "SENT",
        exchangeRate: parseFloat(exchangeRate) || 0,
        amountInBs: parseFloat(amountInBs) || 0,
        swiftBankUSD: parseFloat(swiftBankUSD) || 0,
        correspondentBankUSD: parseFloat(correspondentBankUSD) || 0,
        swiftBankBs: parseFloat(swiftBankBs) || 0,
        correspondentBankBs: parseFloat(correspondentBankBs) || 0,
        managementServiceBs: parseFloat(managementServiceBs) || 0,
        managementServicePercentage:
          parseFloat(managementServicePercentage) || 0,
        totalInBs: parseFloat(totalInBs) || 0,
        terms: terms || null,
        notes: notes || null,
        requestId: requestData.id,
        companyId: requestData.companyId,
        createdById: profile.id,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE_QUOTATION",
        entity: "Request",
        entityId: requestData.id,
        newValues: {
          quotationId: quotation.id,
          quotationCode: quotation.code,
          totalInBs: quotation.totalInBs,
        },
        profileId: profile.id, // Use actual profile ID
      },
    });

    // Update request status to reflect quotation creation and advance workflow
    await prisma.request.update({
      where: { id: requestData.id },
      data: {
        status: "IN_REVIEW", // This moves the workflow from step 1 to step 2
        reviewedAt: new Date(),
      },
    });

    // Step 2: Notify the importador about the new quotation
    try {
      if (requestData.createdBy) {
        await createSystemNotification(
          "QUOTATION_RECEIVED",
          requestData.createdBy.id,
          {
            requestId: requestData.id,
            requestCode: requestData.code,
            quotationId: quotation.id,
            quotationCode: quotation.code,
            totalInBs: quotation.totalInBs,
            currency: quotation.currency,
            validUntil: quotation.validUntil.toISOString(),
          }
        );
      }
    } catch (notificationError) {
      console.error(
        "Error sending notification to importador:",
        notificationError
      );
      // Don't fail the quotation creation if notification fails
    }

    return NextResponse.json({
      success: true,
      quotation,
      message: "Quotation created successfully",
    });
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestIdOrCode } = await params;

    // Find request by ID or code
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    const quotations = await prisma.quotation.findMany({
      where: {
        request: whereClause,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
