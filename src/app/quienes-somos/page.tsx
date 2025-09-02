import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import NordexBanner from "@/components/ui/nordex-banner";
import { Badge } from "@/components/ui/badge";
import NordexStats from "@/components/ui/nordex-stats";
import NordexValuesTimeline from "@/components/ui/nordex-values-timeline";

export default function QuienesSomosPage() {
  return (
    <div className="bg-white min-h-screen">
      <NordexBanner />
      <NordexHeader />

      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex gap-4 py-6 flex-col items-start mb-10">
            <div>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655]">
                Nosotros
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h1 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#262626] font-sans font-bold">
                Quiénes <span className="text-[#051D67]">Somos</span>
              </h1>
              <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
                Somos especialistas en comercio internacional con más de una
                década de experiencia, dedicados a simplificar y optimizar los
                procesos de comercio exterior para empresas bolivianas.
              </p>
            </div>
          </div>

          {/* About/Stats Section */}
          <div className="mb-12">
            {/* Stats Section */}
            <NordexStats />
          </div>

          {/* Mission & Vision */}
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#262626] mb-8">
                Misión & Visión
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-left">
                  <h3 className="text-xl font-sans font-bold text-[#051D67] mb-4">
                    Nuestra Misión
                  </h3>
                  <p className="text-[#262626A3] font-serif text-base leading-relaxed">
                    Facilitar el proceso de internacionalización para empresas
                    bolivianas, proporcionando servicios especializados que
                    simplifiquen operaciones internacionales y aceleren el
                    crecimiento global.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-sans font-bold text-[#051D67] mb-4">
                    Nuestra Visión
                  </h3>
                  <p className="text-[#262626A3] font-serif text-base leading-relaxed">
                    Ser el líder indiscutible en facilitación comercial
                    internacional en Bolivia, reconocido por nuestra excelencia
                    operativa, innovación y compromiso con el éxito de nuestros
                    clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Timeline */}
          <NordexValuesTimeline />
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}
