import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { resend, FROM_EMAIL } from "@/lib/resend";

// Helper function to upload file to Supabase Storage
async function uploadFileToSupabase(file: File, filename: string) {
  const supabase = createRouteHandlerClient({ cookies });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data, error } = await supabase.storage
    .from("nordex")
    .upload(`payment-proofs/${filename}`, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file to Supabase:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("nordex")
    .getPublicUrl(`payment-proofs/${filename}`);

  return urlData.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting payment proof upload...");

    // Authenticate importer user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    console.log("User authenticated:", user.id);

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      console.log("Profile not found for user:", user.id);
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    console.log("Profile found:", profile.id, "Role:", profile.role);

    if (profile.role !== "IMPORTADOR") {
      console.log("Unauthorized role:", profile.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (!profile.companyId) {
      console.log("No company ID for profile:", profile.id);
      return NextResponse.json(
        { error: "Usuario sin empresa asignada" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contractId = formData.get("contractId") as string;
    const type = formData.get("type") as string;

    console.log("Form data parsed:", {
      hasFile: !!file,
      fileSize: file?.size,
      fileType: file?.type,
      contractId,
      type,
    });

    if (!file || !contractId || !type) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Archivo, ID del contrato y tipo son requeridos" },
        { status: 400 }
      );
    }

    // Validate contract exists and belongs to user's company
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { company: true },
    });

    if (!contract) {
      console.log("Contract not found:", contractId);
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    console.log("Contract found:", contract.code, "Status:", contract.status);

    if (contract.companyId !== profile.companyId) {
      console.log(
        "Contract company mismatch:",
        contract.companyId,
        "vs",
        profile.companyId
      );
      return NextResponse.json(
        { error: "No autorizado para este contrato" },
        { status: 403 }
      );
    }

    if (contract.status !== "COMPLETED") {
      console.log("Contract not completed:", contract.status);
      return NextResponse.json(
        { error: "Solo se pueden subir documentos para contratos completados" },
        { status: 400 }
      );
    }

    // Check if payment already exists for this contract
    const existingPayment = await prisma.payment.findFirst({
      where: { contractId: contractId },
    });

    if (existingPayment) {
      console.log("Payment already exists for contract:", contractId);
      return NextResponse.json(
        { error: "Ya se ha subido un comprobante de pago para este contrato" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo PDF e imágenes." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      return NextResponse.json(
        { error: "El archivo no puede ser mayor a 5MB" },
        { status: 400 }
      );
    }

    console.log("File validation passed, creating file URL...");

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `payment_proof_${contract.code}_${timestamp}.${fileExtension}`;

    // Upload file to Supabase Storage
    const fileUrl = await uploadFileToSupabase(file, filename);
    console.log("File uploaded to Supabase:", filename);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        code: `PAY-${contract.code}-${timestamp}`,
        amount: contract.amount,
        currency: contract.currency,
        type: "FINAL",
        status: "PENDING", // Basic payment status
        description: `Pago del contrato ${contract.code}`,
        reference: `Contrato ${contract.code}`,
        contractId: contractId,
        companyId: profile.companyId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    console.log("Payment created:", payment.id);

    // Create document record
    const document = await prisma.document.create({
      data: {
        filename,
        fileUrl: fileUrl, // Store the Supabase URL
        fileSize: file.size,
        mimeType: file.type,
        type: "COMPROBANTE_PAGO",
        status: "PENDING",
        contractId: contractId,
        paymentId: payment.id, // Link document to payment
        companyId: profile.companyId,
        documentInfo: `Comprobante de pago subido por ${profile.firstName} ${profile.lastName} el ${new Date().toLocaleDateString("es-ES")}`,
      },
    });

    console.log("Document created:", document.id);

    // Update contract with payment information and status
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "PAYMENT_PENDING", // Update contract status to indicate payment is pending review
        additionalData: {
          ...((contract.additionalData as any) || {}),
          payment: {
            paymentId: payment.id,
            status: "PENDING_REVIEW", // This is the payment workflow status in contract data
            uploadedAt: new Date().toISOString(),
            uploadedByName: `${profile.firstName} ${profile.lastName}`,
            documentId: document.id,
            filename: filename,
          },
        },
      },
    });

    console.log("Contract updated with payment info");

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPLOAD_PAYMENT_PROOF",
        entity: "Contract",
        entityId: contractId,
        newValues: {
          paymentId: payment.id,
          documentId: document.id,
          filename: filename,
          uploadedBy: profile.id,
          uploadedAt: new Date().toISOString(),
          status: "PENDING",
        },
        profileId: profile.id,
      },
    });

    console.log("Audit log created");

    // Send notification to admin users
    try {
      const adminProfiles = await prisma.profile.findMany({
        where: {
          role: "SUPERADMIN",
          status: "ACTIVE",
        },
      });

      console.log("Found admin profiles:", adminProfiles.length);

      await Promise.all(
        adminProfiles.map((admin) =>
          createSystemNotification("PAYMENT_PROOF_UPLOADED", admin.id, {
            contractId: contract.id,
            contractCode: contract.code,
            companyName: contract.company.name,
            uploadedBy: `${profile.firstName} ${profile.lastName}`,
            uploadedAt: new Date().toISOString(),
            documentId: document.id,
            filename: filename,
            paymentId: payment.id,
            amount: contract.amount.toString(),
            currency: contract.currency,
          })
        )
      );

      console.log("Notifications sent to admins");

      // Send email notifications to admins
      await Promise.all(
        adminProfiles
          .filter((admin) => admin.email) // Only send to admins with email
          .map(async (admin) => {
            try {
              await resend.emails.send({
                from: FROM_EMAIL,
                to: admin.email!,
                subject: `📄 Nuevo Comprobante de Pago - Contrato ${contract.code}`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1f2937;">📄 Nuevo Comprobante de Pago Subido</h2>
                  
                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">Detalles del Contrato</h3>
                    <p><strong>Código:</strong> ${contract.code}</p>
                    <p><strong>Empresa:</strong> ${contract.company.name}</p>
                    <p><strong>Monto:</strong> ${contract.amount} ${contract.currency}</p>
                    <p><strong>Subido por:</strong> ${profile.firstName} ${profile.lastName}</p>
                    <p><strong>Documento:</strong> ${filename}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                  </div>
                  
                  <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #1e40af; margin: 0;">
                      <strong>Acción Requerida:</strong> Por favor revise el comprobante de pago 
                      y apruebe o rechace el documento según corresponda.
                    </p>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px;">
                    Este es un mensaje automático del sistema NORDEX Platform.
                  </p>
                </div>
              `,
              });
              console.log(`Email sent to admin: ${admin.email}`);
            } catch (emailError) {
              console.error(
                `Error sending email to ${admin.email}:`,
                emailError
              );
            }
          })
      );

      console.log("Email notifications sent to admins");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Don't fail the upload if notifications fail
    }

    console.log("Payment proof upload completed successfully");

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        code: payment.code,
        status: payment.status,
      },
      document: {
        id: document.id,
        filename: filename,
        uploadedAt: document.createdAt,
      },
      message:
        "Comprobante de pago subido exitosamente. El administrador revisará el documento.",
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Error al subir el comprobante de pago",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
