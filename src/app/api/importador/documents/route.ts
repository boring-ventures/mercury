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
      return NextResponse.json({ documents: [] });
    }

    // Fetch documents for the user's company
    const documents = await prisma.document.findMany({
      where: {
        companyId: profile.companyId,
      },
      include: {
        contract: {
          select: {
            id: true,
            code: true,
            status: true,
          },
        },
        payment: {
          select: {
            id: true,
            code: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching importer documents:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Error al cargar documentos",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
