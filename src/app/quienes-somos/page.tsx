import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import { Badge } from "@/components/ui/badge";
import NordexStats from "@/components/ui/nordex-stats";
import NordexValuesTimeline from "@/components/ui/nordex-values-timeline";

export default function QuienesSomosPage() {
  return (
    <div className="bg-white min-h-screen">
      <NordexHeader />

      <main className="pt-16 pb-8 sm:pt-18 sm:pb-10 lg:pt-20 lg:pb-12 xl:pt-24 xl:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Hero Section */}
          <div className="flex gap-3 sm:gap-4 py-4 sm:py-6 lg:py-8 flex-col items-start mb-8 sm:mb-10 lg:mb-12">
            <div>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655] text-xs sm:text-sm">
                Nosotros
              </Badge>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter max-w-full lg:max-w-xl xl:max-w-2xl font-regular text-[#262626] font-sans font-bold">
                Quiénes <span className="text-[#051D67]">Somos</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
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

          {/* Values Timeline */}
          <NordexValuesTimeline />
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}
