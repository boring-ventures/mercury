import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find document by ID
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        request: {
          select: {
            id: true,
            code: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // In a real implementation, you would:
    // 1. Check user permissions to access this document
    // 2. Fetch the actual file from storage (S3, local filesystem, etc.)
    // 3. Return the file with appropriate headers

    // For demo purposes, we'll redirect to the fileUrl or return placeholder
    if (document.fileUrl && document.fileUrl.startsWith("http")) {
      // If it's a full URL, redirect to it
      return NextResponse.redirect(document.fileUrl);
    }

    // Create a placeholder response for documents without valid URLs
    const isImage = document.mimeType?.includes("image");
    const isPDF = document.mimeType?.includes("pdf");

    if (isImage) {
      // Redirect to a placeholder image service
      const placeholderUrl = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
      return NextResponse.redirect(placeholderUrl);
    }

    if (isPDF) {
      // For PDFs, return a simple text response (in real app, return actual PDF)
      const pdfContent = `Mock PDF content for: ${document.filename}\nDocument ID: ${document.id}\nType: ${document.type}\nCreated: ${document.createdAt}`;

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${document.filename}"`,
        },
      });
    }

    // For other file types, return file info as JSON
    return NextResponse.json({
      id: document.id,
      filename: document.filename,
      mimeType: document.mimeType,
      type: document.type,
      size: document.fileSize,
      status: document.status,
      createdAt: document.createdAt,
      message: "File content would be served in a real implementation",
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return NextResponse.json(
      { error: "Failed to serve document" },
      { status: 500 }
    );
  }
}
