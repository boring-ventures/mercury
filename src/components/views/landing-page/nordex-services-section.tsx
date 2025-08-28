"use client";

import { Button } from "@/components/ui/button";

export default function NordexServicesSection() {
  const services = [
    {
      id: 1,
      title: "Intermediación Comercial Internacional",
      subtitle: "Negociación comercial y representación",
      description: "Actuamos como intermediarios entre tu empresa y proveedores internacionales, facilitando negociaciones comerciales y representando tus intereses en el mercado global.",
      features: [
        "Negociación directa con proveedores",
        "Representación comercial internacional",
        "Gestión de contratos y acuerdos",
        "Asesoría en términos comerciales"
      ],
      icon: "🤝"
    },
    {
      id: 2,
      title: "Gestión de Pagos Internacionales",
      subtitle: "Asistencia en pagos internacionales",
      description: "Facilitamos el proceso de pagos internacionales a proveedores y demás contrapartes, asegurando transacciones seguras y eficientes.",
      features: [
        "Procesamiento de pagos internacionales",
        "Gestión de divisas y tipos de cambio",
        "Cumplimiento normativo ASFI",
        "Seguimiento de transacciones"
      ],
      icon: "💳"
    },
    {
      id: 3,
      title: "Gestión de Operaciones de Comercio Exterior",
      subtitle: "Logística y aranceles",
      description: "Manejamos todos los aspectos logísticos y arancelarios del comercio exterior, desde la planificación hasta la entrega final.",
      features: [
        "Gestión logística integral",
        "Trámites aduaneros y aranceles",
        "Documentación de comercio exterior",
        "Coordinación de envíos internacionales"
      ],
      icon: "🚢"
    },
    {
      id: 4,
      title: "Consultoría y Capacitación",
      subtitle: "A empresas",
      description: "Brindamos asesoría especializada y programas de capacitación para que tu empresa pueda desarrollar capacidades de internacionalización.",
      features: [
        "Asesoría en estrategias de internacionalización",
        "Capacitación en comercio exterior",
        "Análisis de mercados internacionales",
        "Desarrollo de planes de expansión"
      ],
      icon: "📊"
    }
  ];

  return (
    <section id="servicios" className="bg-[#FFFFFF] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1F1915] font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-[#1F1915A3] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Ofrecemos soluciones integrales para conectar tu empresa con el mercado internacional, 
            desde la negociación hasta la entrega final.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`group relative bg-gradient-to-br ${
                index % 2 === 0 
                  ? 'from-[#F2EFE9] to-white' 
                  : 'from-white to-[#F2EFE9]'
              } rounded-2xl p-8 border border-gray-100 hover:border-[#051D67]/20 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="absolute top-6 right-6 text-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                {service.icon}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[#1F1915] font-serif text-xl md:text-2xl font-bold leading-tight">
                    {service.title}
                  </h3>
                  <h4 className="text-[#051D67] font-serif text-lg font-semibold">
                    {service.subtitle}
                  </h4>
                  <p className="text-[#1F1915A3] text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-[#1F1915] font-medium text-sm uppercase tracking-wide">
                    Incluye:
                  </h5>
                  <ul className="grid grid-cols-1 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className="flex items-center space-x-3 text-[#1F1915A3] text-sm"
                      >
                        <div className="w-2 h-2 bg-[#051D67] rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white transition-all duration-200 text-sm px-6 py-2 rounded-md font-medium"
                  >
                    Más información
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#051D67] to-[#041655] rounded-2xl p-8 text-white">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para expandir tu negocio globalmente?
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para ayudarte a conectar con el mundo. 
              Agenda una consulta gratuita y descubre cómo podemos impulsar tu crecimiento internacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#81D843] hover:bg-[#6BC536] text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                Consulta gratuita
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                Ver casos de éxito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}