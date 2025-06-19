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
    const supabase = createServerComponentClient({
      cookies,
    });

    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
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
    const where: {
      profileId: string;
      read?: boolean;
      type?: NotificationType;
    } = {
      profileId: profile.id,
    };

    if (read !== null) {
      where.read = read === "true";
    }

    if (
      type &&
      Object.values(NotificationType).includes(type as NotificationType)
    ) {
      where.type = type as NotificationType;
    }

    // Get notifications with pagination
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
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
    const supabase = createServerComponentClient({
      cookies,
    });

    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, message, type, profileIds, metadata } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    let result;

    if (profileIds && Array.isArray(profileIds)) {
      // Create notifications for multiple users
      result = await createBulkNotifications({
        title,
        message,
        type: type || NotificationType.INFO,
        profileIds,
        metadata,
      });
    } else {
      // Create notification for current user
      result = await createNotification({
        title,
        message,
        type: type || NotificationType.INFO,
        profileId: profile.id,
        metadata,
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
