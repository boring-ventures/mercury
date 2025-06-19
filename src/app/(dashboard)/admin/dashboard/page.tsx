"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRequests } from "@/hooks/use-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface RequestItem {
  id: string;
  code: string;
  status: string;
  amount: number;
  company?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const { data: requestsData } = useRequests({ limit: 5 });

  // Mock data for other metrics (would come from actual APIs)
  const metrics = {
    totalRequests: requestsData?.pagination?.total || 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0,
    activeCompanies: 0,
    pendingQuotations: 0,
  };

  if (requestsData?.requests) {
    metrics.pendingRequests = requestsData.requests.filter(
      (r: RequestItem) => r.status === "PENDING"
    ).length;
    metrics.completedRequests = requestsData.requests.filter(
      (r: RequestItem) => r.status === "COMPLETED"
    ).length;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Solicitudes Totales
              </span>
              <div className="text-3xl font-bold">{metrics.totalRequests}</div>
              <span className="text-xs text-green-600">+12% este mes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                En Revisión
              </span>
              <div className="text-3xl font-bold">
                {metrics.pendingRequests}
              </div>
              <span className="text-xs text-amber-600">8 pendientes hoy</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Completadas
              </span>
              <div className="text-3xl font-bold">
                {metrics.completedRequests}
              </div>
              <span className="text-xs text-green-600">
                +5% vs mes anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Rechazadas
              </span>
              <div className="text-3xl font-bold">15</div>
              <span className="text-xs text-red-600">-2% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
                <TabsTrigger value="contracts">Contratos</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Juan Salinas</div>
                      <div className="text-sm text-muted-foreground">
                        Subió documento
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Ana Cortez</div>
                      <div className="text-sm text-muted-foreground">
                        Aprobó cotización SH-005
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Sistema</div>
                      <div className="text-sm text-muted-foreground">
                        Generó contrato SH-003
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ver informe completo
                </Button>
              </TabsContent>
              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Juan Salinas</div>
                      <div className="text-sm text-muted-foreground">
                        Subió documento
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="quotes" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Ana Cortez</div>
                      <div className="text-sm text-muted-foreground">
                        Aprobó cotización SH-005
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contracts" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Sistema</div>
                      <div className="text-sm text-muted-foreground">
                        Generó contrato SH-003
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      22/05/2025
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accesos directos a funciones comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2" variant="default">
              <FileText className="h-4 w-4" /> Validar Documentos
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <Clock className="h-4 w-4" /> Revisar Solicitudes Pendientes
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <CheckCircle className="h-4 w-4" /> Aprobar Cotizaciones
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <XCircle className="h-4 w-4" /> Gestionar Rechazos
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              Solicitudes que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">SH-001 - ABC Importaciones</p>
                  <p className="text-sm text-muted-foreground">
                    1,000 USDT - 22/05/2025
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Pendiente
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">SH-005 - XYZ Trading</p>
                  <p className="text-sm text-muted-foreground">
                    2,500 USDT - 21/05/2025
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Pendiente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Progreso del Mes</CardTitle>
            <CardDescription>Métricas de rendimiento mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Solicitudes Procesadas
                  </span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Documentos Validados
                  </span>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Contratos Firmados
                  </span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Meta de Ingresos</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
