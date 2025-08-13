import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { ContractStatus, Currency } from "@prisma/client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateContractActivatedEmail } from "@/lib/email-templates";

// GET: Fetch all contracts with filtering and pagination (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const currency = searchParams.get("currency");
    const search = searchParams.get("search");

    // Get authenticated admin user
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
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is admin
    if (profile.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build where clause
    const whereClause: any = {};

    if (status && status !== "todos") {
      whereClause.status = status;
    }

    if (currency && currency !== "todos") {
      whereClause.currency = currency;
    }

    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { request: { code: { contains: search, mode: "insensitive" } } },
        { quotation: { code: { contains: search, mode: "insensitive" } } },
        { company: { name: { contains: search, mode: "insensitive" } } },
        { createdBy: { firstName: { contains: search, mode: "insensitive" } } },
        { createdBy: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get contracts with pagination
    const [contracts, totalCount] = await Promise.all([
      prisma.contract.findMany({
        where: whereClause,
        select: {
          id: true,
          code: true,
          title: true,
          status: true,
          amount: true,
          currency: true,
          startDate: true,
          endDate: true,
          signedAt: true,
          createdAt: true,
          request: {
            select: {
              id: true,
              code: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
          quotation: {
            select: {
              id: true,
              code: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contract.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      contracts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

// POST: Create a draft contract from an accepted quotation (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quotationId,
      title,
      description,
      terms,
      amount,
      currency,
      startDate,
      endDate,
    } = body;

    // Auth admin
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile || profile.role !== "SUPERADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    // Load quotation and relations
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        request: { include: { company: true, provider: true } },
      },
    });
    if (!quotation)
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    if (quotation.status !== "ACCEPTED")
      return NextResponse.json(
        { error: "Quotation is not accepted" },
        { status: 400 }
      );

    // Create draft contract
    const newContract = await prisma.contract.create({
      data: {
        code: `CON-${Math.floor(Math.random() * 90000 + 10000)}`,
        title: title || `Contrato basado en ${quotation.code}`,
        description: description || quotation.description,
        amount: amount ?? quotation.amount,
        currency: (currency || quotation.currency) as Currency,
        status: ContractStatus.DRAFT,
        startDate: new Date(startDate || new Date()),
        endDate: new Date(
          endDate || new Date(new Date().setMonth(new Date().getMonth() + 6))
        ),
        terms: terms || quotation.terms || "",
        companyId: quotation.companyId,
        createdById: profile.id,
        quotationId: quotation.id,
        requestId: quotation.requestId,
      },
    });

    return NextResponse.json({ success: true, contract: newContract });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}

// PATCH: Update/Activate a contract (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      title,
      description,
      amount,
      currency,
      startDate,
      endDate,
      terms,
      conditions,
    } = body;

    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile || profile.role !== "SUPERADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        company: true,
        request: { include: { company: true } },
        quotation: true,
      },
    });
    if (!contract)
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(currency !== undefined && { currency }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(terms !== undefined && { terms }),
        ...(conditions !== undefined && { conditions }),
        ...(status !== undefined && { status }),
        ...(status === "ACTIVE" && { signedAt: new Date() }),
      },
    });

    // If activated, email importer company
    if (status === "ACTIVE") {
      try {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const html = generateContractActivatedEmail({
          companyName:
            contract.request?.company.name || contract.company?.name || "",
          contractCode: updated.code,
          title: updated.title,
          amount: updated.amount.toString(),
          currency: updated.currency,
          startDate: updated.startDate.toISOString(),
          endDate: updated.endDate.toISOString(),
          link: `${appUrl}/importador/solicitudes/${contract.requestId}`,
        });
        const toEmail = contract.request?.company.email;
        if (toEmail) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: toEmail,
            subject: `Contrato activo • ${updated.code}`,
            html,
          });
        }
      } catch (emailErr) {
        console.error("Failed sending contract activation email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, contract: updated });
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}
