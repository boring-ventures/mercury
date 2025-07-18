import { CreditCard, Zap, Bitcoin } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function DepositsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Depósitos flexibles
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Carga tu cuenta de múltiples formas: transferencias bancarias,
                PIX, efectivo o incluso criptomonedas
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            <BlurFade delay={0.1}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Transferencias bancarias
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Realiza depósitos desde cualquier banco de forma segura y
                    rápida
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    PIX instantáneo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Depósitos instantáneos a través de PIX, disponible 24/7
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.3}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                    <Bitcoin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Criptomonedas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Deposita usando tus criptomonedas favoritas de forma segura
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
