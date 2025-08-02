import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ActivityType } from "@prisma/client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import {
  generateRegistrationConfirmationEmail,
  generateAdminNotificationEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      nit,
      companyType,
      country,
      city,
      activity,
      contactName,
      contactPosition,
      email,
      phone,
      documents,
    } = body;

    // Validate required fields
    if (
      !companyName ||
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
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // Validate activity type
    if (!Object.values(ActivityType).includes(activity)) {
      return NextResponse.json(
        { error: "Tipo de actividad económica no válida" },
        { status: 400 }
      );
    }

    // Check email status and validate if registration is allowed
    const existingRequest = await prisma.registrationRequest.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }, // Get the most recent request
    });

    // Check if email is associated with an active company
    const existingCompany = await prisma.company.findFirst({
      where: {
        email,
        status: "ACTIVE",
      },
    });

    // If there's an active company with this email
    if (existingCompany) {
      return NextResponse.json(
        {
          error:
            "Ya existe una cuenta activa con este email. Por favor inicie sesión.",
        },
        { status: 409 }
      );
    }

    // If there's a registration request, check its status
    if (existingRequest) {
      switch (existingRequest.status) {
        case "PENDING":
          return NextResponse.json(
            {
              error:
                "Ya existe una solicitud pendiente con este email. Por favor espere la revisión.",
            },
            { status: 409 }
          );

        case "APPROVED":
          return NextResponse.json(
            {
              error:
                "Su solicitud ya fue aprobada. Por favor revise su email para las credenciales de acceso.",
            },
            { status: 409 }
          );

        case "REJECTED":
          // Allow resubmission for rejected requests - don't return error
          console.log(
            `Allowing resubmission for rejected email: ${email}, previous request: ${existingRequest.id}`
          );
          break;

        default:
          return NextResponse.json(
            { error: "Estado de solicitud desconocido" },
            { status: 409 }
          );
      }
    }

    // Create the registration request
    const registrationRequest = await prisma.registrationRequest.create({
      data: {
        companyName,
        nit,
        companyType,
        country,
        city,
        activity,
        contactName,
        contactPosition,
        email,
        phone,
        status: "PENDING",
      },
    });

    // If documents were uploaded, create document records
    if (documents) {
      const documentPromises = [];

      // Required documents
      if (documents.matricula) {
        documentPromises.push(
          prisma.document.create({
            data: {
              filename: documents.matricula.name,
              fileUrl: documents.matricula.fileUrl || "", // Use the uploaded file URL
              fileSize: documents.matricula.size,
              mimeType: documents.matricula.type,
              type: "MATRICULA_COMERCIO",
              registrationRequestId: registrationRequest.id,
            },
          })
        );
      }

      if (documents.nit) {
        documentPromises.push(
          prisma.document.create({
            data: {
              filename: documents.nit.name,
              fileUrl: documents.nit.fileUrl || "", // Use the uploaded file URL
              fileSize: documents.nit.size,
              mimeType: documents.nit.type,
              type: "NIT",
              registrationRequestId: registrationRequest.id,
            },
          })
        );
      }

      if (documents.poder) {
        documentPromises.push(
          prisma.document.create({
            data: {
              filename: documents.poder.name,
              fileUrl: documents.poder.fileUrl || "", // Use the uploaded file URL
              fileSize: documents.poder.size,
              mimeType: documents.poder.type,
              type: "PODER_REPRESENTANTE",
              registrationRequestId: registrationRequest.id,
            },
          })
        );
      }

      if (documents.carnet) {
        documentPromises.push(
          prisma.document.create({
            data: {
              filename: documents.carnet.name,
              fileUrl: documents.carnet.fileUrl || "", // Use the uploaded file URL
              fileSize: documents.carnet.size,
              mimeType: documents.carnet.type,
              type: "CARNET_IDENTIDAD",
              registrationRequestId: registrationRequest.id,
            },
          })
        );
      }

      // Optional document
      if (documents.aduana) {
        documentPromises.push(
          prisma.document.create({
            data: {
              filename: documents.aduana.name,
              fileUrl: documents.aduana.fileUrl || "", // Use the uploaded file URL
              fileSize: documents.aduana.size,
              mimeType: documents.aduana.type,
              type: "CERTIFICADO_ADUANA",
              registrationRequestId: registrationRequest.id,
            },
          })
        );
      }

      // Execute all document creation promises
      if (documentPromises.length > 0) {
        await Promise.all(documentPromises);
      }
    }

    // Send confirmation email
    try {
      const emailHtml = generateRegistrationConfirmationEmail({
        companyName,
        nit,
        companyType,
        country,
        city,
        activity,
        contactName,
        contactPosition,
        email,
        phone,
        requestId: registrationRequest.id,
        submittedAt: registrationRequest.createdAt.toISOString(),
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Solicitud de Registro Recibida - Mercury Platform (ID: ${registrationRequest.id})`,
        html: emailHtml,
      });

      console.log(
        `Confirmation email sent to ${email} for request ${registrationRequest.id}`
      );
    } catch (emailError) {
      // Log email error but don't fail the registration
      console.error("Error sending confirmation email:", emailError);
      // The registration was successful, so we still return success
      // but could add a note about email delivery
    }

    // Send admin notification emails to all SUPERADMIN users
    try {
      // Get all users with SUPERADMIN role and their emails
      const superAdmins = await prisma.profile.findMany({
        where: {
          role: "SUPERADMIN",
          status: "ACTIVE",
        },
        select: {
          email: true,
        },
      });

      // Filter out profiles without emails
      const adminEmails = superAdmins
        .map(admin => admin.email)
        .filter(email => email) as string[];

      if (adminEmails.length > 0) {
        // Count uploaded documents
        const documentsCount = documents
          ? Object.keys(documents).length
          : 0;

        const adminEmailHtml = generateAdminNotificationEmail({
          companyName,
          nit,
          companyType,
          country,
          city,
          activity,
          contactName,
          contactPosition,
          email,
          phone,
          requestId: registrationRequest.id,
          submittedAt: registrationRequest.createdAt.toISOString(),
          documentsCount,
        });

        // Send email to all SUPERADMIN users
        const adminEmailPromises = adminEmails.map((email) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `🚨 Nueva Solicitud de Registro - Mercury Platform (ID: ${registrationRequest.id})`,
            html: adminEmailHtml,
          })
        );

        await Promise.all(adminEmailPromises);

        console.log(
          `Admin notification emails sent to ${adminEmails.length} SUPERADMIN users for request ${registrationRequest.id}`
        );
      } else {
        console.log("No SUPERADMIN users with valid emails found");
      }
    } catch (adminEmailError) {
      // Log admin email error but don't fail the registration
      console.error(
        "Error sending admin notification emails:",
        adminEmailError
      );
      // The registration was successful, so we still return success
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de registro enviada correctamente",
        registrationRequest: {
          id: registrationRequest.id,
          companyName: registrationRequest.companyName,
          email: registrationRequest.email,
          status: registrationRequest.status,
          createdAt: registrationRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating registration request:", error);
    return NextResponse.json(
      {
        error:
          "Error interno del servidor. Por favor inténtelo de nuevo más tarde.",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
