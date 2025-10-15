import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ companies: [] });
    }

    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Error searching companies:", error);
    return NextResponse.json(
      { error: "Error al buscar empresas" },
      { status: 500 }
    );
  }
}
