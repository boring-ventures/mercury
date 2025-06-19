import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        ruc: true,
        country: true,
        activity: true,
        status: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
