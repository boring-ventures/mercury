import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

// Interface for PDF request data
interface PDFRequestData {
  id: string;
  code: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  company?: {
    name: string;
  } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestIdOrCode } = await params;

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
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find request by ID or code
    const isId = requestIdOrCode.length > 20 && !requestIdOrCode.includes("-");
    const whereClause = isId
      ? { id: requestIdOrCode }
      : { code: requestIdOrCode };

    const requestData = await prisma.request.findUnique({
      where: whereClause,
      include: {
        company: true,
        provider: true,
        createdBy: true,
        assignedTo: true,
        documents: true,
        quotations: true,
        contracts: true,
        payments: true,
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // In a real implementation, you would use a PDF generation library like:
    // - puppeteer
    // - jsPDF
    // - PDFKit
    // - react-pdf

    // For now, we'll return a mock PDF URL or generate basic PDF content
    const pdfContent = generatePDFContent({
      ...requestData,
      amount: Number(requestData.amount),
      createdAt: requestData.createdAt.toISOString(),
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "DOWNLOAD_PDF",
        entity: "Request",
        entityId: requestData.id,
        profileId: profile.id, // Use actual profile ID
      },
    });

    // Return PDF as response
    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="solicitud_${requestData.code}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generatePDFContent(requestData: PDFRequestData): string {
  // Mock PDF content - in real implementation, use proper PDF generation
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(SOLICITUD DE IMPORTACION) Tj
0 -24 Td
(Codigo: ${requestData.code}) Tj
0 -24 Td
(Empresa: ${requestData.company?.name || "N/A"}) Tj
0 -24 Td
(Monto: $${requestData.amount} ${requestData.currency}) Tj
0 -24 Td
(Estado: ${requestData.status}) Tj
0 -24 Td
(Fecha: ${new Date(requestData.createdAt).toLocaleDateString()}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000203 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
450
%%EOF`;
}
