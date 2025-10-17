import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
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

    // Find the quotation
    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Check if quotation is in DRAFT status
    if (quotation.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only DRAFT quotations can be published" },
        { status: 400 }
      );
    }

    // Update quotation status to SENT
    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: {
        status: "SENT",
      },
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation,
      message: "Quotation published successfully",
    });
  } catch (error) {
    console.error("Error publishing quotation:", error);
    return NextResponse.json(
      { error: "Failed to publish quotation" },
      { status: 500 }
    );
  }
}
