import React from "react";
import { Building, Users, Globe, Award, Clock, Target } from "lucide-react";

export default function NordexAboutSection() {
  const companyValues = [
    {
      icon: Building,
      title: "Empresa Boliviana",
      description:
        "Fundada y operada en Bolivia, con profundo conocimiento del mercado local y regulaciones nacionales.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description:
        "Profesionales con amplia experiencia en comercio internacional y facilitación comercial.",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description:
        "Conectamos Bolivia con más de 50 países a través de nuestra red de socios comerciales.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Award,
      title: "Excelencia Operativa",
      description:
        "Comprometidos con la calidad y la satisfacción del cliente en cada operación.",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: Clock,
      title: "Soporte 24/7",
      description:
        "Disponibilidad total para resolver consultas y situaciones urgentes de nuestros clientes.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Target,
      title: "Resultados Garantizados",
      description:
        "99.8% de operaciones exitosas respaldan nuestra metodología y expertise.",
      color: "from-[#81D843] to-[#051D67]",
    },
  ];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Quienes Somos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            NORDEX Global es una empresa boliviana especializada en apoyar a
            empresas en el proceso de internacionalización, facilitando
            operaciones internacionales y comercialización global.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#051D67] mb-6">
              Nuestra Historia
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Fundada con la misión de simplificar el proceso de
              internacionalización para empresas bolivianas, NORDEX Global se ha
              convertido en un socio estratégico confiable para más de 150
              empresas que buscan expandir sus operaciones globalmente.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestro equipo combina experiencia local con conocimiento global,
              ofreciendo soluciones integrales que abarcan desde la
              intermediación comercial hasta la gestión completa de operaciones
              de comercio exterior.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Con un enfoque en la transparencia, velocidad y cumplimiento
              normativo, hemos logrado una tasa de éxito del 99.8% en todas
              nuestras operaciones.
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD] text-center">
              <div className="text-6xl mb-6">🏢</div>
              <h4 className="text-2xl font-bold mb-4">NORDEX Global</h4>
              <p className="text-lg opacity-90">
                Facilitando la internacionalización empresarial en Bolivia
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold">+150</div>
                  <div className="opacity-80">Empresas atendidas</div>
                </div>
                <div>
                  <div className="font-bold">+500</div>
                  <div className="opacity-80">Operaciones exitosas</div>
                </div>
                <div>
                  <div className="font-bold">+50</div>
                  <div className="opacity-80">Países conectados</div>
                </div>
                <div>
                  <div className="font-bold">98%</div>
                  <div className="opacity-80">Satisfacción</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#051D67] mb-4">
              Nuestros Valores
            </h3>
            <p className="text-xl text-gray-600">
              Los principios que guían cada una de nuestras operaciones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${value.color} shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#051D67] mb-3">
                    {value.title}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-8 text-[#FCFDFD]">
            <h4 className="text-2xl font-bold mb-4">Nuestra Misión</h4>
            <p className="text-lg opacity-90">
              Facilitar el proceso de internacionalización para empresas
              bolivianas, proporcionando servicios especializados que
              simplifiquen operaciones internacionales y aceleren el crecimiento
              global.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#81D843] to-[#051D67] rounded-2xl p-8 text-[#FCFDFD]">
            <h4 className="text-2xl font-bold mb-4">Nuestra Visión</h4>
            <p className="text-lg opacity-90">
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
