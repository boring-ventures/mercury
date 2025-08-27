import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateContractGeneratedAdminEmail } from "@/lib/email-templates";
import { ContractStatus, Currency } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quotationId } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "representativeName",
      "representativeCI",
      "notaryName",
      "testimonioNumber",
      "testimonioDate",
      "powerNumber",
      "powerDate",
      "bankName",
      "accountNumber",
      "accountType",
      "accountHolder",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === "") {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

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
        { error: "Only importers can generate contracts" },
        { status: 403 }
      );
    }

    // Find quotation with request details
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        request: {
          include: {
            company: true,
            createdBy: true,
            provider: true,
          },
        },
        createdBy: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Verify quotation belongs to user's company
    if (quotation.companyId !== profile.companyId) {
      return NextResponse.json(
        { error: "Quotation does not belong to your company" },
        { status: 403 }
      );
    }

    // Verify quotation is accepted
    if (quotation.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Only accepted quotations can generate contracts" },
        { status: 400 }
      );
    }

    // Check if contract already exists for this quotation
    const existingContract = await prisma.contract.findFirst({
      where: { quotationId: quotationId },
    });

    if (existingContract) {
      return NextResponse.json(
        { error: "Contract already exists for this quotation" },
        { status: 400 }
      );
    }

    // Generate contract code
    const contractCode = `CTR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        code: contractCode,
        title: body.contractTitle || `Contrato de Servicio - ${quotation.code}`,
        description: body.contractDescription || quotation.description,
        amount: quotation.amount,
        currency: quotation.currency as Currency,
        status: ContractStatus.DRAFT,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        terms:
          body.contractTerms ||
          quotation.terms ||
          "Términos y condiciones del contrato de servicio.",
        conditions: body.conditions || null,
        requestId: quotation.requestId,
        quotationId: quotationId,
        companyId: quotation.companyId,
        createdById: profile.id,
        // Store additional contract data in a JSON field for template generation
        additionalData: {
          representative: {
            name: body.representativeName,
            ci: body.representativeCI,
            role: body.representativeRole,
          },
          notary: {
            name: body.notaryName,
            testimonioNumber: body.testimonioNumber,
            testimonioDate: body.testimonioDate,
          },
          power: {
            number: body.powerNumber,
            date: body.powerDate,
          },
          banking: {
            bankName: body.bankName,
            accountHolder: body.accountHolder,
            accountNumber: body.accountNumber,
            accountType: body.accountType,
          },
          additional: {
            beneficiaryName: body.beneficiaryName,
            referenceName: body.referenceName,
            referenceDate: body.referenceDate,
          },
          // Store all form data for future use
          formData: body.formData || {},
          // Store company data extracted from form
          companyData: body.formData
            ? {
                name: body.formData.companyName,
                address: body.formData.companyAddress,
                phone: body.formData.companyPhone,
                email: body.formData.companyEmail,
                nit: body.formData.companyRif,
                city: body.formData.companyCity,
              }
            : {},
          // Store contact data extracted from form
          contactData: body.formData
            ? {
                name: body.formData.contactName,
                phone: body.formData.contactPhone,
                email: body.formData.contactEmail,
                position: body.formData.contactPosition,
                ci: body.formData.contactCI,
              }
            : {},
          // Store provider data extracted from form
          providerData: body.formData
            ? {
                name: body.formData.providerName,
                country: body.formData.providerCountry,
                email: body.formData.providerEmail,
                phone: body.formData.providerPhone,
                bankName: body.formData.providerBankName,
                accountNumber: body.formData.providerAccountNumber,
                swiftCode: body.formData.providerSwiftCode,
                bankAddress: body.formData.providerBankAddress,
                beneficiaryName: body.formData.providerBeneficiaryName,
                accountType: body.formData.providerAccountType,
              }
            : {},
        },
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
        action: "GENERATE_CONTRACT",
        entity: "Contract",
        entityId: contract.id,
        newValues: {
          contractId: contract.id,
          contractCode: contract.code,
          quotationId: quotationId,
          quotationCode: quotation.code,
        },
        profileId: profile.id,
      },
    });

    // Update request status to reflect contract generation
    await prisma.request.update({
      where: { id: quotation.requestId },
      data: {
        status: "APPROVED", // Move to contract step
      },
    });

    // Notify admin about contract generation
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
          createSystemNotification("CONTRACT_GENERATED", admin.id, {
            contractId: contract.id,
            contractCode: contract.code,
            quotationId: quotationId,
            quotationCode: quotation.code,
            requestId: quotation.requestId,
            requestCode: quotation.request.code,
            companyName: quotation.request.company.name,
            amount: contract.amount,
          })
        )
      );

      // Send email to admins who have an email configured
      const adminEmails = adminUsers
        .map((a) => a.email)
        .filter((e): e is string => Boolean(e));

      if (adminEmails.length > 0) {
        const emailContent = generateContractGeneratedAdminEmail({
          contractCode: contract.code,
          quotationCode: quotation.code,
          requestCode: quotation.request.code,
          companyName: quotation.request.company.name,
          amount: Number(contract.amount),
          currency: contract.currency,
          importerName:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.email || "Importador",
          generatedAt: new Date().toISOString(),
        });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: adminEmails,
          subject: `Nuevo Contrato Generado - ${contract.code}`,
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
      message: "Contract generated successfully",
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    return NextResponse.json(
      { error: "Failed to generate contract" },
      { status: 500 }
    );
  }
}
