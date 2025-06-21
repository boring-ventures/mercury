import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { RequestStatus, QuotationStatus } from "@prisma/client";

// API route for updating quotation status (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quotationId } = await params;
    const body = await request.json();
    const { action, notes } = body; // action: "ACCEPTED" or "REJECTED"

    // Validate action
    if (!action || !["ACCEPTED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be ACCEPTED or REJECTED" },
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
      include: { company: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find quotation with request details
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        request: {
          include: {
            company: true,
            createdBy: true,
          },
        },
        createdBy: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Check authorization - only the importador from the request's company can respond
    if (
      profile.role !== "IMPORTADOR" ||
      profile.companyId !== quotation.request.companyId
    ) {
      return NextResponse.json(
        { error: "Not authorized to respond to this quotation" },
        { status: 403 }
      );
    }

    // Check if quotation is still valid
    if (quotation.status !== "SENT" && quotation.status !== "DRAFT") {
      return NextResponse.json(
        {
          error:
            "This quotation has already been responded to or is not active",
        },
        { status: 400 }
      );
    }

    // Check if quotation has expired
    if (new Date() > quotation.validUntil) {
      return NextResponse.json(
        { error: "This quotation has expired" },
        { status: 400 }
      );
    }

    // Update quotation with response
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: action,
        respondedAt: new Date(),
        rejectionReason: action === "REJECTED" ? notes : null,
      },
      include: {
        request: {
          include: {
            company: true,
            quotations: {
              where: { status: "REJECTED" },
              select: { id: true },
            },
          },
        },
      },
    });

    // Handle request status updates based on quotation response
    const requestUpdateData: {
      status?: RequestStatus;
      rejectionCount?: number;
      reviewNotes?: string;
    } = {};

    if (action === "ACCEPTED") {
      // Move request to approved status when quotation is accepted
      requestUpdateData.status = RequestStatus.APPROVED;
    } else if (action === "REJECTED") {
      // Increment rejection count
      const currentRejectionCount = updatedQuotation.request.quotations.length;
      const newRejectionCount = currentRejectionCount;

      requestUpdateData.rejectionCount = newRejectionCount;

      // If this is the 3rd rejection, cancel the request
      if (newRejectionCount >= 3) {
        requestUpdateData.status = RequestStatus.CANCELLED;
        requestUpdateData.reviewNotes = `Solicitud cancelada automáticamente después de 3 propuestas rechazadas. Última razón de rechazo: ${notes}`;
      } else {
        // Set back to PENDING to allow admin to create a new quotation
        requestUpdateData.status = RequestStatus.PENDING;
        requestUpdateData.reviewNotes = `Cotización ${newRejectionCount}/3 rechazada: ${notes}. Se puede enviar una nueva propuesta.`;
      }
    }

    // Update the request
    await prisma.request.update({
      where: { id: updatedQuotation.request.id },
      data: requestUpdateData,
    });

    // If accepted, update request status and potentially create contract
    if (action === "ACCEPTED") {
      // Create audit log for acceptance
      await prisma.auditLog.create({
        data: {
          action: "ACCEPT_QUOTATION",
          entity: "Quotation",
          entityId: quotationId,
          newValues: {
            status: action,
            notes: notes || null,
          },
          profileId: profile.id,
        },
      });

      // Notify admin about quotation acceptance
      try {
        // Get admin users to notify
        const adminUsers = await prisma.profile.findMany({
          where: {
            role: "SUPERADMIN",
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        });

        // Notify all admin users
        await Promise.all(
          adminUsers.map((admin) =>
            createSystemNotification("REQUEST_APPROVED", admin.id, {
              requestId: quotation.requestId,
              requestCode: quotation.request.code,
              quotationId: quotationId,
              quotationCode: quotation.code,
              companyName: quotation.request.company.name,
              amount: quotation.totalAmount,
            })
          )
        );
      } catch (notificationError) {
        console.error(
          "Error sending notification to admin:",
          notificationError
        );
        // Don't fail the quotation update if notification fails
      }
    } else {
      // If rejected, create audit log
      await prisma.auditLog.create({
        data: {
          action: "REJECT_QUOTATION",
          entity: "Quotation",
          entityId: quotationId,
          newValues: {
            status: action,
            notes: notes || null,
          },
          profileId: profile.id,
        },
      });

      // Notify admin about quotation rejection
      try {
        const adminUsers = await prisma.profile.findMany({
          where: {
            role: "SUPERADMIN",
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        });

        await Promise.all(
          adminUsers.map((admin) =>
            createSystemNotification("REQUEST_REJECTED", admin.id, {
              requestId: quotation.requestId,
              requestCode: quotation.request.code,
              quotationId: quotationId,
              quotationCode: quotation.code,
              companyName: quotation.request.company.name,
              reason: notes || "No reason provided",
            })
          )
        );
      } catch (notificationError) {
        console.error(
          "Error sending notification to admin:",
          notificationError
        );
      }
    }

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

// Helper function to get authenticated admin user
async function getAuthenticatedAdminUser() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Not authenticated", status: 401 };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { company: true },
  });

  if (!profile) {
    return { error: "Profile not found", status: 404 };
  }

  if (profile.role !== "SUPERADMIN") {
    return { error: "Not authorized. Admin access required.", status: 403 };
  }

  return { profile };
}

// API route for deleting quotations (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quotationId } = await params;

    // Get authenticated admin user
    const authResult = await getAuthenticatedAdminUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const { profile } = authResult;

    // Find quotation
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        request: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of DRAFT and SENT quotations
    if (!["DRAFT", "SENT"].includes(quotation.status)) {
      return NextResponse.json(
        { error: "Cannot delete quotations that have been responded to" },
        { status: 400 }
      );
    }

    // Delete the quotation
    await prisma.quotation.delete({
      where: { id: quotationId },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "DELETE_QUOTATION",
        entity: "Quotation",
        entityId: quotationId,
        oldValues: {
          code: quotation.code,
          status: quotation.status,
          totalAmount: quotation.totalAmount,
        },
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}

// API route for updating quotations (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quotationId } = await params;
    const body = await request.json();
    const {
      baseAmount,
      fees,
      taxes,
      totalAmount,
      validUntil,
      terms,
      notes,
      status,
    } = body;

    // Get authenticated admin user
    const authResult = await getAuthenticatedAdminUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const { profile } = authResult;

    // Find quotation
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        request: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Only allow editing of DRAFT and SENT quotations
    if (!["DRAFT", "SENT"].includes(quotation.status)) {
      return NextResponse.json(
        { error: "Cannot edit quotations that have been responded to" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!baseAmount || !validUntil || !status) {
      return NextResponse.json(
        { error: "Base amount, valid until date, and status are required" },
        { status: 400 }
      );
    }

    // Validate future date
    const selectedDate = new Date(validUntil + "T00:00:00");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return NextResponse.json(
        { error: "Valid until date must be at least tomorrow" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      baseAmount: number;
      fees: number;
      taxes: number;
      totalAmount: number;
      validUntil: Date;
      status: QuotationStatus;
      terms?: string;
      notes?: string;
      sentAt?: Date;
    } = {
      baseAmount: parseFloat(baseAmount),
      fees: parseFloat(fees) || 0,
      taxes: parseFloat(taxes) || 0,
      totalAmount: parseFloat(totalAmount),
      validUntil: new Date(validUntil + "T23:59:59"), // Set to end of day
      status: status as QuotationStatus,
    };

    // Only update terms and notes if provided
    if (terms !== undefined) updateData.terms = terms;
    if (notes !== undefined) updateData.notes = notes;

    // If status is changing from DRAFT to SENT, set sentAt
    if (quotation.status === "DRAFT" && status === "SENT") {
      updateData.sentAt = new Date();
    }

    // Update the quotation
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: updateData,
      include: {
        request: {
          include: {
            company: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_QUOTATION",
        entity: "Quotation",
        entityId: quotationId,
        oldValues: {
          baseAmount: quotation.baseAmount,
          totalAmount: quotation.totalAmount,
          status: quotation.status,
          validUntil: quotation.validUntil,
        },
        newValues: {
          baseAmount: updateData.baseAmount,
          totalAmount: updateData.totalAmount,
          status: updateData.status,
          validUntil: updateData.validUntil,
        },
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation,
      message: "Quotation updated successfully",
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}
