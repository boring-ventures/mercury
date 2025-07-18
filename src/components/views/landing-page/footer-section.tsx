import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";
import {
  Building,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-secondary/20 text-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <ShineBorder className="p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Building className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    NORDEX
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Facilitación Comercial Internacional - Conectando empresas
                  bolivianas con el mundo global.
                </p>
              </ShineBorder>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Av. Principal, Zona Central, La Paz - Bolivia
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    +591 2 XXX-XXXX
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    WhatsApp: +591 7XXXX-XXXX
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    info@nordex.bo
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Horarios: Lunes a Viernes 8:00 - 18:00
                </div>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sobre-nosotros"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">
                Servicios
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/servicios/facilitacion-comercial"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Facilitación Comercial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios/tramites-internacionales"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Trámites Internacionales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios/consultoria"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Consultoría Comercial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios/documentacion"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Gestión Documental
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios/seguimiento"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Seguimiento de Operaciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Redes */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">
                Legal
              </h4>
              <ul className="space-y-3 mb-8">
                <li>
                  <Link
                    href="/terminos"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacidad"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cumplimiento"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Cumplimiento Normativo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificaciones"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Certificaciones
                  </Link>
                </li>
              </ul>

              <h5 className="text-md font-medium mb-4 text-foreground">
                Síguenos
              </h5>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/company/nordex-bolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href="https://facebook.com/nordexbolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href="https://twitter.com/nordexbolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <TwitterIcon size={18} />
                </a>
                <a
                  href="https://instagram.com/nordexbolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="border-t border-border pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} NORDEX - Facilitación
                Comercial Internacional. Todos los derechos reservados.
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Servicios Operacionales</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Bolivia - Comercio Global
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </footer>
  );
}
