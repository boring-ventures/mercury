import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateContractAcceptedAdminEmail } from "@/lib/email-templates";
import { ContractStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;

    // Get current user from session
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify user is an importador
    if (profile.role !== "IMPORTADOR") {
      return NextResponse.json(
        { error: "Only importers can accept contracts" },
        { status: 403 }
      );
    }

    // Find contract with relations
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: true,
        quotation: {
          include: {
            request: {
              include: {
                company: true,
                createdBy: true,
              },
            },
          },
        },
        request: {
          include: {
            company: true,
            provider: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Verify contract belongs to user's company
    if (contract.companyId !== profile.companyId) {
      return NextResponse.json(
        { error: "Contract does not belong to your company" },
        { status: 403 }
      );
    }

    // Verify contract is in DRAFT status
    if (contract.status !== ContractStatus.DRAFT) {
      return NextResponse.json(
        { error: "Only draft contracts can be accepted" },
        { status: 400 }
      );
    }

    // Update contract status to ACTIVE and set signed date
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.ACTIVE,
        signedAt: new Date(),
      },
      include: {
        company: true,
        quotation: true,
        request: {
          include: {
            company: true,
            provider: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ACCEPT_CONTRACT",
        entity: "Contract",
        entityId: contractId,
        newValues: {
          status: ContractStatus.ACTIVE,
          signedAt: new Date(),
        },
        profileId: profile.id,
      },
    });

    // Update request status to reflect contract acceptance
    if (contract.requestId) {
      await prisma.request.update({
        where: { id: contract.requestId },
        data: {
          status: "APPROVED", // Keep in approved status for contract step
        },
      });
    }

    // Notify admin about contract acceptance
    try {
      // Get admin users to notify
      const adminUsers = await prisma.profile.findMany({
        where: {
          role: "SUPERADMIN",
          status: "ACTIVE",
        },
        select: {
          id: true,
          email: true,
        },
      });

      // Notify all admin users (in-app notification)
      await Promise.all(
        adminUsers.map((admin) =>
          createSystemNotification("CONTRACT_ACCEPTED", admin.id, {
            contractId: contract.id,
            contractCode: contract.code,
            quotationId: contract.quotationId,
            quotationCode: contract.quotation?.code,
            requestId: contract.requestId,
            requestCode: contract.request?.code,
            companyName: contract.company.name,
            amount: contract.amount,
            signedAt: new Date().toISOString(),
          })
        )
      );

      // Send email to admins who have an email configured
      const adminEmails = adminUsers
        .map((a) => a.email)
        .filter((e): e is string => Boolean(e));

      if (adminEmails.length > 0) {
        const emailContent = generateContractAcceptedAdminEmail({
          contractCode: contract.code,
          quotationCode: contract.quotation?.code || "N/A",
          requestCode: contract.request?.code || "N/A",
          companyName: contract.company.name,
          amount: Number(contract.amount),
          currency: contract.currency,
          importerName:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.email || "Importador",
          acceptedAt: new Date().toISOString(),
        });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: adminEmails,
          subject: `Contrato Aceptado - ${contract.code}`,
          html: emailContent,
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      contractId: contract.id,
      contractCode: contract.code,
      status: ContractStatus.ACTIVE,
      message: "Contract accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting contract:", error);
    return NextResponse.json(
      { error: "Failed to accept contract" },
      { status: 500 }
    );
  }
}
