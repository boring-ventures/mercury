import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { notifyQuotationReceived } from "@/lib/notification-events";

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
      skipNotifications, // Flag to skip notifications in onboarding flow
    } = body;

    // Validate required fields
    if (!amount || !validUntil) {
      return NextResponse.json(
        { error: "Amount to send and valid until date are required" },
        { status: 400 }
      );
    }

    // Get current user from session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
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

    // Generate quotation code with new format: [CompanyPrefix][Month][Year][SequentialNumber]
    const generateQuotationCode = async (companyName: string) => {
      // Generate company prefix: first two letters or first letter of each word
      const generateCompanyPrefix = (name: string): string => {
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
          // Single word: take first two letters
          return words[0].substring(0, 2).toUpperCase();
        } else {
          // Multiple words: take first letter of each word
          return words
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase();
        }
      };

      const companyPrefix = generateCompanyPrefix(companyName);

      // Get current month and year
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01-12
      const year = now.getFullYear().toString().slice(-2); // Last 2 digits

      // Find the highest sequential number for this company in the current month/year
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const existingQuotations = await prisma.quotation.findMany({
        where: {
          companyId: requestData.companyId,
          createdAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
        select: { code: true },
      });

      // Extract sequential numbers from existing codes and find the next one
      const pattern = new RegExp(`^${companyPrefix}${month}${year}(\\d{2})$`);
      const existingNumbers = existingQuotations
        .map((q) => {
          const match = q.code.match(pattern);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => num > 0);

      const nextSequentialNumber =
        existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

      return `${companyPrefix}${month}${year}${nextSequentialNumber.toString().padStart(2, "0")}`;
    };

    const quotationCode = await generateQuotationCode(requestData.company.name);

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

    // Step 2: Notify the importador about the new quotation (in-app + email)
    // Skip notifications if skipNotifications flag is true (onboarding flow)
    if (!skipNotifications) {
      try {
        // Get the admin who created the quotation
        const adminProfile = await prisma.profile.findUnique({
          where: { id: profile.id },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        const createdBy = adminProfile
          ? `${adminProfile.firstName} ${adminProfile.lastName}`.trim()
          : "Administrador";

        await notifyQuotationReceived({
          quotationId: quotation.id,
          code: quotation.code,
          requestId: requestData.id,
          companyId: requestData.companyId,
          amount: Number(quotation.amount),
          currency: quotation.currency,
          totalInBs: Number(quotation.totalInBs),
          exchangeRate: Number(quotation.exchangeRate),
          validUntil: quotation.validUntil.toISOString(),
          createdBy: createdBy,
          createdAt: quotation.createdAt.toISOString(),
          companyName: requestData.company?.name,
          requestCode: requestData.code,
          status: quotation.status,
        });
      } catch (notificationError) {
        console.error(
          "Error sending notification to importador:",
          notificationError
        );
        // Don't fail the quotation creation if notification fails
      }
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

// PUT: Accept or Reject quotation (for importador)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const body = await request.json();
    const { quotationId, action, notes } = body;

    if (!quotationId || !action) {
      return NextResponse.json(
        { error: "Quotation ID and action are required" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be ACCEPTED or REJECTED" },
        { status: 400 }
      );
    }

    // Get current user from session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
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
        role: true,
        companyId: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find the request
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        company: true,
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check authorization: only importador from the same company or admin can accept/reject
    if (
      profile.role === "IMPORTADOR" &&
      profile.companyId !== requestData.companyId
    ) {
      return NextResponse.json(
        { error: "Not authorized to manage this quotation" },
        { status: 403 }
      );
    }

    // Find the quotation
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Check if quotation belongs to this request
    if (quotation.requestId !== requestId) {
      return NextResponse.json(
        { error: "Quotation does not belong to this request" },
        { status: 400 }
      );
    }

    // Check if quotation is in SENT status
    if (quotation.status !== "SENT") {
      return NextResponse.json(
        { error: "Only SENT quotations can be accepted or rejected" },
        { status: 400 }
      );
    }

    // Update quotation status
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: action,
        rejectionReason: action === "REJECTED" ? notes : null,
      },
    });

    // If accepted, update request status to APPROVED
    if (action === "ACCEPTED") {
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: action === "ACCEPTED" ? "ACCEPT_QUOTATION" : "REJECT_QUOTATION",
        entity: "Quotation",
        entityId: quotationId,
        newValues: {
          status: action,
          notes: notes || null,
        },
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation,
      message: `Quotation ${action.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}
