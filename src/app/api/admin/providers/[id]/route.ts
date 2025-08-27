import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch a specific provider by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
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
            role: true,
            status: true,
            company: {
              select: {
                id: true,
                name: true,
                nit: true,
              },
            },
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
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider" },
      { status: 500 }
    );
  }
}

// PUT: Update a provider
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, country, bankingDetails, email, phone, userId } = body;

    // Check if provider exists
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        name,
        country,
        bankingDetails,
        email,
        phone,
        userId,
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

    return NextResponse.json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if provider exists
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Check if provider has active requests
    const activeRequests = await prisma.request.count({
      where: {
        providerId: id,
        status: {
          in: ["PENDING", "IN_REVIEW", "APPROVED"],
        },
      },
    });

    if (activeRequests > 0) {
      return NextResponse.json(
        { error: "Cannot delete provider with active requests" },
        { status: 400 }
      );
    }

    // Delete the provider
    await prisma.provider.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Provider deleted successfully" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
