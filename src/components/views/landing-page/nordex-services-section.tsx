"use client";

import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CreditCard,
  Ship,
  Lightbulb,
  GraduationCap,
  Headphones,
} from "lucide-react";
import { WavePath } from "@/components/wave-path";

export default function NordexServicesSection() {
  const advantages = [
    {
      title: "Intermediación Comercial",
      description:
        "Negociación directa con proveedores internacionales y representación de tus intereses en el mercado global.",
      icon: Building2,
    },
    {
      title: "Gestión de Pagos",
      description:
        "Procesamiento seguro de pagos internacionales con cumplimiento normativo ASFI y gestión de divisas.",
      icon: CreditCard,
    },
    {
      title: "Operaciones de Comercio Exterior",
      description:
        "Gestión logística integral, trámites aduaneros y coordinación de envíos internacionales.",
      icon: Ship,
    },
    {
      title: "Consultoría Especializada",
      description:
        "Asesoría en estrategias de internacionalización y análisis de mercados internacionales.",
      icon: Lightbulb,
    },
    {
      title: "Capacitación Empresarial",
      description:
        "Programas de formación en comercio exterior y desarrollo de planes de expansión global.",
      icon: GraduationCap,
    },
    {
      title: "Soporte Continuo",
      description:
        "Acompañamiento 24/7 en todo el proceso de internacionalización de tu empresa.",
      icon: Headphones,
    },
  ];

  return (
    <section id="servicios" className="bg-[#FFFFFF] py-16 sm:py-18 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex gap-4 py-12 flex-col items-start">
          <div>
            <Badge className="bg-[#051D67] text-white hover:bg-[#041655]">
              Servicios
            </Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#262626] font-sans font-bold">
              Nuestros Servicios
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
              Soluciones integrales para conectar tu empresa con el mercado
              internacional, desde la negociación hasta la entrega final.
            </p>
          </div>
          <div className="flex gap-10 pt-8 sm:pt-10 md:pt-12 flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-8 sm:gap-10 w-full">
              {advantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-row gap-4 sm:gap-6 w-full items-start min-w-0"
                  >
                    <div className="w-10 h-10 border-2 border-[#051D67] rounded-lg flex items-center justify-center mt-2 shrink-0">
                      <IconComponent className="w-5 h-5 text-[#051D67]" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="font-medium text-[#262626] font-sans break-words">
                        {advantage.title}
                      </p>
                      <p className="text-[#262626A3] text-sm leading-relaxed font-serif break-words">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section with Wave Path */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="relative">
            {/* Wave Path Component */}
            <div className="flex justify-center mb-8">
              <WavePath className="text-[#051D67]" />
            </div>

            {/* CTA Banner with Minimalistic Border */}
            <div className="border border-[#051D67] rounded-2xl p-6 sm:p-8 bg-white relative overflow-hidden">
              <h3 className="font-sans text-2xl md:text-3xl font-bold mb-4 text-[#262626]">
                ¿Listo para expandir tu negocio globalmente?
              </h3>
              <p className="text-[#262626A3] text-sm md:text-base mb-6 max-w-2xl mx-auto font-serif">
                Nuestro equipo de expertos está listo para ayudarte a conectar
                con el mundo. Agenda una consulta gratuita y descubre cómo
                podemos impulsar tu crecimiento internacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-all duration-200">
                  Consulta gratuita
                </button>
                <button className="border-2 border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-all duration-200">
                  Ver casos de éxito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
