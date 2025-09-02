import React from "react";
import { Building, Users, Globe, Award, Clock, Target } from "lucide-react";

export default function About() {
  const companyValues = [
    {
      icon: Building,
      title: "Empresa Boliviana",
      description:
        "Fundada y operada en Bolivia, con profundo conocimiento del mercado local y regulaciones nacionales.",
      color: "bg-[#051D67]",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description:
        "Profesionales con amplia experiencia en comercio internacional y facilitación comercial.",
      color: "bg-[#81D843]",
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description:
        "Conectamos Bolivia con más de 50 países a través de nuestra red de socios comerciales.",
      color: "bg-[#051D67]",
    },
    {
      icon: Award,
      title: "Excelencia Operativa",
      description:
        "Comprometidos con la calidad y la satisfacción del cliente en cada operación.",
      color: "bg-[#81D843]",
    },
    {
      icon: Clock,
      title: "Soporte 24/7",
      description:
        "Disponibilidad total para resolver consultas y situaciones urgentes de nuestros clientes.",
      color: "bg-[#051D67]",
    },
    {
      icon: Target,
      title: "Resultados Garantizados",
      description:
        "99.8% de operaciones exitosas respaldan nuestra metodología y expertise.",
      color: "bg-[#81D843]",
    },
  ];

  return (
    <section id="quienes-somos" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6 font-sans">
            Quienes Somos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-serif">
            Conoce más sobre NORDEX Global y nuestro compromiso con el
            crecimiento empresarial boliviano
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#051D67] mb-6 font-sans">
              Nuestra Historia
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              Fundada con la misión de simplificar el proceso de
              internacionalización para empresas bolivianas, NORDEX Global se ha
              convertido en un socio estratégico confiable para más de 150
              empresas que buscan expandir sus operaciones globalmente.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              Nuestro equipo combina experiencia local con conocimiento global,
              ofreciendo soluciones integrales que abarcan desde la
              intermediación comercial hasta la gestión completa de operaciones
              de comercio exterior.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              Con un enfoque en la transparencia, velocidad y cumplimiento
              normativo, hemos logrado una tasa de éxito del 99.8% en todas
              nuestras operaciones.
            </p>
          </div>

          <div className="relative">
            <div className="bg-[#051D67] rounded-lg p-12 text-[#FCFDFD] text-center">
              <div className="text-6xl mb-6">🏢</div>
              <h4 className="text-2xl font-bold mb-4 font-sans">
                NORDEX Global
              </h4>
              <p className="text-lg opacity-90 font-serif">
                Facilitando la internacionalización empresarial en Bolivia
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold font-sans">+10</div>
                  <div className="opacity-80 font-serif">
                    Años de experiencia
                  </div>
                </div>
                <div>
                  <div className="font-bold font-sans">+30</div>
                  <div className="opacity-80 font-serif">
                    Empresas
                  </div>
                </div>
                <div>
                  <div className="font-bold font-sans">+10</div>
                  <div className="opacity-80 font-serif">
                    Países destino
                  </div>
                </div>
                <div>
                  <div className="font-bold font-sans">+50M$</div>
                  <div className="opacity-80 font-serif">
                    En transacciones gestionadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#051D67] mb-4 font-sans">
              Nuestros Valores
            </h3>
            <p className="text-xl text-gray-600 font-serif">
              Los principios que guían cada una de nuestras operaciones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${value.color} shadow-sm`}
                    >
                      <IconComponent className="w-6 h-6 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#051D67] mb-3 font-sans">
                    {value.title}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed font-serif">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#051D67] rounded-lg p-8 text-[#FCFDFD]">
            <h4 className="text-2xl font-bold mb-4 font-sans">
              Nuestra Misión
            </h4>
            <p className="text-lg opacity-90 font-sans">
              Facilitar el proceso de internacionalización para empresas
              bolivianas, proporcionando servicios especializados que
              simplifiquen operaciones internacionales y aceleren el crecimiento
              global.
            </p>
          </div>

          <div className="bg-[#81D843] rounded-lg p-8 text-[#051D67]">
            <h4 className="text-2xl font-bold mb-4 font-sans">
              Nuestra Visión
            </h4>
            <p className="text-lg opacity-90 font-sans">
              Ser el líder indiscutible en facilitación comercial internacional
              en Bolivia, reconocido por nuestra excelencia operativa,
              innovación y compromiso con el éxito de nuestros clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
