import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ActivityType } from "@prisma/client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateRegistrationConfirmationEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      ruc,
      country,
      activity,
      contactName,
      contactPosition,
      email,
      phone,
      bankingDetails,
      documents,
    } = body;

    // Validate required fields
    if (
      !companyName ||
      !ruc ||
      !country ||
      !activity ||
      !contactName ||
      !contactPosition ||
      !email ||
      !phone ||
      !bankingDetails
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
        ruc,
        country,
        activity,
        contactName,
        contactPosition,
        email,
        phone,
        bankingDetails,
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
        ruc,
        country,
        activity,
        contactName,
        contactPosition,
        email,
        phone,
        bankingDetails,
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
