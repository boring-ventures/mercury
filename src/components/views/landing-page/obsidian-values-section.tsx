import React from "react";
import { Zap, Clock, Eye, MapPin, DollarSign, TrendingUp } from "lucide-react";

export default function NordexBenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "Simplicidad Operativa",
      subtitle: "Elimina la complejidad",
      description:
        "Convertimos procesos complicados en operaciones simples y directas. Tu equipo se enfoca en el negocio mientras nosotros manejamos los aspectos técnicos del comercio internacional.",
      gradient: "from-[#051D67] to-black",
    },
    {
      icon: Clock,
      title: "Velocidad de Ejecución",
      subtitle: "Rapidez sin comprometer seguridad",
      description:
        "Procesamos tus operaciones en tiempo récord manteniendo los más altos estándares de seguridad y cumplimiento normativo.",
      gradient: "from-black to-[#051D67]",
    },
    {
      icon: Eye,
      title: "Transparencia Total",
      subtitle: "Visibilidad completa del proceso",
      description:
        "Acceso en tiempo real al estado de tus operaciones con reportes detallados y comunicación constante sobre el progreso.",
      gradient: "from-[#051D67] to-gray-700",
    },
    {
      icon: MapPin,
      title: "Expertise Local",
      subtitle: "Conocimiento del mercado boliviano",
      description:
        "Entendemos las particularidades del entorno empresarial boliviano y las regulaciones locales que afectan el comercio internacional.",
      gradient: "from-gray-700 to-[#051D67]",
    },
    {
      icon: DollarSign,
      title: "Costos Competitivos",
      subtitle: "Optimización de recursos",
      description:
        "Estructura de costos transparente y competitiva que te permite planificar mejor tus operaciones internacionales.",
      gradient: "from-[#051D67] to-black",
    },
    {
      icon: TrendingUp,
      title: "Escalabilidad",
      subtitle: "Crece sin límites",
      description:
        "Nuestra infraestructura se adapta al crecimiento de tu empresa, desde operaciones pequeñas hasta grandes volúmenes comerciales.",
      gradient: "from-black to-[#051D67]",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            ¿Por qué elegir NORDEX para tu comercio internacional?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="text-left group hover:scale-105 transition-transform duration-300 bg-gray-50 rounded-xl p-8"
              >
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${benefit.gradient} mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-2 group-hover:text-[#051D67] transition-colors">
                  {benefit.title}
                </h3>

                <h4 className="text-lg font-semibold text-[#051D67] mb-4">
                  {benefit.subtitle}
                </h4>

                <p className="text-gray-600 text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-black mb-6">
            Transforma tu comercio internacional con NORDEX
          </h3>

          <a
            href="#contacto"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-black text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Comenzar Ahora
          </a>
        </div>
      </div>
    </section>
  );
}
