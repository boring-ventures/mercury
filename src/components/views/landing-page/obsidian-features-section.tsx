"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  Headphones,
  Globe,
  TrendingUp,
  Users,
} from "lucide-react";

export default function NordexMetricsSection() {
  const [activeMetric, setActiveMetric] = useState("tiempo");

  const metrics = [
    {
      id: "tiempo",
      icon: Clock,
      percentage: "85%",
      title: "Reducción en Tiempos",
      subtitle: "De semanas a días",
      description:
        "Optimizamos los procesos de gestión internacional reduciendo significativamente los tiempos de espera tradicionales.",
      color: "from-[#051D67] to-[#81D843]",
      demo: (
        <div className="bg-gradient-to-br from-[#051D67] to-[#81D843] p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden text-[#FCFDFD]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Procesos Acelerados</h3>
            <p className="text-sm opacity-80">De semanas a días</p>
          </div>
        </div>
      ),
    },
    {
      id: "exito",
      icon: CheckCircle,
      percentage: "99.8%",
      title: "Tasa de Éxito",
      subtitle: "Operaciones completadas",
      description:
        "Nuestra experiencia y metodología garantiza que tus operaciones se completen exitosamente.",
      color: "from-[#81D843] to-[#051D67]",
      demo: (
        <div className="bg-gradient-to-br from-[#81D843] to-[#051D67] p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden text-[#FCFDFD]">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Éxito Garantizado</h3>
            <p className="text-sm opacity-80">99.8% de operaciones exitosas</p>
          </div>
        </div>
      ),
    },
    {
      id: "soporte",
      icon: Headphones,
      percentage: "24/7",
      title: "Soporte Disponible",
      subtitle: "Disponibilidad total",
      description:
        "Equipo especializado disponible para resolver cualquier consulta o situación urgente.",
      color: "from-[#051D67] to-[#81D843]",
      demo: (
        <div className="bg-gradient-to-br from-[#051D67] to-[#81D843] p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden text-[#FCFDFD]">
          <div className="text-center">
            <div className="text-6xl mb-4">🕐</div>
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-sm opacity-80">Siempre disponibles para ti</p>
          </div>
        </div>
      ),
    },
    {
      id: "paises",
      icon: Globe,
      percentage: "+50",
      title: "Países Conectados",
      subtitle: "Alcance global",
      description:
        "Facilitamos operaciones comerciales con proveedores en más de 50 países alrededor del mundo.",
      color: "from-[#81D843] to-[#051D67]",
      demo: (
        <div className="bg-gradient-to-br from-[#81D843] to-[#051D67] p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden text-[#FCFDFD]">
          <div className="text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Alcance Global</h3>
            <p className="text-sm opacity-80">Más de 50 países conectados</p>
          </div>
        </div>
      ),
    },
  ];

  const activeMetricData =
    metrics.find((m) => m.id === activeMetric) || metrics[0];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Métricas que transforman tu negocio
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Resultados verificables que demuestran el impacto real de nuestros
            servicios en la internacionalización empresarial.
          </p>
        </div>

        {/* Metrics Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={`flex flex-col items-center space-y-2 px-6 py-4 rounded-lg font-semibold transition-all duration-300 min-w-[200px] ${
                  activeMetric === metric.id
                    ? "bg-[#051D67] text-[#FCFDFD] shadow-lg"
                    : "bg-[#FCFDFD] text-[#051D67] hover:bg-gray-50 border border-[#81D843]"
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <div className="text-center">
                  <div className="text-sm font-medium">{metric.percentage}</div>
                  <div className="text-sm">{metric.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Metric Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Metric Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <activeMetricData.icon className="w-6 h-6 text-[#051D67]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#81D843] mb-1">
                  {activeMetricData.percentage}
                </div>
                <h3 className="text-3xl font-bold text-[#051D67]">
                  {activeMetricData.title}
                </h3>
              </div>
            </div>

            <h4 className="text-xl font-semibold text-[#81D843]">
              {activeMetricData.subtitle}
            </h4>

            <p className="text-lg text-gray-600 leading-relaxed">
              {activeMetricData.description}
            </p>
          </div>

          {/* Metric Demo */}
          <div className="relative">
            <div className="transform hover:scale-105 transition-transform duration-300">
              {activeMetricData.demo}
            </div>
          </div>
        </div>

        {/* Additional Impact Stats */}
        <div className="mt-20 bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD]">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Impacto mensual en nuestros clientes
            </h3>
            <p className="text-xl opacity-90">
              Datos que respaldan nuestra excelencia operativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">+50</div>
              <div className="text-lg font-semibold mb-2">
                Países conectados
              </div>
              <div className="text-sm opacity-80">Alcance global</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
