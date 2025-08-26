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
      return NextResponse.json({ activities: [] });
    }

    // Fetch notifications for the user's company (as a proxy for activity history)
    // In a real implementation, you might want to create a separate ActivityLog table
    const activities = await prisma.notification.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to last 100 activities
    });

    // Transform notifications into activity format
    const transformedActivities = activities.map((notification) => ({
      id: notification.id,
      type: notification.title.includes("Solicitud")
        ? "REQUEST_CREATED"
        : notification.title.includes("Cotización")
          ? "QUOTATION_RECEIVED"
          : notification.title.includes("Contrato")
            ? "CONTRACT_CREATED"
            : notification.title.includes("Pago")
              ? "PAYMENT_UPLOADED"
              : "GENERAL_ACTIVITY",
      title: notification.title,
      description: notification.message,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
      relatedDocument: null, // Could be enhanced to include document links
    }));

    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    console.error("Error fetching importer history:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Error al cargar historial",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
