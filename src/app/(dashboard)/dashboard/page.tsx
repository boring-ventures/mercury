"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && profile) {
      // Redirect based on user role
      if (profile.role === "SUPERADMIN") {
        router.replace("/admin/solicitudes");
        return;
      }

      if (profile.role === "IMPORTADOR") {
        router.replace("/importador/solicitudes");
        return;
      }
    }
  }, [profile, isLoading, router]);

  // Show loading state while determining redirect
  if (
    isLoading ||
    (profile &&
      (profile.role === "SUPERADMIN" || profile.role === "IMPORTADOR"))
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Only shown for users with unknown roles or no profile
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Bienvenido a Mercury. Tu perfil está siendo configurado...
        </p>
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
}
