"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Por favor ingresa tu email" })
    .email({ message: "Dirección de email inválida" }),
});

type FormValues = z.infer<typeof formSchema>;

type MagicLinkFormProps = React.HTMLAttributes<HTMLDivElement>;

export function MagicLinkForm({ className, ...props }: MagicLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);

      // Get the site URL from the environment or current location
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      console.log("Sending magic link to:", data.email);
      console.log("Site URL:", siteUrl);
      console.log("Redirect URL:", `${siteUrl}/auth/callback`);

      // Send magic link email
      const { error, data: authData } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      console.log("Supabase auth response:", { error, authData });

      if (error) {
        console.error("Magic link error details:", error);
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: "Revisa tu email",
        description: "Te hemos enviado un enlace mágico para iniciar sesión.",
      });
    } catch (error) {
      console.error("Magic link error:", error);
      toast({
        title: "Error",
        description: "Algo salió mal. Por favor inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {isSuccess ? (
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Revisa tu email</h3>
          <p className="text-sm text-muted-foreground">
            Hemos enviado un enlace mágico a tu email. Por favor revisa tu
            bandeja de entrada y haz clic en el enlace para iniciar sesión.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
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
            <Button
              type="submit"
              className="w-full h-11 mt-4"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Enviando..." : "Enviar Enlace Mágico"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
