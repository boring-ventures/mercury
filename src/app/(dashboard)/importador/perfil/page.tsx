"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Edit,
  Save,
  X,
  Shield,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ImporterProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFormData({
          firstName: data.profile.firstName || "",
          lastName: data.profile.lastName || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          position: data.profile.position || "",
          department: data.profile.department || "",
        });
      } else {
        throw new Error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setIsEditing(false);
        toast({
          title: "Éxito",
          description: "Perfil actualizado exitosamente",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      position: profile.position || "",
      department: profile.department || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No se pudo cargar el perfil</p>
          <Button onClick={loadProfile} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">
          Gestiona tu información personal y de la empresa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">
                    {profile.firstName || "No especificado"}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">
                    {profile.lastName || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">
                  {profile.email || "No especificado"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">
                  {profile.phone || "No especificado"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Cargo</Label>
                {isEditing ? (
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">
                    {profile.position || "No especificado"}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="department">Departamento</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">
                    {profile.department || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Empresa</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.company?.name || "No especificado"}
              </p>
            </div>

            <div>
              <Label>País</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.company?.country || "No especificado"}
              </p>
            </div>

            <div>
              <Label>Ciudad</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.company?.city || "No especificado"}
              </p>
            </div>

            <div>
              <Label>Email de la Empresa</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.company?.email || "No especificado"}
              </p>
            </div>

            <div>
              <Label>Teléfono de la Empresa</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.company?.phone || "No especificado"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Información de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rol</Label>
              <div className="mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  {profile.role === "IMPORTADOR" ? "Importador" : profile.role}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Estado</Label>
              <div className="mt-1">
                <Badge
                  className={
                    profile.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {profile.status === "ACTIVE" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Fecha de Registro</Label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(profile.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <Label>Última Actualización</Label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(profile.updatedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estadísticas de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Solicitudes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {profile._count?.requests || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900">Contratos</p>
                <p className="text-2xl font-bold text-green-600">
                  {profile._count?.contracts || 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  Cotizaciones
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {profile._count?.quotations || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">
                  Documentos
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {profile._count?.documents || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
