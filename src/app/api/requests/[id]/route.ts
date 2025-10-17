import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    const { id: requestIdOrCode } = await params;

    // Build where clause based on user role
    // Check if the parameter is an ID (CUID format) or a code (human-readable format)
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause: Record<string, unknown> = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    if (profile.role === "IMPORTADOR") {
      // Importador can only see their company's requests
      if (!profile.companyId) {
        return NextResponse.json(
          { error: "No se encontró la empresa asociada" },
          { status: 400 }
        );
      }
      whereClause.companyId = profile.companyId;
    }

    const requestData = await prisma.request.findFirst({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            nit: true,
            city: true,
            contactName: true,
            contactPosition: true,
            email: true,
            phone: true,
            bankingDetails: true,
            documents: {
              select: {
                id: true,
                type: true,
                documentInfo: true,
              },
              where: {
                type: {
                  in: [
                    "CARNET_IDENTIDAD",
                    "NIT",
                    "MATRICULA_COMERCIO",
                    "PODER_REPRESENTANTE",
                  ],
                },
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            country: true,
            bankingDetails: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        documents: {
          select: {
            id: true,
            filename: true,
            fileUrl: true,
            type: true,
            status: true,
            createdAt: true,
            documentInfo: true, // Include document text information
          },
          where: {
            type: {
              notIn: [
                "CARNET_IDENTIDAD",
                "NIT",
                "MATRICULA_COMERCIO",
                "PODER_REPRESENTANTE",
              ],
            },
          },
        },
        quotations: {
          include: {
            documents: {
              select: {
                id: true,
                filename: true,
                fileUrl: true,
                type: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        contracts: {
          include: {
            documents: {
              select: {
                id: true,
                filename: true,
                fileUrl: true,
                type: true,
                status: true,
                createdAt: true,
              },
            },
            quotation: {
              select: {
                id: true,
                code: true,
                amount: true,
                totalInBs: true,
                createdAt: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                nit: true,
                city: true,
                contactName: true,
                contactPosition: true,
              },
            },
            payments: {
              select: {
                id: true,
                type: true,
                status: true,
                amount: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          include: {
            documents: {
              select: {
                id: true,
                filename: true,
                fileUrl: true,
                type: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: requestData });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    const { id: requestIdOrCode } = await params;
    const body = await request.json();
    const { status, reviewNotes, assignedToId } = body;

    // Check if the parameter is an ID (CUID format) or a code (human-readable format)
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause: Record<string, unknown> = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    if (profile.role === "IMPORTADOR") {
      // Importador can only update their company's requests (limited updates)
      if (!profile.companyId) {
        return NextResponse.json(
          { error: "No se encontró la empresa asociada" },
          { status: 400 }
        );
      }
      whereClause.companyId = profile.companyId;
    }

    const existingRequest = await prisma.request.findFirst({
      where: whereClause,
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    // Prepare update data based on user role
    const updateData: Record<string, unknown> = {};

    if (profile.role === "SUPERADMIN") {
      // Superadmin can update status, notes, and assignment
      if (status) updateData.status = status;
      if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
      if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
      if (status && ["APPROVED", "REJECTED", "IN_REVIEW"].includes(status)) {
        updateData.reviewedAt = new Date();
      }
    } else if (profile.role === "IMPORTADOR") {
      // Importador can only update limited fields for DRAFT requests
      if (existingRequest.status !== "DRAFT") {
        return NextResponse.json(
          { error: "Solo se pueden editar solicitudes en borrador" },
          { status: 403 }
        );
      }
      // Add specific fields that importadors can update
      const { amount, description } = body;
      if (amount !== undefined) updateData.amount = parseFloat(amount);
      if (description !== undefined) updateData.description = description;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date();

    const updatedRequest = await prisma.request.update({
      where: { id: existingRequest.id }, // Always use the actual ID for updates
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: "Solicitud actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    const { id: requestIdOrCode } = await params;

    // Check if the parameter is an ID (CUID format) or a code (human-readable format)
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause: Record<string, unknown> = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    if (profile.role === "IMPORTADOR") {
      // Importador can only delete their company's DRAFT requests
      if (!profile.companyId) {
        return NextResponse.json(
          { error: "No se encontró la empresa asociada" },
          { status: 400 }
        );
      }
      whereClause.companyId = profile.companyId;
      whereClause.status = "DRAFT";
    }

    const existingRequest = await prisma.request.findFirst({
      where: whereClause,
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada o no se puede eliminar" },
        { status: 404 }
      );
    }

    // Delete the request (this will cascade to related documents due to schema relations)
    await prisma.request.delete({
      where: { id: existingRequest.id }, // Always use the actual ID for deletes
    });

    return NextResponse.json({
      success: true,
      message: "Solicitud eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
