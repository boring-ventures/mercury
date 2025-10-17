import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("=== ADMIN DOCUMENT UPLOAD API START ===");

    // Authenticate admin user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      console.log("Profile not found for user:", user.id);
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    if (profile.role !== "SUPERADMIN") {
      console.log("Unauthorized role:", profile.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    console.log("Authentication successful");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contractId = formData.get("contractId") as string;
    const paymentId = formData.get("paymentId") as string;
    const type = formData.get("type") as string;
    const notes = formData.get("notes") as string;

    if (!file || !contractId || !type) {
      return NextResponse.json(
        { error: "Archivo, contractId y type son requeridos" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo PDF, imágenes y documentos Word." },
        { status: 400 }
      );
    }

    // Validate file size (30MB max)
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 30MB." },
        { status: 400 }
      );
    }

    // Get contract info
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: true,
      },
    });

    if (!contract) {
      console.log("Contract not found:", contractId);
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    console.log("Contract found:", contract.code);

    // Upload file to Supabase Storage
    console.log("Uploading file to Supabase...");
    const supabaseStorage = createRouteHandlerClient({ cookies });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${type.toLowerCase()}-${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } =
      await supabaseStorage.storage
        .from("nordex")
        .upload(`documents/${filename}`, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return NextResponse.json(
        { error: `Error al subir el archivo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabaseStorage.storage
      .from("nordex")
      .getPublicUrl(`documents/${filename}`);

    const fileUrl = urlData.publicUrl;
    console.log("File uploaded successfully:", fileUrl);

    // Create document record
    const document = await prisma.document.create({
      data: {
        filename,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        type: type,
        status: "APPROVED",
        contractId: contractId,
        paymentId: paymentId || undefined,
        companyId: contract.companyId,
        documentInfo: notes || `Documento subido por ${profile.firstName} ${profile.lastName} el ${new Date().toLocaleDateString("es-ES")}`,
      },
    });

    console.log("Document record created:", document.id);

    console.log("=== ADMIN DOCUMENT UPLOAD API COMPLETED SUCCESSFULLY ===");

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        fileUrl: document.fileUrl,
      },
      message: "Documento subido exitosamente.",
    });
  } catch (error) {
    console.error("=== ADMIN DOCUMENT UPLOAD API ERROR ===");
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Error al subir el documento",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
