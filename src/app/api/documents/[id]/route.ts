import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const debug = searchParams.get("debug") === "true";

    // If debug mode, test storage configuration
    if (debug) {
      const supabase = createServerComponentClient({ cookies });

      const debugInfo: {
        buckets: Array<{ name: string; public: boolean }>;
        testUpload: string | null;
        testDownload: string | null;
        environment: {
          supabaseUrl: string;
          hasAnonKey: boolean;
          storageBucket: string | undefined;
        };
      } = {
        buckets: [],
        testUpload: null,
        testDownload: null,
        environment: {
          supabaseUrl:
            process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "..." ||
            "undefined",
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
        },
      };

      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        debugInfo.buckets =
          buckets?.map((b) => ({ name: b.name, public: b.public })) || [];
        if (error)
          debugInfo.testDownload = `Bucket list error: ${error.message}`;
      } catch (e) {
        debugInfo.testDownload = `Error: ${e}`;
      }

      return NextResponse.json(debugInfo);
    }

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
        registrationRequest: {
          select: {
            id: true,
            companyName: true,
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

    // Check if it's a demo file - return placeholder
    const isDemoFile =
      document.fileUrl &&
      (document.fileUrl.includes("1750030") ||
        document.fileUrl.includes("IMG_9355") ||
        document.fileUrl.startsWith("/uploads/demo/") ||
        document.fileUrl.includes("breach-report"));

    if (isDemoFile) {
      const isImage = document.mimeType?.includes("image");

      if (isImage) {
        // Redirect to placeholder image
        const placeholderUrl = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
        return NextResponse.redirect(placeholderUrl);
      }

      // For non-images, return JSON info
      return NextResponse.json({
        id: document.id,
        filename: document.filename,
        mimeType: document.mimeType,
        type: document.type,
        size: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
        message: "This is a demo file - actual content not available",
        isDemoFile: true,
      });
    }

    // For real files, try to fetch from Supabase storage
    if (document.fileUrl) {
      // Create Supabase client
      const supabase = createServerComponentClient({ cookies });

      console.log(
        `Processing document: ${document.filename}, fileUrl: ${document.fileUrl}`
      );

      // First, let's check if we can access the bucket at all
      try {
        const { data: buckets, error: bucketError } =
          await supabase.storage.listBuckets();
        console.log(
          "Available buckets:",
          buckets?.map((b) => b.name)
        );
        if (bucketError) {
          console.log("Bucket list error:", bucketError);
        }
      } catch (e) {
        console.log("Error listing buckets:", e);
      }

      // Check if fileUrl is a full URL or a storage path
      if (document.fileUrl.startsWith("http")) {
        // It's already a full URL, redirect to it
        console.log(`Redirecting to full URL: ${document.fileUrl}`);
        return NextResponse.redirect(document.fileUrl);
      }

      // It's a storage path, try to download from Supabase
      const bucketNames = ["nordex", "registration-documents", "documents"];

      for (const bucketName of bucketNames) {
        try {
          console.log(
            `Trying to download from bucket: ${bucketName}, path: ${document.fileUrl}`
          );

          // First check if the file exists
          const { data: listData, error: listError } = await supabase.storage
            .from(bucketName)
            .list(document.fileUrl.split("/").slice(0, -1).join("/") || "", {
              limit: 100,
              search: document.fileUrl.split("/").pop(),
            });

          if (listError) {
            console.log(
              `List error for bucket ${bucketName}:`,
              listError.message
            );
            continue;
          }

          console.log(
            `Files in path for bucket ${bucketName}:`,
            listData?.map((f) => f.name)
          );

          const { data, error } = await supabase.storage
            .from(bucketName)
            .download(document.fileUrl);

          if (!error && data) {
            console.log(`Successfully downloaded from bucket: ${bucketName}`);

            // Convert blob to buffer
            const buffer = await data.arrayBuffer();

            // Return the file with proper headers
            return new NextResponse(buffer, {
              headers: {
                "Content-Type": document.mimeType || "application/octet-stream",
                "Content-Disposition": `inline; filename="${document.filename}"`,
                "Content-Length": buffer.byteLength.toString(),
                "Cache-Control": "public, max-age=3600",
              },
            });
          } else {
            console.log(
              `Failed to download from bucket ${bucketName}:`,
              error?.message
            );
          }
        } catch (bucketError) {
          console.log(`Error with bucket ${bucketName}:`, bucketError);
          continue;
        }
      }

      // If we can't download from any bucket, try to get public URL
      try {
        console.log(`Trying to get public URL for path: ${document.fileUrl}`);
        const {
          data: { publicUrl },
        } = supabase.storage.from("nordex").getPublicUrl(document.fileUrl);

        if (publicUrl) {
          console.log(`Redirecting to public URL: ${publicUrl}`);
          return NextResponse.redirect(publicUrl);
        }
      } catch (urlError) {
        console.log("Error getting public URL:", urlError);
      }

      // Log final failure
      console.log(
        `All attempts failed for document: ${document.filename} with fileUrl: ${document.fileUrl}`
      );
    }

    // If all else fails, return placeholder based on file type
    const isImage = document.mimeType?.includes("image");
    const isPDF = document.mimeType?.includes("pdf");

    if (isImage) {
      // Redirect to a placeholder image service
      const placeholderUrl = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(document.filename)}`;
      return NextResponse.redirect(placeholderUrl);
    }

    if (isPDF) {
      // For PDFs, return a simple text response
      const pdfContent = `Mock PDF content for: ${document.filename}\nDocument ID: ${document.id}\nType: ${document.type}\nCreated: ${document.createdAt}\n\nThis document could not be retrieved from storage.`;

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `inline; filename="${document.filename}.txt"`,
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
      message: "File could not be retrieved from storage",
      fileUrl: document.fileUrl,
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return NextResponse.json(
      { error: "Failed to serve document" },
      { status: 500 }
    );
  }
}
