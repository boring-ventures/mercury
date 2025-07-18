import { Download } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";

export function MeruFooter() {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Productos</h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/cuenta"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Cuenta Meru
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tarjeta"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Tarjeta VISA
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/inversiones"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Inversiones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/criptomonedas"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Criptomonedas
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Empresa</h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/prensa"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Prensa
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Download */}
              <div>
                <h3 className="text-lg font-semibold mb-6">¡Descarga Meru!</h3>
                <div className="space-y-4">
                  <Link
                    href="/download/ios"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>iOS</span>
                  </Link>
                  <Link
                    href="/download/android"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Android</span>
                  </Link>
                </div>
              </div>

              {/* Brand Partners */}
              <div>
                <h3 className="text-lg font-semibold mb-6">
                  Contamos con el apoyo y alianzas de prestigio mundial
                </h3>
                <div className="text-sm text-gray-400">
                  <p>Infraestructura de API para stablecoins</p>
                  <p className="mt-2">Programático, rápido, claro y seguro</p>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-gray-400">
                  © 2025 Meru. Todos los derechos reservados.
                </div>
                <div className="flex space-x-6 text-sm">
                  <Link
                    href="/terminos"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Términos y Condiciones
                  </Link>
                  <Link
                    href="/privacidad"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacidad
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </footer>
  );
}
