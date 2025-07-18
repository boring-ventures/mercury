import { Zap, Globe, QrCode } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function TransfersSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Transferencias Instantáneas
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Envía y recibe dinero al instante. Sin esperas, sin
                complicaciones
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            <BlurFade delay={0.1}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Transferencias inmediatas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tus transferencias se procesan al instante, 24/7
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Transferencias internacionales
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Envía dinero a cualquier parte del mundo con las mejores
                    tasas
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.3}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <QrCode className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pagos con QR
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Paga escaneando códigos QR en comercios y entre amigos
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
