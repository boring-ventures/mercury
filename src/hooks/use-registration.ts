import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface RegistrationData {
  companyName: string;
  nit: string;
  companyType: string;
  country: string;
  city: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  terms: boolean;
  privacy: boolean;
}

export interface DocumentFiles {
  matricula?: {
    name: string;
    size: number;
    type: string;
    file: File;
  } | null;
  nit?: {
    name: string;
    size: number;
    type: string;
    file: File;
  } | null;
  poder?: {
    name: string;
    size: number;
    type: string;
    file: File;
  } | null;
  carnet?: {
    name: string;
    size: number;
    type: string;
    file: File;
  } | null;
  aduana?: {
    name: string;
    size: number;
    type: string;
    file: File;
  } | null;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  registrationRequest?: {
    id: string;
    companyName: string;
    email: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}

export interface EmailValidationResponse {
  status:
    | "AVAILABLE"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE_ACCOUNT"
    | "UNKNOWN";
  message: string;
  canProceed: boolean;
  requestId?: string;
  previousRequestId?: string;
  rejectionReason?: string;
  submittedAt?: Date;
}

interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  fileUrl: string;
}

// Helper function to upload a single file to Supabase storage
async function uploadFileToStorage(
  file: File,
  bucketName: string,
  filePath: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Create a client for uploading
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error("Storage upload error:", error);
      return { url: null, error: error.message };
    }

    return { url: data.path, error: null }; // Return the path, not public URL
  } catch (error) {
    console.error("Upload error:", error);
    return { url: null, error: (error as Error).message };
  }
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = async (
    email: string
  ): Promise<EmailValidationResponse> => {
    try {
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error validating email");
      }

      return await response.json();
    } catch (error) {
      console.error("Email validation error:", error);
      return {
        status: "UNKNOWN",
        message: "Error validando el email. Por favor inténtelo de nuevo.",
        canProceed: false,
      };
    }
  };

  const submitRegistration = async (
    data: RegistrationData,
    documents: DocumentFiles
  ): Promise<RegistrationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // First validate the email
      const emailValidation = await validateEmail(data.email);

      if (!emailValidation.canProceed) {
        const errorMsg = emailValidation.message;
        setError(errorMsg);

        // Show different toast types based on status
        const toastVariant =
          emailValidation.status === "REJECTED" ? "default" : "destructive";
        toast({
          title:
            emailValidation.status === "PENDING"
              ? "Solicitud Pendiente"
              : emailValidation.status === "ACTIVE_ACCOUNT"
                ? "Cuenta Existente"
                : emailValidation.status === "APPROVED"
                  ? "Solicitud Aprobada"
                  : "Error",
          description: errorMsg,
          variant: toastVariant,
        });
        return { success: false, error: errorMsg };
      }

      // Show special message for rejected resubmissions
      if (emailValidation.status === "REJECTED") {
        toast({
          title: "Reenvío de Solicitud",
          description: emailValidation.rejectionReason
            ? `Motivo de rechazo anterior: ${emailValidation.rejectionReason}`
            : "Enviando nueva solicitud para email previamente rechazado.",
          variant: "default",
        });
      }

      // Validate required fields
      if (!data.terms || !data.privacy) {
        const errorMsg =
          "Debe aceptar los términos y condiciones y la política de privacidad";
        setError(errorMsg);
        toast({
          title: "Términos requeridos",
          description: errorMsg,
          variant: "destructive",
        });
        return { success: false, error: errorMsg };
      }

      // Validate file size (5MB max)
      const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
      for (const [docType, file] of Object.entries(documents)) {
        if (file && file.size > maxFileSize) {
          const errorMsg = `El archivo ${docType} excede el tamaño máximo de 5MB`;
          setError(errorMsg);
          toast({
            title: "Archivo muy grande",
            description: errorMsg,
            variant: "destructive",
          });
          return { success: false, error: errorMsg };
        }
      }

      // Check for required documents based on company type
      const companyType = data.companyType;
      const requiredDocs: string[] = ["nit", "carnet"]; // Always required

      // Add conditional required documents
      if (companyType !== "UNIPERSONAL") {
        requiredDocs.push("matricula", "poder");
      }

      const missingDocs = requiredDocs.filter(
        (doc) => !documents[doc as keyof DocumentFiles]
      );

      if (missingDocs.length > 0) {
        const errorMsg = `Faltan documentos requeridos: ${missingDocs.join(", ")}`;
        setError(errorMsg);
        toast({
          title: "Documentos faltantes",
          description: errorMsg,
          variant: "destructive",
        });
        return { success: false, error: errorMsg };
      }

      // Upload files to Supabase storage first
      const bucketName = "mercury"; // Your bucket name
      const uploadedDocuments: Record<string, UploadedDocument> = {};
      const timestamp = Date.now();
      const sanitizedCompanyName = data.companyName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );

      toast({
        title: "Subiendo documentos...",
        description: "Por favor espere mientras subimos sus archivos.",
      });

      // Upload each document
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          const fileExtension = file.name.split(".").pop() || "";
          const fileName = `registration/${sanitizedCompanyName}_${timestamp}_${docType}.${fileExtension}`;

          const { url, error: uploadError } = await uploadFileToStorage(
            file.file,
            bucketName,
            fileName
          );

          if (uploadError || !url) {
            const errorMsg = `Error subiendo ${docType}: ${uploadError || "URL de archivo inválida"}`;
            setError(errorMsg);
            toast({
              title: "Error de subida",
              description: errorMsg,
              variant: "destructive",
            });
            return { success: false, error: errorMsg };
          }

          uploadedDocuments[docType] = {
            name: file.name,
            size: file.size,
            type: file.type,
            fileUrl: url, // url is now guaranteed to be string (not null)
          };
        }
      }

      // Prepare the request payload with uploaded file URLs
      const payload = {
        ...data,
        documents: uploadedDocuments,
      };

      // Submit the registration request
      const response = await fetch("/api/registration-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || "Error al enviar la solicitud";
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return { success: false, error: errorMsg };
      }

      // Success
      toast({
        title: "¡Solicitud enviada!",
        description:
          result.message ||
          "Su solicitud ha sido enviada correctamente. Le contactaremos pronto.",
      });

      return {
        success: true,
        message: result.message,
        registrationRequest: result.registrationRequest,
      };
    } catch (error) {
      const errorMsg = "Error de conexión. Por favor inténtelo de nuevo.";
      setError(errorMsg);
      toast({
        title: "Error de conexión",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("Registration error:", error);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    validateEmail,
    submitRegistration,
    isLoading,
    error,
    clearError,
  };
}
