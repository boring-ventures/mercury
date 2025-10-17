import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { resend, FROM_EMAIL } from "@/lib/resend";

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

// POST: Create a new company with associated user
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

    // Check if email already exists
    const existingUser = await prisma.profile.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create Supabase client for admin operations
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    // Generate temporary password
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = uppercase + lowercase + numbers;

    let temporaryPassword = "";

    // Ensure at least one uppercase, one lowercase, and one number
    temporaryPassword += uppercase.charAt(
      Math.floor(Math.random() * uppercase.length)
    );
    temporaryPassword += lowercase.charAt(
      Math.floor(Math.random() * lowercase.length)
    );
    temporaryPassword += numbers.charAt(
      Math.floor(Math.random() * numbers.length)
    );

    // Fill the rest with random characters
    for (let i = 3; i < 12; i++) {
      temporaryPassword += allChars.charAt(
        Math.floor(Math.random() * allChars.length)
      );
    }

    // Shuffle the password to make it more random
    temporaryPassword = temporaryPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Create company first
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
    });

    // Create user in Supabase Auth
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          firstName: contactName.split(" ")[0],
          lastName: contactName.split(" ").slice(1).join(" "),
          companyName: name,
          role: "IMPORTADOR",
        },
      });

    if (authError) {
      console.error("Error creating Supabase user:", authError);
      // Rollback company creation
      await prisma.company.delete({ where: { id: company.id } });
      throw new Error(`Error creating user: ${authError.message}`);
    }

    if (!authUser.user) {
      // Rollback company creation
      await prisma.company.delete({ where: { id: company.id } });
      throw new Error("No se pudo crear el usuario en Supabase");
    }

    // Create profile in database
    const profile = await prisma.profile.create({
      data: {
        userId: authUser.user.id,
        firstName: contactName.split(" ")[0],
        lastName: contactName.split(" ").slice(1).join(" "),
        email,
        phone,
        role: "IMPORTADOR",
        status: "ACTIVE",
        companyId: company.id,
      },
    });

    // Send welcome email with credentials
    try {
      const emailHtml = generateWelcomeEmail({
        companyName: name,
        contactName,
        email,
        temporaryPassword,
        nit,
        country,
        city,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `¡Bienvenido a NORDEX Platform! - Credenciales de acceso`,
        html: emailHtml,
      });

      console.log(`Welcome email sent to ${email} for company ${name}`);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the company creation if email fails
    }

    return NextResponse.json(
      {
        company: {
          id: company.id,
          name: company.name,
          nit: company.nit,
          companyType: company.companyType,
          country: company.country,
          city: company.city,
          activity: company.activity,
          contactName: company.contactName,
          contactPosition: company.contactPosition,
          email: company.email,
          phone: company.phone,
          status: company.status,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
        },
        user: {
          id: profile.id,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
          status: profile.status,
        },
        message:
          "Empresa y usuario creados exitosamente. Se ha enviado un email con las credenciales.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create company",
      },
      { status: 500 }
    );
  }
}

// Helper function to generate welcome email with credentials
function generateWelcomeEmail(data: {
  companyName: string;
  contactName: string;
  email: string;
  temporaryPassword: string;
  nit: string;
  country: string;
  city: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a NORDEX Platform!</title>
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
        .hero-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .hero-title {
            color: #f59e0b;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .hero-subtitle {
            color: #4b5563;
            font-size: 16px;
            margin: 0 0 20px 0;
        }
        .status-badge {
            background-color: #f59e0b;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            font-size: 14px;
        }
        .credentials-section {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .credentials-title {
            color: #f59e0b;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }
        .credential-item {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .credential-label {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 8px 0;
            font-weight: 500;
        }
        .credential-value {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 0;
            background: #f9fafb;
            padding: 8px;
            border-radius: 4px;
        }
        .warning-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .warning-text {
            color: #dc2626;
            font-size: 14px;
            margin: 0;
        }
        .details-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .cta-button {
            background-color: #f59e0b;
            color: #ffffff;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin: 25px 0;
            font-size: 16px;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">NORDEX</h1>
            <p class="tagline">Plataforma especializada para gestión de envíos internacionales</p>
        </div>

        <div class="hero-section">
            <h2 class="hero-title">¡Bienvenido a NORDEX!</h2>
            <p class="hero-subtitle">
                Su empresa ha sido <strong>registrada exitosamente</strong> en nuestra plataforma.<br>
                Ya puede acceder con sus credenciales de acceso.
            </p>
            <div class="status-badge">
                ✅ Empresa Registrada
            </div>
        </div>

        <div class="details-section">
            <h3 style="color: #1f2937; margin: 0 0 20px 0;">📋 Información de la Empresa</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <p style="margin: 5px 0;"><strong>Empresa:</strong> ${data.companyName}</p>
                    <p style="margin: 5px 0;"><strong>NIT:</strong> ${data.nit}</p>
                </div>
                <div>
                    <p style="margin: 5px 0;"><strong>País:</strong> ${data.country}</p>
                    <p style="margin: 5px 0;"><strong>Ciudad:</strong> ${data.city}</p>
                </div>
            </div>
        </div>

        <div class="credentials-section">
            <h3 class="credentials-title">🔐 Sus Credenciales de Acceso</h3>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">
                Utilice estas credenciales para acceder a NORDEX Platform:
            </p>

            <div class="credential-item">
                <p class="credential-label">📧 Email de acceso:</p>
                <p class="credential-value">${data.email}</p>
            </div>

            <div class="credential-item">
                <p class="credential-label">🔑 Contraseña temporal:</p>
                <p class="credential-value">${data.temporaryPassword}</p>
            </div>

            <div class="warning-box">
                <p class="warning-text">
                    ⚠️ <strong>Importante:</strong> Esta es una contraseña temporal. Por su seguridad, le recomendamos encarecidamente cambiarla en su primer inicio de sesión.
                </p>
            </div>
        </div>

        <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sign-in" class="cta-button">
                🚀 Acceder a NORDEX Platform
            </a>
        </div>

        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h4 style="color: #0369a1; margin: 0 0 15px 0;">🎯 Próximos pasos:</h4>
            <ol style="color: #0c4a6e; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Inicie sesión con sus credenciales</li>
                <li>Cambie su contraseña temporal</li>
                <li>Complete su perfil de empresa</li>
                <li>Explore las funcionalidades de la plataforma</li>
                <li>Comience a gestionar sus envíos internacionales</li>
            </ol>
        </div>

        <div class="footer">
            <p class="footer-text">© 2025 NORDEX Platform. Todos los derechos reservados.</p>
            <p class="footer-text">
                Si tiene alguna pregunta, contáctenos en
                <a href="mailto:support@nordex.com" style="color: #f59e0b;">support@nordex.com</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
