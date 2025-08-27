import React from "react";
import { Handshake, CreditCard, Truck, GraduationCap } from "lucide-react";

export default function NordexServicesSection() {
  const services = [
    {
      icon: Handshake,
      title: "Intermediación Comercial Internacional",
      subtitle: "Negociación comercial y representación",
      description:
        "Actuamos como intermediarios entre tu empresa y proveedores internacionales, facilitando negociaciones comerciales y representando tus intereses en el mercado global.",
      features: [
        "Negociación directa con proveedores",
        "Representación comercial internacional",
        "Gestión de contratos y acuerdos",
        "Asesoría en términos comerciales",
      ],
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: CreditCard,
      title: "Gestión de Pagos Internacionales",
      subtitle: "Asistencia en pagos internacionales",
      description:
        "Facilitamos el proceso de pagos internacionales a proveedores y demás contrapartes, asegurando transacciones seguras y eficientes.",
      features: [
        "Procesamiento de pagos internacionales",
        "Gestión de divisas y tipos de cambio",
        "Cumplimiento normativo ASFI",
        "Seguimiento de transacciones",
      ],
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: Truck,
      title: "Gestión de Operaciones de Comercio Exterior",
      subtitle: "Logística y aranceles",
      description:
        "Manejamos todos los aspectos logísticos y arancelarios del comercio exterior, desde la planificación hasta la entrega final.",
      features: [
        "Gestión logística integral",
        "Trámites aduaneros y aranceles",
        "Documentación de comercio exterior",
        "Coordinación de envíos internacionales",
      ],
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: GraduationCap,
      title: "Consultoría y Capacitación",
      subtitle: "A empresas",
      description:
        "Brindamos asesoría especializada y programas de capacitación para que tu empresa pueda desarrollar capacidades de internacionalización.",
      features: [
        "Asesoría en estrategias de internacionalización",
        "Capacitación en comercio exterior",
        "Análisis de mercados internacionales",
        "Desarrollo de planes de expansión",
      ],
      color: "from-[#81D843] to-[#051D67]",
    },
  ];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Nuestros Servicios Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Soluciones integrales para la internacionalización empresarial,
            diseñadas para simplificar y acelerar tus operaciones globales.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${service.color} mb-4 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#051D67] mb-2 group-hover:text-[#81D843] transition-colors">
                    {service.title}
                  </h3>

                  <h4 className="text-lg font-semibold text-[#81D843] mb-4">
                    {service.subtitle}
                  </h4>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-[#81D843] rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD]">
            <h3 className="text-3xl font-bold mb-6">
              ¿Listo para internacionalizar tu empresa?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Nuestros servicios están diseñados para empresas bolivianas que
              buscan expandir sus operaciones globalmente de manera eficiente y
              segura.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FCFDFD] hover:bg-gray-100 text-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Solicitar Consultoría
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/10 border-2 border-[#FCFDFD] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Conocer Más
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
