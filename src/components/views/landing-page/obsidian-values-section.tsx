import React from "react";
import { Building, Users, TrendingUp, Globe, Shield } from "lucide-react";

export default function NordexSocialProofSection() {
  const industries = [
    {
      icon: Building,
      title: "Importadoras de Tecnología",
      description: "Equipos informáticos y componentes electrónicos",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Users,
      title: "Distribuidoras de Maquinaria",
      description: "Maquinaria industrial y herramientas especializadas",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: TrendingUp,
      title: "Empresas Textiles",
      description: "Materias primas y productos manufacturados",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Globe,
      title: "Sector Farmacéutico",
      description: "Medicamentos y equipos médicos",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: Shield,
      title: "Industria Alimentaria",
      description: "Ingredientes y maquinaria para procesamiento",
      color: "from-[#051D67] to-[#81D843]",
    },
  ];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Empresas líderes confían en NORDEX Global
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Más de 150 empresas bolivianas han confiado en nuestros servicios de
            internacionalización
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
          {industries.map((industry, index) => {
            const IconComponent = industry.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${industry.color} mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-[#FCFDFD]" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#051D67] mb-2 group-hover:text-[#81D843] transition-colors">
                  {industry.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {industry.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD]">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Nuestro impacto en números
            </h3>
            <p className="text-xl opacity-90">
              Resultados verificables que respaldan nuestra excelencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">+150</div>
              <div className="text-lg font-semibold mb-2">
                Empresas atendidas
              </div>
              <div className="text-sm opacity-80">
                Confianza de importadoras líderes
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">+500</div>
              <div className="text-lg font-semibold mb-2">
                Operaciones exitosas
              </div>
              <div className="text-sm opacity-80">
                Transacciones internacionales
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-lg font-semibold mb-2">
                Satisfacción del cliente
              </div>
              <div className="text-sm opacity-80">Calificación promedio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
