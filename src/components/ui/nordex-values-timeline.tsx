"use client";

import { Shield, Zap, Users, Globe, TrendingUp, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Confiabilidad",
    description: "Cumplimos nuestros compromisos con transparencia y responsabilidad absoluta en cada operación internacional.",
    position: { top: '20%', left: '15%' }
  },
  {
    icon: Zap,
    title: "Innovación",
    description: "Adoptamos las últimas tecnologías para optimizar continuamente nuestros procesos de comercio exterior.",
    position: { top: '10%', left: '60%' }
  },
  {
    icon: Users,
    title: "Compromiso",
    description: "Nos dedicamos completamente al éxito y crecimiento internacional de nuestros clientes bolivianos.",
    position: { top: '45%', left: '80%' }
  },
  {
    icon: Globe,
    title: "Visión Global",
    description: "Conectamos Bolivia con mercados internacionales, facilitando el acceso a oportunidades globales.",
    position: { top: '70%', left: '70%' }
  },
  {
    icon: TrendingUp,
    title: "Excelencia",
    description: "Buscamos la mejora continua en cada aspecto de nuestros servicios de facilitación comercial.",
    position: { top: '80%', left: '25%' }
  },
  {
    icon: Heart,
    title: "Pasión",
    description: "Amamos lo que hacemos y nos apasiona ayudar a las empresas bolivianas a crecer internacionalmente.",
    position: { top: '55%', left: '10%' }
  }
];

export default function NordexValuesTimeline() {
  return (
    <div className="relative py-20">
      <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#262626] text-center mb-20">
        Nuestros Valores
      </h2>
      
      <div className="relative max-w-6xl mx-auto h-[600px]">
        {/* Central circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#051D67] to-[#81D843] rounded-full flex items-center justify-center shadow-2xl z-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#051D67] font-bold text-xl font-sans">NORDEX</span>
          </div>
        </div>

        {/* Orbital rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-80 h-80 border border-[#051D67]/20 rounded-full animate-spin-slow"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-[#81D843]/20 rounded-full animate-reverse-spin"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] h-[500px] border border-[#051D67]/10 rounded-full animate-spin-slower"></div>
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
              <div className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-b from-[#051D67]/30 to-transparent transform -translate-x-1/2 -translate-y-full origin-bottom rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Value circle */}
              <div className="w-16 h-16 bg-white border-3 border-[#051D67] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <IconComponent className="w-8 h-8 text-[#051D67] transition-colors group-hover:text-[#81D843]" />
              </div>

              {/* Value card */}
              <div className="absolute left-1/2 top-full mt-4 transform -translate-x-1/2 w-80 bg-white border border-gray-200 rounded-xl p-6 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                <div className="flex items-center mb-3">
                  <IconComponent className="w-6 h-6 text-[#051D67] mr-3" />
                  <h3 className="font-sans font-bold text-lg text-[#262626]">{value.title}</h3>
                </div>
                <p className="text-[#262626A3] font-serif text-sm leading-relaxed">{value.description}</p>
                
                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}