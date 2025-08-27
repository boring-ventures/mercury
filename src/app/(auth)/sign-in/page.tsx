import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import AuthLayout from "@/components/auth/auth-layout";
import { UserAuthForm } from "@/components/auth/sign-in/components/user-auth-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Accede a tu cuenta de NORDEX",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <Card className="p-8 shadow-lg border-0 bg-card">
        <div className="flex flex-col space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>
        </div>

        <div className="mt-6">
          <UserAuthForm />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Al iniciar sesión, aceptas nuestros{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  );
}
