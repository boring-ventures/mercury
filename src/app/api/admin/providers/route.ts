import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { capitalizeCountry } from "@/lib/utils";

// GET: Fetch all providers with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const country = searchParams.get("country");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (country) {
      where.country = country;
    }

    // Get total count
    const total = await prisma.provider.count({ where });

    // Get providers with pagination
    const providers = await prisma.provider.findMany({
      where,
      select: {
        id: true,
        name: true,
        country: true,
        bankingDetails: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            requests: true,
          },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      providers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

// POST: Create a new provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, bankingDetails, email, phone, userId } = body;

    // Validate required fields
    if (!name || !country) {
      return NextResponse.json(
        { error: "Name and country are required" },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        name,
        country: capitalizeCountry(country),
        bankingDetails: bankingDetails || null,
        email: email || null,
        phone: phone || null,
        userId: userId || null,
      },
      select: {
        id: true,
        name: true,
        country: true,
        bankingDetails: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
