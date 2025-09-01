import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import { Shield, Zap, Users } from "lucide-react";

export default function QuienesSomosPage() {
  return (
    <div className="bg-white min-h-screen">
      <NordexHeader />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1F1915] mb-8">
              Quiénes Somos
            </h1>
            <p className="text-lg md:text-xl text-[#1F1915A3] max-w-3xl mx-auto leading-relaxed">
              Somos especialistas en comercio internacional con más de una
              década de experiencia, dedicados a simplificar y optimizar los
              procesos de comercio exterior para empresas bolivianas.
            </p>
          </div>

          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1915] mb-8">
                Nuestra Historia
              </h2>
              <div className="space-y-6 text-[#1F1915A3] text-base md:text-lg leading-relaxed">
                <p>
                  NORDEX nace de la necesidad de brindar soluciones integrales y
                  confiables en el mercado de comercio internacional. Fundada por un
                  equipo de profesionales con amplia experiencia, hemos crecido hasta
                  convertirnos en un referente del sector.
                </p>
                <p>
                  Desde nuestros inicios, nos hemos enfocado en comprender las
                  necesidades específicas de cada cliente, desarrollando
                  soluciones personalizadas que agregan valor real a sus
                  operaciones comerciales.
                </p>
                <p>
                  Hoy en día, facilitamos operaciones internacionales para empresas
                  bolivianas, manteniendo siempre nuestro compromiso con la excelencia,
                  la transparencia y la innovación.
                </p>
              </div>
            </div>
            <div className="bg-[#051D67] rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8">En Números</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    +10
                  </div>
                  <div className="text-white/80 text-sm">
                    Años de experiencia
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    +30
                  </div>
                  <div className="text-white/80 text-sm">
                    Empresas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    +10
                  </div>
                  <div className="text-white/80 text-sm">
                    Países destino
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    +50M$
                  </div>
                  <div className="text-white/80 text-sm">
                    En transacciones gestionadas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-[#051D67] text-white rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                Nuestra Misión
              </h3>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                Facilitar el proceso de internacionalización para empresas
                bolivianas, proporcionando servicios especializados que
                simplifiquen operaciones internacionales y aceleren el crecimiento
                global.
              </p>
            </div>
            <div className="bg-[#81D843] text-[#051D67] rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                Nuestra Visión
              </h3>
              <p className="text-[#051D67]/90 text-base md:text-lg leading-relaxed">
                Ser el líder indiscutible en facilitación comercial internacional
                en Bolivia, reconocido por nuestra excelencia operativa,
                innovación y compromiso con el éxito de nuestros clientes.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1915] text-center mb-16">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-[#051D67] rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-[#051D67]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1F1915] mb-4">
                  Confiabilidad
                </h3>
                <p className="text-[#1F1915A3] text-base leading-relaxed">
                  Cumplimos nuestros compromisos con transparencia y
                  responsabilidad absoluta.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-[#051D67] rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-[#051D67]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1F1915] mb-4">
                  Innovación
                </h3>
                <p className="text-[#1F1915A3] text-base leading-relaxed">
                  Adoptamos las últimas tecnologías para optimizar continuamente
                  nuestros procesos.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-[#051D67] rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#051D67]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1F1915] mb-4">
                  Compromiso
                </h3>
                <p className="text-[#1F1915A3] text-base leading-relaxed">
                  Nos dedicamos completamente al éxito y crecimiento de nuestros
                  clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}
