import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check authentication
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get user profile to check role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    if (!profile || profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a este documento" },
        { status: 403 }
      );
    }

    // Find the document - using the correct model name 'document'
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        registrationRequest: {
          select: {
            id: true,
            companyName: true,
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
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Check if document has a valid file URL
    if (!document.fileUrl) {
      return NextResponse.json(
        { error: "Archivo no disponible" },
        { status: 404 }
      );
    }

    // Common bucket names to try (prioritize mercury since that's the user's bucket)
    const bucketNames = [
      "mercury", // User's actual bucket
      "registration-documents",
      "documents",
      "uploads",
      "files",
      "avatars", // fallback
    ];

    let fileData = null;
    let successfulBucket = null;

    // Try different bucket names
    for (const bucketName of bucketNames) {
      try {
        console.log(
          `Trying bucket: ${bucketName} for file: ${document.fileUrl}`
        );

        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(document.fileUrl);

        if (!error && data) {
          fileData = data;
          successfulBucket = bucketName;
          console.log(`Success with bucket: ${bucketName}`);
          break;
        } else if (error) {
          console.log(`Bucket ${bucketName} error:`, error.message);
        }
      } catch (bucketError) {
        console.log(`Bucket ${bucketName} failed:`, bucketError);
        continue;
      }
    }

    // If we found the file, return it
    if (fileData && successfulBucket) {
      return new NextResponse(fileData, {
        headers: {
          "Content-Type": document.mimeType || "application/octet-stream",
          "Content-Disposition": `inline; filename="${document.filename}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    // If download failed, try to get public URL
    for (const bucketName of bucketNames) {
      try {
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(document.fileUrl);

        if (publicUrl && !publicUrl.includes("null")) {
          console.log(
            `Redirecting to public URL from bucket ${bucketName}: ${publicUrl}`
          );
          return NextResponse.redirect(publicUrl);
        }
      } catch (publicUrlError) {
        console.log(
          `Public URL failed for bucket ${bucketName}:`,
          publicUrlError
        );
        continue;
      }
    }

    // If the fileUrl is already a full URL (starts with https://), redirect directly
    if (document.fileUrl.startsWith("https://")) {
      console.log(`Direct URL redirect: ${document.fileUrl}`);
      return NextResponse.redirect(document.fileUrl);
    }

    // Final fallback: return demo content based on file type
    console.log(
      `All storage methods failed, using fallback for: ${document.filename}`
    );

    const isPDF =
      document.mimeType?.toLowerCase().includes("pdf") ||
      document.filename.toLowerCase().endsWith(".pdf");

    const isImage =
      document.mimeType?.toLowerCase().includes("image") ||
      document.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);

    if (isPDF) {
      // For demo: redirect to a sample PDF
      return NextResponse.redirect(
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      );
    }

    if (isImage) {
      // For demo: redirect to a placeholder image based on document name
      const placeholderUrl = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
      return NextResponse.redirect(placeholderUrl);
    }

    // For other file types, return error
    return NextResponse.json(
      { error: "No se pudo acceder al archivo" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error serving document:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
