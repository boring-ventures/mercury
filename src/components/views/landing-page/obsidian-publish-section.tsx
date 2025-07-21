import React from "react";
import { Clock, CheckCircle, Headphones, Globe } from "lucide-react";

export default function NordexMetricsSection() {
  const metrics = [
    {
      icon: Clock,
      percentage: "85%",
      title: "Reducción en Tiempos",
      subtitle: "De semanas a días",
      description:
        "Optimizamos los procesos de gestión internacional reduciendo significativamente los tiempos de espera tradicionales.",
      color: "from-[#051D67] to-black",
    },
    {
      icon: CheckCircle,
      percentage: "99.8%",
      title: "Tasa de Éxito",
      subtitle: "Transacciones completadas",
      description:
        "Nuestra experiencia y metodología garantiza que tus operaciones se completen exitosamente.",
      color: "from-black to-[#051D67]",
    },
    {
      icon: Headphones,
      percentage: "24/7",
      title: "Soporte",
      subtitle: "Disponibilidad total",
      description:
        "Equipo especializado disponible para resolver cualquier consulta o situación urgente.",
      color: "from-[#051D67] to-gray-700",
    },
    {
      icon: Globe,
      percentage: "+50",
      title: "Países",
      subtitle: "Alcance global",
      description:
        "Facilitamos operaciones comerciales con proveedores en más de 50 países alrededor del mundo.",
      color: "from-gray-700 to-[#051D67]",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Resultados que transforman tu negocio
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Métricas que demuestran el impacto real de nuestros servicios en las
            operaciones de comercio internacional de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 h-full">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${metric.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-4xl font-bold text-black mb-2 group-hover:text-[#051D67] transition-colors">
                      {metric.percentage}
                    </div>

                    <h3 className="text-xl font-bold text-black mb-2">
                      {metric.title}
                    </h3>

                    <h4 className="text-lg font-semibold text-[#051D67] mb-4">
                      {metric.subtitle}
                    </h4>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {metric.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Representation */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#051D67] to-black rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Impacto Mensual</h3>
                <p className="text-gray-300">
                  Resultados promedio de nuestros clientes
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tiempo de procesamiento</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-white font-semibold">85% menos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Operaciones exitosas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-green-400 font-semibold">99.8%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    Satisfacción del cliente
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-blue-400 font-semibold">98%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#051D67] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-gray-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">
              Nuestro impacto en números
            </h3>
            <p className="text-xl text-gray-600">
              Datos verificables que respaldan nuestra excelencia operativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#051D67] mb-2">+150</div>
              <div className="text-lg font-semibold text-black mb-2">
                Empresas atendidas
              </div>
              <div className="text-sm text-gray-600">
                Confianza de importadoras líderes
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#051D67] mb-2">+500</div>
              <div className="text-lg font-semibold text-black mb-2">
                Transacciones procesadas
              </div>
              <div className="text-sm text-gray-600">
                Operaciones exitosas completadas
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#051D67] mb-2">98%</div>
              <div className="text-lg font-semibold text-black mb-2">
                Satisfacción del cliente
              </div>
              <div className="text-sm text-gray-600">
                Calificación promedio de servicio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
