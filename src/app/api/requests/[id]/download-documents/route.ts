import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

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
        documents: true,
        company: true,
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (!requestData.documents || requestData.documents.length === 0) {
      return NextResponse.json(
        { error: "No documents found for this request" },
        { status: 404 }
      );
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "DOWNLOAD_DOCUMENTS",
        entity: "Request",
        entityId: requestData.id,
        profileId: profile.id, // Use actual profile ID
      },
    });

    // In a real implementation, you would:
    // 1. Create a ZIP file with all documents
    // 2. Fetch each document from storage (S3, local filesystem, etc.)
    // 3. Add each document to the ZIP
    // 4. Return the ZIP as a response

    // For demo purposes, we'll create a mock ZIP response
    const zipFilename = `Documentos_${requestData.code}_${Date.now()}.zip`;

    // Mock ZIP content (in real implementation, use a library like archiver or node-stream-zip)
    const mockZipContent = Buffer.from(
      `Mock ZIP file for request ${requestData.code}\n` +
        `Documents included:\n` +
        requestData.documents.map((doc) => `- ${doc.filename}`).join("\n") +
        `\n\nGenerated on: ${new Date().toISOString()}`
    );

    return new NextResponse(mockZipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFilename}"`,
        "Content-Length": mockZipContent.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading documents:", error);
    return NextResponse.json(
      { error: "Failed to download documents" },
      { status: 500 }
    );
  }
}
