import { Bitcoin, TrendingUp, Wallet } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function CryptoSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* DeFi Section */}
            <div>
              <BlurFade>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Haz crecer tu dinero
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Invierte en DeFi y haz crecer tu dinero con las mejores
                  oportunidades del mercado financiero
                </p>
              </BlurFade>

              <div className="space-y-6">
                <BlurFade delay={0.1}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Rendimientos atractivos
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Obtén los mejores rendimientos del mercado en dólares
                        con inversiones en DeFi
                      </p>
                    </div>
                  </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Estadísticas detalladas
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sigue el rendimiento de tus inversiones en DeFi en
                        tiempo real
                      </p>
                    </div>
                  </div>
                </BlurFade>

                <BlurFade delay={0.3}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Retiros flexibles
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Retira tu dinero cuando lo necesites, sin penalizaciones
                        y con total seguridad
                      </p>
                    </div>
                  </div>
                </BlurFade>
              </div>
            </div>

            {/* Crypto Section */}
            <div>
              <BlurFade delay={0.4}>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Accede al mundo crypto
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Invierte en Bitcoin, Ethereum, y cualquier crypto de forma
                  segura y sencilla
                </p>
              </BlurFade>

              <div className="space-y-6">
                <BlurFade delay={0.5}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bitcoin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        De forma autocustodiada
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tú eres el único dueño de tus criptomonedas, con acceso
                        total y control sobre tus activos
                      </p>
                    </div>
                  </div>
                </BlurFade>

                <BlurFade delay={0.6}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Accede a más de 2000 tokens
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Una amplia selección de criptomonedas y tokens para
                        diversificar tu portafolio
                      </p>
                    </div>
                  </div>
                </BlurFade>

                <BlurFade delay={0.7}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wallet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Como una cuenta bancaria fusionada con criptomonedas
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        La comodidad de una cuenta bancaria tradicional con el
                        poder de las criptomonedas
                      </p>
                    </div>
                  </div>
                </BlurFade>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
