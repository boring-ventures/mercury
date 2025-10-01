import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get the request ID and company ID from query params
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");
    const companyId = searchParams.get("companyId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Fetch company registration documents (only registration-related documents)
    const companyRegistrationDocuments = await prisma.document.findMany({
      where: {
        companyId: companyId,
        type: {
          in: [
            "CARNET_IDENTIDAD",
            "NIT",
            "MATRICULA_COMERCIO",
            "PODER_REPRESENTANTE",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Fetch request-specific documents (documents uploaded for this specific request)
    const requestDocuments = await prisma.document.findMany({
      where: {
        requestId: requestId,
        type: {
          notIn: [
            "CARNET_IDENTIDAD",
            "NIT",
            "MATRICULA_COMERCIO",
            "PODER_REPRESENTANTE",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        request: {
          select: {
            id: true,
            code: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      companyRegistrationDocuments,
      requestDocuments,
      totalDocuments:
        companyRegistrationDocuments.length + requestDocuments.length,
    });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
