"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NordexServicesSection() {
  const advantages = [
    {
      title: "Intermediación Comercial",
      description:
        "Negociación directa con proveedores internacionales y representación de tus intereses en el mercado global.",
    },
    {
      title: "Gestión de Pagos",
      description:
        "Procesamiento seguro de pagos internacionales con cumplimiento normativo ASFI y gestión de divisas.",
    },
    {
      title: "Operaciones de Comercio Exterior",
      description:
        "Gestión logística integral, trámites aduaneros y coordinación de envíos internacionales.",
    },
    {
      title: "Consultoría Especializada",
      description:
        "Asesoría en estrategias de internacionalización y análisis de mercados internacionales.",
    },
    {
      title: "Capacitación Empresarial",
      description:
        "Programas de formación en comercio exterior y desarrollo de planes de expansión global.",
    },
    {
      title: "Soporte Continuo",
      description:
        "Acompañamiento 24/7 en todo el proceso de internacionalización de tu empresa.",
    },
  ];

  return (
    <section id="servicios" className="bg-[#FFFFFF] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 py-12 flex-col items-start">
          <div>
            <Badge className="bg-[#051D67] text-white hover:bg-[#041655]">
              Servicios
            </Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#1F1915] font-serif font-bold">
              Nuestros Servicios
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#1F1915A3]">
              Soluciones integrales para conectar tu empresa con el mercado
              internacional, desde la negociación hasta la entrega final.
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-6 w-full items-start"
                >
                  <Check className="w-4 h-4 mt-2 text-[#051D67]" />
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-[#1F1915]">
                      {advantage.title}
                    </p>
                    <p className="text-[#1F1915A3] text-sm leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#051D67] to-[#041655] rounded-2xl p-8 text-white">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para expandir tu negocio globalmente?
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para ayudarte a conectar con
              el mundo. Agenda una consulta gratuita y descubre cómo podemos
              impulsar tu crecimiento internacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#81D843] hover:bg-[#6BC536] text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200">
                Consulta gratuita
              </button>
              <button className="border-white text-white hover:bg-white hover:text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200 border rounded-md">
                Ver casos de éxito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
