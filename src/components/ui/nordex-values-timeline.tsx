"use client";

import { Shield, Zap, Users, Globe, TrendingUp, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    icon: Shield,
    title: "Confiabilidad",
    description:
      "Cumplimos nuestros compromisos con transparencia y responsabilidad absoluta en cada operación internacional.",
    position: { top: "20%", left: "15%" },
  },
  {
    icon: Zap,
    title: "Innovación",
    description:
      "Adoptamos las últimas tecnologías para optimizar continuamente nuestros procesos de comercio exterior.",
    position: { top: "10%", left: "60%" },
  },
  {
    icon: Users,
    title: "Compromiso",
    description:
      "Nos dedicamos completamente al éxito y crecimiento internacional de nuestros clientes bolivianos.",
    position: { top: "45%", left: "80%" },
  },
  {
    icon: Globe,
    title: "Visión Global",
    description:
      "Conectamos Bolivia con mercados internacionales, facilitando el acceso a oportunidades globales.",
    position: { top: "70%", left: "70%" },
  },
  {
    icon: TrendingUp,
    title: "Excelencia",
    description:
      "Buscamos la mejora continua en cada aspecto de nuestros servicios de facilitación comercial.",
    position: { top: "80%", left: "25%" },
  },
  {
    icon: Heart,
    title: "Pasión",
    description:
      "Amamos lo que hacemos y nos apasiona ayudar a las empresas bolivianas a crecer internacionalmente.",
    position: { top: "55%", left: "10%" },
  },
];

export default function NordexValuesTimeline() {
  return (
    <div className="relative py-6 sm:py-8 lg:py-12">
      <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-sans font-bold text-[#262626] text-center mb-6 sm:mb-8 lg:mb-12">
        Nuestros Valores
      </h2>

      <div className="relative max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto h-[200px] sm:h-[250px] lg:h-[300px] mb-12 sm:mb-16 lg:mb-20">
        {/* Central circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#051D67] to-[#81D843] rounded-full flex items-center justify-center shadow-xl z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#051D67] font-bold text-sm font-sans">
              NORDEX
            </span>
          </div>
        </div>

        {/* Orbital rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 border border-[#051D67]/20 rounded-full animate-spin-slow"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-48 h-48 border border-[#81D843]/20 rounded-full animate-reverse-spin"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[280px] h-[280px] border border-[#051D67]/10 rounded-full animate-spin-slower"></div>
        </div>

        {/* Value points */}
        {values.map((value, index) => {
          const IconComponent = value.icon;
          return (
            <div
              key={index}
              className="absolute group cursor-pointer"
              style={value.position}
            >
              {/* Connection line to center */}
              <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-gradient-to-b from-[#051D67]/30 to-transparent transform -translate-x-1/2 -translate-y-full origin-bottom rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Value circle */}
              <div className="w-8 h-8 bg-white border-2 border-[#051D67] rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <IconComponent className="w-4 h-4 text-[#051D67] transition-colors group-hover:text-[#81D843]" />
              </div>

              {/* Value card */}
              <div className="absolute left-1/2 top-full mt-3 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                <div className="flex items-center mb-2">
                  <IconComponent className="w-5 h-5 text-[#051D67] mr-2" />
                  <h3 className="font-sans font-bold text-base text-[#262626]">
                    {value.title}
                  </h3>
                </div>
                <p className="text-[#262626A3] font-serif text-xs leading-relaxed">
                  {value.description}
                </p>

                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CEO/Founder Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* CEO Info */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655] mb-4">
                Liderazgo
              </Badge>
              <h3 className="text-2xl md:text-3xl font-sans font-bold text-[#262626] mb-4">
                Jimena León
              </h3>
              <p className="text-lg font-sans font-semibold text-[#051D67] mb-4">
                CEO & Fundadora
              </p>
            </div>
            <p className="text-[#262626A3] font-serif text-base leading-relaxed">
              Con más de 15 años de experiencia en comercio internacional,
              Jimena ha liderado la transformación digital del sector en
              Bolivia. Su visión estratégica y compromiso con la excelencia han
              posicionado a NORDEX como la empresa líder en facilitación
              comercial internacional del país.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#81D843] rounded-full"></div>
                <span className="text-sm text-[#262626A3] font-serif">
                  Especialista en Comercio Internacional
                </span>
              </div>
            </div>
          </div>

          {/* CEO Image Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Photo Section */}
              <div className="relative h-64 bg-white flex items-center justify-center">
                {/* Main Photo */}
                <div className="relative z-10">
                  <div className="w-40 h-40 bg-gradient-to-br from-[#051D67] to-[#81D843] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden ring-4 ring-[#051D67]/20 shadow-lg">
                    <img
                      src="/team/Screenshot 2025-09-02 134805.png"
                      alt="Jimena León - CEO & Fundadora de NORDEX"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "flex";
                        }
                      }}
                    />
                    <span className="text-5xl hidden">👩‍💼</span>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-sans font-bold mb-1 text-[#262626]">
                      Jimena León
                    </h4>
                    <p className="text-sm text-[#051D67] font-semibold">
                      CEO & Fundadora
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#81D843] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#262626A3] font-serif">
                      Disponible para consultas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#051D67] font-sans mb-1">
                      15+
                    </p>
                    <p className="text-xs text-[#262626A3] font-serif">
                      Años de experiencia
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#051D67] font-sans mb-1">
                      500+
                    </p>
                    <p className="text-xs text-[#262626A3] font-serif">
                      Operaciones exitosas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
