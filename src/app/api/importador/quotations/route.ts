import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("Starting importer quotations API...");
    
    // Authenticate importer user
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth result:", { user: user?.id, authError });

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    console.log("Fetching profile for user:", user.id);
    
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    console.log("Profile found:", { 
      profileId: profile?.id, 
      role: profile?.role, 
      companyId: profile?.companyId 
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    if (profile.role !== "IMPORTADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (!profile.companyId) {
      console.log("No company ID found, returning empty array");
      // If no company, return empty array
      return NextResponse.json({ quotations: [] });
    }

    console.log("Fetching quotations for company:", profile.companyId);

    // Fetch quotations for the user's company
    const quotations = await prisma.quotation.findMany({
      where: {
        request: {
          companyId: profile.companyId,
        },
      },
      include: {
        request: {
          select: {
            id: true,
            code: true,
            amount: true,
            currency: true,
            description: true,
            status: true,
            createdAt: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Found quotations:", quotations.length);

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("Error fetching importer quotations:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Error al cargar cotizaciones",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
