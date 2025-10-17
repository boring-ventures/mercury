import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Only superadmins can update contract dates
    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo superadministradores pueden actualizar fechas de contratos." },
        { status: 403 }
      );
    }

    const { id: contractId } = await params;
    const body = await request.json();
    const { startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Fechas de inicio y fin son requeridas" },
        { status: 400 }
      );
    }

    // Update contract dates
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json({
      message: "Fechas del contrato actualizadas exitosamente",
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error("Error updating contract dates:", error);
    return NextResponse.json(
      { error: "Error al actualizar las fechas del contrato", details: error.message },
      { status: 500 }
    );
  }
}
