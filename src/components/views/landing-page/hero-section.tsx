import Link from "next/link";
import { Download, Smartphone } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className="absolute inset-0 h-full w-full"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <BoxReveal>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
                  <SparklesText
                    text="Tu cuenta en dólares"
                    className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white"
                  />
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">
                    sin fronteras
                  </span>
                </h1>
              </BoxReveal>

              <BlurFade delay={0.2}>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Ahorra, envía, recibe, invierte y paga globalmente sin límites
                </p>
              </BlurFade>

              <BlurFade delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <ShimmerButton>
                    <Link
                      href="/download"
                      className="inline-flex items-center px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Descargar Meru
                    </Link>
                  </ShimmerButton>
                </div>
              </BlurFade>
            </div>

            {/* Right Column - App Preview & Stats */}
            <div className="relative">
              <BlurFade delay={0.4}>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  {/* Mock App Interface */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Balance Total
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Cuenta USD
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        $75,120
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-green-500 font-semibold">
                          +12%
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Este mes
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Transferencias
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Instantáneas
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Inversiones
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          DeFi
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
