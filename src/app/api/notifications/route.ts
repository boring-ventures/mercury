import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  createNotification,
  createBulkNotifications,
} from "@/lib/notifications";
import { NotificationType } from "@/types/notifications";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const read = searchParams.get("read");
    const type = searchParams.get("type");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      profileId: profile.id,
    };

    if (read !== null) {
      where.read = read === "true";
    }

    if (
      type &&
      Object.values(NotificationType).includes(type as NotificationType)
    ) {
      where.type = type;
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          profile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        profileId: profile.id,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Only admins can create notifications
    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, metadata, profileId, profileIds } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    let result;

    if (profileIds && Array.isArray(profileIds)) {
      // Create bulk notifications
      result = await createBulkNotifications({
        title,
        message,
        type: type || NotificationType.INFO,
        metadata,
        profileIds,
      });
    } else if (profileId) {
      // Create single notification
      result = await createNotification({
        title,
        message,
        type: type || NotificationType.INFO,
        metadata,
        profileId,
      });
    } else {
      return NextResponse.json(
        { error: "Either profileId or profileIds is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Notification(s) created successfully",
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
