"use client";

import React, { useState } from "react";
import { Search, FileText, Cog, CheckCircle, ArrowRight } from "lucide-react";

export default function NordexProcessSection() {
  const [activeStep, setActiveStep] = useState("consulta");

  const steps = [
    {
      id: "consulta",
      step: "Paso 1",
      title: "Consulta Inicial",
      subtitle: "Análisis de necesidades",
      description:
        "Evaluamos tus requerimientos específicos de comercio internacional y diseñamos la estrategia más efectiva para tu empresa.",
      icon: Search,
      demo: (
        <div className="bg-gradient-to-br from-[#051D67] to-black p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              Análisis Personalizado
            </h3>
            <p className="text-sm text-gray-300">
              Evaluamos tus necesidades específicas
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "propuesta",
      step: "Paso 2",
      title: "Propuesta Personalizada",
      subtitle: "Solución a medida",
      description:
        "Presentamos una propuesta detallada con costos transparentes, tiempos estimados y metodología de trabajo específica para tu caso.",
      icon: FileText,
      demo: (
        <div className="bg-white border-2 border-[#051D67] rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 text-[#051D67]">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-[#051D67]">
              Propuesta Detallada
            </h3>
            <p className="text-sm text-gray-600">
              Costos transparentes y metodología clara
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "implementacion",
      step: "Paso 3",
      title: "Implementación",
      subtitle: "Ejecución experta",
      description:
        "Nuestro equipo especializado ejecuta la operación con seguimiento constante y comunicación fluida durante todo el proceso.",
      icon: Cog,
      demo: (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 h-64 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2 text-[#051D67]">
                En Proceso
              </h3>
              <p className="text-sm text-gray-600">
                Seguimiento constante y comunicación fluida
              </p>
            </div>
          </div>
          {/* Progress indicators */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className="w-3 h-3 bg-[#051D67] rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      id: "entrega",
      step: "Paso 4",
      title: "Entrega y Seguimiento",
      subtitle: "Resultados garantizados",
      description:
        "Completamos la operación exitosamente y proporcionamos seguimiento post-servicio para asegurar tu total satisfacción.",
      icon: CheckCircle,
      demo: (
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Operación Completada
            </h3>
            <p className="text-sm text-green-600">
              Con seguimiento post-servicio
            </p>
          </div>
        </div>
      ),
    },
  ];

  const activeStepData = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Así de simple es trabajar con NORDEX
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Un proceso estructurado y transparente que garantiza resultados
            exitosos en cada operación de comercio internacional.
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center space-y-2 px-6 py-4 rounded-lg font-semibold transition-all duration-300 min-w-[200px] ${
                  activeStep === step.id
                    ? "bg-[#051D67] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <div className="text-center">
                  <div className="text-sm font-medium">{step.step}</div>
                  <div className="text-sm">{step.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Step Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <activeStepData.icon className="w-6 h-6 text-[#051D67]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#051D67] mb-1">
                  {activeStepData.step}
                </div>
                <h3 className="text-3xl font-bold text-black">
                  {activeStepData.title}
                </h3>
              </div>
            </div>

            <h4 className="text-xl font-semibold text-[#051D67]">
              {activeStepData.subtitle}
            </h4>

            <p className="text-lg text-gray-600 leading-relaxed">
              {activeStepData.description}
            </p>

            <a
              href="#contacto"
              className="inline-flex items-center text-[#051D67] hover:text-black font-semibold group"
            >
              Iniciar proceso
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Step Demo */}
          <div className="relative">
            <div className="transform hover:scale-105 transition-transform duration-300">
              {activeStepData.demo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
