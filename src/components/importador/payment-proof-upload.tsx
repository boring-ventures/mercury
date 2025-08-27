"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader, FileText } from "lucide-react";

interface PaymentProofUploadProps {
  contractId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentProofUpload({
  contractId,
  onSuccess,
  onError,
}: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.type.includes("pdf") &&
        !selectedFile.type.includes("image/")
      ) {
        onError("Solo se permiten archivos PDF o imágenes");
        return;
      }
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        onError("El archivo no puede ser mayor a 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onError("Por favor seleccione un archivo");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("contractId", contractId);
      formData.append("type", "COMPROBANTE_PAGO");

      const response = await fetch(
        "/api/importador/contracts/upload-payment-proof",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir el archivo");
      }

      const result = await response.json();
      setFile(null);
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir el archivo";
      onError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="text-sm"
          disabled={isUploading}
        />

        {file && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <FileText className="h-4 w-4" />
            Archivo seleccionado: {file.name}
          </div>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full"
        size="sm"
      >
        {isUploading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Subir Comprobante
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Formatos permitidos: PDF, JPG, JPEG, PNG (máximo 5MB)
      </div>
    </div>
  );
}
