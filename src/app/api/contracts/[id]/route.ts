import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;

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

    // Find contract with relations
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: true,
        quotation: {
          include: {
            request: {
              include: {
                company: true,
                createdBy: true,
              },
            },
          },
        },
        request: {
          include: {
            company: true,
            provider: true,
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

    // Verify contract belongs to user's company (for importers) or user is admin
    if (
      profile.role === "IMPORTADOR" &&
      contract.companyId !== profile.companyId
    ) {
      return NextResponse.json(
        { error: "Contract does not belong to your company" },
        { status: 403 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
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

    // Update contract with additional data
    const updateData: any = {};

    // If admin is completing the contract
    if (body.status === "COMPLETED" && body.adminCompleted) {
      updateData.status = "COMPLETED";
      updateData.adminCompletedAt = new Date();
    } else {
      // If importer is submitting the form
      updateData.additionalData = {
        companyData: body.companyData || {},
        contactData: body.contactData || {},
        providerData: body.providerData || {},
      };
      updateData.status = "ACTIVE"; // Mark as active when importer submits form
      updateData.signedAt = new Date(); // Mark as signed
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
