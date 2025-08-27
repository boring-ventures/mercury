import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch a specific company by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({
      where: { id },
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
        bankingDetails: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        requests: {
          select: {
            id: true,
            code: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            users: true,
            requests: true,
            contracts: true,
            documents: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

// PUT: Update a company
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      status,
    } = body;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check if NIT is being changed and if it already exists
    if (nit && nit !== existingCompany.nit) {
      const companyWithSameNit = await prisma.company.findUnique({
        where: { nit },
      });

      if (companyWithSameNit) {
        return NextResponse.json(
          { error: "Company with this NIT already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
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
        bankingDetails,
        status,
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

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a company (soft delete by setting status to INACTIVE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check if company has active users
    const activeUsers = await prisma.profile.count({
      where: {
        companyId: id,
        status: "ACTIVE",
      },
    });

    if (activeUsers > 0) {
      return NextResponse.json(
        { error: "Cannot delete company with active users" },
        { status: 400 }
      );
    }

    // Soft delete by setting status to INACTIVE
    await prisma.company.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
