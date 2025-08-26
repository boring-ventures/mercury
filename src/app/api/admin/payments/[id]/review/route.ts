import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { resend } from "@/lib/resend";
import { FROM_EMAIL } from "@/lib/resend";
import { SystemNotificationTemplates } from "@/types/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== PAYMENT REVIEW API START ===");
    const resolvedParams = await params;
    console.log("Params:", resolvedParams);
    console.log("Request method:", request.method);

    // Test basic functionality first
    console.log("1. Basic API functionality test - PASSED");

    // Test authentication
    console.log("2. Testing authentication...");
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    console.log("2. Authentication - PASSED");

    // Test profile lookup
    console.log("3. Testing profile lookup...");
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
    console.log("3. Profile lookup - PASSED");

    // Test request body parsing
    console.log("4. Testing request body parsing...");
    const paymentId = resolvedParams.id;
    const {
      action,
      reviewNotes,
      providerPaymentAmount,
      providerPaymentCurrency,
    } = await request.json();

    console.log("Request body:", { paymentId, action, reviewNotes });
    console.log("4. Request body parsing - PASSED");

    // Test action validation
    console.log("5. Testing action validation...");
    if (
      !action ||
      !["APPROVE", "REJECT", "MARK_PROVIDER_PAID"].includes(action)
    ) {
      return NextResponse.json(
        {
          error:
            "Acción inválida. Debe ser APPROVE, REJECT, o MARK_PROVIDER_PAID",
        },
        { status: 400 }
      );
    }
    console.log("5. Action validation - PASSED");

    // Test payment lookup
    console.log("6. Testing payment lookup...");
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        contract: true,
        documents: true,
      },
    });

    if (!payment) {
      console.log("Payment not found:", paymentId);
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }
    console.log("6. Payment lookup - PASSED");
    console.log("Payment found:", payment.code, "Status:", payment.status);

    // Test payment update
    console.log("7. Testing payment update...");
    const newPaymentStatus =
      action === "MARK_PROVIDER_PAID" ? "COMPLETED" : "PENDING";

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newPaymentStatus,
        paidAt: action === "MARK_PROVIDER_PAID" ? new Date() : undefined,
      },
    });
    console.log("7. Payment update - PASSED");

    // Test contract update
    console.log("8. Testing contract update...");
    let newContractStatus = payment.contract?.status;

    switch (action) {
      case "APPROVE":
        newContractStatus = "PAYMENT_REVIEWED";
        break;
      case "REJECT":
        newContractStatus = "PAYMENT_PENDING";
        break;
      case "MARK_PROVIDER_PAID":
        newContractStatus = "PROVIDER_PAID";
        break;
    }

    if (payment.contract && newContractStatus) {
      await prisma.contract.update({
        where: { id: payment.contract.id },
        data: {
          status: newContractStatus,
        },
      });
      console.log("8. Contract update - PASSED");
    }

    // Send notification to importer
    console.log("9. Sending notification to importer...");
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
          let notificationType: keyof SystemNotificationTemplates =
            "PAYMENT_APPROVED";
          let notificationData = {};

          switch (action) {
            case "APPROVE":
              notificationType = "PAYMENT_APPROVED";
              notificationData = {
                paymentId: payment.id,
                paymentCode: payment.code,
                contractCode: payment.contract?.code,
                amount: payment.amount.toString(),
                currency: payment.currency,
                reviewNotes,
              };
              break;
            case "REJECT":
              notificationType = "PAYMENT_REJECTED";
              notificationData = {
                paymentId: payment.id,
                paymentCode: payment.code,
                contractCode: payment.contract?.code,
                reviewNotes,
              };
              break;
            case "MARK_PROVIDER_PAID":
              notificationType = "PROVIDER_PAYMENT_COMPLETED";
              notificationData = {
                paymentId: payment.id,
                paymentCode: payment.code,
                contractCode: payment.contract?.code,
                reviewNotes,
              };
              break;
          }

          await Promise.all(
            importerProfiles.map((importer) =>
              createSystemNotification(
                notificationType,
                importer.id,
                notificationData
              )
            )
          );

          console.log("9. Notifications sent to importers - PASSED");

          // Send email notifications to importers
          console.log("10. Sending email notifications...");
          try {
            const importerEmails = importerProfiles
              .map((importer) => importer.email)
              .filter(
                (email): email is string =>
                  email !== null && email !== undefined
              );

            if (importerEmails.length > 0) {
              let emailSubject = "";
              let emailContent = "";

              switch (action) {
                case "APPROVE":
                  emailSubject = "✅ Pago Aprobado - NORDEX Platform";
                  emailContent = `
                    <h2>Su comprobante de pago ha sido aprobado</h2>
                    <p><strong>Contrato:</strong> ${payment.contract?.code || "N/A"}</p>
                    <p><strong>Pago:</strong> ${payment.code}</p>
                    <p><strong>Monto:</strong> ${payment.amount} ${payment.currency}</p>
                    <p><strong>Fecha de revisión:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                    ${reviewNotes ? `<p><strong>Comentarios:</strong> ${reviewNotes}</p>` : ""}
                    <p>El administrador procederá a realizar el pago al proveedor. Recibirá una notificación cuando este proceso se complete.</p>
                  `;
                  break;
                case "REJECT":
                  emailSubject = "❌ Pago Rechazado - NORDEX Platform";
                  emailContent = `
                    <h2>Su comprobante de pago ha sido rechazado</h2>
                    <p><strong>Contrato:</strong> ${payment.contract?.code || "N/A"}</p>
                    <p><strong>Pago:</strong> ${payment.code}</p>
                    <p><strong>Fecha de revisión:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                    ${reviewNotes ? `<p><strong>Comentarios:</strong> ${reviewNotes}</p>` : ""}
                    <p>Por favor, revise los comentarios y suba un nuevo comprobante de pago si es necesario.</p>
                  `;
                  break;
                case "MARK_PROVIDER_PAID":
                  emailSubject =
                    "💰 Pago al Proveedor Completado - NORDEX Platform";
                  emailContent = `
                    <h2>Pago al proveedor completado</h2>
                    <p><strong>Contrato:</strong> ${payment.contract?.code || "N/A"}</p>
                    <p><strong>Pago:</strong> ${payment.code}</p>
                    <p><strong>Fecha de pago:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                    ${reviewNotes ? `<p><strong>Comentarios:</strong> ${reviewNotes}</p>` : ""}
                    <p>El administrador ha completado el pago al proveedor. Pronto subirá el comprobante de pago al proveedor para su revisión.</p>
                  `;
                  break;
              }

              await resend.emails.send({
                from: FROM_EMAIL,
                to: importerEmails,
                subject: emailSubject,
                html: `
                  <!DOCTYPE html>
                  <html lang="es">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${emailSubject}</title>
                    <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
                      .content { padding: 20px; background-color: #f9f9f9; }
                      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1>NORDEX Platform</h1>
                      </div>
                      <div class="content">
                        ${emailContent}
                      </div>
                      <div class="footer">
                        <p>Este es un mensaje automático del sistema NORDEX Platform.</p>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
              });

              console.log("10. Email notifications sent - PASSED");
            }
          } catch (emailError) {
            console.error("Error sending email notifications:", emailError);
            // Don't fail the entire request if emails fail
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

    console.log("=== PAYMENT REVIEW API COMPLETED SUCCESSFULLY ===");

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        code: payment.code,
        status: newPaymentStatus,
      },
      contract: payment.contract
        ? {
            id: payment.contract.id,
            code: payment.contract.code,
            status: newContractStatus,
          }
        : null,
      message: `Pago ${action === "APPROVE" ? "aprobado" : action === "REJECT" ? "rechazado" : "marcado como pagado al proveedor"} exitosamente.`,
    });
  } catch (error) {
    console.error("=== PAYMENT REVIEW API ERROR ===");
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.error(
      "Error name:",
      error instanceof Error ? error.name : "Unknown"
    );

    return NextResponse.json(
      {
        error: "Error al revisar el pago",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
