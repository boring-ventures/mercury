import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from "@/lib/notifications";

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

    const body = await request.json();
    const { notificationIds, markAll } = body;

    let result;

    if (markAll) {
      // Mark all notifications as read
      result = await markAllNotificationsAsRead(profile.id);
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      result = await markNotificationsAsRead(notificationIds, profile.id);
    } else {
      return NextResponse.json(
        { error: "Either notificationIds or markAll is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Notifications marked as read successfully",
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
