import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import crypto from "crypto";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check authentication
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get user profile to check role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!profile || profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a esta información" },
        { status: 403 }
      );
    }

    // Find the registration request
    const petition = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            type: true,
            status: true,
            fileUrl: true,
          },
        },
      },
    });

    if (!petition) {
      return NextResponse.json(
        { error: "Solicitud de registro no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      petition,
    });
  } catch (error) {
    console.error("Error fetching registration petition:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, reviewNotes, rejectionReason } = body;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Acción no válida. Debe ser 'approve' o 'reject'" },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get user profile to check role and get admin info
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        role: true,
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!adminProfile || adminProfile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    // Find the registration request
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            filename: true,
            type: true,
            fileUrl: true,
          },
        },
      },
    });

    if (!registrationRequest) {
      return NextResponse.json(
        { error: "Solicitud de registro no encontrada" },
        { status: 404 }
      );
    }

    if (registrationRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Esta solicitud ya ha sido procesada" },
        { status: 400 }
      );
    }

    // Validate rejection reason if rejecting
    if (action === "reject" && (!rejectionReason || !rejectionReason.trim())) {
      return NextResponse.json(
        { error: "La razón del rechazo es obligatoria" },
        { status: 400 }
      );
    }

    let updatedRequest;
    let emailSubject: string;
    let emailContent: string;
    const adminName =
      `${adminProfile.firstName || ""} ${adminProfile.lastName || ""}`.trim() ||
      "Administrador";
    const reviewDate = new Date();

    if (action === "approve") {
      // Generate a temporary password for the new user
      const temporaryPassword = crypto.randomBytes(12).toString("hex");

      try {
        // Create user in Supabase Auth
        const { data: authUser, error: authError } =
          await supabase.auth.admin.createUser({
            email: registrationRequest.email,
            password: temporaryPassword,
            email_confirm: true,
            user_metadata: {
              firstName: registrationRequest.contactName.split(" ")[0],
              lastName: registrationRequest.contactName
                .split(" ")
                .slice(1)
                .join(" "),
              companyName: registrationRequest.companyName,
              role: "IMPORTADOR",
            },
          });

        if (authError) {
          console.error("Error creating Supabase user:", authError);
          throw new Error(`Error creando usuario: ${authError.message}`);
        }

        if (!authUser.user) {
          throw new Error("No se pudo crear el usuario en Supabase");
        }

        console.log("Supabase user created successfully:", authUser.user.id);

        // Create Profile record with company association
        const profile = await prisma.profile.create({
          data: {
            userId: authUser.user.id,
            firstName: registrationRequest.contactName.split(" ")[0],
            lastName:
              registrationRequest.contactName.split(" ").slice(1).join(" ") ||
              "",
            role: "IMPORTADOR",
            status: "ACTIVE",
            phone: registrationRequest.phone,
            // We'll set the companyId after creating the company
          },
        });

        console.log("Profile created successfully:", profile.id);

        // Create Company record with all information from registration request
        const company = await prisma.company.create({
          data: {
            name: registrationRequest.companyName,
            ruc: registrationRequest.ruc,
            country: registrationRequest.country,
            activity: registrationRequest.activity as any,
            contactName: registrationRequest.contactName,
            contactPosition: registrationRequest.contactPosition,
            email: registrationRequest.email,
            phone: registrationRequest.phone,
            bankingDetails: registrationRequest.bankingDetails, // Transfer banking details
            status: "ACTIVE",
          },
        });

        console.log("Company created successfully:", company.id);

        // Update the profile to link it to the company
        await prisma.profile.update({
          where: { id: profile.id },
          data: { companyId: company.id },
        });

        console.log("Profile linked to company successfully");

        // Transfer documents from registration request to company
        if (
          registrationRequest.documents &&
          registrationRequest.documents.length > 0
        ) {
          await prisma.document.updateMany({
            where: {
              registrationRequestId: registrationRequest.id,
            },
            data: {
              companyId: company.id,
              status: "APPROVED", // Mark documents as approved when company is created
            },
          });

          console.log("Documents transferred to company successfully");
        }

        // Update the registration request with approval details
        // Do NOT add approval notes to reviewNotes (timeline) - they're only for the email
        updatedRequest = await prisma.registrationRequest.update({
          where: { id },
          data: {
            status: "APPROVED",
            reviewedAt: reviewDate,
            reviewedBy: adminProfile.id,
            // reviewNotes stays unchanged - approval notes don't go to timeline
            generatedPassword: temporaryPassword,
            companyId: company.id,
          },
        });

        console.log("Registration request updated successfully");

        emailSubject = "¡Solicitud Aprobada! - Bienvenido a Mercury Platform";
        emailContent = generateApprovalEmail(
          updatedRequest,
          temporaryPassword,
          adminName,
          reviewDate,
          reviewNotes?.trim()
        );
      } catch (creationError) {
        console.error("Error in user creation process:", creationError);
        return NextResponse.json(
          {
            error: "Error creando la cuenta del usuario",
            details:
              process.env.NODE_ENV === "development"
                ? (creationError as Error).message
                : undefined,
          },
          { status: 500 }
        );
      }
    } else {
      // Reject the request
      // Do NOT add rejection notes to reviewNotes (timeline) - they're only for the email
      updatedRequest = await prisma.registrationRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          reviewedAt: reviewDate,
          reviewedBy: adminProfile.id,
          // reviewNotes stays unchanged - rejection notes don't go to timeline
          rejectionReason: rejectionReason.trim(),
        },
      });

      emailSubject =
        "Actualización sobre su Solicitud de Registro - Mercury Platform";
      emailContent = generateRejectionEmail(
        updatedRequest,
        adminName,
        reviewDate,
        reviewNotes?.trim()
      );
    }

    // Send notification email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: registrationRequest.email,
        subject: emailSubject,
        html: emailContent,
      });

      console.log(
        `${action === "approve" ? "Approval" : "Rejection"} email sent to ${registrationRequest.email} for request ${id}`
      );
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Log error but don't fail the operation
    }

    return NextResponse.json({
      success: true,
      message: `Solicitud ${action === "approve" ? "aprobada" : "rechazada"} correctamente`,
      registrationRequest: {
        id: updatedRequest.id,
        status: updatedRequest.status,
        reviewedAt: updatedRequest.reviewedAt,
        reviewedBy: updatedRequest.reviewedBy,
        reviewNotes: updatedRequest.reviewNotes,
        rejectionReason: updatedRequest.rejectionReason,
      },
    });
  } catch (error) {
    console.error("Error processing registration petition:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

function generateApprovalEmail(
  request: any,
  temporaryPassword: string,
  adminName: string,
  reviewDate: Date,
  reviewNotes?: string
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a Mercury Platform!</title>
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
            font-size: 32px;
            font-weight: bold;
            margin: 0;
        }
        .hero-section {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            border-radius: 12px;
            padding: 40px 30px;
            text-align: center;
            margin: 30px 0;
        }
        .hero-title {
            color: #1f2937;
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .hero-subtitle {
            color: #4b5563;
            font-size: 18px;
            margin: 0 0 25px 0;
        }
        .status-badge {
            background-color: #dcfce7;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            font-size: 16px;
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
        .review-info {
            background-color: #e0f2fe;
            border: 1px solid #b3e5fc;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
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
            <h1 class="logo">MERCURY</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 5px 0 0 0;">
                Plataforma especializada para gestión de envíos internacionales
            </p>
        </div>

        <div class="hero-section">
            <h2 class="hero-title">¡Bienvenido a Mercury!</h2>
            <p class="hero-subtitle">
                Su solicitud de registro ha sido <strong>aprobada exitosamente</strong>.<br>
                Ya puede acceder a la plataforma con sus credenciales.
            </p>
            <div class="status-badge">
                ✅ Solicitud Aprobada
            </div>
        </div>

        <div class="details-section">
            <h3 style="color: #1f2937; margin: 0 0 20px 0;">📋 Detalles de la Aprobación</h3>
            
            <div class="review-info">
                <p style="margin: 0 0 10px 0;"><strong>Revisado por:</strong> ${adminName}</p>
                <p style="margin: 0;"><strong>Fecha de aprobación:</strong> ${reviewDate.toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
            </div>

            ${
              reviewNotes
                ? `
            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #1f2937; margin: 0 0 10px 0;">💬 Notas del revisor:</h4>
                <p style="color: #6b7280; font-size: 14px; margin: 0; white-space: pre-wrap;">${reviewNotes}</p>
            </div>
            `
                : ""
            }

            <div style="grid: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div>
                    <p style="margin: 5px 0;"><strong>Empresa:</strong> ${request.companyName}</p>
                    <p style="margin: 5px 0;"><strong>RUC:</strong> ${request.ruc}</p>
                </div>
                <div>
                    <p style="margin: 5px 0;"><strong>País:</strong> ${request.country}</p>
                    <p style="margin: 5px 0;"><strong>Contacto:</strong> ${request.contactName}</p>
                </div>
            </div>
        </div>

        <div class="credentials-section">
            <h3 class="credentials-title">🔐 Sus Credenciales de Acceso</h3>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">
                Utilice estas credenciales para acceder a Mercury Platform:
            </p>
            
            <div class="credential-item">
                <p class="credential-label">📧 Email de acceso:</p>
                <p class="credential-value">${request.email}</p>
            </div>
            
            <div class="credential-item">
                <p class="credential-label">🔑 Contraseña temporal:</p>
                <p class="credential-value">${temporaryPassword}</p>
            </div>

            <div class="warning-box">
                <p class="warning-text">
                    ⚠️ <strong>Importante:</strong> Esta es una contraseña temporal. Por su seguridad, le recomendamos encarecidamente cambiarla en su primer inicio de sesión.
                </p>
            </div>
        </div>

        <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/sign-in" class="cta-button">
                🚀 Acceder a Mercury Platform
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
            <p class="footer-text">© 2024 Mercury Platform. Todos los derechos reservados.</p>
            <p class="footer-text">
                Si tiene alguna pregunta, contáctenos en 
                <a href="mailto:support@mercury.com" style="color: #f59e0b;">support@mercury.com</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

function generateRejectionEmail(
  request: any,
  adminName: string,
  reviewDate: Date,
  reviewNotes?: string
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Solicitud - Mercury Platform</title>
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
        .content-section {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .section-title {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        .rejection-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .rejection-title {
            color: #dc2626;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }
        .rejection-text {
            color: #7f1d1d;
            font-size: 15px;
            margin: 0;
            white-space: pre-wrap;
            background-color: #ffffff;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #f3f4f6;
        }
        .review-info {
            background-color: #e0f2fe;
            border: 1px solid #b3e5fc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .next-steps {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
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
            <h1 class="logo">MERCURY</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                Plataforma especializada para gestión de envíos internacionales
            </p>
        </div>

        <div class="content-section">
            <h2 class="section-title">📋 Actualización sobre su Solicitud de Registro</h2>
            <p style="color: #6b7280; margin: 0 0 25px 0; font-size: 16px;">
                Estimado/a <strong>${request.contactName}</strong>,
            </p>
            <p style="color: #6b7280; margin: 0 0 25px 0;">
                Gracias por su interés en formar parte de Mercury Platform. 
                Hemos revisado cuidadosamente su solicitud de registro para <strong>${request.companyName}</strong>.
            </p>

            <div class="review-info">
                <h4 style="color: #0369a1; margin: 0 0 15px 0;">ℹ️ Información de la revisión:</h4>
                <p style="margin: 5px 0;"><strong>Revisado por:</strong> ${adminName}</p>
                <p style="margin: 5px 0;"><strong>Fecha de revisión:</strong> ${reviewDate.toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
                <p style="margin: 5px 0;"><strong>ID de solicitud:</strong> ${request.id}</p>
            </div>

            <div class="rejection-box">
                <h3 class="rejection-title">❌ Solicitud No Aprobada</h3>
                <p style="color: #7f1d1d; font-size: 14px; margin: 0 0 15px 0;">
                    Lamentablemente, no hemos podido aprobar su solicitud en esta ocasión por la siguiente razón:
                </p>
                <div class="rejection-text">${request.rejectionReason}</div>
              </div>

              ${
                reviewNotes
                  ? `
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h4 style="color: #1f2937; margin: 0 0 15px 0;">💬 Comentarios adicionales del revisor:</h4>
                  <p style="color: #6b7280; font-size: 14px; margin: 0; white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 6px;">${reviewNotes}</p>
              </div>
              `
                  : ""
              }

              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1f2937; margin: 0 0 15px 0;">📊 Detalles de la solicitud revisada:</h4>
                <div class="details-grid">
                    <div>
                        <p style="margin: 5px 0;"><strong>Empresa:</strong> ${request.companyName}</p>
                        <p style="margin: 5px 0;"><strong>RUC:</strong> ${request.ruc}</p>
                        <p style="margin: 5px 0;"><strong>País:</strong> ${request.country}</p>
                    </div>
                    <div>
                        <p style="margin: 5px 0;"><strong>Contacto:</strong> ${request.contactName}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${request.email}</p>
                        <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${request.phone}</p>
                    </div>
                </div>
            </div>

            <div class="next-steps">
                <h4 style="color: #0369a1; margin: 0 0 15px 0;">🚀 ¿Qué puede hacer ahora?</h4>
                <ol style="color: #0c4a6e; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li><strong>Revise los motivos de rechazo</strong> mencionados arriba</li>
                    <li><strong>Corrija los puntos señalados</strong> y prepare la documentación actualizada</li>
                    <li><strong>Actualice la información</strong> que sea necesaria según las observaciones</li>
                    <li><strong>Envíe una nueva solicitud</strong> cuando haya corregido los puntos observados</li>
                    <li><strong>Contáctenos</strong> si necesita clarificaciones sobre algún punto específico</li>
                </ol>
            </div>

            <p style="color: #6b7280; margin: 25px 0 0 0;">
                Valoramos su interés en Mercury Platform y esperamos poder trabajar con usted en el futuro una vez que se resuelvan los puntos observados.
            </p>
        </div>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: start; gap: 10px;">
                <span style="color: #16a34a; font-size: 20px;">💡</span>
                <div>
                    <p style="color: #16a34a; font-weight: 600; margin: 0 0 8px 0;">¿Necesita ayuda?</p>
                    <p style="color: #15803d; font-size: 14px; margin: 0;">
                        Si tiene preguntas sobre los motivos de rechazo o necesita orientación para corregir su solicitud, 
                        puede contactarnos en 
                        <a href="mailto:soporte@mercury.com" style="color: #f59e0b; font-weight: 600;">soporte@mercury.com</a>
                        <br>
                        <strong>Por favor incluya su ID de solicitud: ${request.id}</strong>
                    </p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p class="footer-text">© 2024 Mercury Platform. Todos los derechos reservados.</p>
            <p class="footer-text">
                Soporte técnico: 
                <a href="mailto:soporte@mercury.com" style="color: #f59e0b;">soporte@mercury.com</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
