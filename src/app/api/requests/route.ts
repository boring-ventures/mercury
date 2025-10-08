import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notifyAllAdmins } from "@/lib/notifications";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { capitalizeCountry } from "@/lib/utils";

// Helper function to generate request code with new format: [CompanyPrefix][Month][Year][SequentialNumber]
async function generateRequestCode(companyName: string): Promise<string> {
  // Generate company prefix: first two letters or first letter of each word
  const generateCompanyPrefix = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word: take first two letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of each word
      return words
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
    }
  };

  const companyPrefix = generateCompanyPrefix(companyName);

  // Get current month and year
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01-12
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits

  // Find the highest sequential number for this company in the current month/year
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const existingRequests = await prisma.request.findMany({
    where: {
      company: {
        name: companyName,
      },
      createdAt: {
        gte: currentMonthStart,
        lt: nextMonthStart,
      },
    },
    select: { code: true },
  });

  // Extract sequential numbers from existing codes and find the next one
  const pattern = new RegExp(`^${companyPrefix}${month}${year}(\\d{2})$`);
  const existingNumbers = existingRequests
    .map((r) => {
      const match = r.code.match(pattern);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => num > 0);

  const nextSequentialNumber =
    existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  return `${companyPrefix}${month}${year}${nextSequentialNumber.toString().padStart(2, "0")}`;
}

interface DocumentUpload {
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type?: string;
  documentInfo?: string; // Add document text information
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });

    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
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
        // If user doesn't have a company yet, return empty results instead of error
        return NextResponse.json({
          requests: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        });
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
        select: {
          id: true,
          code: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          rejectionCount: true,
          createdAt: true,
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
              email: true,
              phone: true,
              bankingDetails: true,
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
              code: true,
              status: true,
              amount: true,
              currency: true,
              validUntil: true,
              createdAt: true,
              notes: true,
              terms: true,
              rejectionReason: true,
              exchangeRate: true,
              managementServiceBs: true,
              managementServicePercentage: true,
              totalInBs: true,
              amountInBs: true,
              correspondentBankBs: true,
              correspondentBankUSD: true,
              swiftBankBs: true,
              swiftBankUSD: true,
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

    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
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
        {
          error: "Perfil incompleto",
          message:
            "Necesitas tener una empresa asociada a tu perfil para crear solicitudes. Contacta al administrador para completar tu configuración.",
        },
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
      providerBankName,
      providerAccountNumber,
      providerSwiftCode,
      providerBankAddress,
      providerBeneficiaryName,
      providerEmail,
      providerPhone,
      providerAdditionalInfo,
      documents,
    } = body;

    // No validation required - all fields are optional
    // Proceed with creating the request

    // Create or find provider - handle empty fields with defaults
    let provider = await prisma.provider.findFirst({
      where: {
        name: providerName || "Proveedor Sin Nombre",
        country: providerCountry || "Unknown",
        userId: profile.id,
      },
    });

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          name: providerName || "Proveedor Sin Nombre",
          country: providerCountry
            ? capitalizeCountry(providerCountry)
            : "Unknown",
          userId: profile.id,
          email: providerEmail || null,
          phone: providerPhone || null,
          additionalInfo: providerAdditionalInfo || null,
          bankingDetails: {
            bankName: providerBankName || null,
            accountNumber: providerAccountNumber || null,
            swiftCode: providerSwiftCode || null,
            bankAddress: providerBankAddress || null,
            beneficiaryName: providerBeneficiaryName || null,
          },
        },
      });
    } else {
      // Update existing provider with new information
      provider = await prisma.provider.update({
        where: { id: provider.id },
        data: {
          email: providerEmail || null,
          phone: providerPhone || null,
          additionalInfo: providerAdditionalInfo || null,
          bankingDetails: {
            bankName: providerBankName || null,
            accountNumber: providerAccountNumber || null,
            swiftCode: providerSwiftCode || null,
            bankAddress: providerBankAddress || null,
            beneficiaryName: providerBeneficiaryName || null,
          },
        },
      });
    }

    // Get company information for request code generation
    const company = await prisma.company.findUnique({
      where: { id: profile.companyId },
      select: { name: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Generate unique request code
    const code = await generateRequestCode(company.name);

    // Create the request - handle empty fields with defaults
    const newRequest = await prisma.request.create({
      data: {
        code,
        amount: amount ? parseFloat(amount) : 0,
        currency: currency || "USDT",
        description: description || "Sin descripción",
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
            type: (doc.type || "PROFORMA_INVOICE") as
              | "PROFORMA_INVOICE"
              | "FACTURA_COMERCIAL"
              | "OTHER",
            documentInfo: doc.documentInfo || null, // Include document text information
            requestId: newRequest.id,
            companyId: profile.companyId,
          },
        });
      });

      await Promise.all(documentPromises);
    }

    // Step 1: Notify all admins about the new solicitud (in-app notification)
    try {
      await notifyAllAdmins("REQUEST_CREATED", {
        requestId: newRequest.id,
        requestCode: newRequest.code,
        companyName: newRequest.company?.name,
        amount: newRequest.amount,
        currency: newRequest.currency,
        createdBy: `${profile.firstName} ${profile.lastName}`,
      });
    } catch (notificationError) {
      console.error("Error sending notification to admins:", notificationError);
      // Don't fail the request creation if notification fails
    }

    // Step 2: Send email notifications to all admins
    try {
      // Get all admin profiles with email addresses
      const adminProfiles = await prisma.profile.findMany({
        where: {
          role: "SUPERADMIN",
          status: "ACTIVE",
          email: { not: null },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (adminProfiles.length > 0) {
        // Generate admin notification email
        const adminEmailHtml = generateAdminRequestNotificationEmail({
          requestCode: newRequest.code,
          companyName: newRequest.company?.name || "N/A",
          amount: newRequest.amount.toString(),
          currency: newRequest.currency,
          description: newRequest.description,
          providerName: newRequest.provider?.name || "N/A",
          providerCountry: newRequest.provider?.country || "N/A",
          createdBy: `${profile.firstName} ${profile.lastName}`,
          documentsCount: documents?.length || 0,
          createdAt: newRequest.createdAt.toISOString(),
        });

        // Send email to all admins
        const emailPromises = adminProfiles.map((admin) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: admin.email!,
            subject: `🆕 Nueva Solicitud de Importación - ${newRequest.code}`,
            html: adminEmailHtml,
          })
        );

        await Promise.all(emailPromises);
        console.log(
          `Email notifications sent to ${adminProfiles.length} admins for request ${newRequest.code}`
        );
      }
    } catch (emailError) {
      console.error("Error sending email notifications to admins:", emailError);
      // Don't fail the request creation if email fails
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

// Helper function to generate admin notification email for new requests
function generateAdminRequestNotificationEmail(data: {
  requestCode: string;
  companyName: string;
  amount: string;
  currency: string;
  description: string;
  providerName: string;
  providerCountry: string;
  createdBy: string;
  documentsCount: number;
  createdAt: string;
}): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud de Importación - NORDEX Platform</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            color: #f59e0b;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .alert-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .alert-title {
            color: #dc2626;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .alert-subtitle {
            color: #4b5563;
            font-size: 16px;
            margin: 0 0 20px 0;
        }
        .priority-badge {
            background-color: #dc2626;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            font-size: 14px;
        }
        .details-section {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        .request-id-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 20px 0;
        }
        .request-id-label {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 5px 0;
        }
        .request-id-value {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 0;
        }
        .submitted-date {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .subsection-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-row {
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-size: 14px;
            padding: 10px 0;
            width: 40%;
            vertical-align: top;
        }
        .detail-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 0;
            vertical-align: top;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0;
            border: none;
        }
        .action-section {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .action-title {
            color: #0369a1;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }
        .action-text {
            color: #4b5563;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .cta-button {
            background-color: #0369a1;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.2s;
            text-align: center;
            min-width: 200px;
            box-shadow: 0 2px 4px rgba(3, 105, 161, 0.2);
        }
        .cta-button:hover {
            background-color: #075985;
            box-shadow: 0 4px 8px rgba(3, 105, 161, 0.3);
        }
        .footer {
            border-top: 1px solid #e5e7eb;
            padding: 25px 0;
            text-align: center;
            margin-top: 40px;
        }
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            margin: 5px 0;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .alert-section, .details-section, .action-section {
                padding: 20px;
            }
            .alert-title {
                font-size: 20px;
            }
            .detail-table {
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">NORDEX</h1>
            <p class="tagline">Plataforma especializada para gestión de envíos internacionales</p>
        </div>

        <!-- Alert Message -->
        <div class="alert-section">
            <h2 class="alert-title">🆕 Nueva Solicitud de Importación</h2>
            <p class="alert-subtitle">
                Se ha creado una nueva solicitud que requiere cotización y revisión administrativa.
            </p>
            <div class="priority-badge">
                Requiere Atención Inmediata
            </div>
        </div>

        <!-- Request Details -->
        <div class="details-section">
            <h3 class="section-title">Detalles de la Solicitud</h3>
            
            <div class="request-id-box">
                <p class="request-id-label">Código de Solicitud:</p>
                <p class="request-id-value">${data.requestCode}</p>
            </div>

            <p class="submitted-date">
                Creada el: ${formatDate(data.createdAt)}
            </p>

            <hr class="divider">

            <!-- Company Information -->
            <h4 class="subsection-title">🏢 Información de la Empresa</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Empresa:</td>
                    <td class="detail-value">${data.companyName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Creada por:</td>
                    <td class="detail-value">${data.createdBy}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Request Information -->
            <h4 class="subsection-title">📋 Información de la Solicitud</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Monto:</td>
                    <td class="detail-value">${data.amount} ${data.currency}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Descripción:</td>
                    <td class="detail-value">${data.description}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Provider Information -->
            <h4 class="subsection-title">🏭 Información del Proveedor</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Nombre del Proveedor:</td>
                    <td class="detail-value">${data.providerName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">País del Proveedor:</td>
                    <td class="detail-value">${data.providerCountry}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Documents Information -->
            <h4 class="subsection-title">📄 Documentos Adjuntos</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Total de Documentos:</td>
                    <td class="detail-value">${data.documentsCount} archivo(s)</td>
                </tr>
            </table>
        </div>

        <!-- Action Section -->
        <div class="action-section">
            <h3 class="action-title">Acción Requerida</h3>
            <p class="action-text">
                Por favor, revise esta solicitud en el panel de administración y genere la cotización correspondiente 
                basándose en la documentación proporcionada y la información de la solicitud.
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/requests" class="cta-button">
                Revisar Solicitud
            </a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <hr class="divider">
            <p class="footer-text">
                © 2025 NORDEX Platform. Todos los derechos reservados.
            </p>
            <p class="footer-text">
                Este es un email automático del sistema de notificaciones.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
