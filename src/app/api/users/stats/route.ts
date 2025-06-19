import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import type { UserStats } from "@/types/users";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// GET: Fetch user statistics for dashboard
export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if user is super admin
    const currentUser = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch statistics in parallel for better performance
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      importadorUsers,
      superAdminUsers,
      usersWithoutCompany,
    ] = await Promise.all([
      // Total users
      prisma.profile.count(),

      // Active users
      prisma.profile.count({
        where: {
          active: true,
          status: "ACTIVE",
        },
      }),

      // Inactive users
      prisma.profile.count({
        where: {
          OR: [{ active: false }, { status: "INACTIVE" }],
        },
      }),

      // Suspended users
      prisma.profile.count({
        where: { status: "SUSPENDED" },
      }),

      // Importador users
      prisma.profile.count({
        where: { role: "IMPORTADOR" },
      }),

      // SuperAdmin users
      prisma.profile.count({
        where: { role: "SUPERADMIN" },
      }),

      // Users without company
      prisma.profile.count({
        where: { companyId: null },
      }),
    ]);

    const stats: UserStats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      importadorUsers,
      superAdminUsers,
      usersWithoutCompany,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
