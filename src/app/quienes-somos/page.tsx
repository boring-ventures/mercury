import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";

export default function QuienesSomosPage() {
  return (
    <div className="bg-white min-h-screen">
      <NordexHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1F1915] mb-8 animate-fade-in">
              Quiénes Somos
            </h1>
            <p className="text-xl text-[#6B6B6B] max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
              Somos especialistas en comercio internacional con más de una
              década de experiencia, dedicados a simplificar y optimizar los
              procesos de importación para empresas de todos los tamaños.
            </p>
          </div>

          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-[#1F1915] mb-8">
                Nuestra Historia
              </h2>
              <div className="space-y-6 text-[#6B6B6B] text-lg leading-relaxed">
                <p className="animate-fade-in-up">
                  NORDEX nace de la necesidad de brindar soluciones integrales y
                  confiables en el mercado de importaciones. Fundada por un
                  equipo de profesionales con amplia experiencia en comercio
                  internacional, hemos crecido hasta convertirnos en un
                  referente del sector.
                </p>
                <p className="animate-fade-in-up-delay">
                  Desde nuestros inicios, nos hemos enfocado en comprender las
                  necesidades específicas de cada cliente, desarrollando
                  soluciones personalizadas que agregan valor real a sus
                  operaciones comerciales.
                </p>
                <p className="animate-fade-in-up-delay-2">
                  Hoy en día, gestionamos cientos de importaciones mensualmente,
                  manteniendo siempre nuestro compromiso con la excelencia, la
                  transparencia y la innovación tecnológica.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-500 animate-slide-in-right">
              <h3 className="text-3xl font-bold text-white mb-8">En Números</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    10+
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    Años de Experiencia
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    Importaciones Mensuales
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    Satisfacción del Cliente
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    50+
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    Países de Origen
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#1F1915] mb-6">
                Nuestra Misión
              </h3>
              <p className="text-[#6B6B6B] text-lg leading-relaxed">
                Facilitar y optimizar los procesos de importación para empresas,
                brindando soluciones integrales, confiables y tecnológicamente
                avanzadas que permitan a nuestros clientes enfocarse en hacer
                crecer sus negocios.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up-delay">
              <div className="w-16 h-16 bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#1F1915] mb-6">
                Nuestra Visión
              </h3>
              <p className="text-[#6B6B6B] text-lg leading-relaxed">
                Ser la plataforma líder en Latinoamérica para la gestión de
                importaciones, reconocidos por nuestra innovación tecnológica,
                excelencia operativa y compromiso con el éxito de nuestros
                clientes.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-[#1F1915] text-center mb-16 animate-fade-in">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group animate-fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all duration-500">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1F1915] mb-4">
                  Confiabilidad
                </h3>
                <p className="text-[#6B6B6B] text-lg leading-relaxed">
                  Cumplimos nuestros compromisos con transparencia y
                  responsabilidad absoluta.
                </p>
              </div>
              <div className="text-center group animate-fade-in-up-delay">
                <div className="w-20 h-20 bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all duration-500">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1F1915] mb-4">
                  Innovación
                </h3>
                <p className="text-[#6B6B6B] text-lg leading-relaxed">
                  Adoptamos las últimas tecnologías para optimizar continuamente
                  nuestros procesos.
                </p>
              </div>
              <div className="text-center group animate-fade-in-up-delay-2">
                <div className="w-20 h-20 bg-gradient-to-br from-[#051D67] to-[#0A2B8A] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all duration-500">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1F1915] mb-4">
                  Compromiso
                </h3>
                <p className="text-[#6B6B6B] text-lg leading-relaxed">
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
