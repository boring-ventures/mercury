import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { generateContractCompletedEmail } from "@/lib/email-templates";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Validate date logic
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "Start date must be before end date" },
        { status: 400 }
      );
    }

    // Authenticate admin user
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get contract with company and importer information
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: {
          include: {
            users: {
              where: {
                status: "ACTIVE",
                role: "IMPORTADOR",
              },
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        quotation: true,
        request: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Update contract with new dates and status
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        startDate,
        endDate,
        status: "COMPLETED",
        additionalData: {
          ...((contract.additionalData as any) || {}),
          adminCompleted: {
            at: new Date().toISOString(),
            by: profile.id,
            byName: `${profile.firstName} ${profile.lastName}`,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "COMPLETE_CONTRACT",
        entity: "Contract",
        entityId: contractId,
        newValues: {
          startDate,
          endDate,
          status: "COMPLETED",
          adminCompleted: {
            at: new Date().toISOString(),
            by: profile.id,
            byName: `${profile.firstName} ${profile.lastName}`,
          },
        },
        profileId: profile.id,
      },
    });

    // Update request status if it exists
    if (contract.requestId) {
      await prisma.request.update({
        where: { id: contract.requestId },
        data: {
          status: "COMPLETED",
        },
      });
    }

    // Send notifications to importers
    try {
      const importers = contract.company.users;

      if (importers.length > 0) {
        // Send in-app notifications
        await Promise.all(
          importers.map((importer) =>
            createSystemNotification("CONTRACT_COMPLETED", importer.id, {
              contractId: contract.id,
              contractCode: contract.code,
              quotationId: contract.quotationId,
              quotationCode: contract.quotation?.code,
              requestId: contract.requestId,
              requestCode: contract.request?.code,
              companyName: contract.company.name,
              amount: contract.amount,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              completedBy: `${profile.firstName} ${profile.lastName}`,
              completedAt: new Date().toISOString(),
            })
          )
        );

        // Send email notifications
        const importersWithEmail = importers.filter((i) => i.email);

        if (importersWithEmail.length > 0) {
          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          await Promise.all(
            importersWithEmail.map(async (importer) => {
              try {
                const emailContent = generateContractCompletedEmail({
                  importerName: `${importer.firstName} ${importer.lastName}`,
                  contractCode: contract.code,
                  quotationCode: contract.quotation?.code || "N/A",
                  requestCode: contract.request?.code || "N/A",
                  companyName: contract.company.name,
                  amount: Number(contract.amount),
                  currency: contract.currency,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                  completedBy: `${profile.firstName} ${profile.lastName}`,
                  completedAt: new Date().toISOString(),
                  link: `${appUrl}/importador/contratos/${contract.id}`,
                });

                await resend.emails.send({
                  from: FROM_EMAIL,
                  to: importer.email!,
                  subject: `✅ Contrato Completado - ${contract.code}`,
                  html: emailContent,
                });

                console.log(
                  `Contract completion email sent to ${importer.email} for contract ${contract.code}`
                );
              } catch (emailError) {
                console.error(
                  `Error sending email to ${importer.email}:`,
                  emailError
                );
              }
            })
          );
        }
      }
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Don't fail the contract completion if notifications fail
    }

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      message: "Contract completed successfully",
    });
  } catch (error) {
    console.error("Error completing contract:", error);

    // Return a proper error response
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Contract completion failed:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to complete contract",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
