import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Authenticate importer user
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
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
      // If no company, return empty array
      return NextResponse.json({ contracts: [] });
    }

    // Fetch contracts for the user's company
    const contracts = await prisma.contract.findMany({
      where: {
        companyId: profile.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        quotation: {
          select: {
            id: true,
            code: true,
            amount: true,
            currency: true,
          },
        },
        request: {
          select: {
            id: true,
            code: true,
            description: true,
            amount: true,
            currency: true,
          },
        },
        documents: {
          select: {
            id: true,
            filename: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
            type: true,
            status: true,
            documentInfo: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error("Error fetching importer contracts:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Error al cargar contratos",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
