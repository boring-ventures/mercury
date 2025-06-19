"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ImportadorRouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function ImportadorRouteGuard({
  children,
  fallbackPath,
}: ImportadorRouteGuardProps) {
  const { profile, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && profile && profile.role !== "IMPORTADOR") {
      // Redirect based on user role
      if (profile.role === "SUPERADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push(fallbackPath || "/dashboard");
      }
    }
  }, [profile, isLoading, router, fallbackPath]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if user doesn't have importador role
  if (profile && profile.role !== "IMPORTADOR") {
    return (
      <div className="flex items-center justify-center min-h-96 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Acceso Restringido
                </h3>
                <p className="text-gray-600 mt-2">
                  No tienes permisos para acceder a esta sección. Solo los
                  importadores pueden ver este contenido.
                </p>
              </div>
              <div className="flex items-center justify-center text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                Si crees que esto es un error, contacta al administrador del
                sistema.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated and has importador role, render children
  return <>{children}</>;
}
