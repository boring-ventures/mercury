import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

// PUT: Update contract content
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await request.json();
    const contractId = params.id;

    console.log("Contract content API - Contract ID:", contractId);
    console.log("Contract content API - Content length:", content?.length);

    if (!contractId) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Auth admin
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Contract content API - Session:", session?.user?.id);

    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Get user profile using Prisma (same as other admin routes)
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    console.log("Contract content API - Profile:", profile);

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: {
            hasProfile: !!profile,
            role: profile?.role,
            userId: session.user.id,
          },
        },
        { status: 403 }
      );
    }

    // Update contract content
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        content: content,
        updatedAt: new Date(),
      },
      include: {
        request: {
          include: {
            company: true,
            provider: true,
            createdBy: true,
          },
        },
        quotation: true,
      },
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
    });
  } catch (error) {
    console.error("Error updating contract content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Get contract content
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractId = params.id;

    // Auth admin
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get contract content
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        content: true,
        code: true,
        title: true,
        status: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        content: contract.content || "",
        code: contract.code,
        title: contract.title,
        status: contract.status,
      },
    });
  } catch (error) {
    console.error("Error getting contract content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
