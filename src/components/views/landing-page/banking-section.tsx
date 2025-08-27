import { Globe, CreditCard, Banknote } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";

export function BankingSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Tu propia cuenta bancaria en
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Estados Unidos y Europa
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Ábrela en minutos con tu documento nacional de identidad, desde
                cualquier parte del mundo*, con tu teléfono celular
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <BlurFade delay={0.1}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cuenta única y personalizada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Abre tu cuenta y obtén un número de cuenta y de ruta de un
                    banco de Estados Unidos y IBAN Europeo exclusivo para ti
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Banknote className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recibe ACH, Wire y SEPA
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recibe transferencias ACH y Wire desde bancos de Estados
                    Unidos o Transferencias SEPA desde Europa que estén a tu
                    nombre, de familiares o terceros
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>

            <BlurFade delay={0.3}>
              <ShineBorder className="p-8 rounded-2xl bg-white dark:bg-gray-800 h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recibe pagos desde plataformas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recibe pagos desde plataformas como Upwork, Stripe, PayPal,
                    Youtube, Gusto, entre otras
                  </p>
                </div>
              </ShineBorder>
            </BlurFade>
          </div>

          {/* App Screenshots Placeholder */}
          <BlurFade delay={0.4}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-center justify-center">
                {[
                  "Meru App Home",
                  "Meru App Withdrawals",
                  "Meru App Cards",
                  "Meru App DeFi",
                  "Meru App Deposits",
                  "Meru App Bitcoin",
                  "Meru App MoneyGram",
                ].map((screen) => (
                  <div
                    key={screen}
                    className="bg-white/20 rounded-2xl p-4 h-32 flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium text-center">
                      {screen}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
