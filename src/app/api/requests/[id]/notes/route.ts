import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

// API route for managing internal notes on requests
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;

    // For now, we'll store notes as notifications with a special type
    // In a real app, you might want a separate Notes table
    const notes = await prisma.notification.findMany({
      where: {
        metadata: {
          path: ["requestId"],
          equals: requestId,
        },
        type: "INFO", // We'll use INFO type for internal notes
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedNotes = notes.map((note) => ({
      id: note.id,
      content: note.message,
      author: note.profile
        ? `${note.profile.firstName || ""} ${note.profile.lastName || ""}`.trim() ||
          "Usuario"
        : "Sistema",
      createdAt: note.createdAt,
    }));

    return NextResponse.json({ notes: formattedNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

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
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Create notification as internal note
    const note = await prisma.notification.create({
      data: {
        title: "Internal Note",
        message: content.trim(),
        type: "INFO",
        metadata: {
          requestId,
          isInternalNote: true,
        },
        profileId: profile.id, // Use actual profile ID
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ADD_INTERNAL_NOTE",
        entity: "Request",
        entityId: requestId,
        newValues: { note: content },
        profileId: profile.id, // Use actual profile ID
      },
    });

    const formattedNote = {
      id: note.id,
      content: note.message,
      author: note.profile
        ? `${note.profile.firstName || ""} ${note.profile.lastName || ""}`.trim() ||
          "Usuario"
        : "Sistema",
      createdAt: note.createdAt,
    };

    return NextResponse.json({ note: formattedNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
