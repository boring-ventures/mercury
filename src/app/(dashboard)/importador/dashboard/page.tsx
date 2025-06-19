"use client";

import Link from "next/link"
import ImportadorLayout from "@/components/importador-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell, CheckCircle2, Clock, DollarSign, FileText, Package } from "lucide-react"

export default function ImportadorDashboard() {
  return (
    <ImportadorLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
          <Link href="/importador/notificaciones">
            <Bell className="h-4 w-4" /> 3 notificaciones
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Package className="h-8 w-8 mb-2 text-primary" />
              <span className="text-2xl font-bold">12</span>
              <span className="text-sm text-muted-foreground">Solicitudes activas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-8 w-8 mb-2 text-amber-500" />
              <span className="text-2xl font-bold">3</span>
              <span className="text-sm text-muted-foreground">Pendientes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
              <span className="text-2xl font-bold">9</span>
              <span className="text-sm text-muted-foreground">Completadas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <DollarSign className="h-8 w-8 mb-2 text-emerald-500" />
              <span className="text-2xl font-bold">45,250</span>
              <span className="text-sm text-muted-foreground">USDT procesados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-8 w-8 mb-2 text-blue-500" />
              <span className="text-2xl font-bold">24</span>
              <span className="text-sm text-muted-foreground">Documentos subidos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Bell className="h-8 w-8 mb-2 text-red-500" />
              <span className="text-2xl font-bold">3</span>
              <span className="text-sm text-muted-foreground">Notificaciones nuevas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Notificaciones</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/importador/notificaciones">Ver todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-md flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Nueva cotización disponible</p>
                <p className="text-sm text-muted-foreground">SH-001 - Hace 2 horas</p>
              </div>
            </div>
            <div className="p-3 border rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Documento rechazado</p>
                <p className="text-sm text-muted-foreground">SH-004 - Hace 5 horas</p>
              </div>
            </div>
            <div className="p-3 border rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Contrato firmado</p>
                <p className="text-sm text-muted-foreground">SH-002 - Hace 1 día</p>
              </div>
            </div>
            <div className="p-3 border rounded-md flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Nuevo documento disponible</p>
                <p className="text-sm text-muted-foreground">SH-001 - Contrato listo para firma - Hace 30 min</p>
              </div>
            </div>
            <div className="p-3 border rounded-md flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Pago verificado</p>
                <p className="text-sm text-muted-foreground">SH-002 - Pago al proveedor completado - Hace 3 horas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ImportadorLayout>
  )
}
