import { CreditCard, Lock, Gift } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function VisaCardSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Tarjeta Visa Internacional
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tu tarjeta Visa para compras en línea y físicas en todo el mundo
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            <BlurFade delay={0.1}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tarjeta física y virtual
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Usa tu tarjeta física o crea tarjetas virtuales para compras
                    en línea
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Control total
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Congela y descongela tu tarjeta, establece límites y recibe
                    notificaciones
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.3}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-900 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <Gift className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Beneficios exclusivos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Descuentos y promociones especiales en comercios
                    seleccionados
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
