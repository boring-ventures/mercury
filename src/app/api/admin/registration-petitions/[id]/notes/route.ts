import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { note } = await request.json();

    // Validate input
    if (!note || typeof note !== "string" || note.trim().length === 0) {
      return NextResponse.json(
        { error: "La nota es requerida" },
        { status: 400 }
      );
    }

    // Check authentication - await cookies()
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get user profile to check role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!profile || profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    // Find the registration petition
    const petition = await prisma.registrationRequest.findUnique({
      where: { id },
      select: { id: true, companyName: true, status: true },
    });

    if (!petition) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    // Update the petition with the new note
    // Add new notes at the beginning (most recent first)
    // Use precise timestamp with milliseconds to avoid conflicts
    const currentTime = new Date();
    // Add a small buffer (1 second) to ensure this note timestamp is distinct from any approval timestamp
    currentTime.setTime(currentTime.getTime() + 1000);

    const authorName =
      `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
      "Administrador";
    const noteWithMetadata = `[${currentTime.toISOString()} - ${authorName}] ${note.trim()}`;

    const existingPetition = await prisma.registrationRequest.findUnique({
      where: { id },
      select: { reviewNotes: true },
    });

    // Add new note at the beginning, separated by double newlines
    const updatedNotes = existingPetition?.reviewNotes
      ? `${noteWithMetadata}\n\n${existingPetition.reviewNotes}`
      : noteWithMetadata;

    const updatedPetition = await prisma.registrationRequest.update({
      where: { id },
      data: {
        reviewNotes: updatedNotes,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ADD_NOTE",
        entity: "RegistrationRequest",
        entityId: id,
        newValues: {
          note: note.trim(),
          addedAt: currentTime.toISOString(),
          addedBy: authorName,
        },
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Nota agregada correctamente",
      petition: updatedPetition,
    });
  } catch (error) {
    console.error("Error adding note to petition:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
