import { Shield, DollarSign, Smartphone } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function BetterBankSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Mejor que tu banco
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Estás en el lugar correcto para manejar todo tu dinero en
                dólares o euros y decirle adiós a la inflación. Te damos la
                bienvenida a la revolución de las finanzas globales
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            <BlurFade delay={0.1}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tu dinero está 100% seguro
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tus fondos están protegidos y asegurados en todo momento
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Ahorra, paga y envía dólares sin comisión
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Realiza todas tus operaciones sin cargos adicionales
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.3}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tu cuenta personal y la de tu negocio en el mismo lugar
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gestiona todas tus cuentas desde una sola aplicación
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
