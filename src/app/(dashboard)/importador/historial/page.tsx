"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Package,
  Building2,
  DollarSign,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  Eye,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

// Activity type badge
function ActivityTypeBadge({ type }: { type: string }) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "REQUEST_CREATED":
        return {
          label: "Solicitud Creada",
          color: "bg-blue-100 text-blue-800",
          icon: Package,
        };
      case "QUOTATION_RECEIVED":
        return {
          label: "Cotización Recibida",
          color: "bg-green-100 text-green-800",
          icon: FileText,
        };
      case "QUOTATION_ACCEPTED":
        return {
          label: "Cotización Aceptada",
          color: "bg-green-100 text-green-800",
          icon: FileText,
        };
      case "QUOTATION_REJECTED":
        return {
          label: "Cotización Rechazada",
          color: "bg-red-100 text-red-800",
          icon: FileText,
        };
      case "CONTRACT_CREATED":
        return {
          label: "Contrato Creado",
          color: "bg-purple-100 text-purple-800",
          icon: Building2,
        };
      case "PAYMENT_UPLOADED":
        return {
          label: "Pago Subido",
          color: "bg-yellow-100 text-yellow-800",
          icon: DollarSign,
        };
      case "PAYMENT_APPROVED":
        return {
          label: "Pago Aprobado",
          color: "bg-green-100 text-green-800",
          icon: DollarSign,
        };
      case "PAYMENT_REJECTED":
        return {
          label: "Pago Rechazado",
          color: "bg-red-100 text-red-800",
          icon: DollarSign,
        };
      case "PROVIDER_PAYMENT_COMPLETED":
        return {
          label: "Pago Proveedor Completado",
          color: "bg-purple-100 text-purple-800",
          icon: DollarSign,
        };
      default:
        return {
          label: type,
          color: "bg-gray-100 text-gray-800",
          icon: TrendingUp,
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;
  return (
    <Badge className={config.color}>
      <IconComponent className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export default function ImporterHistory() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();

  // Load activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/importador/history");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        throw new Error("Failed to load activities");
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las actividades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter activities based on search and filters
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    const matchesDate =
      !dateFilter || activity.createdAt.startsWith(dateFilter);

    return matchesSearch && matchesType && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Historial</h1>
        <p className="text-gray-600">
          Revisa el historial completo de todas tus actividades en la plataforma
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="REQUEST_CREATED">Solicitud Creada</option>
              <option value="QUOTATION_RECEIVED">Cotización Recibida</option>
              <option value="QUOTATION_ACCEPTED">Cotización Aceptada</option>
              <option value="QUOTATION_REJECTED">Cotización Rechazada</option>
              <option value="CONTRACT_CREATED">Contrato Creado</option>
              <option value="PAYMENT_UPLOADED">Pago Subido</option>
              <option value="PAYMENT_APPROVED">Pago Aprobado</option>
              <option value="PAYMENT_REJECTED">Pago Rechazado</option>
              <option value="PROVIDER_PAYMENT_COMPLETED">
                Pago Proveedor Completado
              </option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("");
                setDateFilter("");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activities.length === 0
                ? "No tienes actividades aún"
                : "No se encontraron actividades"}
            </h3>
            <p className="text-gray-500 text-center">
              {activities.length === 0
                ? "Las actividades aparecerán aquí una vez que comiences a usar la plataforma."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {activity.title || "Actividad"}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <ActivityTypeBadge type={activity.type} />
                      <span className="text-sm text-gray-600">
                        {new Date(activity.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.relatedDocument && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Handle document preview/download
                          toast({
                            title: "Documento",
                            description:
                              "Funcionalidad de documento en desarrollo",
                          });
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Documento
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Activity Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Detalles de la Actividad
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <ActivityTypeBadge type={activity.type} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hora:</span>
                        <span className="font-medium">
                          {new Date(activity.createdAt).toLocaleTimeString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                      {activity.metadata && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Referencia:</span>
                          <span className="font-medium">
                            {activity.metadata.reference || "N/A"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activity Description */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Descripción
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {activity.description || "Sin descripción disponible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Information */}
                {activity.metadata && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Información Relacionada
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activity.metadata.contractCode && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">
                            Contrato
                          </p>
                          <p className="text-sm text-blue-700">
                            {activity.metadata.contractCode}
                          </p>
                        </div>
                      )}
                      {activity.metadata.quotationCode && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-900">
                            Cotización
                          </p>
                          <p className="text-sm text-green-700">
                            {activity.metadata.quotationCode}
                          </p>
                        </div>
                      )}
                      {activity.metadata.requestCode && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-purple-900">
                            Solicitud
                          </p>
                          <p className="text-sm text-purple-700">
                            {activity.metadata.requestCode}
                          </p>
                        </div>
                      )}
                      {activity.metadata.amount && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-yellow-900">
                            Monto
                          </p>
                          <p className="text-sm text-yellow-700">
                            {formatCurrency(
                              activity.metadata.amount,
                              activity.metadata.currency || "USD"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
