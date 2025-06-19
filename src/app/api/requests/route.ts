import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentType } from "@prisma/client";

// Helper function to generate request code
function generateRequestCode(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `SH-${timestamp}${random}`;
}

interface DocumentUpload {
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type?: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
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

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Filters
    const status = searchParams.get("status");
    const country = searchParams.get("country");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause based on filters and user role
    const whereClause: Record<string, unknown> = {};

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
    // Superadmin can see all requests (no additional filter)

    // Apply additional filters
    if (status && status !== "todos") {
      whereClause.status = status.toUpperCase();
    }

    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (country && country !== "todos") {
      whereClause.provider = {
        country: { contains: country, mode: "insensitive" },
      };
    }

    if (dateFrom || dateTo) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.lte = new Date(dateTo + "T23:59:59.999Z");
      }
      whereClause.createdAt = dateFilter;
    }

    // Get requests with pagination
    const [requests, totalCount] = await Promise.all([
      prisma.request.findMany({
        where: whereClause,
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
          quotations: {
            select: {
              id: true,
              status: true,
            },
          },
          contracts: {
            select: {
              id: true,
              status: true,
            },
          },
          payments: {
            select: {
              id: true,
              status: true,
              type: true,
            },
          },
          _count: {
            select: {
              documents: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.request.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
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

    if (!profile || profile.role !== "IMPORTADOR") {
      return NextResponse.json(
        { error: "Solo los importadores pueden crear solicitudes" },
        { status: 403 }
      );
    }

    if (!profile.companyId) {
      return NextResponse.json(
        { error: "No se encontró la empresa asociada" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      amount,
      currency,
      description,
      providerName,
      providerCountry,
      providerBankingDetails,
      documents,
    } = body;

    // Validate required fields
    if (
      !amount ||
      !description ||
      !providerName ||
      !providerCountry ||
      !providerBankingDetails
    ) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // Create or find provider
    let provider = await prisma.provider.findFirst({
      where: {
        name: providerName,
        country: providerCountry,
      },
    });

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          name: providerName,
          country: providerCountry,
          bankingDetails: providerBankingDetails,
        },
      });
    }

    // Generate unique request code
    let code = generateRequestCode();
    let existingRequest = await prisma.request.findUnique({
      where: { code },
    });

    // Ensure code is unique
    while (existingRequest) {
      code = generateRequestCode();
      existingRequest = await prisma.request.findUnique({
        where: { code },
      });
    }

    // Create the request
    const newRequest = await prisma.request.create({
      data: {
        code,
        amount: parseFloat(amount),
        currency: currency || "USDT",
        description,
        status: "PENDING",
        providerId: provider.id,
        companyId: profile.companyId,
        createdById: profile.id,
      },
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
      },
    });

    // If documents were uploaded, create document records
    if (documents && Array.isArray(documents)) {
      const documentPromises = documents.map((doc: DocumentUpload) => {
        return prisma.document.create({
          data: {
            filename: doc.filename,
            fileUrl: doc.fileUrl,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: (doc.type || "PROFORMA_INVOICE") as DocumentType,
            requestId: newRequest.id,
            companyId: profile.companyId,
          },
        });
      });

      await Promise.all(documentPromises);
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: "Solicitud creada exitosamente",
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
