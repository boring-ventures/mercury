import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import type { UpdateUserRequest } from "@/types/users";

interface Params {
  id: string;
}

// GET: Fetch a specific user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Check authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is super admin
    const currentUser = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const user = await prisma.profile.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            companyType: true,
            country: true,
            city: true,
            activity: true,
            contactName: true,
            contactPosition: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            createdRequests: true,
            assignedRequests: true,
            notifications: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Check authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is super admin
    const currentUser = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body: UpdateUserRequest = await req.json();
    const { firstName, lastName, phone, role, status, companyId, active } =
      body;

    // Check if user exists
    const existingUser = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile
    const updatedUser = await prisma.profile.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(status && { status }),
        ...(companyId !== undefined && { companyId: companyId || null }),
        ...(active !== undefined && { active }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            companyType: true,
            country: true,
            city: true,
            activity: true,
            contactName: true,
            contactPosition: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            createdRequests: true,
            assignedRequests: true,
            notifications: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user (soft delete by setting active to false)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Check authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is super admin
    const currentUser = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    // Check if user exists
    const existingUser = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting self
    if (existingUser.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Soft delete by setting active to false and status to SUSPENDED
    await prisma.profile.update({
      where: { id },
      data: {
        active: false,
        status: "SUSPENDED",
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
