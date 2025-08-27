import React from "react";
import {
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react";

export default function NordexBannerSection() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Experiencia Comprobada",
      description: "Más de 150 empresas confían en nuestros servicios",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description: "Profesionales expertos en comercio internacional",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: TrendingUp,
      title: "Resultados Garantizados",
      description: "99.8% de operaciones exitosas",
      color: "from-[#051D67] to-[#81D843]",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#051D67] via-[#81D843] to-[#051D67] py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FCFDFD] rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-[#FCFDFD] rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#FCFDFD] rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-[#FCFDFD] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Banner Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-[#FCFDFD] mb-8">
            Transforma tu empresa con NORDEX Global
          </h2>
          <p className="text-xl md:text-2xl text-[#FCFDFD] opacity-90 max-w-4xl mx-auto mb-12">
            Especialistas en internacionalización empresarial que facilitan
            operaciones internacionales y comercialización global
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-12 py-4 bg-[#FCFDFD] hover:bg-gray-100 text-[#051D67] rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Globe className="w-6 h-6 mr-3" />
              Comenzar Ahora
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center px-12 py-4 bg-transparent hover:bg-[#FCFDFD]/10 border-2 border-[#FCFDFD] rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 text-[#FCFDFD]"
            >
              Ver Servicios
              <ArrowRight className="w-6 h-6 ml-3" />
            </a>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#FCFDFD]/10 backdrop-blur-sm rounded-xl p-8 hover:bg-[#FCFDFD]/20 transition-all duration-300 transform hover:scale-105 border border-[#FCFDFD]/20"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${benefit.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-[#FCFDFD]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FCFDFD]">
                    {benefit.title}
                  </h3>
                </div>

                <p className="text-[#FCFDFD] opacity-90 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-[#FCFDFD]/10 backdrop-blur-sm rounded-lg px-8 py-4 border border-[#FCFDFD]/20">
            <Globe className="w-5 h-5 text-[#FCFDFD]" />
            <span className="text-[#FCFDFD]">
              ¿Listo para expandir tu negocio globalmente?
            </span>
            <a
              href="#contacto"
              className="text-[#FCFDFD] font-semibold underline hover:opacity-80 transition-opacity"
            >
              Contáctanos hoy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
