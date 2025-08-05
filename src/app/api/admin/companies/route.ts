import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all companies with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const companyType = searchParams.get("companyType");
    const activity = searchParams.get("activity");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nit: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (companyType) {
      where.companyType = companyType;
    }

    if (activity) {
      where.activity = activity;
    }

    // Get total count
    const total = await prisma.company.count({ where });

    // Get companies with pagination
    const companies = await prisma.company.findMany({
      where,
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
        _count: {
          select: {
            users: true,
            requests: true,
            contracts: true,
          },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// POST: Create a new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nit,
      companyType,
      country,
      city,
      activity,
      contactName,
      contactPosition,
      email,
      phone,
      bankingDetails,
    } = body;

    // Validate required fields
    if (
      !name ||
      !nit ||
      !companyType ||
      !country ||
      !city ||
      !activity ||
      !contactName ||
      !contactPosition ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if NIT already exists
    const existingCompany = await prisma.company.findUnique({
      where: { nit },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company with this NIT already exists" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        nit,
        companyType,
        country,
        city,
        activity,
        contactName,
        contactPosition,
        email,
        phone,
        bankingDetails: bankingDetails || null,
      },
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
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
