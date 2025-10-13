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

// DELETE: Delete a company
// Query param ?hard=true for permanent deletion with cascade
// Otherwise does soft delete by setting status to INACTIVE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const hardDelete = searchParams.get("hard") === "true";

  try {
    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            requests: true,
            contracts: true,
            quotations: true,
            payments: true,
            documents: true,
          },
        },
      },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (hardDelete) {
      // Hard delete with full cascade
      // Delete in order to respect foreign key constraints

      // 1. Delete cashier transactions related to quotations
      await prisma.cashierTransaction.deleteMany({
        where: {
          quotation: {
            companyId: id,
          },
        },
      });

      // 2. Delete documents
      await prisma.document.deleteMany({
        where: { companyId: id },
      });

      // 3. Delete payments
      await prisma.payment.deleteMany({
        where: { companyId: id },
      });

      // 4. Delete contracts
      await prisma.contract.deleteMany({
        where: { companyId: id },
      });

      // 5. Delete quotations
      await prisma.quotation.deleteMany({
        where: { companyId: id },
      });

      // 6. Delete requests
      await prisma.request.deleteMany({
        where: { companyId: id },
      });

      // 7. Delete registration request if exists
      await prisma.registrationRequest.deleteMany({
        where: { companyId: id },
      });

      // 8. Update users to remove company reference (instead of deleting users)
      await prisma.profile.updateMany({
        where: { companyId: id },
        data: {
          companyId: null,
          status: "INACTIVE",
        },
      });

      // 9. Finally delete the company
      await prisma.company.delete({
        where: { id },
      });

      return NextResponse.json({
        message: "Company and all related data deleted permanently",
        deletedCounts: existingCompany._count,
      });
    } else {
      // Soft delete by setting status to INACTIVE
      // Check if company has active users
      const activeUsers = await prisma.profile.count({
        where: {
          companyId: id,
          status: "ACTIVE",
        },
      });

      if (activeUsers > 0) {
        return NextResponse.json(
          { error: "Cannot delete company with active users. Use hard delete to force deletion." },
          { status: 400 }
        );
      }

      await prisma.company.update({
        where: { id },
        data: { status: "INACTIVE" },
      });

      return NextResponse.json({ message: "Company deactivated successfully" });
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
