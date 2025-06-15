"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/utils/password-input";
import { PasswordStrengthIndicator } from "@/components/utils/password-strength-indicator";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { uploadAvatar } from "@/lib/supabase/upload-avatar";
import { useRouter } from "next/navigation";

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue("password", e.target.value);
  };

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);

      // Send plain password to Supabase Auth - it handles password hashing internally
      const signUpResult = await signUp(data.email, data.password);

      if (!signUpResult.success || signUpResult.error) {
        throw signUpResult.error || new Error("Failed to sign up");
      }

      const { user, session, confirmEmail } = signUpResult;

      if (user) {
        let avatarUrl = null;
        if (avatarFile) {
          try {
            avatarUrl = await uploadAvatar(avatarFile, user.id);
          } catch (error) {
            console.error("Avatar upload failed:", error);
            toast({
              title: "Advertencia",
              description:
                "No se pudo subir la imagen de perfil, puedes añadirla después desde tu perfil.",
              variant: "default",
            });
          }
        }

        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            avatarUrl,
          }),
        });

        let result: Record<string, unknown>;
        let text = "";

        try {
          text = await response.text();
          result = text ? JSON.parse(text) : {};

          if (!response.ok) {
            throw new Error(
              typeof result.error === "string"
                ? result.error
                : `Server responded with status ${response.status}`
            );
          }
        } catch (parseError) {
          console.error(
            "Response parsing error:",
            parseError,
            "Response text:",
            text
          );
          throw new Error("Invalid server response");
        }

        toast({
          title: "Cuenta creada",
          description:
            "Tu cuenta ha sido creada correctamente. Por favor verifica tu email para continuar.",
        });

        // Redirect to verification page instead of dashboard if email confirmation is required
        if (confirmEmail) {
          router.push("/verify-email");
        } else if (session) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Algo salió mal. Por favor inténtalo de nuevo.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-20 w-20">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Vista previa del avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/25">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full max-w-xs h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Imagen de perfil (opcional)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nombre@ejemplo.com"
                    type="email"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    className="h-11"
                    {...field}
                    onChange={handlePasswordChange}
                  />
                </FormControl>
                <PasswordStrengthIndicator password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full h-11 mt-6" disabled={isLoading} size="lg">
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
