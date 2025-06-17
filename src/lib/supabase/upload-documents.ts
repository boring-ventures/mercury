import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "mercury";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadDocument(
  file: File,
  folderPath: string = "documents"
) {
  // Validate file before upload
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a PDF, image, or document file."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "File size too large. Please upload a file smaller than 5MB."
    );
  }

  try {
    const supabase = createClientComponentClient();

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "";
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${folderPath}/${timestamp}-${cleanFilename}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

    return {
      path: data.path,
      publicUrl: publicUrl,
      filename: filename,
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

export async function deleteDocument(filePath: string) {
  try {
    const supabase = createClientComponentClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Storage delete error:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
