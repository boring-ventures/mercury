import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id: requestId, docId } = await params;
    const body = await request.json();
    const { status, reviewNotes } = body;

    // Validate status
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "EXPIRED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid document status" },
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

    // Get current document status for audit log
    const currentDocument = await prisma.document.findUnique({
      where: { id: docId },
      select: { status: true },
    });

    if (!currentDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Update document status
    const updatedDocument = await prisma.document.update({
      where: {
        id: docId,
        requestId: requestId,
      },
      data: {
        status,
        reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: `${profile.firstName} ${profile.lastName}`,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_DOCUMENT_STATUS",
        entity: "Document",
        entityId: docId,
        oldValues: { status: currentDocument.status },
        newValues: { status, reviewNotes },
        profileId: profile.id, // Use actual profile ID
      },
    });

    return NextResponse.json({ document: updatedDocument });
  } catch (error) {
    console.error("Error updating document status:", error);
    return NextResponse.json(
      { error: "Failed to update document status" },
      { status: 500 }
    );
  }
}
