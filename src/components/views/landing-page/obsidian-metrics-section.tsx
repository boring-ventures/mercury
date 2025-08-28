import React from "react";
import {
  Clock,
  CheckCircle,
  Headphones,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  Award,
} from "lucide-react";

export default function NordexMetricsSection() {
  const monthlyMetrics = [
    {
      icon: TrendingUp,
      value: "85%",
      label: "Reducción en Tiempos",
      description: "De semanas a días",
      color: "bg-[#051D67]",
    },
    {
      icon: CheckCircle,
      value: "99.8%",
      label: "Tasa de Éxito",
      description: "Transacciones completadas",
      color: "bg-[#81D843]",
    },
    {
      icon: Headphones,
      value: "24/7",
      label: "Soporte Disponible",
      description: "Disponibilidad total",
      color: "bg-[#051D67]",
    },
    {
      icon: Globe,
      value: "+50",
      label: "Países Conectados",
      description: "Alcance global",
      color: "bg-[#81D843]",
    },
    {
      icon: Users,
      value: "+150",
      label: "Empresas Atendidas",
      description: "Clientes satisfechos",
      color: "bg-[#051D67]",
    },
    {
      icon: DollarSign,
      value: "+500",
      label: "Operaciones Mensuales",
      description: "Transacciones procesadas",
      color: "bg-[#81D843]",
    },
  ];

  return (
    <section id="servicios" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6 font-['Helvetica']">
            IMPACTO MENSUAL EN NUESTROS CLIENTES
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Helvetica']">
            Resultados verificables que demuestran el impacto real de nuestros
            servicios
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monthlyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Icon with solid background */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${metric.color} shadow-sm group-hover:shadow-md transition-shadow duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Metric Value */}
                <div className="mb-4">
                  <div className="text-4xl font-bold text-[#051D67] mb-2 font-['Helvetica']">
                    {metric.value}
                  </div>
                  <div className="text-lg font-semibold text-[#81D843] mb-2 font-['Helvetica']">
                    {metric.label}
                  </div>
                  <div className="text-sm text-gray-600 font-['Helvetica']">
                    {metric.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Summary */}
        <div className="mt-20 text-center">
          <div className="bg-[#051D67] rounded-lg p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <Award className="w-16 h-16 mx-auto mb-6 text-white opacity-90" />
              <h3 className="text-3xl font-bold mb-4 font-['Helvetica']">
                Transformando el Comercio Internacional
              </h3>
              <p className="text-xl opacity-90 leading-relaxed font-['Helvetica']">
                Cada mes, facilitamos la expansión global de empresas
                bolivianas, creando un impacto medible y sostenible en la
                economía nacional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
