import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import JSZip from "jszip";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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
        { error: "No tienes permisos para descargar estos documentos" },
        { status: 403 }
      );
    }

    // Find the registration petition with documents
    const petition = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            filename: true,
            fileUrl: true,
            mimeType: true,
            type: true,
          },
        },
      },
    });

    if (!petition) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (!petition.documents || petition.documents.length === 0) {
      return NextResponse.json(
        { error: "No hay documentos para descargar" },
        { status: 400 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();

    // Common bucket names to try
    const bucketNames = [
      "nordex",
      "registration-documents",
      "documents",
      "uploads",
      "files",
    ];

    let successfulDownloads = 0;

    // Download each document and add to ZIP
    for (const doc of petition.documents) {
      let fileData = null;
      let successfulBucket = null;

      // Try to download from different buckets
      for (const bucketName of bucketNames) {
        try {
          console.log(`Trying bucket: ${bucketName} for file: ${doc.fileUrl}`);

          const { data, error } = await supabase.storage
            .from(bucketName)
            .download(doc.fileUrl);

          if (!error && data) {
            // Convert Blob to ArrayBuffer for JSZip
            fileData = await data.arrayBuffer();
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

      if (fileData && successfulBucket) {
        // Add file to ZIP with a safe filename
        const safeFilename = doc.filename.replace(/[<>:"/\\|?*]/g, "_");
        console.log(`Adding file to ZIP: ${safeFilename}`);

        try {
          zip.file(safeFilename, fileData);
          successfulDownloads++;
        } catch (zipError) {
          console.error(`Error adding file ${safeFilename} to ZIP:`, zipError);
          // Add error file instead
          const errorContent = `Error al procesar el archivo: ${doc.filename}\nError: ${zipError}\nURL: ${doc.fileUrl}\nTipo: ${doc.type}`;
          zip.file(`ERROR_${safeFilename}.txt`, errorContent);
        }
      } else {
        // If we can't download the file, add a text file with the error
        console.log(`Could not download file: ${doc.filename}`);
        const errorContent = `No se pudo descargar el archivo: ${doc.filename}\nURL: ${doc.fileUrl}\nTipo: ${doc.type}\nBuckets probados: ${bucketNames.join(", ")}`;
        zip.file(
          `ERROR_${doc.filename.replace(/[<>:"/\\|?*]/g, "_")}.txt`,
          errorContent
        );
      }
    }

    // Always generate ZIP even if no successful downloads (will contain error files)
    console.log(
      `Successfully downloaded ${successfulDownloads} out of ${petition.documents.length} files`
    );

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    // Create filename for the ZIP
    const companyName = petition.companyName.replace(/[<>:"/\\|?*]/g, "_");
    const zipFilename = `Documentos_${companyName}_${petition.id.slice(-8)}.zip`;

    console.log(
      `Generated ZIP file: ${zipFilename}, size: ${zipBuffer.byteLength} bytes`
    );

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFilename}"`,
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading documents:", error);
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
