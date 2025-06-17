import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filename = path.join("/");

    // In a real implementation, you would:
    // 1. Check if the file exists in your storage
    // 2. Serve the actual file
    // 3. Handle authentication and permissions

    // For now, we'll redirect to a placeholder image
    // since the original files don't exist in this demo

    // Extract the original filename for the placeholder
    const originalFilename = filename.split("-").pop() || "document";
    const isImage = filename
      .toLowerCase()
      .match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);

    if (isImage) {
      // Redirect to placeholder image
      const placeholderUrl = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(originalFilename)}`;
      return NextResponse.redirect(placeholderUrl);
    }

    // For non-images, return a 404 with helpful message
    return NextResponse.json(
      {
        error: "File not found",
        message:
          "This is a demo environment. Uploaded files are not persisted.",
        filename,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error serving upload:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
