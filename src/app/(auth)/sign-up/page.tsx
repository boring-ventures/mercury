"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  Building2,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import AuthLayout from "@/components/auth/auth-layout";
import { useRegistration } from "@/hooks/use-registration";

// Type for uploaded files
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
  previewUrl?: string;
}

// Type for submitted data
interface SubmittedData {
  formData: z.infer<typeof formSchema>;
  documents: {
    matricula: UploadedFile | null;
    nit: UploadedFile | null;
    aduana: UploadedFile | null;
    poder: UploadedFile | null;
    carnet: UploadedFile | null;
  };
  response?: {
    id: string;
    companyName: string;
    email: string;
    status: string;
    createdAt: string;
  };
}

// Schema de validación basado en el modelo RegistrationRequest
const formSchema = z.object({
  // Información de la Empresa
  companyName: z.string().min(3, {
    message: "El nombre de la empresa debe tener al menos 3 caracteres.",
  }),
  ruc: z.string().min(5, {
    message: "El RUC debe tener al menos 5 caracteres.",
  }),
  country: z.string({
    required_error: "Por favor seleccione un país.",
  }),
  activity: z.string({
    required_error: "Por favor seleccione una actividad económica.",
  }),

  // Información de Contacto
  contactName: z.string().min(3, {
    message: "El nombre de contacto debe tener al menos 3 caracteres.",
  }),
  contactPosition: z.string().min(3, {
    message: "El cargo debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),
  phone: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 caracteres.",
  }),

  // Información bancaria
  bankingDetails: z.string().min(10, {
    message: "Los detalles bancarios deben tener al menos 10 caracteres.",
  }),

  // Términos y condiciones
  terms: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar los términos y condiciones.",
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar la política de privacidad.",
  }),
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isValidating, setIsValidating] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(
    null
  );
  const [uploadedFiles, setUploadedFiles] = useState<{
    matricula: UploadedFile | null;
    nit: UploadedFile | null;
    aduana: UploadedFile | null;
    poder: UploadedFile | null;
    carnet: UploadedFile | null;
  }>({
    matricula: null,
    nit: null,
    aduana: null,
    poder: null,
    carnet: null,
  });

  // Use registration hook
  const { submitRegistration, isLoading, clearError } = useRegistration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation but don't show errors yet
    defaultValues: {
      companyName: "",
      ruc: "",
      country: "",
      activity: "",
      contactName: "",
      contactPosition: "",
      email: "",
      phone: "",
      bankingDetails: "",
      terms: false,
      privacy: false,
    },
  });

  // Cleanup file URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(uploadedFiles).forEach((file) => {
        if (file?.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [uploadedFiles]);

  // Define step field groups for validation
  const stepFields = {
    1: ["companyName", "ruc", "country", "activity"] as const,
    2: [
      "contactName",
      "contactPosition",
      "email",
      "phone",
      "bankingDetails",
    ] as const,
    3: ["terms", "privacy"] as const,
  };

  // Validate current step
  const validateCurrentStep = async (currentStep: number) => {
    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields];

    if (!fieldsToValidate) return true;

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setShowErrors(true);

      // Final validation
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          title: "Formulario incompleto",
          description: "Por favor revise los campos marcados en rojo.",
          variant: "destructive",
        });
        return;
      }

      // Clear any previous errors
      clearError();

      // Prepare documents object for the hook
      const documentsForSubmission = Object.fromEntries(
        Object.entries(uploadedFiles).map(([key, file]) => [
          key,
          file
            ? {
                name: file.name,
                size: file.size,
                type: file.type,
                file: file.file,
              }
            : null,
        ])
      );

      // Submit using the hook
      const result = await submitRegistration(values, documentsForSubmission);

      if (result.success) {
        // Store submitted data and go to success step
        setSubmittedData({
          formData: values,
          documents: uploadedFiles,
          response: result.registrationRequest,
        });
        setStep(4);
        setProgress(100);
        setShowErrors(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Error inesperado. Por favor inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  }

  // Manejar la carga de archivos
  const handleFileUpload = (
    fileType: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles({
        ...uploadedFiles,
        [fileType]: {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        },
      });
    }
  };

  // Avanzar al siguiente paso con validación
  const nextStep = async () => {
    setIsValidating(true);
    setShowErrors(true);

    const isStepValid = await validateCurrentStep(step);

    if (isStepValid) {
      const newStep = step + 1;
      setStep(newStep);

      // Update progress based on step
      if (newStep === 2) setProgress(50);
      else if (newStep === 3) setProgress(75);
      else if (newStep === 4) setProgress(100);

      setShowErrors(false); // Reset errors for next step
    } else {
      toast({
        title: "Campos requeridos",
        description:
          "Por favor complete todos los campos obligatorios antes de continuar.",
        variant: "destructive",
      });
    }

    setIsValidating(false);
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    setProgress(newStep === 1 ? 25 : newStep === 2 ? 50 : 100);
    setShowErrors(false); // Reset errors when going back
  };

  // Componente personalizado para subida de archivos
  const CustomFileUpload = ({
    fileType,
    accept,
    label,
    description,
  }: {
    fileType: string;
    accept: string;
    label: string;
    description: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadedFile = uploadedFiles[fileType as keyof typeof uploadedFiles];

    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <div>
              <h3 className="font-medium">{label}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded">
            {fileType === "aduana" ? "Opcional" : "Requerido"}
          </div>
        </div>

        <div className="mt-2">
          {uploadedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted p-2 rounded">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm truncate max-w-[200px]">
                    {uploadedFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setUploadedFiles({
                      ...uploadedFiles,
                      [fileType]: null,
                    })
                  }
                >
                  Cambiar
                </Button>
              </div>

              {/* Vista previa del archivo */}
              {uploadedFile.previewUrl && (
                <div className="border rounded-lg p-2 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">
                    Vista previa:
                  </p>
                  <Image
                    src={uploadedFile.previewUrl}
                    alt="Vista previa"
                    width={200}
                    height={100}
                    className="max-w-full h-32 object-contain mx-auto rounded"
                  />
                </div>
              )}

              {uploadedFile.type === "application/pdf" && (
                <div className="border rounded-lg p-4 bg-muted/30 text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Archivo PDF cargado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) => handleFileUpload(fileType, e)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 border-dashed border-2 hover:border-primary/50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Formato: PDF, JPG, PNG (máx. 5MB)
          </p>
        </div>
      </div>
    );
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Registro de Importador
          </h1>
          <p className="text-muted-foreground">
            Complete el formulario para solicitar su cuenta de importador
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">
                Información Empresa
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">
                Datos de Contacto
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Documentación</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Confirmación</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border-0 shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">
                          Información de la Empresa
                        </h2>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  Nombre de la Empresa
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nombre legal de la empresa"
                                    className="h-11"
                                    {...field}
                                  />
                                </FormControl>
                                {showErrors && <FormMessage />}
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="ruc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                RUC
                                <span className="text-destructive ml-1">*</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="w-4 h-4 ml-1 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="w-60">
                                        Número de identificación tributaria de
                                        su empresa
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Número de identificación tributaria"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                País
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar país" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bolivia">
                                    <div className="flex items-center">
                                      <span className="mr-2">🇧🇴</span>
                                      <span>Bolivia</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="peru">
                                    <div className="flex items-center">
                                      <span className="mr-2">🇵🇪</span>
                                      <span>Perú</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="colombia">
                                    <div className="flex items-center">
                                      <span className="mr-2">🇨🇴</span>
                                      <span>Colombia</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="ecuador">
                                    <div className="flex items-center">
                                      <span className="mr-2">🇪🇨</span>
                                      <span>Ecuador</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="activity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  Actividad Económica
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Seleccionar actividad económica" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="IMPORTACION_GENERAL">
                                      Importación General
                                    </SelectItem>
                                    <SelectItem value="IMPORTACION_ALIMENTOS">
                                      Importación de Alimentos
                                    </SelectItem>
                                    <SelectItem value="IMPORTACION_TEXTILES">
                                      Importación de Textiles
                                    </SelectItem>
                                    <SelectItem value="IMPORTACION_MAQUINARIA">
                                      Importación de Maquinaria
                                    </SelectItem>
                                    <SelectItem value="IMPORTACION_ELECTRONICA">
                                      Importación de Electrónicos
                                    </SelectItem>
                                    <SelectItem value="IMPORTACION_VEHICULOS">
                                      Importación de Vehículos
                                    </SelectItem>
                                    <SelectItem value="COMERCIO_MAYORISTA">
                                      Comercio Mayorista
                                    </SelectItem>
                                    <SelectItem value="COMERCIO_MINORISTA">
                                      Comercio Minorista
                                    </SelectItem>
                                    <SelectItem value="OTROS">Otros</SelectItem>
                                  </SelectContent>
                                </Select>
                                {showErrors && <FormMessage />}
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">
                          Información de Contacto
                        </h2>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Nombre de Contacto
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre completo del contacto"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPosition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Cargo
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Gerente General, Director, etc."
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Email Corporativo
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="email@empresa.com"
                                    className="pl-10 h-11"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Teléfono
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="+591 999 888 777"
                                    className="pl-10 h-11"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              {showErrors && <FormMessage />}
                            </FormItem>
                          )}
                        />

                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="bankingDetails"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  Detalles Bancarios
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Banco, número de cuenta, titular..."
                                    className="h-11"
                                    {...field}
                                  />
                                </FormControl>
                                {showErrors && <FormMessage />}
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">
                          Documentos Requeridos
                        </h2>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 px-6">
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg mb-6">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Todos los documentos deben estar en formato PDF,
                              JPG o PNG y no exceder los 5MB. Los documentos
                              serán revisados por nuestro equipo antes de
                              aprobar su cuenta.
                            </p>
                          </div>
                        </div>

                        <Tabs defaultValue="required" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="required">
                              Documentos Obligatorios
                            </TabsTrigger>
                            <TabsTrigger value="optional">
                              Documentos Opcionales
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="required" className="space-y-4">
                            <div className="grid grid-cols-1 gap-6">
                              {/* Matrícula de Comercio */}
                              <CustomFileUpload
                                fileType="matricula"
                                accept=".pdf,.jpg,.jpeg,.png"
                                label="Matrícula de Comercio"
                                description="Documento oficial de registro comercial"
                              />

                              {/* Documento NIT */}
                              <CustomFileUpload
                                fileType="nit"
                                accept=".pdf,.jpg,.jpeg,.png"
                                label="Documento NIT"
                                description="Número de Identificación Tributaria"
                              />

                              {/* Poder de Representante Legal */}
                              <CustomFileUpload
                                fileType="poder"
                                accept=".pdf,.jpg,.jpeg,.png"
                                label="Poder de Representante Legal"
                                description="Documento que acredita al representante legal"
                              />

                              {/* Carnet de Identidad del RL */}
                              <CustomFileUpload
                                fileType="carnet"
                                accept=".pdf,.jpg,.jpeg,.png"
                                label="Carnet de Identidad del Representante Legal"
                                description="Documento de identidad del representante"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="optional">
                            <CustomFileUpload
                              fileType="aduana"
                              accept=".pdf,.jpg,.jpeg,.png"
                              label="Certificado de Aduana"
                              description="Certificado de operador económico autorizado"
                            />
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-4 pt-4">
                          <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm">
                                    Acepto los{" "}
                                    <Link
                                      href="/terms"
                                      className="text-primary hover:underline"
                                    >
                                      términos y condiciones
                                    </Link>{" "}
                                    de Mercury Platform
                                  </FormLabel>
                                  {showErrors && <FormMessage />}
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="privacy"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm">
                                    Acepto la{" "}
                                    <Link
                                      href="/privacy"
                                      className="text-primary hover:underline"
                                    >
                                      política de privacidad
                                    </Link>{" "}
                                    de Mercury Platform
                                  </FormLabel>
                                  {showErrors && <FormMessage />}
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}

                {step === 4 && submittedData && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">
                          ¡Solicitud Enviada Exitosamente!
                        </h2>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 px-6">
                      <div className="space-y-6">
                        {/* Success Message */}
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Solicitud Recibida
                            </h3>
                            <p className="text-muted-foreground">
                              Hemos recibido su solicitud de registro como
                              importador. Nuestro equipo la revisará en las
                              próximas 24-48 horas.
                            </p>
                          </div>
                        </div>

                        {/* Submitted Details */}
                        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                          <h4 className="font-medium text-foreground">
                            Detalles de la Solicitud:
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Empresa:
                              </span>
                              <p className="font-medium">
                                {submittedData.formData.companyName}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                RUC:
                              </span>
                              <p className="font-medium">
                                {submittedData.formData.ruc}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                País:
                              </span>
                              <p className="font-medium">
                                {submittedData.formData.country}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Email:
                              </span>
                              <p className="font-medium">
                                {submittedData.formData.email}
                              </p>
                            </div>
                          </div>

                          {submittedData.response && (
                            <div className="pt-2 border-t border-border/50">
                              <span className="font-medium text-muted-foreground">
                                ID de Solicitud:
                              </span>
                              <p className="font-mono text-sm bg-background px-2 py-1 rounded border inline-block ml-2">
                                {submittedData.response.id}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">
                            Próximos Pasos:
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">
                                  1
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  Revisión de Documentos
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Nuestro equipo revisará los documentos
                                  enviados y validará la información.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">
                                  2
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  Notificación por Email
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Le enviaremos un email a{" "}
                                  <strong>
                                    {submittedData.formData.email}
                                  </strong>{" "}
                                  con el resultado de la revisión.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">
                                  3
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  Creación de Cuenta
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Una vez aprobada, crearemos su cuenta y le
                                  enviaremos las credenciales de acceso.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-primary">
                                ¿Necesita ayuda?
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Si tiene preguntas sobre su solicitud, puede
                                contactarnos en{" "}
                                <a
                                  href="mailto:soporte@mercury.com"
                                  className="text-primary hover:underline font-medium"
                                >
                                  soporte@mercury.com
                                </a>{" "}
                                o incluya su ID de solicitud en la consulta.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardFooter className="flex justify-between p-6 bg-muted/30">
                {step > 1 && step < 4 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center"
                    disabled={isValidating || isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center"
                    disabled={isValidating || isLoading}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                ) : step === 3 ? (
                  <Button
                    type="submit"
                    className="flex items-center"
                    disabled={isLoading || isValidating}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-1" />
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                ) : step === 4 ? (
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Reset form for new submission
                        form.reset();
                        setStep(1);
                        setProgress(25);
                        setShowErrors(false);
                        setSubmittedData(null);
                        setUploadedFiles({
                          matricula: null,
                          nit: null,
                          aduana: null,
                          poder: null,
                          carnet: null,
                        });
                      }}
                      className="flex items-center"
                    >
                      Nueva Solicitud
                    </Button>
                    <Button
                      type="button"
                      onClick={() => (window.location.href = "/sign-in")}
                      className="flex items-center"
                    >
                      Ir a Iniciar Sesión
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : null}
              </CardFooter>
            </Card>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            ¿Necesitas ayuda? Contáctanos a{" "}
            <a
              href="mailto:soporte@mercury.com"
              className="text-primary hover:underline"
            >
              soporte@mercury.com
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
