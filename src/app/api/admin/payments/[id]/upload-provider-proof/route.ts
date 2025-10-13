import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { resend } from "@/lib/resend";
import { FROM_EMAIL } from "@/lib/resend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== PROVIDER PROOF UPLOAD API START ===");
    const resolvedParams = await params;
    console.log("Params:", resolvedParams);

    // Authenticate admin user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

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

    if (profile.role !== "SUPERADMIN") {
      console.log("Unauthorized role:", profile.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    console.log("Authentication successful");

    const paymentId = resolvedParams.id;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const notes = formData.get("notes") as string;

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo PDF e imágenes." },
        { status: 400 }
      );
    }

    // Validate file size (30MB max)
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 30MB." },
        { status: 400 }
      );
    }

    // Get payment with contract info
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        contract: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!payment) {
      console.log("Payment not found:", paymentId);
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    console.log("Payment found:", payment.code);

    // Upload file to Supabase Storage
    console.log("Uploading file to Supabase...");
    const supabaseStorage = createRouteHandlerClient({ cookies });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `provider-proof-${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } =
      await supabaseStorage.storage
        .from("nordex")
        .upload(`provider-proofs/${filename}`, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return NextResponse.json(
        { error: `Error al subir el archivo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabaseStorage.storage
      .from("nordex")
      .getPublicUrl(`provider-proofs/${filename}`);

    const fileUrl = urlData.publicUrl;
    console.log("File uploaded successfully:", fileUrl);

    // Create document record
    const document = await prisma.document.create({
      data: {
        filename,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        type: "COMPROBANTE_PAGO_PROVEEDOR",
        status: "APPROVED",
        contractId: payment.contractId,
        paymentId: payment.id,
        companyId: payment.contract?.companyId,
        documentInfo: `Comprobante de pago al proveedor subido por ${profile.firstName} ${profile.lastName} el ${new Date().toLocaleDateString("es-ES")}${notes ? ` - Notas: ${notes}` : ""}`,
      },
    });

    console.log("Document record created:", document.id);

    // Update contract status to PAYMENT_COMPLETED
    if (payment.contract) {
      await prisma.contract.update({
        where: { id: payment.contract.id },
        data: {
          status: "PAYMENT_COMPLETED",
        },
      });
      console.log("Contract status updated to PAYMENT_COMPLETED");
    }

    // Send notification to importer
    console.log("Sending notification to importer...");
    try {
      if (payment.contract?.companyId) {
        const importerProfiles = await prisma.profile.findMany({
          where: {
            companyId: payment.contract.companyId,
            role: "IMPORTADOR",
            status: "ACTIVE",
          },
        });

        console.log("Found importer profiles:", importerProfiles.length);

        if (importerProfiles.length > 0) {
          // Send in-app notification
          await Promise.all(
            importerProfiles.map((importer) =>
              createSystemNotification("PROVIDER_PROOF_UPLOADED", importer.id, {
                paymentId: payment.id,
                paymentCode: payment.code,
                contractCode: payment.contract?.code,
                documentId: document.id,
                filename: filename,
                notes: notes,
              })
            )
          );

          console.log("In-app notifications sent");

          // Send email notifications
          const importerEmails = importerProfiles
            .map((importer) => importer.email)
            .filter(
              (email): email is string => email !== null && email !== undefined
            );

          if (importerEmails.length > 0) {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: importerEmails,
              subject:
                "📄 Comprobante de Pago al Proveedor Subido - NORDEX Platform",
              html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Comprobante de Pago al Proveedor Subido - NORDEX Platform</title>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .success-badge { background-color: #dcfce7; color: #166534; padding: 10px; border-radius: 5px; margin: 15px 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>NORDEX Platform</h1>
                    </div>
                    <div class="content">
                      <div class="success-badge">
                        <strong>✅ Proceso de Pago Completado</strong>
                      </div>
                      <h2>Comprobante de pago al proveedor subido</h2>
                      <p><strong>Contrato:</strong> ${payment.contract?.code || "N/A"}</p>
                      <p><strong>Pago:</strong> ${payment.code}</p>
                      <p><strong>Archivo:</strong> ${filename}</p>
                      <p><strong>Fecha de subida:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                      ${notes ? `<p><strong>Notas del administrador:</strong> ${notes}</p>` : ""}
                      <p>El proceso de pago ha sido completado exitosamente. El administrador ha subido el comprobante de pago al proveedor.</p>
                      <p><strong>Estado del contrato:</strong> Completado</p>
                    </div>
                    <div class="footer">
                      <p>Este es un mensaje automático del sistema NORDEX Platform.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            });

            console.log("Email notifications sent");
          }
        } else {
          console.log(
            "No importer profiles found for company:",
            payment.contract.companyId
          );
        }
      } else {
        console.log("No company ID found in contract");
      }
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Don't fail the entire request if notifications fail
    }

    console.log("=== PROVIDER PROOF UPLOAD API COMPLETED SUCCESSFULLY ===");

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        fileUrl: document.fileUrl,
      },
      message: "Comprobante de pago al proveedor subido exitosamente.",
    });
  } catch (error) {
    console.error("=== PROVIDER PROOF UPLOAD API ERROR ===");
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Error al subir el comprobante de pago al proveedor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
