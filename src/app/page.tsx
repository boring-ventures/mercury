import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Globe,
  Package,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.svg"
                alt="Mercury Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary">MERCURY</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Gestión de Envíos Internacionales Simplificada
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mercury es la plataforma especializada para importadores que
                necesitan gestionar transferencias internacionales de manera
                segura y eficiente
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/sign-in">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Acceso Importadores
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">
              ¿Cómo funciona Mercury Platform?
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-secondary rounded-full w-12 h-12 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    1. Solicitud y Documentación
                  </h4>
                  <p className="text-muted-foreground">
                    Los importadores crean solicitudes de envío y suben la
                    documentación necesaria para validación
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-secondary rounded-full w-12 h-12 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    2. Cotización y Aprobación
                  </h4>
                  <p className="text-muted-foreground">
                    Nuestro equipo revisa y genera cotizaciones personalizadas
                    en menos de 24 horas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-secondary rounded-full w-12 h-12 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    3. Transferencia Segura
                  </h4>
                  <p className="text-muted-foreground">
                    Procesamos las transferencias internacionales con rapidez y
                    seguridad garantizada
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">
              Beneficios de Mercury Platform
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Seguridad Garantizada</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transacciones protegidas con encriptación de nivel bancario
                    y verificación de identidad
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Gestión Centralizada</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Administre todas sus operaciones de envío desde un único
                    panel de control intuitivo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Cobertura Internacional</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Servicio especializado para transferencias a más de 50
                    países con regulaciones actualizadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Reportes Inteligentes</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Análisis completo de sus operaciones con estadísticas en
                    tiempo real y predicciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-6">
              ¿Listo para optimizar sus envíos internacionales?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Únase a cientos de empresas que ya confían en Mercury Platform
              para sus operaciones internacionales seguras y eficientes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Registrarse como Importador
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">MERCURY PLATFORM</h3>
              <p className="text-sm text-muted-foreground">
                Soluciones avanzadas de gestión de envíos internacionales para
                empresas modernas y eficientes
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Gestión de Envíos</li>
                <li>Documentación Digital</li>
                <li>Cotizaciones Automáticas</li>
                <li>Contratos Digitales</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sobre Nosotros</li>
                <li>Contacto</li>
                <li>Blog</li>
                <li>Soporte</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Términos de Servicio</li>
                <li>Política de Privacidad</li>
                <li>Cumplimiento Normativo</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; 2025 Mercury Platform. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
