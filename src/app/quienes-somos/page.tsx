import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";

export default function QuienesSomosPage() {
  return (
    <div className="bg-[#F2EFE9] min-h-screen">
      <NordexHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1915] mb-6">
              Quiénes Somos
            </h1>
            <p className="text-lg text-[#6B6B6B] max-w-3xl mx-auto">
              Somos especialistas en comercio internacional con más de una década de experiencia, 
              dedicados a simplificar y optimizar los procesos de importación para empresas de todos los tamaños.
            </p>
          </div>

          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-[#1F1915] mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-[#6B6B6B]">
                <p>
                  NORDEX nace de la necesidad de brindar soluciones integrales y confiables 
                  en el mercado de importaciones. Fundada por un equipo de profesionales con 
                  amplia experiencia en comercio internacional, hemos crecido hasta convertirnos 
                  en un referente del sector.
                </p>
                <p>
                  Desde nuestros inicios, nos hemos enfocado en comprender las necesidades 
                  específicas de cada cliente, desarrollando soluciones personalizadas que 
                  agregan valor real a sus operaciones comerciales.
                </p>
                <p>
                  Hoy en día, gestionamos cientos de importaciones mensualmente, manteniendo 
                  siempre nuestro compromiso con la excelencia, la transparencia y la 
                  innovación tecnológica.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-[#1F1915] mb-6">En Números</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#051D67] mb-2">10+</div>
                  <div className="text-sm text-[#6B6B6B]">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#051D67] mb-2">500+</div>
                  <div className="text-sm text-[#6B6B6B]">Importaciones Mensuales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#051D67] mb-2">98%</div>
                  <div className="text-sm text-[#6B6B6B]">Satisfacción del Cliente</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#051D67] mb-2">50+</div>
                  <div className="text-sm text-[#6B6B6B]">Países de Origen</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F1915] mb-4">Nuestra Misión</h3>
              <p className="text-[#6B6B6B]">
                Facilitar y optimizar los procesos de importación para empresas, brindando 
                soluciones integrales, confiables y tecnológicamente avanzadas que permitan 
                a nuestros clientes enfocarse en hacer crecer sus negocios.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1F1915] mb-4">Nuestra Visión</h3>
              <p className="text-[#6B6B6B]">
                Ser la plataforma líder en Latinoamérica para la gestión de importaciones, 
                reconocidos por nuestra innovación tecnológica, excelencia operativa y 
                compromiso con el éxito de nuestros clientes.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#1F1915] text-center mb-12">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#051D67] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F1915] mb-2">Confiabilidad</h3>
                <p className="text-[#6B6B6B]">
                  Cumplimos nuestros compromisos con transparencia y responsabilidad absoluta.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#051D67] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F1915] mb-2">Innovación</h3>
                <p className="text-[#6B6B6B]">
                  Adoptamos las últimas tecnologías para optimizar continuamente nuestros procesos.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#051D67] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F1915] mb-2">Compromiso</h3>
                <p className="text-[#6B6B6B]">
                  Nos dedicamos completamente al éxito y crecimiento de nuestros clientes.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 mb-16">
            <h2 className="text-3xl font-bold text-[#1F1915] text-center mb-8">
              Nuestro Equipo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#1F1915] mb-1">María González</h3>
                <p className="text-[#6B6B6B] text-sm mb-2">Directora General</p>
                <p className="text-[#6B6B6B] text-sm">
                  15 años de experiencia en comercio internacional y logística.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#1F1915] mb-1">Carlos Mendoza</h3>
                <p className="text-[#6B6B6B] text-sm mb-2">Director de Operaciones</p>
                <p className="text-[#6B6B6B] text-sm">
                  Especialista en optimización de procesos y gestión aduanera.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#1F1915] mb-1">Ana Rodríguez</h3>
                <p className="text-[#6B6B6B] text-sm mb-2">Directora de Tecnología</p>
                <p className="text-[#6B6B6B] text-sm">
                  Líder en desarrollo de plataformas digitales para comercio.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1F1915] mb-4">
              Únete a Nuestra Comunidad
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
              Descubre por qué cientos de empresas confían en NORDEX para sus operaciones 
              de importación. Comienza hoy mismo tu experiencia con nosotros.
            </p>
            <button className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-colors">
              Comenzar Ahora
            </button>
          </div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}