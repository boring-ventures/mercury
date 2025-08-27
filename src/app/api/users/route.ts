import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import type { UserRole, UserStatus, Prisma } from "@prisma/client";
import type { UserListResponse } from "@/types/users";

// GET: Fetch all users with filtering, pagination, and search
export async function GET(req: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as UserRole | null;
    const status = searchParams.get("status") as UserStatus | null;
    const companyId = searchParams.get("companyId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build the where clause for filtering
    const whereClause: Prisma.ProfileWhereInput = {};

    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    if (companyId) whereClause.companyId = companyId;

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        {
          company: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { nit: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Get total count for pagination
    const total = await prisma.profile.count({ where: whereClause });

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Fetch users with company details and counts
    const users = await prisma.profile.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const response: UserListResponse = {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { firstName, lastName, email, phone, role, companyId, password } =
      body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const adminClient = createRouteHandlerClient({ cookies });
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Failed to create user in auth system" },
        { status: 400 }
      );
    }

    // Create profile in database
    const profile = await prisma.profile.create({
      data: {
        userId: authData.user.id,
        firstName,
        lastName,
        phone,
        role,
        companyId: companyId || null,
        status: "ACTIVE",
        active: true,
      },
      include: {
        company: true,
        _count: {
          select: {
            createdRequests: true,
            assignedRequests: true,
            notifications: true,
          },
        },
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
