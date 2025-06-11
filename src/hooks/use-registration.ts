import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface RegistrationData {
  companyName: string;
  ruc: string;
  country: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  bankingDetails: string;
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

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRegistration = async (
    data: RegistrationData,
    documents: DocumentFiles
  ): Promise<RegistrationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
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

      // Check for required documents
      const requiredDocs = ["matricula", "nit", "poder", "carnet"];
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

      // Prepare the request payload
      const payload = {
        ...data,
        documents: Object.fromEntries(
          Object.entries(documents).map(([key, file]) => [
            key,
            file
              ? {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                }
              : null,
          ])
        ),
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
    submitRegistration,
    isLoading,
    error,
    clearError,
  };
}
